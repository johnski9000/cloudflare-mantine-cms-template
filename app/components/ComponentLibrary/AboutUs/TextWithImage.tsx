import Link from "next/link";
import { igniteString, igniteImage } from "defaultprops";

export const TextWithImageProps = {
  id: igniteString("text-with-image"),

  title: igniteString("About Anslow Building Surveyors"),
  description: igniteString(
    "Anslow Building Surveyors offer a range of surveying services within the residential property market. Our aim is to provide clients with the highest quality inspection and reporting process, with a personal touch.<br/><br/>Your survey will be carried out personally by our director and principal Surveyor, **Christopher Anslow**. A fully qualified building surveyor, holding an RICS accredited BSc (Hons) Building Surveying Degree, and also a member of the Residential Property Surveyors Association (RPSA).<br/><br/>Chris has carried out tens of thousands of building surveys since qualifying, covering a wide spectrum of requirements. As a direct result Chris has a deep knowledge of buildings pathology, critical to providing an accurate inspection of properties and their potential defects.<br/><br/>In our experience, **communication is key**. We always provide an initial consultation directly with our clients to discuss any specific requirements and discuss the property itself. Often a client will have individual requests which we will incorporate into our bespoke survey. Following the survey, we offer a phone or video call to discuss the findings of the survey, our opinions on the property and any specific defects that may have been discovered during the inspection."
  ),

  buttonText: igniteString("Contact Us Today"),
  buttonLink: igniteString("/contact"),

  image: igniteImage(
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop"
  ),
  imageAlt: igniteString("Christopher Anslow - Principal Surveyor"),
};
export default function TextWithImage(props) {
  const mergedProps = { ...props };

  // Function to parse <br/> tags in description
  const parseDescription = (text) => {
    return text.split("<br/>").map((part, index, array) => (
      <span key={index}>
        {part}
        {index < array.length - 1 && <br />}
      </span>
    ));
  };

  return (
    <section
      className="relative max-w-[1440px] mx-auto "
      id={mergedProps.id.value}
    >
      <div className="w-full px-4 md:px-5 lg:pr-0">
        <div className="w-full ml-auto bg-white flex-col justify-end items-end gap-2.5 flex">
          <div className="w-full justify-end items-center xl:gap-12 gap-10 lg:flex">
            {/* Text Content Section */}
            <div className="lg:w-1/2 w-full xl:px-28 lg:py-24 py-10 flex-col justify-center lg:items-start items-center gap-10 inline-flex">
              <div className="flex-col justify-start lg:items-start items-center gap-4 flex">
                <h2 className="text-gray-900 text-4xl font-bold font-manrope leading-normal lg:text-left text-center">
                  {mergedProps.title.value}
                </h2>
                <p className="text-gray-500 text-base font-normal leading-relaxed lg:text-left text-center">
                  {parseDescription(mergedProps.description.value)}
                </p>
              </div>

              {/* CTA Button */}
              <Link href={mergedProps.buttonLink.value}>
                <button className="group py-2 px-4 rounded-lg border border-gray-300 shadow-[0px_1px_2px_0px_rgba(16,_24,_40,_0.05)] justify-center items-center flex hover:shadow-md transition-all duration-300">
                  <span className="pr-1.5 py-px text-gray-900 group-hover:text-gray-800 transition-all duration-700 ease-in-out text-sm font-medium leading-5">
                    {mergedProps.buttonText.value}
                  </span>
                  <svg
                    className="group-hover:translate-x-0.5 text-gray-900 group-hover:text-gray-800 transition-all duration-700 ease-in-out"
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                  >
                    <path
                      d="M6.75265 4.49658L11.2528 8.99677L6.75 13.4996"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </Link>
            </div>

            {/* Image Section */}
            <img
              className="lg:w-1/2 mx-auto lg:mb-0 mb-10 lg:h-full h-auto object-cover"
              src={mergedProps.image.value}
              alt={mergedProps.imageAlt.value}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
