import { useState, useEffect } from "react";
import { auth } from "../../firebase";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

interface Report {
  job_title: string;
  contact: string;
  reason: string;
  reported_at: string;
}

const AdminPage = () => {
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      fetch("https://community-board-backend.onrender.com/reports")
        .then((res) => res.json())
        .then((data) => setReports(data))
        .catch((err) => console.error("Failed to fetch reports:", err));
    }
  }, [user]);

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      alert("Login failed. Check email/password.");
    }
  };

  const handleLogout = () => {
    signOut(auth);
  };

  const handleRemoveReport = async (report: Report) => {
    const res = await fetch("https://community-board-backend.onrender.com/reports", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        job_title: report.job_title,
        contact: report.contact,
      }),
    });

    if (res.ok) {
      setReports(reports.filter((r) => r !== report));
    } else {
      alert("Failed to remove report");
    }
  };

  const handleDeletePost = async (report: Report) => {
    const confirm = window.confirm(
      `Are you sure you want to delete the job: "${report.job_title}"?`
    );
    if (!confirm) return;

    const res = await fetch("https://community-board-backend.onrender.com/jobs/admin-delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: report.job_title,
        contact: report.contact,
      }),
    });

    if (res.ok) {
      setReports(reports.filter((r) => r !== report));
      alert("Job deleted.");
    } else {
      alert("Failed to delete job post");
    }
  };

  if (!user) {
    return (
      <div className="max-w-sm mx-auto p-6 bg-white border rounded shadow mt-10">
        <h2 className="text-2xl font-semibold text-center mb-4">Admin Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-3 border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        />
        <button
          onClick={handleLogin}
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
        >
          Log In
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 mt-10 bg-white border rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Welcome, Admin</h2>
      <p className="mb-4">You're now logged in and can access admin-only features.</p>
      <button
        onClick={handleLogout}
        className="mb-6 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
      >
        Log Out
      </button>

      <h3 className="text-xl font-semibold mb-2">Reported Posts</h3>
      {reports.length === 0 ? (
        <p className="text-sm text-gray-600">No reported posts yet.</p>
      ) : (
        <ul className="space-y-4">
          {reports.map((report, idx) => (
            <li
              key={idx}
              className="border p-4 rounded bg-yellow-50 text-sm text-gray-800"
            >
              <p><strong>Title:</strong> {report.job_title}</p>
              <p><strong>Contact:</strong> {report.contact}</p>
              <p><strong>Reason:</strong> {report.reason}</p>
              <p><strong>Reported At:</strong> {new Date(report.reported_at).toLocaleString()}</p>

              <div className="flex gap-4 mt-3">
                <button
                  onClick={() => handleRemoveReport(report)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-xs"
                >
                  🧹 Remove Report
                </button>
                <button
                  onClick={() => handleDeletePost(report)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-xs"
                >
                  ❌ Delete Post
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminPage;
