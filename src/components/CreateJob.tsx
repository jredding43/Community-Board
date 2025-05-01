import { useState } from "react";
import { Filter } from "bad-words";

const filter = new Filter();

export function validatePost(content: string) {
  return !filter.isProfane(content);
}

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

  const isValidDate = (date: string) => !isNaN(Date.parse(date));

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
    if (filter.isProfane(form.title) || filter.isProfane(form.description)) {
      setError("Your post contains inappropriate language and cannot be submitted.");
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
        setError(res.status === 429 ? "You've already posted 2 jobs with this contact." : error || "Failed to post job.");
      }
    } catch {
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
    res.ok ? setSearchResults(data) : alert(data.error || "No posts found.");
  };

  const handleDelete = async (title: string) => {
    const res = await fetch("https://community-board-backend.onrender.com/jobs/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, contact: form.contact, deletePassPhrase: form.deletePassPhrase }),
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
    <div className="max-w-2xl mx-auto bg-gradient-to-br from-indigo-200 to-white text-gray-800 p-10 rounded-3xl shadow-xl space-y-10 border border-indigo-200">
      <h2 className="text-3xl font-bold text-center">Post a Local Job</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <input type="text" name="title" placeholder="Job Title" value={form.title} onChange={handleChange} required className="w-full p-3 bg-white border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400" />

        <textarea name="description" placeholder="Job Description" rows={4} value={form.description} onChange={handleChange} required className="w-full bg-white p-3 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {form.payType !== "Donation" && form.payType !== "Community Service" && (
            <input type="text" name="payAmount" placeholder="Pay (e.g., 20)" value={form.payAmount} onChange={handleChange} className="w-full bg-white p-3 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400" />
          )}
          <select name="payType" value={form.payType} onChange={handleChange} className="w-full bg-white p-3 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400">
            <option value="Hourly">Hourly</option>
            <option value="Total">Total</option>
            <option value="Community Service">Community Service</option>
            <option value="Donation">Donation</option>
          </select>
        </div>

        <select name="location" value={form.location} onChange={handleChange} required className="bg-white w-full p-3 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400">
          <option value="">Select a Location</option>
          <option value="Republic">Republic</option>
          <option value="North Port">North Port</option>
          <option value="Kettle Falls">Kettle Falls</option>
          <option value="Colville">Colville</option>
          <option value="Chewelah">Chewelah</option>
        </select>

        <input type="text" name="dateNeeded" placeholder="Date" value={form.dateNeeded} onFocus={(e) => (e.target.type = "date")} onBlur={(e) => { if (!e.target.value) e.target.type = "text"; }} onChange={handleChange} required className="w-full bg-white p-3 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <select name="contactType" value={form.contactType} onChange={handleChange} className="w-full bg-white p-3 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400">
            <option value="phone">Phone</option>
            <option value="email">Email</option>
          </select>
          <input type={form.contactType === "email" ? "email" : "tel"} name="contact" placeholder={form.contactType === "email" ? "you@example.com" : "e.g., 509-555-1234"} value={form.contact} onChange={handleChange} required className="w-full bg-white p-3 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400" />
        </div>

        <textarea name="deletePassPhrase" placeholder="Unique passphrase (one word)" rows={2} value={form.deletePassPhrase} onChange={handleChange} required className="w-full bg-white p-3 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400" />
        <p className="text-sm text-gray-500 italic">Make sure to remember this passphrase to manage your post.</p>

        {error && <p className="text-red-600 text-sm font-medium">{error}</p>}
        {success && <p className="text-green-600 text-sm font-medium">{success}</p>}

        <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition">Submit Job</button>
      </form>

      <div className="border-t pt-6 space-y-4">
        <h3 className="text-xl font-bold">Manage Your Posts</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input type="text" placeholder="Contact (email or phone)" name="contact" value={form.contact} onChange={handleChange} className="w-full bg-white p-3 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400" />
          <input type="text" placeholder="Passphrase" name="deletePassPhrase" value={form.deletePassPhrase} onChange={handleChange} className="w-full bg-white p-3 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400" />
        </div>
        <button onClick={handleSearch} className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3 rounded-lg transition">Find My Posts</button>

        {searchResults.length > 0 && (
          <div className="space-y-4">
            {searchResults.map((post, idx) => (
              <div key={idx} className="border border-black p-4 rounded-lg bg-gray-50">
                <p className="font-bold text-lg text-gray-800">{post.title}</p>
                <p className="text-sm text-gray-600">{post.description}</p>
                <button onClick={() => handleDelete(post.title)} className="mt-3 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-4 py-2 rounded">❌ Delete Post</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateJob;
