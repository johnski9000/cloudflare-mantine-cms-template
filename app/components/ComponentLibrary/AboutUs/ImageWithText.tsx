import Link from "next/link";
import { igniteString, igniteImage } from "defaultprops";

export const ImageWithTextProps = {
  id: igniteString("image-with-text"),

  title: igniteString("Our Mission & Commitment"),
  description: igniteString(
    "In addition, please do not hesitate to call us at any point throughout the survey process with your queries. **We are here to support you**.<br/><br/>The purchase of any property is potentially the single largest that a person will make in their lifetime. As such a building survey is of extreme importance and is always recommended, whatever the property age.<br/><br/>Our mission is to provide **clear, concise, unbiased and reflective reports** to clients on the true condition of any potential future home. We want our clients to have as much information as possible with regards any potential purchase to avoid any nasty or hidden surprises shortly after taking ownership.<br/><br/>We greatly look forward to hearing from you, call Anslow Building Surveyors today to help decide which survey best suits you and meets your individual requirements."
  ),

  buttonText: igniteString("Get Your Survey"),
  buttonLink: igniteString("/services"),

  image: igniteImage(
    "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=400&fit=crop"
  ),
  imageAlt: igniteString("Professional building survey in progress"),
};
export default function ImageWithText(props) {
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
      className="max-w-[1440px] mx-auto relative"
      id={mergedProps.id.value}
    >
      <div className="w-full px-4 md:px-5 lg:pl-0">
        <div className="w-full mr-auto bg-white flex-col justify-start items-start gap-2.5 flex">
          <div className="w-full justify-start items-center xl:gap-12 gap-10 lg:flex">
            {/* Image Section */}
            <img
              className="lg:w-1/2 mx-auto lg:mb-0 mb-10 lg:h-full h-auto object-cover"
              src={mergedProps.image.value}
              alt={mergedProps.imageAlt.value}
            />

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
          </div>
        </div>
      </div>
    </section>
  );
}
