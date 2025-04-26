import { useEffect, useState } from "react";
// import JobCard from "../components/JobCard";

interface Job {
  title: string;
  description: string;
  pay: string;
  location: string;
  dateNeeded: string;
  contact: string;
  postedAt: string;
}

interface HomePageProps {
  setActivePage: (page: string) => void;
}

const HomePage = ({ setActivePage }: HomePageProps) => {
  const [, setRecentJobs] = useState<Job[]>([]);
  const [, setLoading] = useState(true);
  //recentJobs / loading

  useEffect(() => {
    fetch("https://community-board-backend.onrender.com/jobs")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setRecentJobs(data.slice(0, 3));
        } else {
          console.error("Backend error:", data);
          setRecentJobs([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading jobs:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero Section */}
      <section className="mb-8 bg-white p-8 rounded-lg shadow-md border text-center">
        <h1 className="text-4xl font-bold text-indigo-800 mb-4">
          Welcome to Community Board
        </h1>
        <p className="text-gray-700 text-lg mb-6">
          A simple, way to post local jobs, find community help, and share upcoming events — no accounts, no recruiters, no hassle.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <button
            onClick={() => setActivePage("createjob")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded shadow"
          >
            Post a Job
          </button>
          <button
            onClick={() => setActivePage("jobpage")}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold px-6 py-3 rounded shadow"
          >
            Browse Jobs
          </button>
          <button
            onClick={() => setActivePage("events")}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold px-6 py-3 rounded shadow"
          >
            Browse Events
          </button>
        </div>
      </section>

      <div className="bg-yellow-100 text-yellow-800 text-center text-sm font-medium py-2 rounded mb-4 shadow">
         Community Board is currently in <strong>Beta Testing</strong>. We appreciate your feedback as we continue to improve!
      </div>


      {/* How it Works */}
      <section className="mb-8 bg-white p-8 rounded-lg shadow-md border">
        <h2 className="text-2xl font-semibold text-indigo-700 mb-4">How This Site Works</h2>

        <ul className="list-disc list-inside text-gray-700 space-y-3">
          <li>Post local job needs, small one-time tasks, or community help requests — no big companies or recruiters allowed</li>
          <li>No accounts, no tracking — only share the contact info you're comfortable providing</li>
          <li>Browse recent posts and connect directly with your neighbors</li>
          <li>All posts are visible for up to <strong>2 weeks</strong> before being automatically removed</li>
          <li>Only posts from Republic, Kettle Falls, Colville, Chewelah, and surrounding areas are allowed</li>
          <li>This platform is community-driven — use at your own risk and report anything inappropriate</li>
        </ul>

        <hr className="my-6 border-t-2 border-black" />

        <ul className="list-disc list-inside text-red-600 text-sm font-semibold space-y-2">
        <li className="text-red-600 font-semibold">Posts are automatically removed 2 weeks after posting to keep things fresh</li>
        <li className="text-red-600 font-semibold">Comments are disabled — only those truly interested will reach out via the contact info you provide</li>
        <li className="text-red-600 font-semibold">Only jobs in Republic, Kettle Falls, Colville, Chewelah, and surrounding areas are allowed. Others will be removed</li>
        <li className="text-red-600 font-semibold">Reported posts will display a warning banner for all users to proceed with caution until reviewed or removed</li>
        </ul>
      </section>

      {/* Sponsors */}
      <section className="mb-8 bg-white p-8 rounded-lg shadow-md border">
        <h2 className="text-2xl font-semibold text-indigo-700 mb-4">Sponsors & Community Support</h2>
        <p className="text-gray-700">
          Community Board is free to use thanks to local sponsor support. Sponsors are carefully selected to align with our mission: local, honest, and community-driven.
          No popups, no intrusive ads — just clean support for keeping the site alive.
        </p>
      </section>

      {/* What's Coming Soon */}
      <section className="mb-8 bg-white p-8 rounded-lg shadow-md border">
        <h2 className="text-2xl font-semibold text-indigo-700 mb-4">Coming Soon</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-3">
          <li><strong>New Event Promotion Tools</strong> — Small businesses will soon promote local sales and events more easily</li>
          <li><strong>Stronger Spam Protection</strong> — Smarter systems to keep the platform fair</li>
          <li><strong>Become a Sponsor</strong> — New ways to feature your local business</li>
          <li><strong>Feedback Form</strong> — Suggest improvements or new features</li>
        </ul>
      </section>

      {/* Closing */}
      <p className="text-center text-sm italic text-gray-500 mt-8">
        Thanks for keeping Community Board strong and positive. Built by the community, for the community.
      </p>
    </div>

  );
};

export default HomePage;


