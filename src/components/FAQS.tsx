// src/components/FAQs.tsx

import { useState } from "react";

const FAQs = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "How long do posts stay up?",
      answer: "Job posts stay active for 14 days. Event posts stay up for 30 days or until the event date passes. After that, they are automatically removed.",
    },
    {
      question: "Do I need an account to post?",
      answer: "No accounts, passwords, or signups are required. Just fill out the form with the contact information you choose to share.",
    },
    {
      question: "Is my information safe?",
      answer: "We only collect the contact info you include in your post. We do not track, sell, or store any additional data about you.",
    },
    {
      question: "Can I post for my business?",
      answer: "Sponsored paid promotions are available through the Events page. Regular job postings must be personal and local only — no recruiters or big companies.",
    },
    {
      question: "How do I delete my post?",
      answer: "When you create a post, you set a unique passphrase. Use your contact info + passphrase to find and delete your post early if needed.",
    },
    {
      question: "Where is this available?",
      answer: "Community Board is focused on Republic, Kettle Falls, Colville, Chewelah, and nearby communities. Posts outside these areas may be removed.",
    },
  ];

  return (
    <section className="mt-12 bg-gray-50 p-8 rounded-lg shadow-md border">
      <h2 className="text-2xl font-semibold text-indigo-700 mb-6 text-center">Frequently Asked Questions</h2>

      <div className="space-y-4 text-gray-700 text-sm">
        {faqs.map((faq, index) => (
          <div key={index} className="border-b pb-3">
            <button
              onClick={() => toggleFAQ(index)}
              className="flex justify-between w-full text-left font-semibold text-indigo-600 hover:underline"
            >
              {faq.question}
              <span className="ml-2">{openIndex === index ? "▲" : "▼"}</span>
            </button>
            {openIndex === index && (
              <p className="mt-2 text-gray-700">{faq.answer}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQs;
