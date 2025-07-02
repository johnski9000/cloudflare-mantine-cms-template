"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import { Carousel } from "@mantine/carousel";
import { useRef } from "react";
import { Button } from "@mantine/core";
import { parseMarkdownBold } from "@/app/utils/parseMarkdown";
import Autoplay from "embla-carousel-autoplay";
import {
  igniteString,
  igniteArray,
  igniteImage,
  igniteNumber,
  igniteBoolean,
} from "defaultprops";

export const HeroCarouselProps = {
  id: igniteString("hero-carousel"),
  sectionClasses: igniteString("h-screen relative overflow-hidden"),

  // Auto-advance settings
  autoplaySpeed: igniteNumber(5000),
  autoplay: igniteBoolean(true),

  // Slides data
  slides: igniteArray([
    {
      image: igniteImage(
        "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=1920&h=1080&fit=crop"
      ),
      title: igniteString("Welcome to Anslow Building Surveyors"),
      description: igniteString(
        "Welcome to **Anslow Building Surveyors**, an independent family run surveying practice, based in **Altrincham, Trafford**, and servicing the wider **North-West of the United Kingdom**. We provide comprehensive building survey services with professional expertise you can trust."
      ),
      owner: igniteString("Family-Run Independent Practice"),
      linkLabel: igniteString("Explore Our Services"),
      linkHref: igniteString("/services"),
    },
    {
      image: igniteImage(
        "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1920&h=1080&fit=crop"
      ),
      title: igniteString("Pre-completion Survey - New Build Protection"),
      description: igniteString(
        "Inspection of newly built properties by qualified RICS/RPSA inspectors on a **non-disruptive basis**. Provides a comprehensive **Finishing Checklist** to identify 'snags' before completion, ensuring your new home meets quality standards."
      ),
      owner: igniteString("RICS/RPSA Qualified Inspector"),
      linkLabel: igniteString("Book Pre-completion Survey"),
      linkHref: igniteString("/pre-completion-survey"),
    },
    {
      image: igniteImage(
        "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920&h=1080&fit=crop"
      ),
      title: igniteString("RICS/RPSA Level 1 Home Survey - Condition Report"),
      description: igniteString(
        "Objective, clear and concise overview for **newly built, conventional properties** in fair condition. Provides concise reporting with clear ratings on building condition, services and external grounds to highlight areas requiring attention."
      ),
      owner: igniteString("RICS/RPSA Qualified Surveyor"),
      linkLabel: igniteString("Get Level 1 Survey"),
      linkHref: igniteString("/rics-rpsa-level-1-home-survey"),
    },
    {
      image: igniteImage(
        "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1920&h=1080&fit=crop"
      ),
      title: igniteString("RICS/RPSA Level 2 Home Survey - Home Buyers Report"),
      description: igniteString(
        "Intermediate level survey for **conventional properties post-1930** in reasonable condition. Comprehensive inspection focusing on defects like subsidence, damp, rot, and structural issues with **traffic light rating system**."
      ),
      owner: igniteString("RPSA Building Surveyor"),
      linkLabel: igniteString("Book Level 2 Survey"),
      linkHref: igniteString("/rics-rpsa-level-2-home-survey"),
    },
    {
      image: igniteImage(
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&h=1080&fit=crop"
      ),
      title: igniteString("Level 3 Home Survey - Structural Survey"),
      description: igniteString(
        "The most comprehensive survey providing **extensive technical analysis** of construction and materials. Perfect for **large, older or run-down properties**. Includes structural condition assessment and advice on repair costs."
      ),
      owner: igniteString("Senior Building Surveyor"),
      linkLabel: igniteString("Request Structural Survey"),
      linkHref: igniteString("/level-3-home-survey-structural-survey"),
    },
    {
      image: igniteImage(
        "https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=1920&h=1080&fit=crop"
      ),
      title: igniteString("Buy-to-Let Survey - Investment Property Protection"),
      description: igniteString(
        "Combines Level 2 property condition survey with **Health & Safety compliance review**. Reviews 29 HHSRS hazard profiles ensuring PRS standards compliance and protecting your rental investment from regulatory risks."
      ),
      owner: igniteString("Buy-to-Let Specialist Surveyor"),
      linkLabel: igniteString("Protect Your Investment"),
      linkHref: igniteString("/buy-to-let-survey"),
    },
    {
      image: igniteImage(
        "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1920&h=1080&fit=crop"
      ),
      title: igniteString("Defects Survey - Expert Problem Diagnosis"),
      description: igniteString(
        "Independent investigation of property issues including **subsidence, structural movement, timber decay, and damp**. Provides detailed findings, causes, severity assessment and recommended action plans with associated repair costs."
      ),
      owner: igniteString("Structural Defects Specialist"),
      linkLabel: igniteString("Diagnose Property Issues"),
      linkHref: igniteString("/defects-surveys"),
    },
  ]),

  // Content styling
  titleClasses: igniteString(
    "text-3xl md:text-4xl font-black pb-3 font-mont text-white"
  ),
  descriptionClasses: igniteString("text !text-gray-200 italic"),
  linkBoxClasses: igniteString("link-box flex md:flex-row flex-col gap-6 pt-8"),
  buttonClasses: igniteString("flex text-sm font-bold group"),

  // Layout classes
  containerClasses: igniteString(
    "max-w-7xl mx-auto content-box p-4 w-full h-full flex items-center relative z-20"
  ),
  innerClasses: igniteString("inner flex flex-col max-w-[900px]"),
  overlayClasses: igniteString("absolute inset-0 bg-black/50 z-10"),
  slideClasses: igniteString("hero-slide relative h-screen w-full"),
  backgroundClasses: igniteString(
    "absolute inset-0 bg-cover bg-center z-0 parallax-bg"
  ),
};

export default function HeroCarousel(props) {
  const autoplay = useRef(Autoplay({ delay: 5000, stopOnInteraction: true }));
  const mergedProps = { ...props };
  const slides = mergedProps.slides.value;

  // Update autoplay settings when props change
  useEffect(() => {
    if (autoplay.current) {
      autoplay.current = Autoplay({
        delay: mergedProps.autoplaySpeed.value,
        stopOnInteraction: true,
        stopOnMouseEnter: true,
      });
    }
  }, [mergedProps.autoplaySpeed.value]);

  // Initialize parallax effect
  useEffect(() => {
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

  return (
    <section>
      {/* Preload first slide image */}
      <link rel="preload" as="image" href={slides[0]?.image.value} />

      <Carousel
        height="100vh"
        loop
        withIndicators
        withControls={false}
        slideSize="100%"
        slideGap={0}
        controlsOffset="xl"
        nextControlIcon={
          <div className="text-white/70 hover:text-white text-2xl p-2 rounded-full bg-black/20 hover:bg-black/40 transition-all">
            &#8250;
          </div>
        }
        previousControlIcon={
          <div className="text-white/70 hover:text-white text-2xl p-2 rounded-full bg-black/20 hover:bg-black/40 transition-all">
            &#8249;
          </div>
        }
        styles={{
          indicators: {
            bottom: "2rem",
          },
          indicator: {
            width: "12px",
            height: "12px",
            backgroundColor: "rgba(255, 255, 255, 0.5)",
            "&[dataActive]": {
              backgroundColor: "white",
              transform: "scale(1.25)",
            },
          },
          control: {
            border: "none",
            backgroundColor: "transparent",
            color: "white",
            opacity: 0.8,
            "&:hover": {
              backgroundColor: "transparent",
              opacity: 1,
            },
          },
          root: {
            height: "100vh",
          },
        }}
        {...(mergedProps.autoplay.value && {
          plugins: [autoplay.current],
        })}
      >
        {slides.map((slide, index) => {
          const parsedDescription = parseMarkdownBold(
            slide.description.value || ""
          );

          return (
            <Carousel.Slide key={index}>
              <div className={mergedProps.slideClasses.value}>
                {/* Background Image */}
                <div
                  className={mergedProps.backgroundClasses.value}
                  style={{
                    backgroundImage: `url("${slide.image.value}")`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundAttachment: "fixed",
                  }}
                />

                {/* Overlay */}
                <div className={mergedProps.overlayClasses.value} />

                {/* Content */}
                <div className={mergedProps.containerClasses.value}>
                  <div
                    className={`${mergedProps.innerClasses.value} content-box animate`}
                  >
                    <h1 className={mergedProps.titleClasses.value}>
                      {slide.title.value}
                    </h1>

                    <div className={mergedProps.descriptionClasses.value}>
                      &quot;
                      {parsedDescription.map((part, partIndex) =>
                        part.type === "bold" ? (
                          <strong key={partIndex}>{part.content}</strong>
                        ) : (
                          <span key={partIndex}>{part.content}</span>
                        )
                      )}
                      &quot; - {slide.owner.value}
                    </div>

                    <div className={mergedProps.linkBoxClasses.value}>
                      <Button
                        component={Link}
                        href={slide.linkHref.value}
                        className={mergedProps.buttonClasses.value}
                      >
                        {slide.linkLabel.value}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Carousel.Slide>
          );
        })}
      </Carousel>
    </section>
  );
}
