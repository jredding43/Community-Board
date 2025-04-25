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
    <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow border">
      <h2 className="text-2xl font-bold text-indigo-700 mb-4">Post a Local Job</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Job Title"
          value={form.title}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          name="description"
          placeholder="Job Description"
          value={form.description}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          rows={4}
          required
        />

        <div className="flex gap-4">
          {form.payType !== "Donation" && form.payType !== "Community Service" && (
            <input
              type="text"
              name="payAmount"
              placeholder="Pay Amount (e.g., 20)"
              value={form.payAmount}
              onChange={handleChange}
              className="w-2/3 p-2 border rounded"
            />
          )}
          <select
            name="payType"
            value={form.payType}
            onChange={handleChange}
            className={form.payType === "Donation" || form.payType === "Community Service" ? "w-full p-2 border rounded" : "w-1/3 p-2 border rounded"}
          >
            <option value="Hourly">Hourly</option>
            <option value="Total">Total</option>
            <option value="Community Service">Community Service</option>
            <option value="Donation">Donation</option>
          </select>
        </div>

        <select
          name="location"
          value={form.location}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Select a Location</option>
          <option value="Republic">Republic</option>
          <option value="Kettle Falls">Kettle Falls</option>
          <option value="Colville">Colville</option>
          <option value="Chewelah">Chewelah</option>
        </select>

        <input
          type="date"
          name="dateNeeded"
          value={form.dateNeeded}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <div className="flex gap-4">
          <select
            name="contactType"
            value={form.contactType}
            onChange={handleChange}
            className="w-1/3 p-2 border rounded"
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
            className="w-2/3 p-2 border rounded"
            required
          />
        </div>

        <textarea
          name="deletePassPhrase"
          placeholder="Unique one-word passphrase"
          value={form.deletePassPhrase}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          rows={2}
          required
        />
        <h3 className="text-red-500 italic -mt-6">Write down or remember passphrase.  It will not be available again.</h3>

        {error && <p className="text-red-600 text-sm">{error}</p>}
        {success && <p className="text-green-600 text-sm">{success}</p>}

        <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
          Submit Job
        </button>

        <div className="hidden">
          <label htmlFor="website">Leave this field blank</label>
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

      <hr className="my-6 border-t border-gray-300" />

      <div className="mb-4 p-4 border-l-4 border-yellow-400 bg-yellow-50 text-sm text-gray-700 rounded">
        <p className="mb-1 font-semibold">Job posts automatically expire after 2 weeks.</p>
        <p>
          If your job has already been fulfilled and you don't want to receive more messages,
          you can remove your post early using the form below.
        </p>
      </div>

      <h3 className="text-lg font-semibold text-indigo-700 mb-2">Find & Remove Your Posts</h3>
      <div className="space-y-3 mb-4">
        <input
          type="text"
          placeholder="Contact (email or phone)"
          value={form.contact}
          onChange={handleChange}
          name="contact"
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Passphrase"
          value={form.deletePassPhrase}
          onChange={handleChange}
          name="deletePassPhrase"
          className="w-full p-2 border rounded"
        />
        <button
          type="button"
          onClick={handleSearch}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Search Posts
        </button>
      </div>

      {searchResults.length > 0 && (
        <div className="mt-4">
          <h4 className="text-md font-semibold text-gray-700 mb-2">Matching Posts</h4>
          <ul className="space-y-3">
            {searchResults.map((post, idx) => (
              <li key={idx} className="border p-3 rounded text-sm bg-gray-50">
                <p><strong>{post.title}</strong></p>
                <p>{post.description}</p>
                <button
                  onClick={() => handleDelete(post.title)}
                  className="mt-2 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-xs"
                >
                  ❌ Delete This Post
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CreateJob;