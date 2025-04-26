import { useState } from "react";
import EventFormModal from "../components/EventFormModal"; 
import CommunityFormModal from "../components/CommunityFormModal";
import TermsModal from "../components/TermsModal";

const EventsPage = () => {
  const [isEventFormOpen, setIsEventFormOpen] = useState(false);
  const [isCommunityFormOpen, setIsCommunityFormOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);

  return (
    <div className="max-w-5xl mx-auto p-8 bg-indigo-50 rounded-lg shadow-md border text-gray-800">
      <h1 className="text-4xl font-bold text-indigo-700 mb-6 text-center">
        Local Events & Promotions
      </h1>
      <p className="text-lg text-gray-700 mb-10 text-center">
        Share your local events, business promotions, fundraisers, workshops, and community happenings. 
        Whether you're hosting or helping — this is where your community connects.
      </p>

      {/* Sponsored Events Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-indigo-600 mb-6">Sponsored Events & Announcements</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {/* Sponsored Event Image Card */}
          <div className="border rounded-lg overflow-hidden shadow-md bg-gray-100 flex items-center justify-center h-64">
            <img
              src="./images/promotion.png" 
              alt="Sponsored Event 1"
              className="object-cover w-96 h-auto"
            />
          </div>
        </div>
      </section>

      {/* Free Community Listings Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-indigo-600 mb-4">Free Community Listings</h2>
        <p className="text-gray-700 mb-4">
          These are free, non-paid listings shared by local residents, nonprofits, and community groups.
        </p>
        <div className="bg-yellow-50 p-4 border-l-4 border-yellow-400 rounded space-y-2">
          <p className="text-sm text-gray-700">
            <strong>Community Spotlight</strong> — Highlight free events, workshops, local gatherings, or volunteer opportunities.
          </p>
        </div>
      </section>

      {/* Promote Your Event Section */}
      <section className="border-t pt-8 space-y-6">
        <h2 className="text-2xl font-semibold text-indigo-700">Want to Promote Your Event?</h2>
        <p className="text-gray-700">
          We offer affordable, one-time paid event slots for local businesses and organizations. 
          Sponsored listings appear at the top of this page and reach a hyper-local audience looking for events and services to support.
        </p>

        {/* Terms Notice */}
        <p className="text-xs text-gray-500">
          By submitting an event, you agree to our{" "}
          <button
            onClick={() => setIsTermsOpen(true)}
            className="text-indigo-600 hover:underline ml-1"
          >
            Terms & Conditions
          </button>.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <button
            onClick={() => setIsEventFormOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded w-full sm:w-auto"
          >
            Submit a Sponsored Event
          </button>

          <button
            onClick={() => setIsCommunityFormOpen(true)}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded w-full sm:w-auto"
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
