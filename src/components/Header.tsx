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

    if (!firstClickTimeRef.current || now - firstClickTimeRef.current > 5000) {
      firstClickTimeRef.current = now;
      clickCountRef.current = 1;
    } else {
      clickCountRef.current += 1;
    }

    if (clickCountRef.current >= 10) {
      setShowAdmin(true);
      console.log("Admin tab unlocked");
      clickCountRef.current = 0;
      firstClickTimeRef.current = null;
    }
  };

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-screen-xl mx-auto px-4 py-3 flex justify-between items-center">
        
        {/* Logo + Text */}
        <button
          onClick={handleLogoClick}
          className="flex items-center space-x-3 text-indigo-600 font-bold text-2xl"
        >
          <img
            src="./images/logo.png"
            alt="Community Board Logo"
            className="h-15 w-auto"
          />
        </button>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-8">
          <button
            onClick={() => setActivePage("home")}
            className="text-gray-700 hover:text-indigo-600 font-medium transition"
          >
            Home
          </button>
          <button
            onClick={() => setActivePage("createjob")}
            className="text-gray-700 hover:text-indigo-600 font-medium transition"
          >
            Post a Job
          </button>
          <button
            onClick={() => setActivePage("jobpage")}
            className="text-gray-700 hover:text-indigo-600 font-medium transition"
          >
            Browse Jobs
          </button>
          <button
            onClick={() => setActivePage("events")}
            className="text-gray-700 hover:text-indigo-600 font-medium transition"
          >
            Events
          </button>
          <button
            onClick={() => setActivePage("about")}
            className="text-gray-700 hover:text-indigo-600 font-medium transition"
          >
            About
          </button>
          {showAdmin && (
            <button
              onClick={() => setActivePage("admin")}
              className="text-red-600 hover:underline font-semibold"
            >
              Admin
            </button>
          )}
        </nav>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-3xl text-gray-700"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="absolute top-16 left-0 w-full bg-white shadow-md flex flex-col space-y-4 py-4 px-6 z-50 md:hidden">
            <button
              onClick={() => {
                setActivePage("home");
                setMenuOpen(false);
              }}
              className="text-gray-700 hover:text-indigo-600 font-medium"
            >
              Home
            </button>
            <button
              onClick={() => {
                setActivePage("createjob");
                setMenuOpen(false);
              }}
              className="text-gray-700 hover:text-indigo-600 font-medium"
            >
              Post a Job
            </button>
            <button
              onClick={() => {
                setActivePage("jobpage");
                setMenuOpen(false);
              }}
              className="text-gray-700 hover:text-indigo-600 font-medium"
            >
              Browse Jobs
            </button>
            <button
              onClick={() => {
                setActivePage("events");
                setMenuOpen(false);
              }}
              className="text-gray-700 hover:text-indigo-600 font-medium"
            >
              Events
            </button>
            <button
              onClick={() => {
                setActivePage("about");
                setMenuOpen(false);
              }}
              className="text-gray-700 hover:text-indigo-600 font-medium"
            >
              About
            </button>
            {showAdmin && (
              <button
                onClick={() => {
                  setActivePage("admin");
                  setMenuOpen(false);
                }}
                className="text-red-600 hover:underline font-semibold"
              >
                Admin
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
