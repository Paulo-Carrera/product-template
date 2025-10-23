import { useState } from 'react';
import './FAQ.css';

const faqs = [
  {
    question: 'How long does shipping take?',
    answer: 'Standard shipping takes 5–10 business days. Expedited options are available at checkout.',
  },
  {
    question: 'Can I get a refund?',
    answer: 'Yes, within 30 days of delivery. Items must be unused and in original packaging.',
  },
  {
    question: 'Is checkout secure?',
    answer: 'Absolutely. We use Stripe for encrypted, secure payment processing.',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="page">
      <h1>Frequently Asked Questions</h1>
      {faqs.map((faq, index) => (
        <div key={index} className="faq-item">
          <button className="faq-question" onClick={() => toggle(index)}>
            {faq.question}
          </button>
          {openIndex === index && <p className="faq-answer">{faq.answer}</p>}
        </div>
      ))}
    </div>
  );
}