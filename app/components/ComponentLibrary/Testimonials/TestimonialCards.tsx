import React from "react";
import { igniteString, igniteArray, igniteImage } from "defaultprops";

export const TestimonialCardsProps = {
  id: igniteString("testimonial-cards"),

  sectionId: igniteString("testimonials"),
  ariaLabel: igniteString("What our clients are saying"),
  title: igniteString("What Our Clients Say About Us"),

  quotationIconColor: igniteString("rgba(209,159,78,0.2)"),

  reviews: igniteArray([
    {
      name: igniteString("David Harrison"),
      role: igniteString("Event Organizer"),
      testimonial: igniteString(
        "Setoria Security provided an excellent team for our corporate event. Their guards were professional, attentive, and ensured everything ran smoothly. Highly recommended!"
      ),
      image: igniteImage("https://randomuser.me/api/portraits/men/15.jpg"),
    },
    {
      name: igniteString("Sophia Mitchell"),
      role: igniteString("Bar & Club Owner"),
      testimonial: igniteString(
        "We rely on Setoria Security for our nightclub security. Their team is well-trained in handling crowd control and conflict resolution. We feel safer with them managing security."
      ),
      image: igniteImage("https://randomuser.me/api/portraits/women/15.jpg"),
    },
    {
      name: igniteString("James Carter"),
      role: igniteString("Homeowner"),
      testimonial: igniteString(
        "After hiring Setoria Security for residential patrols, our community feels much safer. Their team is professional, reliable, and always responsive."
      ),
      image: igniteImage("https://randomuser.me/api/portraits/men/10.jpg"),
    },
  ]),
};

export default function TestimonialCards(props) {
  const mergedProps = { ...props };

  return (
    <section
      id={mergedProps.sectionId.value}
      aria-label={mergedProps.ariaLabel.value}
      className="py-20 sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl md:text-center">
          <h2 className="font-display text-3xl tracking-tight text-slate-900 sm:text-4xl">
            {mergedProps.title.value}
          </h2>
        </div>

        {/* Testimonials Grid */}
        <ul
          role="list"
          className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:gap-8 lg:mt-20 lg:max-w-none lg:grid-cols-3"
        >
          {mergedProps.reviews.value.map((review, index) => (
            <li key={index}>
              <ul role="list" className="flex flex-col gap-y-6 sm:gap-y-8">
                <li>
                  <figure className="relative rounded-2xl p-6 shadow-xl shadow-slate-900/10">
                    {/* Quotation Icon */}
                    <svg
                      aria-hidden="true"
                      width="105"
                      height="78"
                      className="absolute left-6 top-6"
                      style={{
                        fill: mergedProps.quotationIconColor.value,
                      }}
                    >
                      <path d="M25.086 77.292c-4.821 0-9.115-1.205-12.882-3.616-3.767-2.561-6.78-6.102-9.04-10.622C1.054 58.534 0 53.411 0 47.686c0-5.273.904-10.396 2.712-15.368 1.959-4.972 4.746-9.567 8.362-13.786a59.042 59.042 0 0 1 12.43-11.3C28.325 3.917 33.599 1.507 39.324 0l11.074 13.786c-6.479 2.561-11.677 5.951-15.594 10.17-3.767 4.219-5.65 7.835-5.65 10.848 0 1.356.377 2.863 1.13 4.52.904 1.507 2.637 3.089 5.198 4.746 3.767 2.41 6.328 4.972 7.684 7.684 1.507 2.561 2.26 5.5 2.26 8.814 0 5.123-1.959 9.19-5.876 12.204-3.767 3.013-8.588 4.52-14.464 4.52Z"></path>
                    </svg>

                    {/* Testimonial Text */}
                    <blockquote className="relative">
                      <p className="text-lg tracking-tight text-slate-900">
                        {review.testimonial.value}
                      </p>
                    </blockquote>

                    {/* Client Info */}
                    <figcaption className="relative mt-6 flex items-center justify-between border-t border-slate-100 pt-6">
                      <div>
                        <div className="font-display text-base text-slate-900 font-semibold">
                          {review.name.value}
                        </div>
                        <div className="text-sm">{review.role.value}</div>
                      </div>
                      <div className="overflow-hidden rounded-full">
                        <img
                          alt={review.name.value}
                          className="h-14 w-14 object-cover"
                          src={review.image.value}
                        />
                      </div>
                    </figcaption>
                  </figure>
                </li>
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
