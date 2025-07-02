"use client";
import { Button } from "@mantine/core";
import { useState } from "react";
import { igniteString, igniteArray } from "defaultprops";

export const SidebarFAQWithCategoriesProps = {
  id: igniteString("orlando-theme-park-tickets-faq"),

  tagline: igniteString("Orlando's #1 Discount Ticket Specialists"),
  title: igniteString("Orlando Theme Park Tickets FAQ"),
  description: igniteString(
    "LetsBookFlorida offers the lowest prices on authentic Disney World, Universal Orlando, SeaWorld, and Central Florida attraction tickets. Save up to 40% with our guaranteed authentic tickets and instant delivery."
  ),
  contactButtonLabel: igniteString("Browse Discount Tickets"),
  contactButtonLink: igniteString("/store"),

  categories: igniteArray([
    {
      title: igniteString("Disney World & Universal Tickets"),
      questions: igniteArray([
        {
          id: igniteString("disney-1"),
          question: igniteString(
            "How much can I save on Disney World and Universal Orlando tickets?"
          ),
          answer: igniteString(
            "LetsBookFlorida offers savings up to 40% off gate prices for Disney World 4-park tickets, Universal Orlando 3-park tickets, and combo packages. Our bulk purchasing agreements with authorized distributors allow us to offer Disney World tickets starting from $79/day (vs $109+ at gate) and Universal Studios tickets from $89/day. Multi-day packages and seasonal promotions provide even greater savings for Orlando vacations."
          ),
        },
        {
          id: igniteString("disney-2"),
          question: igniteString(
            "Are your discounted Disney and Universal tickets 100% authentic?"
          ),
          answer: igniteString(
            "Yes, absolutely guaranteed! All LetsBookFlorida Disney World, Universal Studios, Islands of Adventure, and Volcano Bay tickets are sourced directly from Disney and Universal's authorized distribution network. Every ticket works with My Disney Experience app, Disney Genie+, Universal mobile app, and all park services. We're an official authorized reseller with full authenticity guarantee and 24/7 customer support."
          ),
        },
        {
          id: igniteString("disney-3"),
          question: igniteString(
            "Which Orlando theme parks should I visit and how many days do I need?"
          ),
          answer: igniteString(
            "For a complete Orlando experience, plan 7-10 days minimum. Disney World requires 4-5 days (Magic Kingdom, EPCOT, Hollywood Studios, Animal Kingdom). Universal Orlando needs 2-3 days (Universal Studios, Islands of Adventure, Volcano Bay water park). Add SeaWorld Orlando, ICON Park, Kennedy Space Center, and Busch Gardens Tampa for the ultimate Central Florida vacation. Our ticket specialists help you choose the perfect combination."
          ),
        },
      ]),
    },
    {
      title: igniteString("Ticket Delivery & Park Access"),
      questions: igniteArray([
        {
          id: igniteString("delivery-1"),
          question: igniteString(
            "How fast will I receive my Orlando theme park tickets?"
          ),
          answer: igniteString(
            "Digital e-tickets are delivered instantly to your email within 5 minutes of purchase confirmation. Disney World and Universal Orlando tickets can be immediately added to My Disney Experience and Universal apps for mobile entry. All tickets include detailed park entry instructions and helpful tips for your Orlando vacation."
          ),
        },
        {
          id: igniteString("delivery-2"),
          question: igniteString(
            "Can I use discounted tickets for Disney Genie+ and Universal Express Pass?"
          ),
          answer: igniteString(
            "Absolutely! Our Disney World tickets work identically to Disney direct purchases - add Disney Genie+ ($15-29/day), Individual Lightning Lanes, make Disney Park Pass reservations, and access all Disney services. Universal tickets are compatible with Universal Express Pass, mobile food ordering, and all Universal features. LetsBookFlorida tickets provide full access to all premium park services and experiences."
          ),
        },
        {
          id: igniteString("delivery-3"),
          question: igniteString(
            "What if I need to change my Orlando theme park visit dates?"
          ),
          answer: igniteString(
            "Most LetsBookFlorida Orlando tickets offer flexible date options. Disney World tickets include same change policies as Disney direct - modify dates through My Disney Experience app subject to availability. Universal Orlando tickets often include flexible dating. SeaWorld and other Central Florida attraction tickets typically allow date changes. Contact our ticket specialists for assistance with any date modifications."
          ),
        },
      ]),
    },
    {
      title: igniteString("Central Florida Attractions & Ticket Options"),
      questions: igniteArray([
        {
          id: igniteString("attractions-1"),
          question: igniteString(
            "What Central Florida attractions beyond Disney and Universal do you offer?"
          ),
          answer: igniteString(
            "LetsBookFlorida provides discounted tickets for 30+ Central Florida attractions: SeaWorld Orlando, LEGOLAND Florida, Busch Gardens Tampa, ICON Park (Orlando Eye, Madame Tussauds), Gatorland, Kennedy Space Center, Bok Tower Gardens, Silver Springs, Weeki Wachee, Fun Spot, and many more. We offer attraction combo packages and multi-park ticket bundles for maximum savings."
          ),
        },
        {
          id: igniteString("attractions-2"),
          question: igniteString(
            "When is the best time to visit Orlando theme parks for lowest ticket prices?"
          ),
          answer: igniteString(
            "Orlando's best value seasons are late January-early March, late April-mid May, and mid-September through mid-November (avoiding holidays). During these periods, find lowest crowds, ideal weather, and maximum ticket savings through LetsBookFlorida. Disney World and Universal offer best ticket prices during off-peak seasons. Hurricane season (June-November) provides great deals but monitor weather forecasts."
          ),
        },
        {
          id: igniteString("attractions-3"),
          question: igniteString(
            "Do you offer combo tickets for multiple Orlando theme parks?"
          ),
          answer: igniteString(
            "Yes! LetsBookFlorida specializes in multi-park combo tickets that provide even greater savings. Popular combinations include Disney World + Universal Orlando packages, Disney + SeaWorld combos, and comprehensive Central Florida attraction passes. Our combo tickets are perfect for families wanting to experience multiple parks while maximizing their vacation budget and minimizing ticket costs."
          ),
        },
      ]),
    },
  ]),
};

export default function SidebarFAQWithCategories(props) {
  const [activeAccordion, setActiveAccordion] = useState("");
  const mergedProps = { ...props };

  const toggleAccordion = (id) => {
    setActiveAccordion(activeAccordion === id ? "" : id);
  };

  return (
    <section className="py-16" id={mergedProps.id.value}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="w-full justify-start items-start lg:gap-x-12 lg:gap-y-0 gap-y-10 grid lg:grid-cols-12 grid-cols-1">
          {/* Sidebar Content */}
          <div className="lg:col-span-5 col-span-12 w-full flex-col justify-start lg:items-start items-center lg:gap-10 gap-5 inline-flex">
            <div className="w-full flex-col justify-start lg:items-start items-center lg:gap-5 gap-4 flex">
              <span className="text-indigo-600 text-base font-medium leading-relaxed lg:text-start text-center">
                {mergedProps.tagline.value}
              </span>
              <h2 className="text-gray-900 sm:text-5xl text-4xl font-semibold font-manrope sm:leading-tight leading-tight lg:text-start text-center">
                {mergedProps.title.value}
              </h2>
              <p className="text-gray-500 text-base font-normal leading-relaxed lg:text-start text-center">
                {mergedProps.description.value}
              </p>
            </div>
            <Button
              component="a"
              href={mergedProps.contactButtonLink.value}
              className="w-full lg:w-auto"
              size="lg"
              color="indigo"
              variant="gradient"
              radius="xl"
            >
              <span className="px-2 py-px text-white text-lg font-semibold leading-[30px]">
                {mergedProps.contactButtonLabel.value}
              </span>
            </Button>
          </div>

          {/* FAQ Categories */}
          <div className="accordion-group flex flex-col gap-8 h-full lg:col-span-7 col-span-12 w-full">
            {mergedProps.categories.value.map((category, categoryIndex) => (
              <div key={categoryIndex}>
                <h3
                  className={`sm:text-start text-center text-gray-900 text-3xl font-bold font-manrope leading-normal ${
                    categoryIndex > 0
                      ? "pt-8 border-t border-gray-200"
                      : "mb-8 border-b border-gray-200"
                  }`}
                >
                  {category.title.value}
                </h3>

                {category.questions.value.map((item, questionIndex) => (
                  <div
                    key={item.id.value}
                    className={`accordion ${
                      categoryIndex ===
                        mergedProps.categories.value.length - 1 &&
                      questionIndex === category.questions.value.length - 1
                        ? "pt-6 pb-6 border-b border-gray-200"
                        : questionIndex > 0 || categoryIndex > 0
                        ? "pt-6 border-t border-solid border-gray-200"
                        : ""
                    }`}
                  >
                    <button
                      className={`hover:cursor-pointer accordion-toggle group inline-flex items-center justify-between leading-relaxed text-lg font-normal w-full transition duration-500 hover:text-indigo-600 ${
                        activeAccordion === item.id.value
                          ? "text-indigo-600"
                          : "text-gray-700"
                      }`}
                      onClick={() => toggleAccordion(item.id.value)}
                    >
                      <h5 className="text-left">{item.question.value}</h5>
                      <div className="max-w-6 max-h-6">
                        <svg
                          className={`text-gray-900 transition duration-500 group-hover:text-indigo-600 ${
                            activeAccordion === item.id.value
                              ? "text-indigo-600 rotate-180"
                              : ""
                          }`}
                          width="22"
                          height="22"
                          viewBox="0 0 22 22"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M16.5 8.25L12.4142 12.3358C11.7475 13.0025 11.4142 13.3358 11 13.3358C10.5858 13.3358 10.2525 13.0025 9.58579 12.3358L5.5 8.25"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </button>
                    <div
                      className={`accordion-content w-full px-0 overflow-hidden transition-all duration-500 ${
                        activeAccordion === item.id.value
                          ? "max-h-96 opacity-100"
                          : "max-h-0 opacity-0"
                      }`}
                    >
                      <p className="text-sm text-gray-500 font-normal pt-3">
                        {item.answer.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
