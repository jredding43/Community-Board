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
      <section className="mb-8 bg-white p-6 rounded-lg shadow-md border">
        <h1 className="text-4xl font-bold text-indigo-800 mb-4 text-center">
          Welcome to the Local Community Board
        </h1>
        <p className="text-gray-700 text-lg mb-4 text-center">
          A simple, no-hassle way to post local job needs, community help, or one-time tasks — no big companies, no recruiters, just neighbors helping neighbors.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => setActivePage("createjob")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded shadow"
          >
            Post a Job
          </button>
          <button
            onClick={() => setActivePage("jobpage")}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded shadow"
          >
            Browse Jobs
          </button>
          <button
            onClick={() => setActivePage("events")}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded shadow"
          >
            Browse Events
          </button>
        </div>
      </section>

      <section className="mb-8 bg-white p-6 rounded-lg shadow-md border">
        <h2 className="text-2xl font-semibold text-indigo-700 mb-2">How This Site Works</h2>
        <ul className="list-disc list-inside text-gray-700">
          <li>Post local job needs, community tasks, or one-time gigs — no big companies or recruiters allowed</li>
          <li>No accounts, no tracking — only share the contact info you're comfortable with</li>
          <li>Browse recent posts and connect directly with your neighbors</li>
          <li>This platform is community-driven — use at your own risk, and report anything inappropriate</li>
          <hr className="my-6 border-t border-black" />
          <li className="text-red-600 font-semibold">Posts are automatically removed 2 weeks after posting to keep things fresh</li>
          <li className="text-red-600 font-semibold">Comments are disabled — only those truly interested will reach out via the contact info you provide</li>
          {/* <li className="text-red-600 font-semibold">You can post up to 2 jobs per week to reduce spam and keep it fair for everyone</li> */}
          <li className="text-red-600 font-semibold">Only jobs in Republic, Kettle Falls, Colville, Chewelah, and surrounding areas are allowed. Others will be removed</li>
          <li className="text-red-600 font-semibold">Reported posts will display a warning banner for all users to proceed with caution until reviewed or removed</li>
        </ul>

        <h2 className="text-2xl font-semibold text-indigo-700 mt-8 mb-2">Sponsors & Community Support</h2>
        <p className="text-gray-700 mb-4">
          This site is free to use thanks to the support of local sponsors. We feature sponsor messages in a clean, non-intrusive way to help cover hosting and development costs.
          Sponsors are always locally focused and relevant to the community.
        </p>

        <h2 className="text-2xl font-semibold text-indigo-700 mt-8 mb-2">What's Coming Soon</h2>
        <ul className="list-disc list-inside text-gray-700">
          <li><strong>Community Events Section</strong> — Local businesses will be able to promote upcoming events, sales, or special offers through paid listings</li>
          <li><strong>Improved spam protection</strong> — We're testing new systems to keep posts genuine and prevent abuse</li>
          <li><strong>Optional sponsor submissions</strong> — Businesses can soon apply to be featured as a supporter of the platform</li>
          <li><strong>Feedback & Improvement Form</strong> — You'll soon be able to suggest new features or improvements directly from the site</li>
        </ul>


        <p className="text-sm italic text-gray-500 mt-6">
          We're building this platform to stay useful, simple, and fair — with your feedback and participation. Thanks for being part of it.
        </p>
      </section>


      {/* <section className="bg-white p-6 rounded-lg shadow-md border">
        <h2 className="text-2xl font-semibold text-indigo-700 mb-4">Recent Job Posts</h2>
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : recentJobs.length > 0 ? (
          <div className="flex flex-wrap gap-4 justify-start">
            {recentJobs.map((job, index) => (
              <JobCard key={index} {...job} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No recent job posts found.</p>
        )}
        <p className="text-center text-sm text-gray-500 mt-4">
          Visit the{" "}
          <button
            onClick={() => setActivePage("jobpage")}
            className="text-indigo-600 hover:underline"
          >
            Browse Jobs
          </button>{" "}
          to see more.
        </p>
      </section> */}
    </div>
  );
};

export default HomePage;
