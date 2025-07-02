"use client";
import { useRef } from "react";
import { Carousel } from "@mantine/carousel";
import { igniteString, igniteArray } from "defaultprops";

export const TestimonialCarouselProps = {
  id: igniteString("orlando-tickets-testimonial-carousel"),

  title: igniteString(
    "What Our Customers Say About Our Orlando Theme Park Tickets"
  ),
  titleBlue: igniteString("Customer Reviews"),

  testimonials: igniteArray([
    {
      name: igniteString("Sarah Johnson"),
      role: igniteString("Family of 4, Manchester UK"),
      feedback: igniteString(
        "Saved over £400 on our Disney World tickets! The e-tickets arrived instantly and worked perfectly with the My Disney Experience app. Our kids had the most magical vacation and we didn't break the bank. Highly recommend LetsBookFlorida!"
      ),
    },
    {
      name: igniteString("David Thompson"),
      role: igniteString("Theme Park Enthusiast, London"),
      feedback: igniteString(
        "I've used LetsBookFlorida multiple times for Universal Orlando tickets. Always authentic, always cheaper than gate prices, and the customer service is excellent. The combo packages saved me hundreds on my solo trips to Florida."
      ),
    },
    {
      name: igniteString("Emma Williams"),
      role: igniteString("First-time Orlando Visitor, Birmingham"),
      feedback: igniteString(
        "As first-time visitors to Orlando, we were overwhelmed by ticket options. LetsBookFlorida's specialists helped us choose the perfect 7-day combo package for Disney and Universal. The savings were incredible and the experience was seamless!"
      ),
    },
    {
      name: igniteString("Michael Roberts"),
      role: igniteString("Group Travel Organizer, Glasgow"),
      feedback: igniteString(
        "Organized tickets for 15 family members visiting Orlando. LetsBookFlorida provided group discounts and handled all the ticket logistics perfectly. Everyone received their e-tickets instantly and saved money for souvenirs and dining!"
      ),
    },
    {
      name: igniteString("Lisa Anderson"),
      role: igniteString("Travel Blogger, Leeds"),
      feedback: igniteString(
        "I regularly recommend LetsBookFlorida to my readers planning Orlando vacations. Their authentic tickets, instant delivery, and up to 40% savings make them the best choice for UK families visiting Disney World and Universal Studios."
      ),
    },
    {
      name: igniteString("James Parker"),
      role: igniteString("Annual Passholder, Bristol"),
      feedback: igniteString(
        "Even as someone who visits Orlando frequently, I still use LetsBookFlorida for additional tickets and special events. Their SeaWorld and ICON Park tickets saved me money on attractions I hadn't tried before. Authentic tickets, great prices!"
      ),
    },
  ]),
};

const getInitials = (name) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

export default function TestimonialCarousel(props) {
  const mergedProps = { ...props };

  return (
    <section className="py-16" id={mergedProps.id.value}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap lg:flex-nowrap lg:flex-row lg:justify-between items-center">
          {/* Left Section - Title */}
          <div className="w-full lg:w-2/5 text-center lg:text-left">
            <h2 className="text-4xl font-bold leading-[3.25rem] mb-8">
              {mergedProps.title.value}{" "}
              <span className="text-blue-500">
                {mergedProps.titleBlue.value}
              </span>
            </h2>
          </div>

          {/* Right Section - Testimonials Carousel */}
          <div className="w-full lg:w-3/5 mt-10 lg:mt-0">
            <Carousel
              slideSize="50%"
              slideGap="md"
              loop
              align="start"
              slidesToScroll={1}
              withControls
              withIndicators={false}
              controlsOffset="xs"
              controlSize={40}
              breakpoints={[
                { maxWidth: "md", slideSize: "100%", slideGap: "sm" },
                { maxWidth: "lg", slideSize: "50%", slideGap: "md" },
              ]}
              styles={{
                control: {
                  backgroundColor: "#d19f4e",
                  border: "none",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "#b8883e",
                  },
                },
              }}
            >
              {mergedProps.testimonials.value.map((testimonial, index) => (
                <Carousel.Slide key={index}>
                  <div className="group border border-solid border-gray-300 rounded-2xl p-6 transition-all duration-500 hover:border-[#d19f4e] shadow-xl h-full">
                    <div className="flex items-center gap-5 mb-5">
                      {/* Avatar with Initials */}
                      <div className="w-12 h-12 rounded-full bg-[#d19f4e] flex items-center justify-center text-white text-lg font-bold">
                        {getInitials(testimonial.name.value)}
                      </div>
                      <div className="grid gap-1">
                        <h5 className="font-medium">
                          {testimonial.name.value}
                        </h5>
                        <span className="text-sm">
                          {testimonial.role.value}
                        </span>
                      </div>
                    </div>

                    {/* Review Stars */}
                    <div className="flex items-center mb-5 gap-2 text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className="w-5 h-5"
                          viewBox="0 0 18 17"
                          fill="currentColor"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M8.10326 1.31699C8.47008 0.57374 9.52992 0.57374 9.89674 1.31699L11.7063 4.98347C11.8519 5.27862 12.1335 5.48319 12.4592 5.53051L16.5054 6.11846C17.3256 6.23765 17.6531 7.24562 17.0596 7.82416L14.1318 10.6781C13.8961 10.9079 13.7885 11.2389 13.8442 11.5632L14.5353 15.5931C14.6754 16.41 13.818 17.033 13.0844 16.6473L9.46534 14.7446C9.17402 14.5915 8.82598 14.5915 8.53466 14.7446L4.91562 16.6473C4.18199 17.033 3.32456 16.41 3.46467 15.5931L4.15585 11.5632C4.21148 11.2389 4.10393 10.9079 3.86825 10.6781L0.940384 7.82416C0.346867 7.24562 0.674378 6.23765 1.4946 6.11846L5.54081 5.53051C5.86652 5.48319 6.14808 5.27862 6.29374 4.98347L8.10326 1.31699Z" />
                        </svg>
                      ))}
                    </div>

                    {/* Testimonial Text */}
                    <p className="text-sm leading-6 min-h-24">
                      {testimonial.feedback.value}
                    </p>
                  </div>
                </Carousel.Slide>
              ))}
            </Carousel>
          </div>
        </div>
      </div>
    </section>
  );
}
