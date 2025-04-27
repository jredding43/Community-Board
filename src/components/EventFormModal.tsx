import { FC, useState } from "react";
import TermsModal from "../components/TermsModal";
import BASE_URL from "../api"

interface EventFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EventFormModal: FC<EventFormModalProps> = ({ isOpen, onClose }) => {
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);

  const handleImageUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'eventuploads'); // your Cloudinary unsigned preset

    try {
      const res = await fetch('https://api.cloudinary.com/v1_1/diaeiexys/image/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setUploadedImageUrl(data.secure_url);
    } catch (error) {
      console.error("Image upload failed:", error);
      alert("Failed to upload image. Please try again.");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const eventName = formData.get('eventName') as string;
    const eventDate = formData.get('eventDate') as string;
    const eventDescription = formData.get('eventDescription') as string;
    const eventLocation = formData.get('eventLocation') as string;
    const imageLink = formData.get('imageLink') as string;
    const contactEmail = formData.get('contactEmail') as string;
    const eventImageUrl = uploadedImageUrl || '';

    try {
      const response = await fetch(`${BASE_URL}/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventName,
          eventDate,
          eventDescription,
          eventLocation,
          eventImageUrl,
          imageLink,
          contactEmail,
        }),
      });

      if (response.ok) {
        alert("Event submitted successfully!");
        onClose();
      } else {
        alert("Failed to submit the event. Please try again.");
      }
    } catch (error) {
      console.error("Event submission error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1000000) { // Limit 1MB
        alert("Please upload an image smaller than 1MB.");
        return;
      }
      handleImageUpload(file);
    }
  };

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

        <h3 className="text-lg font-semibold mb-4 text-indigo-700">Submit Your Event</h3>

        <div className="mb-4 p-3 bg-yellow-100 border border-yellow-300 rounded text-yellow-800 text-sm">
          <p>
            Submitting this form does <strong>not guarantee</strong> your event will be published. 
            All submissions are reviewed prior to approval. 
            If approved, we'll contact you for payment details. 
            Events are listed up to <strong>30 days</strong>. 
            Submit at least <strong>72 hours in advance</strong> for timely posting.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Event Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Event Name</label>
            <input type="text" name="eventName" required className="mt-1 block w-full border rounded-md p-2" />
          </div>

          {/* Date & Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Date & Time</label>
            <input type="text" name="eventDate" required className="mt-1 block w-full border rounded-md p-2" />
          </div>

          {/* Event Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Event Description</label>
            <textarea name="eventDescription" rows={4} required className="mt-1 block w-full border rounded-md p-2"></textarea>
          </div>

          {/* Event Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Event Location</label>
            <input type="text" name="eventLocation" required className="mt-1 block w-full border rounded-md p-2" />
          </div>

          {/* Upload Event Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Upload Event Image (optional, 1MB max)</label>
            <input type="file" accept="image/*" onChange={handleImageChange} className="mt-1 block w-full border rounded-md p-2" />
            {uploadedImageUrl && (
              <div className="mt-2">
                <img src={uploadedImageUrl} alt="Uploaded" className="w-32 h-auto rounded-md" />
              </div>
            )}
          </div>

          {/* Links to Website/Promotion */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Links to Website/Promotion (Optional)</label>
            <input type="url" name="imageLink" className="mt-1 block w-full border rounded-md p-2" />
          </div>

          {/* Contact Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Contact Email</label>
            <input type="email" name="contactEmail" required className="mt-1 block w-full border rounded-md p-2" />
          </div>

          {/* Terms & Conditions */}
          <div className="flex items-start">
            <input id="agree" name="agree" type="checkbox" required className="mt-1 mr-2" />
            <label htmlFor="agree" className="text-sm text-gray-700">
              I agree to the
              <span className="text-indigo-600 ml-1 underline cursor-pointer" onClick={() => setIsTermsOpen(true)}>
                Terms & Conditions
              </span>.
            </label>
            <TermsModal isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} />
          </div>

          {/* Submit Button */}
          <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default EventFormModal;
