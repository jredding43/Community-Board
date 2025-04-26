import { FC } from "react";

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TermsModal: FC<TermsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-3xl w-full relative overflow-y-auto max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold text-indigo-700 mb-4">Terms & Conditions</h2>

        <div className="space-y-4 text-gray-700 text-sm">
          <p>
            By submitting a Sponsored Event or Community Listing, you acknowledge and agree to the following Terms & Conditions. Please read carefully before submitting.
          </p>

          <h3 className="font-semibold text-indigo-600">1. Submission and Approval</h3>
          <p>
            Submission of an event or listing does <strong>not guarantee</strong> publication. All submissions are subject to review and approval based on relevance, appropriateness, and community standards.
          </p>

          <h3 className="font-semibold text-indigo-600">2. Content Standards</h3>
          <p>
            Submitted events must be lawful, appropriate for all audiences, and community-focused. We reserve the right to reject or remove any listing that contains offensive, misleading, or inappropriate content.
          </p>

          <h3 className="font-semibold text-indigo-600">3. Payment Terms (Sponsored Events Only)</h3>
          <p>
            Payment is required for Sponsored Event submissions upon approval. All payments are <strong>non-refundable</strong> once the event has been approved and scheduled for posting.
          </p>

          <h3 className="font-semibold text-indigo-600">4. Posting Duration</h3>
          <p>
            Approved events will be posted for a maximum of <strong>30 days</strong> from the publication date unless otherwise agreed. Extensions beyond 30 days may require additional payment.
          </p>

          <h3 className="font-semibold text-indigo-600">5. Timeliness of Submissions</h3>
          <p>
            Submissions made fewer than <strong>72 hours</strong> before the event or promotion date may not be processed or posted in time. We recommend submitting at least one week in advance.
          </p>

          <h3 className="font-semibold text-indigo-600">6. Editing and Removal</h3>
          <p>
            We reserve the right to edit submissions for clarity, grammar, or length. We may also remove listings at any time without notice if deemed necessary to comply with community guidelines or legal requirements.
          </p>

          <h3 className="font-semibold text-indigo-600">7. Accuracy of Information</h3>
          <p>
            You are responsible for the accuracy of the information submitted. We are not liable for errors, omissions, or outdated information provided in your listing.
          </p>

          <h3 className="font-semibold text-indigo-600">8. Limitation of Liability</h3>
          <p>
            We are not responsible for any loss, damage, or dissatisfaction arising from participation in, reliance on, or attendance at any listed event. Submission of an event does not create any partnership, agency, or employment relationship.
          </p>

          <h3 className="font-semibold text-indigo-600">9. Policy Changes</h3>
          <p>
            We reserve the right to update these Terms & Conditions at any time without prior notice. It is your responsibility to review them periodically for any changes.
          </p>

          <p className="font-semibold text-gray-600 pt-4">
            By submitting your event or listing, you confirm that you have read, understood, and agree to these Terms & Conditions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsModal;
