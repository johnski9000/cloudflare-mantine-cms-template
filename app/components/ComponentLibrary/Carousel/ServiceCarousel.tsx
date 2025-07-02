"use client";
import React from "react";
import { Carousel } from "@mantine/carousel";
import { Card, Image, Text, Badge, Button, Group, Stack } from "@mantine/core";
import { igniteString, igniteArray, igniteImage } from "defaultprops";

export const ServiceCarouselProps = {
  sectionId: igniteString("service-carousel"),
  sectionClasses: igniteString("py-16 bg-gray-50"),
  containerClasses: igniteString("max-w-7xl mx-auto px-4"),

  // Header content
  headerClasses: igniteString("text-center mb-12"),
  title: igniteString("Choose Your Service Type"),
  titleClasses: igniteString(
    "text-3xl md:text-4xl font-bold text-gray-900 mb-4"
  ),
  subtitle: igniteString(
    "Professional services tailored to your needs. From basic assessments to comprehensive solutions."
  ),
  subtitleClasses: igniteString("text-lg text-gray-600 max-w-2xl mx-auto"),

  // Service items
  services: igniteArray([
    {
      id: igniteString("0"),
      title: igniteString("Pre-completion Survey"),
      subtitle: igniteString("New Build Quality Assurance"),
      description: igniteString(
        "Professional snagging inspection for newly built properties. Creates a finishing checklist to ensure your new home meets quality standards before completion."
      ),
      image: igniteImage(
        "https://images.unsplash.com/photo-1503387762-592deb58ef4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250&q=80"
      ),
      price: igniteString("From £450"),
      duration: igniteString("2-3 hours"),
      suitableFor: igniteString("New builds, pre-completion properties"),
      features: igniteArray([
        igniteString("RICS/RPSA qualified inspector"),
        igniteString("Finishing checklist creation"),
        igniteString("Non-invasive inspection"),
        igniteString("NHQB approved process"),
      ]),
      link: igniteString("/pre-completion-survey"),
    },
    {
      id: igniteString("1"),
      title: igniteString("Level 1 Home Survey"),
      subtitle: igniteString("Essential Property Assessment"),
      description: igniteString(
        "Perfect for conventional properties and newer homes. Identifies risks, potential legal issues, and urgent defects."
      ),
      image: igniteString(
        "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250&q=80"
      ),
      price: igniteString("From £350"),
      duration: igniteString("2-3 hours"),
      suitableFor: igniteString("New builds, good condition properties"),
      features: igniteArray([
        igniteString("Condition report"),
        igniteString("Risk identification"),
        igniteString("Urgent defects"),
        igniteString("Legal issues"),
      ]),
      link: igniteString("/rics-rpsa-level-1-home-survey"),
    },
    {
      id: igniteString("2"),
      title: igniteString("Level 2 Home Survey"),
      subtitle: igniteString("Detailed Property Analysis"),
      description: igniteString(
        "Most popular choice for conventional properties in reasonable condition. Includes extensive inspections and maintenance advice."
      ),
      image: igniteString(
        "https://images.unsplash.com/photo-1448630360428-65456885c650?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250&q=80"
      ),
      price: igniteString("From £550"),
      duration: igniteString("3-4 hours"),
      suitableFor: igniteString("Properties post-1930, reasonable condition"),
      features: igniteArray([
        igniteString("Traffic light rating"),
        igniteString("Roof space inspection"),
        igniteString("Drainage assessment"),
        igniteString("Maintenance advice"),
      ]),
      link: igniteString("/rics-rpsa-level-2-home-survey"),
    },
    {
      id: igniteString("3"),
      title: igniteString("Level 3 Building Survey"),
      subtitle: igniteString("Complete Structural Assessment"),
      description: igniteString(
        "The most comprehensive survey for older, unusual, or run-down properties. Includes drone inspections and detailed analysis."
      ),
      image: igniteString(
        "https://images.unsplash.com/photo-1518780664697-55e3ad937233?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250&q=80"
      ),
      price: igniteString("From £750"),
      duration: igniteString("4-6 hours"),
      suitableFor: igniteString("Older properties, major renovations"),
      features: igniteArray([
        igniteString("Drone inspections"),
        igniteString("Structural analysis"),
        igniteString("Repair cost estimates"),
        igniteString("Comprehensive reporting"),
      ]),
      link: igniteString("/level-3-home-survey-structural-survey"),
    },
    {
      id: igniteString("4"),
      title: igniteString("Buy-to-Let Survey"),
      subtitle: igniteString("Investment Property Protection"),
      description: igniteString(
        "Specialized survey combining property condition with Health & Safety compliance for rental properties."
      ),
      image: igniteString(
        "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250&q=80"
      ),
      price: igniteString("From £650"),
      duration: igniteString("3-5 hours"),
      suitableFor: igniteString("Rental properties, landlords"),
      features: igniteArray([
        igniteString("Health & Safety review"),
        igniteString("HHSRS compliance"),
        igniteString("Investment protection"),
        igniteString("Annual review option"),
      ]),
      link: igniteString("/buy-to-let-survey"),
    },
    {
      id: igniteString("5"),
      title: igniteString("Defects Survey"),
      subtitle: igniteString("Expert Problem Diagnosis"),
      description: igniteString(
        "Identify and resolve structural issues, damp, subsidence, and timber decay before they become costly problems."
      ),
      image: igniteString(
        "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250&q=80"
      ),
      price: igniteString("From £450"),
      duration: igniteString("2-4 hours"),
      suitableFor: igniteString("Properties with known issues"),
      features: igniteArray([
        igniteString("Problem diagnosis"),
        igniteString("Repair cost estimates"),
        igniteString("Action plans"),
        igniteString("Cause identification"),
      ]),
      link: igniteString("/defects-surveys"),
    },
  ]),
  // Footer content
  footerClasses: igniteString("text-center mt-12"),
  footerButtonText: igniteString("Get Free Quote"),
  footerButtonSize: igniteString("lg"),
  footerButtonVariant: igniteString("gradient"),

  // Card button
  cardButtonText: igniteString("Learn More"),
  cardButtonVariant: igniteString("filled"),
  cardButtonColor: igniteString("blue"),

  // Contact scroll target
  contactScrollTarget: igniteString("contact-form"),
};

export default function ServiceCarousel(props) {
  const mergedProps = { ...props };

  return (
    <section
      className={mergedProps.sectionClasses.value}
      id={mergedProps.sectionId.value}
    >
      <div className={mergedProps.containerClasses.value}>
        <div className={mergedProps.headerClasses.value}>
          <h2 className={mergedProps.titleClasses.value}>
            {mergedProps.title.value}
          </h2>
          <p className={mergedProps.subtitleClasses.value}>
            {mergedProps.subtitle.value}
          </p>
        </div>

        <Carousel
          slideSize={{ base: "100%", sm: "50%", lg: "33.333333%" }}
          slideGap="md"
          align="start"
          slidestoscroll={1}
          withIndicators
          withControls
          loop={true}
          classNames={{
            control:
              "bg-white border-2 border-gray-200 text-gray-700 hover:bg-gray-50",
            indicator: "bg-gray-300 data-[active]:bg-blue-600",
          }}
        >
          {mergedProps.services.value.map((service) => (
            <Carousel.Slide key={service.id.value}>
              <Card
                shadow="sm"
                padding="lg"
                radius="md"
                withBorder
                className="h-full flex flex-col"
              >
                <Card.Section>
                  <Image
                    src={service.image.value}
                    height={250}
                    alt={service.title.value}
                    fit="cover"
                  />
                </Card.Section>

                <Stack gap="md" className="mt-4 flex-1 flex flex-col">
                  <div>
                    <Group justify="space-between" align="flex-start">
                      <div className="flex-1">
                        <Text fw={600} size="lg" className="text-gray-900">
                          {service.title.value}
                        </Text>
                        <Text size="sm" c="dimmed" className="text-gray-600">
                          {service.subtitle.value}
                        </Text>
                      </div>
                      <Badge color="blue" variant="light">
                        {service.price.value}
                      </Badge>
                    </Group>
                  </div>

                  <Text size="sm" className="text-gray-700 line-clamp-3">
                    {service.description.value}
                  </Text>

                  <div className="space-y-2">
                    <Group gap="xs">
                      <Text size="xs" fw={500} className="text-gray-600">
                        Duration:
                      </Text>
                      <Text size="xs" className="text-gray-800">
                        {service.duration.value}
                      </Text>
                    </Group>
                    <Group gap="xs">
                      <Text size="xs" fw={500} className="text-gray-600">
                        Suitable for:
                      </Text>
                      <Text size="xs" className="text-gray-800">
                        {service.suitableFor.value}
                      </Text>
                    </Group>
                  </div>

                  <div className="flex-1">
                    <Text size="xs" fw={500} className="text-gray-600 mb-2">
                      Key Features:
                    </Text>
                    <div className="flex flex-wrap gap-1">
                      {service.features.value.map((feature, index) => (
                        <Badge
                          key={index}
                          size="xs"
                          variant="outline"
                          color="gray"
                          className="text-xs"
                        >
                          {feature.value}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button
                    component="a"
                    href={service.link.value}
                    variant={mergedProps.cardButtonVariant.value}
                    color={mergedProps.cardButtonColor.value}
                    fullWidth
                    className="mt-auto"
                  >
                    {mergedProps.cardButtonText.value}
                  </Button>
                </Stack>
              </Card>
            </Carousel.Slide>
          ))}
        </Carousel>

        <div className={mergedProps.footerClasses.value}>
          <Button
            variant={mergedProps.footerButtonVariant.value}
            size={mergedProps.footerButtonSize.value}
            component="a"
            href="/contact-us"
          >
            {mergedProps.footerButtonText.value}
          </Button>
        </div>
      </div>
    </section>
  );
}
