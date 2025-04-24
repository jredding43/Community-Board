import { useState, useRef } from "react";

interface HeaderProps {
  setActivePage: (page: string) => void;
}

const Header = ({ setActivePage }: HeaderProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const clickCountRef = useRef(0);
  const firstClickTimeRef = useRef<number | null>(null);

  const handleLogoClick = () => {
    const now = Date.now();

    // Reset if it's been more than 5 seconds since the first click
    if (!firstClickTimeRef.current || now - firstClickTimeRef.current > 5000) {
      firstClickTimeRef.current = now;
      clickCountRef.current = 1;
    } else {
      clickCountRef.current += 1;
    }

    if (clickCountRef.current >= 10) {
      setShowAdmin(true);
      console.log(" Admin tab unlocked");
      // Optional: Reset so it doesn't keep counting
      clickCountRef.current = 0;
      firstClickTimeRef.current = null;
    }
  };

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-screen-xl mx-auto px-4 py-4 flex justify-between items-center">
        <button
          onClick={handleLogoClick}
          className="text-xl font-bold text-indigo-600"
        >
          Community Board
        </button>

        {/* Hamburger Menu */}
        <button
          className="md:hidden text-2xl text-gray-700"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>

        {/* Nav Links */}
        <nav
          className={`${
            menuOpen ? "block" : "hidden"
          } absolute md:static top-16 left-0 w-full md:w-auto bg-white md:bg-transparent md:flex space-y-4 md:space-y-0 md:space-x-4 px-4 md:px-0 py-4 md:py-0 shadow md:shadow-none z-50`}
        >
          <button
            onClick={() => {
              setActivePage("home");
              setMenuOpen(false);
            }}
            className="block text-gray-700 hover:text-indigo-600"
          >
            Home
          </button>
          <button
            onClick={() => {
              setActivePage("createjob");
              setMenuOpen(false);
            }}
            className="block text-gray-700 hover:text-indigo-600"
          >
            Post a Job
          </button>
          <button
            onClick={() => {
              setActivePage("jobpage");
              setMenuOpen(false);
            }}
            className="block text-gray-700 hover:text-indigo-600"
          >
            Browse Jobs
          </button>
          <button
            onClick={() => {
              setActivePage("events");
              setMenuOpen(false);
            }}
            className="block text-gray-700 hover:text-indigo-600"
          >
            Events
          </button>
          <button
            onClick={() => {
              setActivePage("about");
              setMenuOpen(false);
            }}
            className="block text-gray-700 hover:text-indigo-600"
          >
            About
          </button>

          {/* Admin tab (hidden unless unlocked) */}
          {showAdmin && (
            <button
              onClick={() => {
                setActivePage("admin");
                setMenuOpen(false);
              }}
              className="block text-red-700 font-semibold hover:underline"
            >
              Admin
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
