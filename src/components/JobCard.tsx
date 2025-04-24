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
}

const JobCard = ({
  title,
  description,
  pay,
  location,
  contact,
  dateNeeded,
  onRemove,
}: JobCardProps) => {
  const [showReportOptions, setShowReportOptions] = useState(false);
  const [hasReported, setHasReported] = useState(false);

  useEffect(() => {
    fetch("http://localhost:3001/jobs/has-been-reported", {
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
    setShowReportOptions((prev) => !prev);
  };

  const submitReport = async (reason: string) => {
    try {
      const res = await fetch("http://localhost:3001/jobs/report", {
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
      const res = await fetch("http://localhost:3001/jobs/delete", {
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
    <div className="w-full bg-white shadow rounded-lg p-4 mb-4 border relative">

      {hasReported && (
        <div className="mb-3 px-3 py-2 bg-yellow-100 border-l-4 border-yellow-600 text-yellow-800 text-sm font-medium rounded">
          ⚠️ This post has been reported. Use caution until reviewed.
        </div>
      )}

      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-semibold text-indigo-700">{title}</h2>
      </div>
      <p className="text-gray-700 mb-2">{description}</p>
      <div className="text-sm text-gray-600 mb-2">
        <p><strong>Pay:</strong> ${pay}</p>
        <p><strong>Location:</strong> {location}</p>
        <p><strong>Date Needed:</strong> {dateNeeded}</p>
        <p><strong>Contact:</strong> {contact}</p>
      </div>

      <div className="flex flex-col items-end gap-2">
        <div className="flex gap-4">

        {hasReported ? (
          <span className="text-xs text-gray-400 italic select-none cursor-not-allowed">
            🕓 Report Pending
          </span>
        ) : (
          <button
            onClick={handleReport}
            className="text-xs text-red-600 hover:underline hover:text-red-800"
          >
            🚩 Report Post
          </button>
        )}

          <button
            onClick={handleRemove}
            className="text-xs text-gray-500 hover:underline hover:text-gray-700"
          >
            ❌ Remove Post
          </button>
        </div>

        {/* Report Options Dropdown */}
        {showReportOptions && (
          <div className="absolute bg-white border shadow-md rounded mt-1 z-50 p-2 text-sm right-4 top-full">
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
    </div>
  );
};

export default JobCard;
