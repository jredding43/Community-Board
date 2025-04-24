const EventsPage = () => {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md border text-gray-800">
        <h1 className="text-3xl font-bold text-indigo-700 mb-4">Local Events & Promotions</h1>
        <p className="mb-6 text-gray-700">
          This space is reserved for community happenings and business promotions. Whether you're running a local sale, organizing a fundraiser,
          or hosting a community event — this is where people in the area come to find out what's going on.
        </p>
  
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-indigo-600 mb-3">Sponsored Events & Announcements</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Example Sponsored Event Card */}
            <div className="border rounded-lg p-4 shadow-sm bg-gray-50">
              <h3 className="text-xl font-bold text-indigo-700">Spring BBQ at Big Pines Park</h3>
              <p className="text-sm text-gray-600">Saturday, May 4 · 12pm - 4pm</p>
              <p className="mt-2 text-gray-700">
                Hosted by Colville Outdoors & BBQ Bros. Come enjoy great food, lawn games, and local vendors. $5 entry — kids eat free!
              </p>
            </div>
  
            <div className="border rounded-lg p-4 shadow-sm bg-gray-50">
              <h3 className="text-xl font-bold text-indigo-700">Kettle Falls Tire — Spring Tire Sale</h3>
              <p className="text-sm text-gray-600">April 22 - May 15</p>
              <p className="mt-2 text-gray-700">
                20% off all sets of all-terrain tires. Free installation for local residents. Walk-ins welcome!
              </p>
            </div>
          </div>
        </section>
  
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-indigo-600 mb-3">Free Community Listings</h2>
          <p className="text-sm text-gray-600 mb-2">
            These are non-paid listings shared by local residents or organizations. Have something to share? Reach out!
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>
              <strong>Neighborhood Clean-Up Day</strong> — May 11 · Meet at Republic Park · Gloves and bags provided
            </li>
            <li>
              <strong>Open Mic Night</strong> at The Bean House — Every Friday at 6pm · Free entry · All ages welcome
            </li>
          </ul>
        </section>
  
        <section className="border-t pt-6">
          <h2 className="text-xl font-semibold text-indigo-700 mb-2">Want to Promote Your Event?</h2>
          <p className="text-gray-700 mb-4">
            We offer affordable, one-time paid event slots for local businesses and organizations. Your listing will appear at the top of this page and reach a
            hyper-local audience looking for things to do and businesses to support.
          </p>
          <a
            href="/contact" 
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded"
          >
            Submit a Sponsored Event
          </a>
        </section>
      </div>
    );
  };
  
  export default EventsPage;
  