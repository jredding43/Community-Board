import dotenv from "dotenv";
dotenv.config();

import pool from "./db";
import express, { Request, Response } from "express";
import cors from "cors";

const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://jredding43.github.io",
    "https://mycommunityboard.com",
    "https://www.mycommunityboard.com"
  ],
  credentials: true
}));

app.use(express.json());

// --- Root Route ---
app.get("/", (_req: Request, res: Response) => {
  res.send("Local Job Board API is running!");
});

// --- GET /jobs (only jobs from the last 14 days) ---
app.get("/jobs", async (req: Request, res: Response) => {
  const limit = parseInt(req.query.limit as string) || 10;
  const offset = parseInt(req.query.offset as string) || 0;
  const location = (req.query.location as string)?.trim();

  try {
    let query = "";
    let values: any[] = [];

    if (location) {
      query = `
        SELECT * FROM jobs 
        WHERE LOWER(location) = LOWER($1)
        AND posted_at >= NOW() - INTERVAL '14 days'
        ORDER BY posted_at DESC 
        LIMIT $2 OFFSET $3
      `;
      values = [location, limit, offset];
    } else {
      query = `
        SELECT * FROM jobs 
        WHERE posted_at >= NOW() - INTERVAL '14 days'
        ORDER BY posted_at DESC 
        LIMIT $1 OFFSET $2
      `;
      values = [limit, offset];
    }

    const result = await pool.query(query, values);

    const formatDate = (dateStr: string) => {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    };

    const jobs = result.rows.map(({ date_needed, posted_at, ...rest }) => ({
      ...rest,
      dateNeeded: formatDate(date_needed),
      postedAt: formatDate(posted_at),
    }));

    res.status(200).json(jobs);
  } catch (error: any) {
    console.error("Error fetching jobs:", error.message || error);
    res.status(500).json({ error: "Failed to load jobs", detail: error.message || error });
  }
});

// --- POST /jobs/delete using title + contact + passphrase ---
app.post("/jobs/delete", async (req, res) => {
  const { title, contact, deletePassPhrase } = req.body;
  const master = process.env.MASTER_PASSPHRASE;

  try {
    let result;

    if (deletePassPhrase === master) {
      result = await pool.query(
        `DELETE FROM jobs WHERE title = $1 AND contact = $2 RETURNING *`,
        [title, contact]
      );
      console.warn("⚠️ Master passphrase used to delete post:", title, contact);
    } else {
      result = await pool.query(
        `DELETE FROM jobs WHERE title = $1 AND contact = $2 AND delete_passphrase = $3 RETURNING *`,
        [title, contact, deletePassPhrase]
      );
    }

    if ((result.rowCount ?? 0) === 0) {
      return res.status(404).json({ error: "No matching post found or incorrect passphrase." });
    }

    res.status(200).json({ message: "Post deleted successfully." });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ error: "Server error while deleting post." });
  }
});

// --- DELETE /jobs/:id using passphrase (backup route) ---
app.delete("/jobs/:id", async (req, res) => {
  const { id } = req.params;
  const { passphrase } = req.body;

  const result = await pool.query(`SELECT delete_passphrase FROM jobs WHERE id = $1`, [id]);
  if (result.rowCount === 0) return res.status(404).json({ error: "Job not found" });

  const match = result.rows[0].delete_passphrase === passphrase;
  if (!match) return res.status(403).json({ error: "Incorrect passphrase" });

  await pool.query(`DELETE FROM jobs WHERE id = $1`, [id]);
  res.status(200).json({ message: "Job post deleted successfully" });
});

// --- POST /jobs/report ---
app.post("/jobs/report", async (req, res) => {
  const { title, contact, reason } = req.body;

  try {
    const check = await pool.query(
      `SELECT * FROM reports WHERE job_title = $1 AND contact = $2`,
      [title, contact]
    );

    if ((check.rowCount ?? 0) > 0) {
      return res.status(400).json({ error: "This post has already been reported." });
    }

    const ipRaw = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const ip = typeof ipRaw === "string" ? ipRaw.replace(/^.*:/, "") : ipRaw;

    await pool.query(
      `INSERT INTO reports (job_title, contact, reason, reporter_ip) VALUES ($1, $2, $3, $4)`,
      [title, contact, reason, ip]
    );

    console.log(`Reported Job: ${title} (${contact}) for ${reason}`);
    res.json({ success: true });
  } catch (error) {
    console.error("Error saving report:", error);
    res.status(500).json({ error: "Failed to save report" });
  }
});

// --- GET /reports ---
app.get("/reports", async (_req, res) => {
  try {
    const result = await pool.query(`
      SELECT job_title, contact, reason, reported_at
      FROM reports
      ORDER BY reported_at DESC
    `);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching reports:", error);
    res.status(500).json({ error: "Failed to fetch reports" });
  }
});

// --- POST /jobs/has-been-reported ---
app.post("/jobs/has-been-reported", async (req, res) => {
  const { title, contact } = req.body;

  try {
    const result = await pool.query(
      `SELECT 1 FROM reports WHERE job_title = $1 AND contact = $2 LIMIT 1`,
      [title, contact]
    );
    res.json({ hasReported: (result.rowCount ?? 0) > 0 });
  } catch (err) {
    res.status(500).json({ error: "Error checking report status." });
  }
});

// --- DELETE /jobs/admin-delete ---
app.delete("/jobs/admin-delete", async (req, res) => {
  const { title, contact } = req.body;

  try {
    const result = await pool.query(
      `DELETE FROM jobs WHERE title = $1 AND contact = $2 RETURNING *`,
      [title, contact]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Job not found" });
    }

    res.status(200).json({ message: "Job post deleted" });
  } catch (err) {
    console.error("Error deleting post:", err);
    res.status(500).json({ error: "Failed to delete job post" });
  }
});

// --- DELETE /reports ---
app.delete("/reports", async (req, res) => {
  const { job_title, contact } = req.body;

  try {
    await pool.query(
      `DELETE FROM reports WHERE job_title = $1 AND contact = $2`,
      [job_title, contact]
    );
    res.status(200).json({ message: "Report removed" });
  } catch (err) {
    console.error("Error removing report:", err);
    res.status(500).json({ error: "Failed to remove report" });
  }
});

// --- POST /jobs/search-by-passphrase ---
app.post("/jobs/search-by-passphrase", async (req, res) => {
  const { contact, deletePassPhrase } = req.body;

  try {
    const result = await pool.query(
      `SELECT * FROM jobs WHERE contact = $1 AND delete_passphrase = $2 ORDER BY posted_at DESC`,
      [contact, deletePassPhrase]
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ error: "Failed to search for jobs." });
  }
});

// --- Server listen ---
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
