import { ParsedPart, parseMarkdownBold } from "@/app/utils/parseMarkdown";
import { Button } from "@mantine/core";
import Link from "next/link";
import { igniteString, igniteArray, igniteImage } from "defaultprops";

export const ContentWithStatsProps = {
  id: igniteString("content-with-stats"),
  title: igniteString(
    "Leading Security Services Provider in Manchester & Cheshire"
  ),
  subtitle: igniteString("Trusted Security Solutions for Every Need"),
  description: igniteString(
    "At Setoria Security, we specialize in providing **top-tier security solutions** tailored for businesses, high-profile events, and residential properties. Our team of **SIA-licensed security professionals** is dedicated to ensuring safety, trust, and peace of mind for our clients across **Manchester and Cheshire**."
  ),

  stats: igniteArray([
    {
      label: igniteString("Years of Industry Expertise"),
      metric: igniteString("15+"),
    },
    {
      label: igniteString("Trained Security Personnel"),
      metric: igniteString("100+"),
    },
    {
      label: igniteString("Satisfied Clients & Businesses"),
      metric: igniteString("500+"),
    },
  ]),

  images: igniteArray([
    {
      image: igniteImage("https://placehold.co/600x400"),
    },
    {
      image: igniteImage("https://placehold.co/600x400"),
    },
  ]),

  buttonText: igniteString("Discover Our Security Services"),
  buttonLink: igniteString("/services"),
};

export default function ContentWithStats(props) {
  const mergedProps = { ...props };

  const parsedDescription = parseMarkdownBold(
    mergedProps.description.value || ""
  );

  return (
    <section className="py-16 relative" id={mergedProps.id.value}>
      <div className="w-full max-w-7xl px-4 md:px-5 lg:px-5 mx-auto">
        <div className="w-full justify-start items-center gap-12 grid lg:grid-cols-2 grid-cols-1">
          {/* Dynamic Images Section */}
          <div className="w-full justify-center items-start gap-6 grid sm:grid-cols-2 grid-cols-1 lg:order-first order-last">
            {mergedProps.images.value.map((item, index) => {
              return (
                <div
                  key={index}
                  className={`${
                    index === 0
                      ? "pt-24 lg:justify-center sm:justify-end"
                      : "sm:ml-0 ml-auto"
                  } justify-start items-start gap-2.5 flex`}
                >
                  <img
                    className="rounded-xl object-cover"
                    src={item.image.value}
                    alt={`Image ${index + 1}`}
                  />
                </div>
              );
            })}
          </div>

          {/* Content Section */}
          <div className="w-full flex-col justify-center lg:items-start items-center gap-10 inline-flex">
            <div className="w-full flex-col justify-center items-start gap-8 flex">
              <div className="w-full flex-col justify-start lg:items-start items-center gap-3 flex">
                <span className="text-base font-medium text-center lg:text-start text-gray-400">
                  {mergedProps.subtitle.value}
                </span>

                <h2 className="text-4xl font-bold font-manrope leading-normal lg:text-start text-center">
                  {mergedProps.title.value}
                </h2>

                <p className="text-base font-normal leading-relaxed lg:text-start text-center">
                  {parsedDescription.map((part, index) =>
                    part.type === "bold" ? (
                      <strong key={index}>{part.content}</strong>
                    ) : (
                      <span key={index}>{part.content}</span>
                    )
                  )}
                </p>
              </div>

              {/* Dynamic Stats Section */}
              <div className="w-full lg:justify-start justify-center sm:items-center sm:gap-10 gap-5 inline-flex flex-col sm:flex-row">
                {mergedProps.stats.value.map((stat, index) => (
                  <div
                    key={index}
                    className="flex-col justify-start items-center md:items-start inline-flex"
                  >
                    <h3 className="text-4xl font-bold font-manrope leading-normal">
                      {stat.metric.value}
                    </h3>

                    <h6 className="text-base font-normal leading-relaxed">
                      {stat.label.value}
                    </h6>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Button */}
            <Link href={mergedProps.buttonLink.value}>
              <Button>
                <span className="px-1.5 text-sm font-medium leading-6">
                  {mergedProps.buttonText.value}
                </span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
