import { FC } from "react";

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PrivacyModal: FC<PrivacyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl relative overflow-y-auto max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold text-indigo-700 mb-4">Privacy Policy</h2>

        <div className="space-y-4 text-gray-700 text-sm">
          <p>
            Community Board values your privacy. We are committed to maintaining a simple, safe, and transparent platform for local community use.
          </p>

          <h3 className="font-semibold text-indigo-600">1. Information We Collect</h3>
          <p>
            We do not collect personal data through user accounts, tracking cookies, or third-party advertising. 
            The only information collected is the contact details (phone number or email) that you voluntarily provide when submitting a job or event post.
          </p>

          <h3 className="font-semibold text-indigo-600">2. How We Use Your Information</h3>
          <p>
            Your contact information is publicly visible within your post to allow community members to reach out to you directly. 
            We do not sell, share, or use this information for any other purpose.
          </p>

          <h3 className="font-semibold text-indigo-600">3. Data Retention</h3>
          <p>
            All posts, along with their associated contact information, are automatically deleted after 14 days (jobs) or 30 days (events) to maintain platform freshness. 
            Users can also manually delete their own posts at any time.
          </p>

          <h3 className="font-semibold text-indigo-600">4. Third-Party Services</h3>
          <p>
            This website does not integrate third-party tracking, analytics, or advertising services.
          </p>

          <h3 className="font-semibold text-indigo-600">5. Security</h3>
          <p>
            We take reasonable measures to secure the platform. However, by submitting information, you acknowledge that posting public contact information involves inherent risks.
          </p>

          <h3 className="font-semibold text-indigo-600">6. Your Responsibilities</h3>
          <p>
            Please avoid posting sensitive information beyond what is necessary. 
            Always use caution when responding to public posts and only share additional personal details with trusted contacts.
          </p>

          <h3 className="font-semibold text-indigo-600">7. Updates to This Policy</h3>
          <p>
            We may update this Privacy Policy occasionally to reflect platform changes. 
            Major updates will be announced publicly on the site.
          </p>

          <p className="italic text-xs text-gray-500">
            Last updated: April 2025
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyModal;
