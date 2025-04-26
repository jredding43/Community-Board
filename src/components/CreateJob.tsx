import { useState } from "react";

const CreateJob = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    payAmount: "",
    payType: "Hourly",
    location: "",
    dateNeeded: "",
    contact: "",
    contactType: "phone",
    deletePassPhrase: "",
    website: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setError("");
    setSuccess("");
  };

  const isValidContact = (value: string, type: string) => {
    const phoneRegex = /^(\+?1\s?)?(\(\d{3}\)|\d{3})[-.\s]?\d{3}[-.\s]?\d{4}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return type === "phone" ? phoneRegex.test(value) : emailRegex.test(value);
  };

  const isValidDate = (date: string) => {
    return !isNaN(Date.parse(date));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.website) return;
    if (!isValidContact(form.contact, form.contactType)) {
      setError(`Please enter a valid ${form.contactType}.`);
      return;
    }
    if (!isValidDate(form.dateNeeded)) {
      setError("Please enter a valid date.");
      return;
    }

    const fullPay = `${form.payAmount} (${form.payType})`;

    try {
      const res = await fetch("https://community-board-backend.onrender.com/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          pay: fullPay,
          location: form.location,
          dateNeeded: form.dateNeeded,
          contact: form.contact,
          contactType: form.contactType,
          ip: "client-ip-placeholder",
          deletePassPhrase: form.deletePassPhrase,
        }),
      });

      if (res.ok) {
        setForm({
          title: "",
          description: "",
          payAmount: "",
          payType: "Hourly",
          location: "",
          dateNeeded: "",
          contact: "",
          contactType: "phone",
          deletePassPhrase: "",
          website: "",
        });
        setSuccess("Job posted successfully!");
      } else {
        const { error } = await res.json();

        if (res.status === 429) {
          setError("You've already posted 2 jobs with this contact. You cannot post more.");
        } else {
          setError(error || "Failed to post job.");
        }
      }
    } catch (err) {
      console.error(err);
      setError("Server error. Try again later.");
    }
  };
      

  const handleSearch = async () => {
    const res = await fetch("https://community-board-backend.onrender.com/jobs/search-by-passphrase", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contact: form.contact,
        deletePassPhrase: form.deletePassPhrase,
      }),
    });
    const data = await res.json();
    if (res.ok) {
      setSearchResults(data);
    } else {
      alert(data.error || "No posts found.");
    }
  };

  const handleDelete = async (title: string) => {
    const res = await fetch("https://community-board-backend.onrender.com/jobs/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        contact: form.contact,
        deletePassPhrase: form.deletePassPhrase,
      }),
    });
    const data = await res.json();
    if (res.ok) {
      setSearchResults(searchResults.filter(post => post.title !== title));
      alert("Post deleted successfully.");
    } else {
      alert(data.error || "Failed to delete post.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md border">
      <h2 className="text-3xl font-bold text-indigo-700 mb-6 text-center">Post a Local Job</h2>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Job Title */}
        <input
          type="text"
          name="title"
          placeholder="Job Title"
          value={form.title}
          onChange={handleChange}
          className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-300"
          required
        />

        {/* Job Description */}
        <textarea
          name="description"
          placeholder="Job Description"
          value={form.description}
          onChange={handleChange}
          className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-300"
          rows={4}
          required
        />

        {/* Pay Section */}
        <div className="flex flex-col md:flex-row gap-4">
          {form.payType !== "Donation" && form.payType !== "Community Service" && (
            <input
              type="text"
              name="payAmount"
              placeholder="Pay Amount (e.g., 20)"
              value={form.payAmount}
              onChange={handleChange}
              className="flex-1 p-3 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
          )}
          <select
            name="payType"
            value={form.payType}
            onChange={handleChange}
            className="flex-1 p-3 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-300"
          >
            <option value="Hourly">Hourly</option>
            <option value="Total">Total</option>
            <option value="Community Service">Community Service</option>
            <option value="Donation">Donation</option>
          </select>
        </div>

        {/* Location */}
        <select
          name="location"
          value={form.location}
          onChange={handleChange}
          className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-300"
          required
        >
          <option value="">Select a Location</option>
          <option value="Republic">Republic</option>
          <option value="Kettle Falls">Kettle Falls</option>
          <option value="Colville">Colville</option>
          <option value="Chewelah">Chewelah</option>
        </select>

        {/* Date Needed */}
        <input
          type="date"
          name="dateNeeded"
          value={form.dateNeeded}
          onChange={handleChange}
          className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-300"
          required
        />

        {/* Contact Info */}
        <div className="flex flex-col md:flex-row gap-4">
          <select
            name="contactType"
            value={form.contactType}
            onChange={handleChange}
            className="flex-1 p-3 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-300"
          >
            <option value="phone">Phone</option>
            <option value="email">Email</option>
          </select>
          <input
            type={form.contactType === "email" ? "email" : "tel"}
            name="contact"
            placeholder={form.contactType === "email" ? "you@example.com" : "e.g., 509-555-1234"}
            value={form.contact}
            onChange={handleChange}
            className="flex-1 p-3 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-300"
            required
          />
        </div>

        {/* Delete Passphrase */}
        <textarea
          name="deletePassPhrase"
          placeholder="Unique passphrase (one word)"
          value={form.deletePassPhrase}
          onChange={handleChange}
          className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-300"
          rows={2}
          required
        />
        <p className="text-xs text-red-500 -mt-4 mb-2 italic">Write this down — it will not be shown again.</p>

        {/* Error & Success Messages */}
        {error && <p className="text-red-600 text-sm">{error}</p>}
        {success && <p className="text-green-600 text-sm">{success}</p>}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded transition"
        >
          Submit Job
        </button>

        {/* Honeypot Field */}
        <div className="hidden">
          <label htmlFor="website">Leave this blank</label>
          <input
            type="text"
            name="website"
            id="website"
            value={form.website || ""}
            onChange={handleChange}
            autoComplete="off"
          />
        </div>
      </form>

      {/* Divider */}
      <hr className="my-10 border-t-2 border-gray-300" />

      {/* Search and Delete Section */}
      <div className="bg-yellow-50 p-6 rounded-lg border-l-4 border-yellow-400 mb-6">
        <h3 className="text-lg font-bold text-yellow-800 mb-2">Manage Your Posts</h3>
        <p className="text-sm text-gray-700 mb-4">
          Posts expire after 2 weeks automatically. If you want to remove your post early, you can find and delete it using your contact and passphrase.
        </p>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Contact (email or phone)"
            value={form.contact}
            onChange={handleChange}
            name="contact"
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-300"
          />
          <input
            type="text"
            placeholder="Passphrase"
            value={form.deletePassPhrase}
            onChange={handleChange}
            name="deletePassPhrase"
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-300"
          />
          <button
            type="button"
            onClick={handleSearch}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-3 rounded transition"
          >
            Search My Posts
          </button>
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="mt-6 space-y-4">
            {searchResults.map((post, idx) => (
              <div key={idx} className="border p-4 rounded-lg bg-white shadow-sm">
                <p className="font-bold text-indigo-700">{post.title}</p>
                <p className="text-gray-600">{post.description}</p>
                <button
                  onClick={() => handleDelete(post.title)}
                  className="mt-3 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-4 py-2 rounded"
                >
                  ❌ Delete Post
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>

  );
};

export default CreateJob;