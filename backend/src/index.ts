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

app.get("/", (_req: Request, res: Response) => {
  res.send("Local Job Board API is running!");
});

app.get("/jobs", async (req: Request, res: Response) => {
  const limit = parseInt(req.query.limit as string) || 10;
  const offset = parseInt(req.query.offset as string) || 0;
  const location = (req.query.location as string)?.trim();

  try {
    let query = "";
    let values: any[] = [];

    if (location) {
      // Filtered query
      query = `
        SELECT * FROM jobs 
        WHERE LOWER(location) = LOWER($1)
        ORDER BY posted_at DESC 
        LIMIT $2 OFFSET $3
      `;
      values = [location, limit, offset];
    } else {
      // Unfiltered query
      query = `
        SELECT * FROM jobs 
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

// --- POST /jobs with spam prevention and validation ---
app.post("/jobs", async (req: Request, res: Response) => {
  const {
    title,
    description,
    pay,
    location,
    dateNeeded,
    contact,
    deletePassPhrase,
    website, // honeypot field
  } = req.body;

  const ipRaw = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  const ip = typeof ipRaw === "string" ? ipRaw.replace(/^.*:/, "") : ipRaw;

  if (website) {
    console.warn("Bot submission blocked via honeypot");
    return res.status(400).json({ error: "Spam detected" });
  }

  if (!title || !description || !pay || !location || !dateNeeded || !contact) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Normalize contact (removes dashes, dots, spaces, upper case)
    const normalizeContact = (value: string) => {
      return value.trim().replace(/[^a-zA-Z0-9@]/g, "").toLowerCase();
    };
    
    const normalizedContact = normalizeContact(contact);
    
    console.log("Raw contact submitted:", contact);
    console.log("Normalized contact:", normalizedContact);

    //  100% accurate match — no SQL replace
    const check = await pool.query(
      `SELECT COUNT(*) FROM jobs WHERE REGEXP_REPLACE(LOWER(contact), '[^a-z0-9@]', '', 'g') = $1`,
      [normalizedContact]
    );
    
    const count = parseInt(check.rows[0].count, 10);
    console.log(`Contact check for: ${normalizedContact} → Found ${count} posts`);
    
    if (count >= 2) {
      return res.status(429).json({ error: "You've reached the limit of 2 job posts for this contact." });
    }
    
    //  Insert with normalized contact
    const result = await pool.query(
      `INSERT INTO jobs (title, description, pay, location, date_needed, contact, ip_address, delete_passphrase)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [title, description, pay, location, dateNeeded, normalizedContact, ip, deletePassPhrase]
    );
    
    console.log("Matching post count:", count);


    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error inserting job:", error);
    res.status(500).json({ error: "Failed to create job post" });
  }
});


// --- POST /jobs/delete using title + contact + passphrase ---
app.post("/jobs/delete", async (req, res) => {
  const { title, contact, deletePassPhrase } = req.body;
  const master = process.env.MASTER_PASSPHRASE;

  try {
    let result;

    if (deletePassPhrase === master) {
      // Master override — skip passphrase match
      result = await pool.query(
        `DELETE FROM jobs WHERE title = $1 AND contact = $2 RETURNING *`,
        [title, contact]
      );
      console.warn("⚠️ Master passphrase used to delete post:", title, contact);
    } else {
      // Regular deletion
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

// POST /jobs/report
app.post("/jobs/report", async (req, res) => {
  const { title, contact, reason } = req.body;

  try {
    // Check for duplicates FIRST
    const check = await pool.query(
      `SELECT * FROM reports WHERE job_title = $1 AND contact = $2`,
      [title, contact]
    );

    if ((check.rowCount ?? 0) > 0) {
      return res.status(400).json({ error: "This post has already been reported." });
    }
    
    // Get IP if needed (even if not stored long-term)
    const ipRaw = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const ip = typeof ipRaw === "string" ? ipRaw.replace(/^.*:/, "") : ipRaw;

    // Insert report
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

//admin panel get reports
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

//report jobs
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

//delete jobs
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

// GET /jobs/search-by-passphrase
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



// --- POST /events to save event submissions ---
app.post("/events", async (req: Request, res: Response) => {
  const {
    eventName,
    eventDate,
    eventDescription,
    eventLocation,
    eventImageUrl,
    imageLink,
    contactEmail
  } = req.body;

  if (!eventName || !eventDate || !eventDescription || !eventLocation || !contactEmail) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO events (event_name, event_date, event_description, event_location, event_image_url, image_link, contact_email)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [eventName, eventDate, eventDescription, eventLocation, eventImageUrl, imageLink, contactEmail]
    );

    res.status(201).json({ message: "Event submitted successfully.", event: result.rows[0] });
  } catch (error: any) {
    console.error("Error inserting event:", error.message || error);
    res.status(500).json({ error: "Failed to submit event." });
  }
});

// --- GET /events to fetch all event submissions ---
app.get("/events", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT id, event_name, event_date, event_description, event_location, event_image_url, image_link, contact_email, approved, created_at
      FROM events
      ORDER BY created_at DESC
    `);

    res.status(200).json(result.rows);
  } catch (error: any) {
    console.error("Error fetching events:", error.message || error);
    res.status(500).json({ error: "Failed to fetch events." });
  }
});

// --- POST /community to save community event submissions ---
app.post("/community", async (req: Request, res: Response) => {
  const {
    communityName,
    communityDate,
    communityDescription,
    communityLocation,
    siteLink,
    contactEmail
  } = req.body;

  if (!communityName || !communityDate || !communityDescription || !communityLocation || !contactEmail) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO community (community_name, community_date, community_description, community_location, site_link, contact_email)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [communityName, communityDate, communityDescription, communityLocation, siteLink, contactEmail]
    );

    res.status(201).json({ message: "Community event submitted successfully.", event: result.rows[0] });
  } catch (error: any) {
    console.error("Error inserting community event:", error.message || error);
    res.status(500).json({ error: "Failed to submit community event." });
  }
});

// --- GET /community to fetch all community submissions ---
app.get("/community", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT id, community_name, community_date, community_description, community_location, site_link, contact_email, approved, created_at
      FROM community
      ORDER BY created_at DESC
    `);

    res.status(200).json(result.rows);
  } catch (error: any) {
    console.error("Error fetching community events:", error.message || error);
    res.status(500).json({ error: "Failed to fetch community events." });
  }
});

// PATCH /events/approve/:id
app.patch("/events/approve/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await pool.query(`UPDATE events SET approved = true WHERE id = $1`, [id]);
    res.status(200).json({ message: "Event approved." });
  } catch (error: any) {
    console.error("Error approving event:", error.message || error);
    res.status(500).json({ error: "Failed to approve event." });
  }
});


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
