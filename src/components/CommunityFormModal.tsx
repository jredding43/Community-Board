import { FC, useState } from "react";
import TermsModal from "../components/TermsModal";

interface CommunityFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CommunityFormModal: FC<CommunityFormModalProps> = ({ isOpen, onClose }) => {
  const [isTermsOpen, setIsTermsOpen] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg relative overflow-y-auto max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        <h3 className="text-lg font-semibold mb-4 text-indigo-700">Submit Community Event</h3>

        <div className="mb-4 p-3 bg-yellow-100 border border-yellow-300 rounded text-yellow-800 text-sm">
          <p>
            Submitting this form does <strong>not guarantee</strong> that your event will be published. 
            We accept free community-focused listings only — such as workshops, informational events, and local gatherings. 
            Business advertisements or promotional sales are not eligible. 
            Approved listings will be posted for up to <strong>30 days</strong> and may be removed automatically after the event date.
          </p>
        </div>

        <form action="https://formspree.io/f/xeogolbj" method="POST" className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Community Event Name</label>
            <input
              type="text"
              name="communityName"
              required
              className="mt-1 block w-full border rounded-md p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Date & Time</label>
            <input
              type="text"
              name="communityDate"
              required
              className="mt-1 block w-full border rounded-md p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Community Description</label>
            <textarea
              name="communityDescription"
              rows={4}
              required
              className="mt-1 block w-full border rounded-md p-2"
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Community Location</label>
            <input
              type="text"
              name="communityLocation"
              required
              className="mt-1 block w-full border rounded-md p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Website or Promotion Link (Optional)</label>
            <input
              type="url"
              name="siteLink"
              className="mt-1 block w-full border rounded-md p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Flyer or Image Link (Optional)</label>
            <input
              type="url"
              name="imageLink"
              className="mt-1 block w-full border rounded-md p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Contact Email</label>
            <input
              type="email"
              name="contactEmail"
              required
              className="mt-1 block w-full border rounded-md p-2"
            />
          </div>

          {/* Terms & Conditions Checkbox */}
          <div className="flex items-start">
            <input
              id="agree"
              name="agree"
              type="checkbox"
              required
              className="mt-1 mr-2"
            />
            <label htmlFor="agree" className="text-sm text-gray-700">
              I agree to the 
              <span
                className="text-indigo-600 ml-1 underline cursor-pointer"
                onClick={() => setIsTermsOpen(true)}
              >
                Terms & Conditions
              </span>.
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded"
          >
            Submit
          </button>
        </form>

        {/* Terms Modal */}
        <TermsModal isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} />
      </div>
    </div>
  );
};

export default CommunityFormModal;
