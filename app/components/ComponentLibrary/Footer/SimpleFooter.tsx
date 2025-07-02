import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FaTwitter, FaInstagram, FaFacebook, FaYoutube } from "react-icons/fa";
import { igniteString, igniteArray, igniteImage } from "defaultprops";

export const SimpleFooterProps = {
  id: igniteString("simple-footer"),

  logo: igniteImage("/logo-placeholder-image.png"),

  links: igniteArray([
    {
      label: igniteString("Home"),
      href: igniteString("/"),
    },
    {
      label: igniteString("Store"),
      href: igniteString("/store"),
    },
    {
      label: igniteString("Contact"),
      href: igniteString("/contact"),
    },
  ]),

  socialLinks: igniteArray([
    {
      platform: igniteString("Twitter"),
      href: igniteString("https://twitter.com"),
    },
    {
      platform: igniteString("Instagram"),
      href: igniteString("https://instagram.com"),
    },
    {
      platform: igniteString("Facebook"),
      href: igniteString("https://facebook.com"),
    },
    {
      platform: igniteString("YouTube"),
      href: igniteString("https://youtube.com"),
    },
  ]),

  copyrightText: igniteString(
    `LetsBookFlorida ${new Date().getFullYear()}, All rights reserved.`
  ),
};

// Social Media Icon Mapping
const socialIcons = {
  Twitter: <FaTwitter className="w-6 h-6" />,
  Instagram: <FaInstagram className="w-6 h-6" />,
  Facebook: <FaFacebook className="w-6 h-6" />,
  YouTube: <FaYoutube className="w-6 h-6" />,
};

export default function SimpleFooter(props) {
  const mergedProps = { ...props };

  // Dynamically update copyright year
  const currentYear = new Date().getFullYear();
  const copyrightText = mergedProps.copyrightText.value.replace(
    "YYYY",
    currentYear.toString()
  );

  return (
    <footer className="w-full py-20" id={mergedProps.id.value}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Logo */}
          <Link href="/">
            <Image
              width={150}
              height={50}
              src={mergedProps.logo.value}
              alt="Company Logo"
              className="mx-auto"
            />
          </Link>

          {/* Navigation Links */}
          <ul className="text-lg flex flex-col gap-7 md:flex-row md:gap-12 justify-center transition-all duration-500 py-10 mb-10 border-b border-gray-200">
            {mergedProps.links.value.map((link, index) => (
              <li key={index}>
                <Link
                  href={link.href.value}
                  className="hover:text-indigo-600 transition-colors duration-300 text-sm font-medium text-gray-600 hover:underline "
                >
                  {link.label.value}
                </Link>
              </li>
            ))}
          </ul>

          {/* Social Media Links with Icons */}
          <div className="flex space-x-6 justify-center items-center mb-10">
            {mergedProps.socialLinks.value.map((social, index) => {
              console.log(social);
              const icon = socialIcons[social.platform.value];
              if (!icon) return null;

              return (
                <Link
                  key={index}
                  href={social.href.value}
                  className="text-gray-600 hover:text-indigo-600 transition-all duration-300"
                  aria-label={social.platform.value}
                >
                  {icon}
                </Link>
              );
            })}
          </div>

          {/* Copyright */}
          <span className="text-lg text-gray-600 text-center block">
            {copyrightText}
          </span>
        </div>
      </div>
    </footer>
  );
}
