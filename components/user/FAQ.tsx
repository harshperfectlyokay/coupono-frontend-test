// "use client"
// import { useState } from 'react';
// import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

// const FAQ = ({ faqData }) => {
//   const [activeIndex, setActiveIndex] = useState(null);

//   const toggleFAQ = (index) => {
//     setActiveIndex(index === activeIndex ? null : index);
//   };

//   return (
//     <div className="max-w-2xl mx-auto py-4">
//       <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
//       <div className="space-y-4">
//         {faqData.map((faq, index) => (
//           <div key={index} className="border border-gray-200 rounded-lg">
//             <button
//               onClick={() => toggleFAQ(index)}
//               className="w-full flex justify-between items-center p-4 text-left text-lg font-medium text-gray-800 focus:outline-none"
//             >
//               {faq.question}
//               {activeIndex === index ? (
//                 <FiChevronUp className="text-xl" />
//               ) : (
//                 <FiChevronDown className="text-xl" />
//               )}
//             </button>
//             <div
//               className={`px-4 text-gray-600 transition-max-height overflow-hidden ${
//                 activeIndex === index ? 'ease-in max-h-screen' : 'ease-out max-h-0'
//               } duration-700`}
//             >
//               {faq.answer}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default FAQ;

"use client";
import { useState } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

const FAQ: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  return (
    <div className="max-w-2xl mx-auto py-4">
      <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
      <div className="space-y-4">
        <div className="border border-gray-200 rounded-lg">
          <button
            onClick={() => toggleFAQ(0)}
            className="w-full flex justify-between items-center p-4 text-left text-lg font-medium text-gray-800 focus:outline-none"
          >
            What is your return policy?
            {activeIndex === 0 ? (
              <FiChevronUp className="text-xl" />
            ) : (
              <FiChevronDown className="text-xl" />
            )}
          </button>
          <div
            className={`px-4 text-gray-600 transition-max-height overflow-hidden ${
              activeIndex === 0 ? 'ease-in max-h-screen' : 'ease-out max-h-0'
            } duration-700`}
          >
            You can return items within 30 days of purchase. Please ensure the item is in its original condition.
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg">
          <button
            onClick={() => toggleFAQ(1)}
            className="w-full flex justify-between items-center p-4 text-left text-lg font-medium text-gray-800 focus:outline-none"
          >
            How do I track my order?
            {activeIndex === 1 ? (
              <FiChevronUp className="text-xl" />
            ) : (
              <FiChevronDown className="text-xl" />
            )}
          </button>
          <div
            className={`px-4 text-gray-600 transition-max-height overflow-hidden ${
              activeIndex === 1 ? 'ease-in max-h-screen' : 'ease-out max-h-0'
            } duration-700`}
          >
            Once your order has been shipped, you will receive a tracking number via email.
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg">
          <button
            onClick={() => toggleFAQ(2)}
            className="w-full flex justify-between items-center p-4 text-left text-lg font-medium text-gray-800 focus:outline-none"
          >
            Do you ship internationally?
            {activeIndex === 2 ? (
              <FiChevronUp className="text-xl" />
            ) : (
              <FiChevronDown className="text-xl" />
            )}
          </button>
          <div
            className={`px-4 text-gray-600 transition-max-height overflow-hidden ${
              activeIndex === 2 ? 'ease-in max-h-screen' : 'ease-out max-h-0'
            } duration-700`}
          >
            Yes, we offer international shipping to many countries. Please check our shipping policy for more details.
          </div>
        </div>

        {/* Add more FAQ sections as needed */}
      </div>
    </div>
  );
};

export default FAQ;
