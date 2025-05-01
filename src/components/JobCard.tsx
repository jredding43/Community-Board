import { useState, useEffect } from "react";

interface JobCardProps {
  title: string;
  description: string;
  pay: string;
  location: string;
  dateNeeded: string;
  contact: string;
  postedAt: string;
  hasReported?: boolean;
  onRemove?: () => void;
  pinned?: boolean;
}

const JobCard = ({
  title,
  description,
  pay,
  location,
  contact,
  dateNeeded,
  onRemove,
  pinned,
}: JobCardProps) => {
  const [showReportOptions, setShowReportOptions] = useState(false);
  const [hasReported, setHasReported] = useState(false);

  useEffect(() => {
    fetch("https://community-board-backend.onrender.com/jobs/has-been-reported", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, contact }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.hasReported) setHasReported(true);
      })
      .catch((err) => console.error("Failed to check report status", err));
  }, [title, contact]);
  

  const handleReport = () => {
    if (pinned) {
      alert("This post cannot be reported.");
      return;
    }
    setShowReportOptions((prev) => !prev);
  };

  const submitReport = async (reason: string) => {
    try {
      const res = await fetch("https://community-board-backend.onrender.com/jobs/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, contact, reason }),
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        alert(data.error || "Something went wrong.");
      } else {
        alert("Thanks for reporting. We'll review it shortly.");
        setShowReportOptions(false);
      }
    } catch (err) {
      console.error("Report failed", err);
      alert("Failed to report post. Please try again later.");
    }
  };
  

  const handleRemove = async () => {
    const passphrase = prompt("Enter the passphrase you used when posting this job:");
    if (!passphrase) {
      alert("Passphrase is required to delete this post.");
      return;
    }

    try {
      const res = await fetch("https://community-board-backend.onrender.com/jobs/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, contact, deletePassPhrase: passphrase }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Post deleted successfully.");
        if (onRemove) onRemove(); // Trigger re-fetch
      } else {
        alert(data.error || "Failed to delete post.");
      }
    } catch (err) {
      console.error("Delete failed", err);
      alert("Server error. Please try again.");
    }
  };

  return (
    <div className="w-full max-w-3xl bg-indigo-200 shadow-sm rounded-xl p-6 mb-6 border border-indigo-100 relative">

  {pinned && (
    <div className="absolute top-3 right-3 bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-1 rounded">
      Admin Post
    </div>
  )}

  {hasReported && (
    <div className="mb-4 px-4 py-3 bg-yellow-50 border border-yellow-400 text-yellow-800 text-sm font-medium rounded">
      ⚠️ This post has been reported. Use caution until reviewed.
    </div>
  )}

  {/* Title */}
  <div className="mb-4">
    <h2 className="text-2xl font-bold text-indigo-800">{title}</h2>
  </div>

  {/* Description */}
  <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-1.5 mb-6">
    <p className="text-gray-800 text-sm whitespace-pre-line italic">{description}</p>
  </div>

  {/* Details Grid */}
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mb-6">
    <div className="bg-white border border-indigo-200 rounded-lg p-1.5 shadow-sm">
      <p className="text-xs text-indigo-500 uppercase font-semibold mb-1">Pay</p>
      <p className="text-sm font-medium text-gray-800">
        {pay.startsWith("$") || isNaN(Number(pay)) ? pay : `$${pay}`}
      </p>
    </div>

    <div className="bg-white border border-indigo-200 rounded-lg p-1.5 shadow-sm">
      <p className="text-xs text-indigo-500 uppercase font-semibold mb-1">Location</p>
      <p className="text-sm font-medium text-gray-800">{location}</p>
    </div>

    <div className="bg-white border border-indigo-200 rounded-lg p-1.5 shadow-sm">
      <p className="text-xs text-indigo-500 uppercase font-semibold mb-1">Date Needed</p>
      <p className="text-sm font-medium text-gray-800">{dateNeeded}</p>
    </div>

    <div className="bg-white border border-indigo-200 rounded-lg p-1.5 shadow-sm">
      <p className="text-xs text-indigo-500 uppercase font-semibold mb-1">Contact</p>
      <p className="text-sm font-medium text-gray-800">{contact}</p>
    </div>
  </div>

  {/* Actions */}
  <div className="flex justify-end gap-1.5">
    {!pinned && (
      hasReported ? (
        <span className="text-xs text-gray-500 italic select-none cursor-not-allowed">
          🕓 Report Pending
        </span>
      ) : (
        <button
          onClick={handleReport}
          className="text-xs text-red-600 hover:underline hover:text-red-800"
        >
          🚩 Report Post
        </button>
      )
    )}

    <button
      onClick={handleRemove}
      className="text-xs text-gray-500 hover:underline hover:text-gray-700"
    >
      ❌ Remove Post
    </button>
  </div>

  {/* Report Dropdown */}
  {showReportOptions && (
    <div className="absolute bg-white border shadow-lg rounded mt-2 z-50 p-3 text-sm right-4 top-full w-56">
      <p className="font-semibold text-gray-700 mb-2">Report Reason:</p>
      <ul className="space-y-1">
        {["Spam", "Scam or Fraud", "Inappropriate", "Incorrect Info"].map((reason) => (
          <li key={reason}>
            <button
              onClick={() => submitReport(reason)}
              className="text-red-600 hover:underline hover:text-red-800"
            >
              {reason}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )}
</div>


  );
};

export default JobCard;
