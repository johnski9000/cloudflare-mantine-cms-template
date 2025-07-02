import { Button } from "@mantine/core";
import { igniteString, igniteArray, igniteImage } from "defaultprops";

export const TextWithImageGridProps = {
  id: igniteString("text-with-image-grid"),

  subtitle: igniteString("Your Florida Adventure Starts Here"),
  title: igniteString("Creating Magical Florida Experiences"),
  description: igniteString(
    "We specialize in crafting unforgettable Florida vacations, from Disney World magic to beautiful beaches. Our expert team ensures every detail of your trip is perfectly planned, so you can focus on making memories that will last a lifetime."
  ),

  features: igniteArray([
    {
      text: igniteString("Over 15 years of Florida travel expertise"),
    },
    {
      text: igniteString(
        "50,000+ families have trusted us with their Disney vacations"
      ),
    },
    {
      text: igniteString(
        "Authorized Disney vacation planner with insider access"
      ),
    },
  ]),

  buttonText: igniteString("Plan Your Trip"),
  buttonLink: igniteString("/contact"),

  images: igniteArray([
    {
      src: igniteImage(
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
      ),
      alt: igniteString("Disney World Castle"),
    },
    {
      src: igniteImage(
        "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
      ),
      alt: igniteString("Florida Beach"),
    },
    {
      src: igniteImage(
        "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
      ),
      alt: igniteString("Family enjoying Disney vacation"),
    },
  ]),
};

export default function TextWithImageGrid(props) {
  const mergedProps = { ...props };

  return (
    <section className="py-16 relative" id={mergedProps.id.value}>
      <div className="w-full max-w-7xl px-4 md:px-5 lg:px-5 mx-auto">
        <div className="w-full justify-center items-start gap-8 grid lg:grid-cols-2 grid-cols-1">
          {/* Text Content Section */}
          <div className="w-full flex-col justify-start lg:items-start items-center gap-7 inline-flex">
            <div className="w-full flex-col justify-start lg:items-start items-center gap-2.5 flex">
              <span className="text-gray-400 text-base font-medium leading-relaxed lg:text-start text-center">
                {mergedProps.subtitle.value}
              </span>
              <h2 className="text-gray-900 text-4xl font-bold font-manrope leading-normal lg:text-start text-center">
                {mergedProps.title.value}
              </h2>
            </div>

            <p className="text-gray-500 text-base font-normal leading-relaxed lg:text-start text-center">
              {mergedProps.description.value}
            </p>

            {/* Features List */}
            <ul className="flex-col justify-start lg:items-start items-center gap-3 flex">
              {mergedProps.features.value.map((feature, index) => (
                <li
                  key={index}
                  className="justify-start items-center gap-2.5 inline-flex"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                      stroke="#4338CA"
                      strokeWidth="1.6"
                    />
                    <path
                      d="M8 11.7236L9.53269 13.2563C10.1994 13.923 10.5327 14.2563 10.9469 14.2563C11.3611 14.2563 11.6945 13.923 12.3611 13.2563L16.6704 8.94702"
                      stroke="#4338CA"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                  </svg>
                  <p className="text-gray-900 text-sm font-normal leading-snug">
                    {feature.text.value}
                  </p>
                </li>
              ))}
            </ul>

            {/* CTA Button */}
            <Button className="sm:w-fit w-full px-3.5 py-2 bg-indigo-600 hover:bg-indigo-800 transition-all duration-700 ease-in-out rounded-lg shadow-[0px_1px_2px_0px_rgba(16,_24,_40,_0.05)] justify-center items-center flex">
              <span className="px-1.5 text-white text-sm font-medium leading-6">
                {mergedProps.buttonText.value}
              </span>
            </Button>
          </div>

          {/* Image Grid Section */}
          <div className="w-full lg:h-full flex-col justify-start items-start gap-4 inline-flex">
            {/* Top Row - 2 Images */}
            <div className="w-full justify-start items-start gap-4 grid sm:grid-cols-2 grid-cols-1">
              {mergedProps.images.value.slice(0, 2).map((image, index) => (
                <div
                  key={index}
                  className="w-full sm:h-full max-h-52 relative rounded-3xl overflow-hidden"
                >
                  <img
                    src={image.src.value}
                    alt={image.alt.value}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>

            {/* Bottom Row - Full Width Image */}
            {mergedProps.images.value[2] && (
              <div className="w-full sm:h-full max-h-80 relative rounded-3xl overflow-hidden">
                <img
                  src={mergedProps.images.value[2].src.value}
                  alt={mergedProps.images.value[2].alt.value}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
