import { useState } from "react";
import EventFormModal from "../components/EventFormModal"; 
import CommunityFormModal from "../components/CommunityFormModal";
import TermsModal from "../components/TermsModal";

const EventsPage = () => {
  const [isEventFormOpen, setIsEventFormOpen] = useState(false);
  const [isCommunityFormOpen, setIsCommunityFormOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);


  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md border text-gray-800">
      <h1 className="text-3xl font-bold text-indigo-700 mb-4">Local Events & Promotions</h1>
      <p className="mb-6 text-gray-700">
        This space is reserved for community happenings and business promotions. Whether you're running a local sale, organizing a fundraiser,
        or hosting a community event — this is where people in the area come to find out what's going on.
      </p>

      {/* Sponsored Events Section */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-indigo-600 mb-6">Sponsored Events & Announcements</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Sponsored Event Image Card */}
          <div className="border rounded-lg overflow-hidden shadow-sm bg-gray-50 flex items-center justify-center h-64">
            <img
              src="./images/promotion.png" 
              alt="Sponsored Event 1"
              className="object-cover w-full h-full"
            />
          </div>
        </div>
      </section>

      {/* Free Community Listings Section */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-indigo-600 mb-3">Free Community Listings</h2>
        <p className="text-sm text-gray-600 mb-2">
          These are non-paid listings shared by local residents or organizations. Have something to share? Reach out!
        </p>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>
            <strong>Community Spotlight</strong> — Share exciting events, announcements, or opportunities happening soon right here.
          </li>
        </ul>
      </section>

      {/* Promote Your Event Section */}
      <section className="border-t pt-6 space-y-4">
        <h2 className="text-xl font-semibold text-indigo-700">Want to Promote Your Event?</h2>
        <p className="text-gray-700">
          We offer affordable, one-time paid event slots for local businesses and organizations. Your listing will appear at the top of this page and reach a
          hyper-local audience looking for things to do and businesses to support.
        </p>

        
        <p className="text-xs text-gray-500 mt-8">
          By submitting an event, you agree to our 
          <button
            onClick={() => setIsTermsOpen(true)}
            className="text-indigo-600 hover:underline ml-1"
          >
            Terms & Conditions
          </button>.
        </p>


        {/* Buttons */}
        <div className="space-x-4">
          <button
            onClick={() => setIsEventFormOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded"
          >
            Submit a Sponsored Event
          </button>

          <button
            onClick={() => setIsCommunityFormOpen(true)}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded"
          >
            Submit a Free Community Listing
          </button>
        </div>

        {/* Form Popups */}
        <EventFormModal isOpen={isEventFormOpen} onClose={() => setIsEventFormOpen(false)} />
        <CommunityFormModal isOpen={isCommunityFormOpen} onClose={() => setIsCommunityFormOpen(false)} />
        <TermsModal isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} />
      </section>
    </div>
  );
};

export default EventsPage;
