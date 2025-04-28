import { useState, useEffect } from "react";
import { auth } from "../../firebase";
import {signInWithEmailAndPassword, onAuthStateChanged, signOut,} from "firebase/auth";
import BASE_URL from "../api";

interface Report {
  job_title: string;
  contact: string;
  reason: string;
  reported_at: string;
}

interface Event {
  id: number;
  event_name: string;
  event_date: string;
  event_description: string;
  event_location: string;
  event_image_url: string;
  image_link: string;
  contact_email: string;
  approved: boolean;
  created_at: string;
}

interface CommunityPost {
  id: number;
  title: string;
  description: string;
  contact_email: string;
  approved: boolean; 
  created_at: string;
}


const AdminPage = () => {
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [reports, setReports] = useState<Report[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [community, setCommunity] = useState<CommunityPost[]>([]);


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      fetch(`${BASE_URL}/reports`)
        .then((res) => res.json())
        .then((data) => setReports(data))
        .catch((err) => console.error("Failed to fetch reports:", err));
  
      fetch(`${BASE_URL}/events/all`)
        .then((res) => res.json())
        .then((data) => setEvents(data))
        .catch((err) => console.error("Failed to fetch events:", err));
  
      fetch(`${BASE_URL}/community/all`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setCommunity(data);
          } else {
            console.error("Unexpected community data format:", data);
            setCommunity([]);
          }
        })
        .catch((err) => {
          console.error("Failed to fetch community posts:", err);
          setCommunity([]);
        });
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
    const res = await fetch(`${BASE_URL}/reports`, {
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

  const handleDenyEvent = async (id: number) => {
    const confirm = window.confirm("Are you sure you want to deny and delete this event?");
    if (!confirm) return;
  
    const res = await fetch(`${BASE_URL}/events/${id}`, {
      method: "DELETE",
    });
  
    if (res.ok) {
      setEvents(events.filter(ev => ev.id !== id));
      alert("Event denied and deleted!");
    } else {
      alert("Failed to deny event.");
    }
  };
  

  const handleDeletePost = async (report: Report) => {
    const confirm = window.confirm(
      `Are you sure you want to delete the job: "${report.job_title}"?`
    );
    if (!confirm) return;

    const res = await fetch(`${BASE_URL}/jobs/admin-delete`, {
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

  const handleApproveEvent = async (id: number) => {
    const res = await fetch(`${BASE_URL}/events/approve/${id}`, {
      method: "PATCH",
    });

    if (res.ok) {
      setEvents(events.map(ev => ev.id === id ? { ...ev, approved: true } : ev));
      alert("Event approved!");
    } else {
      alert("Failed to approve event.");
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

  const handleApproveCommunity = async (id: number) => {
    const res = await fetch(`${BASE_URL}/community/approve/${id}`, {
      method: "PATCH",
    });

    if (res.ok) {
      setCommunity(community.map(post => post.id === id ? { ...post, approved: true } : post));
      alert("Community post approved!");
    } else {
      alert("Failed to approve community post.");
    }
  };

  const handleDenyCommunity = async (id: number) => {
    const confirm = window.confirm("Are you sure you want to deny and delete this community post?");
    if (!confirm) return;

    const res = await fetch(`${BASE_URL}/community/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setCommunity(community.filter(post => post.id !== id));
      alert("Community post denied and deleted!");
    } else {
      alert("Failed to deny community post.");
    }
  };

  const handleDeleteEvent = async (id: number) => {
    const confirmDelete = window.confirm("Are you sure you want to permanently delete this event?");
    if (!confirmDelete) return;
  
    const res = await fetch(`${BASE_URL}/events/${id}`, {
      method: "DELETE",
    });
  
    if (res.ok) {
      setEvents(events.filter(ev => ev.id !== id));
      alert("Event deleted successfully.");
    } else {
      alert("Failed to delete event.");
    }
  };
  
  const handleDeleteCommunityPost = async (id: number) => {
    const confirmDelete = window.confirm("Are you sure you want to permanently delete this community post?");
    if (!confirmDelete) return;
  
    const res = await fetch(`${BASE_URL}/community/${id}`, {
      method: "DELETE",
    });
  
    if (res.ok) {
      setCommunity(community.filter(post => post.id !== id));
      alert("Community post deleted successfully.");
    } else {
      alert("Failed to delete community post.");
    }
  };
  

  return (
    <div className="max-w-6xl mx-auto p-6 mt-10 bg-white border rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Welcome, Admin</h2>
      <p className="mb-4">You're now logged in and can access admin-only features.</p>
      <button
        onClick={handleLogout}
        className="mb-6 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
      >
        Log Out
      </button>

      {/* Submitted Events */}
      <h3 className="text-xl font-semibold mb-4">Submitted Events</h3>
      {events.length === 0 ? (
        <p className="text-sm text-gray-600 mb-8">No events submitted yet.</p>
      ) : (
        <ul className="space-y-6 mb-8">
          {events.map((event) => (
            <li
              key={event.id}
              className={`border p-4 rounded text-gray-800 text-sm ${
                event.approved ? "bg-green-50" : "bg-yellow-100"
              }`}
            >
              <p><strong>Event Name:</strong> {event.event_name}</p>
              <p><strong>Date & Time:</strong> {event.event_date}</p>
              <p><strong>Location:</strong> {event.event_location}</p>
              <p><strong>Contact Email:</strong> {event.contact_email}</p>
              {event.event_image_url && (
                <div className="mt-2">
                  <img src={event.event_image_url} alt="Event" className="w-48 h-auto rounded-md" />
                </div>
              )}
              <p className="mt-2"><strong>Description:</strong> {event.event_description}</p>
              {event.image_link && (
                <p className="mt-2">
                  <strong>Promo Link:</strong>{" "}
                  <a href={event.image_link} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">
                    {event.image_link}
                  </a>
                </p>
              )}
              <p className="mt-2 text-xs text-gray-500">Submitted on: {new Date(event.created_at).toLocaleString()}</p>

              {!event.approved && (
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => handleApproveEvent(event.id)}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-xs"
                  >
                    Approve Event
                  </button>
                  <button
                    onClick={() => handleDenyEvent(event.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-xs"
                  >
                    Deny Event
                  </button>
                </div>
              )}

            <button
              onClick={() => handleDeleteEvent(event.id)}
              className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-xs"
            >
              Delete Event
            </button>

            </li>
          ))}
        </ul>
      )}

      {/* Free Community Posts */}
      <h3 className="text-xl font-semibold mb-4">Free Community Listings</h3>
      {community.length === 0 ? (
        <p className="text-sm text-gray-600 mb-8">No community posts yet.</p>
      ) : (
        <ul className="space-y-6 mb-8">
          {community.map((post) => (
            <li
              key={post.id}
              className={`border p-4 rounded text-gray-800 text-sm ${
                post.approved ? "bg-green-50" : "bg-yellow-100"
              }`}
            >
              <p><strong>Title:</strong> {post.title}</p>
              <p className="mt-2"><strong>Description:</strong> {post.description}</p>
              <p className="mt-2"><strong>Contact Email:</strong> {post.contact_email}</p>
              <p className="mt-2 text-xs text-gray-500">Submitted on: {new Date(post.created_at).toLocaleString()}</p>

              {!post.approved && (
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => handleApproveCommunity(post.id)}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-xs"
                  >
                    Approve Post
                  </button>
                  <button
                    onClick={() => handleDenyCommunity(post.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-xs"
                  >
                    Deny Post
                  </button>
                </div>
              )}

            <button
              onClick={() => handleDeleteCommunityPost(post.id)}
              className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-xs"
            >
              Delete Post
            </button>

            </li>
          ))}
        </ul>
      )}

      {/* Reported Posts */}
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
                   Remove Report
                </button>
                <button
                  onClick={() => handleDeletePost(report)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-xs"
                >
                   Delete Post
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
