"use client";
import { useState } from "react";
import Script from "next/script";
import { igniteString, igniteArray } from "defaultprops";

export const SimpleFAQAccordionProps = {
  id: igniteString("simple-faq-accordion"),

  overTitle: igniteString("FAQs"),
  title: igniteString(
    "Frequently Asked Questions About Setoria Security Services"
  ),

  faqs: igniteArray([
    {
      question: igniteString(
        "What security services does Setoria Security offer in Manchester and Cheshire?"
      ),
      answer: igniteString(
        "Setoria Security provides top-tier security solutions across Manchester and Cheshire, including corporate security, event security, residential protection, door supervision, mobile patrols, and 24/7 security monitoring. Our SIA-licensed team tailors services to meet the unique needs of businesses, high-profile events, and private properties."
      ),
    },
    {
      question: igniteString(
        "Are Setoria Security guards fully licensed and trained for risk management?"
      ),
      answer: igniteString(
        "Yes, all Setoria Security personnel are SIA-licensed and undergo extensive training in risk assessment, conflict resolution, and emergency response. With over 15 years of industry expertise, our guards ensure safety and peace of mind for clients across Manchester and Cheshire."
      ),
    },
    {
      question: igniteString(
        "How does Setoria Security manage crowd control for large events in Manchester?"
      ),
      answer: igniteString(
        "Setoria Security employs structured crowd management strategies for large events, combining advanced surveillance technology with expertly trained security guards. We assess venue layouts, implement entry/exit protocols, and provide real-time monitoring to ensure safety at concerts, festivals, and corporate events in Manchester and beyond."
      ),
    },
    {
      question: igniteString(
        "Can Setoria Security provide 24/7 protection for my business or home?"
      ),
      answer: igniteString(
        "Absolutely, we offer round-the-clock security services including mobile patrols, CCTV monitoring, and on-site guards for businesses and residential properties in Manchester and Cheshire. Contact us for a free consultation to customize your 24/7 protection plan."
      ),
    },
    {
      question: igniteString(
        "How quickly can Setoria Security respond to a security request in Cheshire?"
      ),
      answer: igniteString(
        "Setoria Security prides itself on rapid response times. Depending on your location in Cheshire or Manchester, our team can deploy trained security personnel within hours of your request. Call us at 0161 234 5678 or email info@setoriasecurity.com for immediate assistance."
      ),
    },
  ]),
};

export default function SimpleFAQAccordion(props) {
  const mergedProps = { ...props };
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleFAQ = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  // Generate Schema.org FAQPage JSON-LD dynamically
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    name: mergedProps.title.value,
    mainEntity: mergedProps.faqs.value.map((faq) => ({
      "@type": "Question",
      name: faq.question.value,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer.value,
      },
    })),
  };

  return (
    <section
      id={mergedProps.id.value}
      className="py-16 relative overflow-hidden"
      aria-labelledby="faq-heading"
    >
      {/* FAQ Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 z-10 relative">
        <div className="flex flex-col justify-center items-center gap-x-16 gap-y-5 xl:gap-28 lg:flex-row lg:justify-between max-lg:max-w-2xl mx-auto max-w-full">
          {/* FAQ Section */}
          <div className="w-full">
            <div>
              {/* Header Section */}
              <div className="max-w-xl mb-10 md:mx-auto text-center lg:max-w-2xl md:mb-12">
                {/* Over Title */}
                <p className="inline-block px-3 py-2 font-bold mb-4 text-xs tracking-wider uppercase rounded-full !text-black bg-[rgba(209,159,78,1)]">
                  {mergedProps.overTitle.value}
                </p>

                {/* Main Title */}
                <h2 className="max-w-lg mb-6 font-sans text-3xl font-bold leading-none tracking-tight sm:text-4xl md:mx-auto">
                  {mergedProps.title.value}
                </h2>
              </div>

              {/* Accordion */}
              <div className="accordion-group">
                {mergedProps.faqs.value.map((faq, index) => (
                  <div
                    key={index}
                    className="border-b border-solid border-gray-200"
                  >
                    <button
                      id={`faq-${index}`}
                      className="flex justify-between items-center w-full py-6 cursor-pointer text-xl hover:text-[rgba(209,159,78,1)]"
                      aria-expanded={expandedIndex === index}
                      aria-controls={`faq-content-${index}`}
                      onClick={() => toggleFAQ(index)}
                    >
                      {faq.question.value}
                      <svg
                        className={`w-6 h-6 transition-transform duration-300 ${
                          expandedIndex === index ? "rotate-180" : ""
                        }`}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <div
                      className={`${
                        expandedIndex === index ? "block" : "hidden"
                      } transition-all duration-500`}
                      id={`faq-content-${index}`}
                      role="region"
                      aria-labelledby={`faq-${index}`}
                    >
                      <p className="text-base p-4">{faq.answer.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic JSON-LD for SEO */}
      <Script
        id="faq-schema"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </section>
  );
}
