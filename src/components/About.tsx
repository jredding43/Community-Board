const AboutPage = () => {
  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md border text-gray-800">
      <h1 className="text-3xl font-bold text-indigo-700 mb-4">About This Site</h1>
      <p className="mb-4">
        This platform was created for people in our communities who need an extra hand — and for those looking to earn extra income by helping out locally.
        Whether you're offering to mow a lawn, need help stacking firewood, or are available for part-time labor, this site is for everyday neighbors, not big businesses.
      </p>

      <p className="mb-4">
        It's a simple and direct way to connect with others in the area. Post what you need or what you're offering, and let the community work together —
        no accounts, no tracking, just honest help when and where it's needed.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Why It Matters</h2>
      <p className="mb-4">
        Local events and small community gatherings are often overlooked or lost on big social platforms. 
        Community Board was created to give everyday people, local organizations, and small businesses a simple way to promote what's happening nearby — 
        without needing an account, without complicated systems, and without getting buried under corporate ads. 
        It's about making sure local voices are heard and local efforts are supported.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">What You Can Expect</h2>
      <ul className="list-disc list-inside mb-4">
        <li>No paywalls or fees — it's completely free</li>
        <li>No logins, accounts, or data harvesting</li>
        <li>Posts disappear after 2 weeks to keep things fresh</li>
        <li>Only local jobs — no recruiters or spam allowed</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">Sponsors & Ads</h2>
      <p className="mb-4">
        To keep this site free for everyone, we may include local sponsor messages or small ads. These are carefully selected and will never interrupt your experience.
        They help cover hosting and development costs — without selling your data or cluttering the site with popups.
        We only feature sponsors that align with the values of the platform: local, supportive, and community-focused.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Community Guidelines</h2>
      <ul className="list-disc list-inside text-sm text-gray-600 mb-4">
        <li>Use this platform respectfully and responsibly</li>
        <li>Never post offensive or inappropriate content</li>
        <li>Do not include sensitive personal details in posts</li>
        <li>Report any abuse or scams — we'll review and remove</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">How Reported Jobs Work</h2>
      <ul className="list-disc list-inside text-gray-700 mb-4">
        <li>Anyone can report a post for reasons like spam, scams, or inappropriate content.</li>
        <li>Once reported, a banner appears on the post: <span className="italic text-yellow-700">"⚠️ This post has been reported. Use caution until reviewed."</span></li>
        <li>Reported posts are not automatically removed — they stay visible unless flagged multiple times or removed by an admin.</li>
        <li>Duplicate reports are blocked — users can only report a post once.</li>
        <li>Posts that receive multiple reports may be hidden or manually reviewed.</li>
        <li>Admins can use a secure master passphrase to delete posts when needed.</li>
        <li>Report reasons are kept private to protect users and prevent retaliation.</li>
      </ul>


      <p className="mt-6 text-sm italic text-gray-500">
        This is a community-driven project. It's only as good as the people who use it — so keep it honest, helpful, and kind.
        Thank you for being part of something local that matters.
      </p>
    </div>
  );
};

export default AboutPage;
