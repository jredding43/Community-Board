import { useState, useEffect } from "react";
import EventFormModal from "../components/EventFormModal";
import CommunityFormModal from "../components/CommunityFormModal";
import TermsModal from "../components/TermsModal";
import BASE_URL from "../api";

interface Event {
  id: number;
  event_name: string;
  event_date: string;
  event_description: string;
  event_location: string;
  event_image_url: string;
  image_link: string;
  contact_email: string;
  approved: boolean;
  created_at: string;
}

interface CommunityPost {
  id: number;
  community_name: string;
  community_description: string;
  community_location: string;
  community_date: string;
  site_link?: string;
  contact_email: string;
  approved: boolean;
  created_at: string;
}

const EventsPage = () => {
  const [isEventFormOpen, setIsEventFormOpen] = useState(false);
  const [isCommunityFormOpen, setIsCommunityFormOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [community, setCommunity] = useState<CommunityPost[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState("");

  const openModal = (imageUrl: string) => {
    setModalImageUrl(imageUrl);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalImageUrl("");
  };

  useEffect(() => {
    fetch(`${BASE_URL}/events`)
      .then((res) => res.json())
      .then((data) => setEvents(data))
      .catch((err) => console.error("Failed to fetch events:", err));

    fetch(`${BASE_URL}/community`)
      .then((res) => res.json())
      .then((data) => setCommunity(data))
      .catch((err) => console.error("Failed to fetch community posts:", err));
  }, []);

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
        <h2 className="text-2xl font-semibold text-indigo-600 mb-6">
          Sponsored Events & Announcements
        </h2>

        {events.length === 0 ? (
          <p className="text-gray-600">No sponsored events currently listed.</p>
        ) : (
          <>
            <div className="grid md:grid-cols-2 gap-6">
              {events
                .filter(event => event && event.approved)
                .map(event => (
                  <div
                    key={event.id}
                    className="border p-4 rounded bg-white shadow-sm cursor-pointer"
                    onClick={() => openModal(event.event_image_url)}
                  >
                    {/* Image Section */}
                    {event.event_image_url ? (
                      <img
                        src={event.event_image_url}
                        alt={event.event_name}
                        className="w-full object-cover rounded-t"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-40 bg-gray-100 text-gray-500 rounded-t">
                        No Image Available
                      </div>
                    )}

                    {/* Text Section */}
                    <h3 className="text-lg font-bold text-indigo-700 mb-2">
                      {event.event_name}
                    </h3>

                    <p className="text-sm text-gray-700 mb-1">
                      <strong>Date:</strong> {event.event_date}
                    </p>

                    <p className="text-sm text-gray-700 mb-1">
                      <strong>Location:</strong> {event.event_location}
                    </p>

                    <p className="text-gray-700 mb-2">
                      <strong>Description:</strong> {event.event_description}
                    </p>

                    {event.image_link && (
                      <p className="text-sm text-indigo-600">
                        <a
                          href={event.image_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Learn More
                        </a>
                      </p>
                    )}
                  </div>
                ))}
            </div>

            {/* Modal Section */}
            {isModalOpen && (
              <div
                className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
                onClick={closeModal}
              >
                <div className="bg-white p-4 rounded-lg max-w-3xl w-full">
                  <img src={modalImageUrl} alt="Popup" className="w-full h-auto rounded-md" />
                </div>
              </div>
            )}
          </>
        )}
      </section>


        {/* Free Community Listings Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-indigo-600 mb-4">
            Free Community Listings
          </h2>
          <p className="text-gray-700 mb-4">
            These are free, non-paid listings shared by local residents, nonprofits, and community groups.
          </p>

          {community.length === 0 ? (
            <div className="bg-yellow-50 p-4 border-l-4 border-yellow-400 rounded">
              <p className="text-sm text-gray-700">
                <strong>Community Spotlight:</strong> Highlight free events, workshops, local gatherings, or volunteer opportunities.
              </p>
              <p className="text-sm text-gray-500 mt-2">
                No community posts have been submitted yet.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6 mt-6">
              {community
                .filter(post => post.approved)
                .map(post => (
                  <div key={post.id} className="border p-4 rounded bg-white shadow-sm">
                    <h3 className="text-lg font-bold text-indigo-700 mb-2">
                      {post.community_name}
                    </h3>

                    <p className="text-sm text-gray-700 mb-1">
                      <strong>Date:</strong> {post.community_date || "N/A"}
                    </p>

                    <p className="text-sm text-gray-700 mb-1">
                      <strong>Location:</strong> {post.community_location || "N/A"}
                    </p>

                    <p className="text-gray-700 mb-2">
                      <strong>Description:</strong> {post.community_description}
                    </p>

                    {post.site_link && (
                      <p className="text-sm text-indigo-600 mb-2">
                        <a
                          href={post.site_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline"
                        >
                          Visit Website
                        </a>
                      </p>
                    )}

                    {/* <p className="text-sm text-gray-500 mb-1">
                      <strong>Contact:</strong> {post.contact_email}
                    </p> */}
                  </div>
                ))}
            </div>
          )}
        </section>



      {/* Promote Your Event Section */}
      <section className="border-t pt-8 space-y-6">
        <h2 className="text-2xl font-semibold text-indigo-700">
          Want to Promote Your Event?
        </h2>
        <p className="text-gray-700">
          We offer affordable, one-time paid event slots for local businesses and organizations. 
          Sponsored listings appear at the top of this page and reach a hyper-local audience looking for events and services to support.
        </p>
        <h4 className="text-small italic text-indigo-600 mb-2">
          Sponsor Ads: $20 for 30 Days
        </h4>
        <p className="text-sm italic text-gray-500 mb-6">
          Your ad will appear for 30 days, increasing visibility in the community.
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
