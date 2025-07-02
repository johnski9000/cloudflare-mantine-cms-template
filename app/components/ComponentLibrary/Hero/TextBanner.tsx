import Link from "next/link";
import {
  Container,
  Title,
  Text,
  Button,
  Badge,
  Stack,
  Group,
} from "@mantine/core";
import { IconArrowRight, IconHome } from "@tabler/icons-react";
import { igniteString } from "defaultprops";

export const TextBannerProps = {
  overTitle: igniteString("Welcome to"),
  title: igniteString("Anslow Building"),
  italic: igniteString("Surveyors"),
  description: igniteString(
    "An independent family run surveying practice, based in Altrincham, Trafford, and servicing the wider North-West of the United Kingdom. We offer a range of surveying services within the residential property market, providing clients with the highest quality inspection and reporting process, with a personal touch."
  ),
  buttonText: igniteString("Our Services"),
  buttonLink: igniteString("/services"),
};

export default function TextBanner(props) {
  const mergedProps = { ...props };

  const isHomeButton = mergedProps.buttonText.value === "Go Back Home";

  return (
    <section className="h-[93vh] relative bg-gradient-to-br from-blue-50 via-slate-50 to-gray-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10"></div>

      {/* Main Content */}
      <Container
        size="lg"
        className="h-full flex items-center justify-center relative z-10"
      >
        <div className="text-center max-w-4xl mx-auto">
          <Stack gap="xl" align="center">
            {/* Over Title Badge */}
            <Badge
              variant="light"
              color="blue"
              size="lg"
              radius="xl"
              className="font-medium tracking-wide shadow-sm bg-blue-50 text-blue-700 border border-blue-200"
            >
              {mergedProps.overTitle.value}
            </Badge>

            {/* Main Title */}
            <div className="space-y-2">
              <Title
                order={1}
                className="font-heading text-4xl xs:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-slate-800"
              >
                {mergedProps.title.value}{" "}
                <Text
                  span
                  inherit
                  className="italic bg-gradient-to-r from-blue-600 to-slate-700 bg-clip-text text-transparent"
                >
                  {mergedProps.italic.value}
                </Text>
              </Title>
            </div>

            {/* Description */}
            <Text
              size="lg"
              className="text-slate-600 leading-relaxed max-w-3xl mx-auto font-normal"
            >
              {mergedProps.description.value}
            </Text>

            {/* CTA Button */}
            <div className="pt-6">
              <Button
                component={Link}
                href={mergedProps.buttonLink.value}
                size="lg"
                radius="md"
                className={`
                  px-8 py-3 font-semibold tracking-wide transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1
                  ${
                    isHomeButton
                      ? "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white border-0"
                      : "bg-gradient-to-r from-blue-600 to-slate-700 hover:from-blue-700 hover:to-slate-800 text-white border-0"
                  }
                `}
                rightSection={
                  isHomeButton ? (
                    <IconHome size={18} />
                  ) : (
                    <IconArrowRight size={18} />
                  )
                }
                aria-label={mergedProps.buttonText.value}
              >
                {mergedProps.buttonText.value}
              </Button>
            </div>

            {/* Decorative Elements */}
            <Group gap="xs" className="opacity-40 mt-8">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse delay-75" />
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-150" />
            </Group>
          </Stack>
        </div>
      </Container>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200 rounded-full opacity-20 blur-xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-slate-200 rounded-full opacity-20 blur-xl animate-pulse delay-1000" />
    </section>
  );
}
