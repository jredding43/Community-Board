import { useState } from "react";
import PrivacyModal from "../components/Privacy";

const Footer = () => {
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

  return (
    <footer className="bg-white border-t mt-8 py-6 text-center text-xs text-gray-500">
      <p className="space-x-2">
        <span>&copy; {new Date().getFullYear()} Community Board.</span>
        <span>Built for local use. Your privacy is respected.</span>
      </p>

      <p className="mt-2 flex justify-center items-center flex-wrap gap-2 text-gray-400">
        <span>
          Built and maintained by{" "}
          <a
            href="https://r43digitaltech.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 font-semibold hover:underline"
          >
            R43 Digital Tech
          </a>
        </span>
        <span>|</span>
        <button
          onClick={() => setIsPrivacyOpen(true)}
          className="text-indigo-600 font-semibold hover:underline"
        >
          Privacy Policy
        </button>
      </p>

      {/* Privacy Modal */}
      <PrivacyModal isOpen={isPrivacyOpen} onClose={() => setIsPrivacyOpen(false)} />
    </footer>
  );
};

export default Footer;
