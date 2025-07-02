import { Button } from "@mantine/core";
import Image from "next/image";
import Link from "next/link";
import { igniteString, igniteImage } from "defaultprops";

export const ImageBannerProps = {
  imageUrl: igniteImage("https://readymadeui.com/cardImg.webp"),
  alt: igniteString("Banner image"),
  title: igniteString("Your Main Title Here"),
  description: igniteString("Your description or quote text"),
  author: igniteString("Author Name"),
  buttonText: igniteString("Get Started"),
  buttonLink: igniteString("/contact"),
  overlayColor: igniteString("rgba(0, 0, 0, 0.6)"),
};

export default function ImageBanner(props) {
  const mergedProps = { ...props };

  return (
    <div className="h-[75vh] relative z-10">
      <Image
        src={mergedProps.imageUrl.value}
        alt={mergedProps.alt.value}
        layout="fill"
        objectFit="cover"
        priority={true}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 100vw"
        quality={90}
      />

      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ backgroundColor: mergedProps.overlayColor.value }}
        role="presentation"
        aria-hidden="true"
      >
        <div className="max-w-screen-xl p-4 w-full h-full flex items-center relative">
          <div className="flex flex-col max-w-[1/2vw]">
            <h1 className="text-3xl md:text-6xl font-black pb-3 text-white text-center md:text-left">
              {mergedProps.title.value}
            </h1>

            <div
              className="text !text-gray-200 italic text-center md:text-left"
              aria-label={`Description: ${mergedProps.description.value}`}
            >
              "{mergedProps.description.value}" - {mergedProps.author.value}
            </div>

            <div className="link-box flex md:flex-row flex-col justify-center items-center md:justify-normal md:items-start gap-6 pt-8">
              <Link href={mergedProps.buttonLink.value}>
                <Button className="text-white font-medium text-sm px-4 py-2">
                  {mergedProps.buttonText.value}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
