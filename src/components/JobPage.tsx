import { useEffect, useState } from "react";
import JobCard from "../components/JobCard";

interface Job {
  id: number;
  title: string;
  description: string;
  pay: string;
  location: string;
  dateNeeded: string;
  contact: string;
  postedAt: string;
}

const JobPage = () => {
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [showScrollTop, setShowScrollTop] = useState(false);


  // Load all jobs on page load
  useEffect(() => {
    const loadJobs = async () => {
      setLoading(true);
      try {
        const res = await fetch("https://community-board-backend.onrender.com/jobs?limit=1000&offset=0");
        const data: Job[] = await res.json();
        setAllJobs(data);
        setFilteredJobs(data); // show all by default
      } catch (err) {
        console.error("Error loading jobs:", err);
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
  
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  

  const applyFilter = () => {
    if (!selectedLocation) {
      setFilteredJobs(allJobs); 
    } else {
      setFilteredJobs(allJobs.filter(job => job.location.toLowerCase() === selectedLocation.toLowerCase()));
    }
  };

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold text-indigo-800 mb-6 text-center">Browse Local Jobs</h1>

      {/* Location Filter */}
      <div className="mb-6 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-center">
        <label className="font-medium text-gray-700">Filter by Location:</label>
        
        <select
          className="border rounded px-2 py-1"
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
        >
          <option value="">All</option>
          <option value="Republic">Republic</option>
          <option value="Kettle Falls">Kettle Falls</option>
          <option value="Colville">Colville</option>
          <option value="Chewelah">Chewelah</option>
        </select>
        
        <button
          onClick={applyFilter}
          className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Apply Filter
        </button>
      </div>

      {/* Ad Panels */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="flex-1 bg-white border rounded-lg p-4 flex flex-col items-center text-center shadow">
        <img
          src="./images/logo4.png" 
          alt="Sponsor 1"
          className="w-80 h-32 object-contain mb-4 mt-6"
        />
        <p className="text-gray-700 font-medium mt-8">Sponsored by Local Businesses</p>
        {/* <p className="text-sm text-gray-500 mt-1">Your ad could be here!</p> */}
      </div>

        <div className="flex-1 bg-white border rounded-lg p-4 flex flex-col items-center text-center shadow">
        <img
          src="./images/sponsor.png" 
          alt="Sponsor 1"
          className="w-100 h-50 object-contain"
        />
        <p className="text-gray-700 font-medium">Sponsored by Local Businesses</p>
        <p className="text-sm text-gray-500 mt-1">Your ad could be here!</p>
      </div>
      </div>

      {/* Job Feed */}
      <div className="flex flex-col gap-4 items-center">
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : filteredJobs.length > 0 ? (
          filteredJobs.map((job) => <JobCard key={job.id} {...job} />)
        ) : (
          <p className="text-gray-500">No job posts found.</p>
        )}
      </div>

      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 z-50 bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 transition"
          aria-label="Scroll to top"
        >
          Back to Top
        </button>
      )}

    </div>
  );
};

export default JobPage;
