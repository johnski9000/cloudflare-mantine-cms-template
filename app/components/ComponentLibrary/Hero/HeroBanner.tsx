"use client";
import React, { useEffect } from "react";
import Link from "next/link";

import { parseMarkdownBold } from "@/app/utils/parseMarkdown";
import { Button } from "@mantine/core";
import { igniteString, igniteImage } from "defaultprops";

export const HeroBannerProps = {
  id: igniteString("hero-banner"),

  // Banner content
  image: igniteImage(
    "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=600&h=400&fit=crop"
  ),
  title: igniteString("Welcome to Anslow Building Surveyors"),
  description: igniteString(
    "Welcome to **Anslow Building Surveyors**, an independent family run surveying practice, based in **Altrincham, Trafford**, and servicing the wider **North-West of the United Kingdom**. We provide comprehensive building survey services with professional expertise you can trust."
  ),
  owner: igniteString("Family-Run Independent Practice"),
  linkLabel: igniteString("Explore Our Services"),
  linkHref: igniteString("/services"),
};

export default function HeroBanner(props) {
  const mergedProps = { ...props };

  useEffect(() => {
    // Animate content on mount
    setTimeout(() => {
      const content = document.querySelector(".content-box");
      if (content) {
        content.classList.add("animate");
      }
    }, 100);

    // Parallax scroll effect
    const handleScroll = () => {
      requestAnimationFrame(() => {
        document.querySelectorAll(".parallax-bg").forEach((bg) => {
          const speed = 0.6;
          bg.style.backgroundPosition = `center calc(50% + ${
            window.scrollY * speed
          }px)`;
        });
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const parsedDescription = parseMarkdownBold(
    mergedProps.description.value || ""
  );

  return (
    <section className="min-h-screen relative" id={mergedProps.id.value}>
      <div className="relative ">
        {/* Background Image with Parallax */}
        <div
          className="bg-cover bg-center h-screen z-0 parallax-bg"
          style={{ backgroundImage: `url(${mergedProps.image.value})` }}
        ></div>

        {/* Overlay */}
        <div className="absolute top-0 left-0 bottom-0 right-0 bg-black opacity-50 z-10" />

        {/* Content */}
        <div className="absolute top-0 left-0 bottom-0 right-0 flex items-center z-20">
          <div className="max-w-7xl mx-auto content-box p-4 w-full h-full flex items-center relative">
            <div className="inner flex flex-col max-w-[900px]">
              <h1 className="text-3xl md:text-4xl font-black pb-3 font-mont text-white">
                {mergedProps.title.value}
              </h1>

              <div className="text !text-gray-200 italic">
                &quot;
                {parsedDescription.map((part, index) =>
                  part.type === "bold" ? (
                    <strong key={index}>{part.content}</strong>
                  ) : (
                    <span key={index}>{part.content}</span>
                  )
                )}
                &quot; - {mergedProps.owner.value}
              </div>

              <div className="link-box flex md:flex-row flex-col gap-6 pt-8">
                <Button
                  component={Link}
                  href={mergedProps.linkHref.value}
                  className="flex text-sm font-bold group"
                >
                  {mergedProps.linkLabel.value}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
