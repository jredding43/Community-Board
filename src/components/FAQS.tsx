import { useState } from "react";

const FAQs = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    { question: "How long do posts stay up?", answer: "Job posts stay visible for 14 days. Event listings last up to 30 days or until the event date passes. Posts are removed automatically afterward." },
    { question: "Do I need an account to post?", answer: "No account or signup is required. You can post using just your contact info — we don't store anything extra." },
    { question: "Is my information safe?", answer: "Yes. We only store the details you include in your post. No tracking, no selling, and no accounts." },
    { question: "Can I post for my business?", answer: "Yes — businesses can post via the Events section with optional paid promotion. Regular job posts are for individuals only." },
    { question: "How do I delete my post?", answer: "You'll set a passphrase when creating your post. Use that along with your contact info to find and remove your listing anytime." },
    { question: "Where is Community Board available?", answer: "This platform is built for Republic, Kettle Falls, Colville, Chewelah, and nearby areas. Posts outside this region may be removed to keep things local." },
    { question: "Is it really free to use?", answer: "Yes! Posting jobs or events is 100% free. There are no hidden fees, upsells, or paid tiers for regular community use." },
    { question: "Can I post volunteer opportunities?", answer: "Absolutely. You can mark the pay type as 'Community Service' when creating your post. It's a great way to find help or offer help locally." },
    { question: "How do I make my post stand out?", answer: "Use clear titles, honest descriptions, and include details like timing, pay, or expectations. Posts with more info get more responses." },
    { question: "Can I edit my post after it's published?", answer: "You must delete the original post using your passphrase and contact, then submit a new one with the updated details." },
    { question: "Will I be notified when someone replies?", answer: "Not yet. Anyone interested will contact you directly using the info you provide." },
    { question: "Why was my post removed?", answer: "We remove posts that are outside the local area, spammy, abusive, or not aligned with the purpose of the site." },
  ];

  const alwaysVisible = faqs.slice(0, 3);
  const hiddenUntilExpanded = faqs.slice(3);

  return (
    <section className="mt-12 bg-gradient-to-br from-indigo-50 to-white p-8 rounded-xl shadow-md border border-indigo-100">
      <h2 className="text-3xl font-bold text-center text-indigo-700 mb-8">Frequently Asked Questions</h2>

      <div className="space-y-4">
        {alwaysVisible.map((faq, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm transition-all">
            <button
              onClick={() => toggleFAQ(index)}
              className="flex justify-between w-full text-left font-medium text-indigo-700 focus:outline-none"
            >
              <span>{faq.question}</span>
              <span className="text-sm">{openIndex === index ? "▲" : "▼"}</span>
            </button>
            {openIndex === index && (
              <p className="mt-3 text-gray-700 text-sm leading-relaxed">{faq.answer}</p>
            )}
          </div>
        ))}

        {showAll &&
          hiddenUntilExpanded.map((faq, index) => {
            const adjustedIndex = index + 3;
            return (
              <div key={adjustedIndex} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm transition-all">
                <button
                  onClick={() => toggleFAQ(adjustedIndex)}
                  className="flex justify-between w-full text-left font-medium text-indigo-700 focus:outline-none"
                >
                  <span>{faq.question}</span>
                  <span className="text-sm">{openIndex === adjustedIndex ? "▲" : "▼"}</span>
                </button>
                {openIndex === adjustedIndex && (
                  <p className="mt-3 text-gray-700 text-sm leading-relaxed">{faq.answer}</p>
                )}
              </div>
            );
          })}
      </div>

      <div className="mt-6 text-center">
        <button
          onClick={() => {
            setShowAll(!showAll);
            setOpenIndex(null);
          }}
          className="px-4 py-2 text-sm font-medium text-indigo-600 border border-indigo-300 rounded hover:bg-indigo-50 transition"
        >
          {showAll ? "Hide Additional Questions" : "Show All Questions"}
        </button>
      </div>
    </section>
  );
};

export default FAQs;
