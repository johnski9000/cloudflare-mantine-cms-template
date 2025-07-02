"use client";
import {
  Container,
  Title,
  Text,
  Stack,
  List,
  Paper,
  Box,
  Grid,
  Card,
} from "@mantine/core";
import {
  IconCheck,
  IconStar,
  IconShield,
  IconClipboardList,
  IconHome,
  IconFileText,
} from "@tabler/icons-react";
import { igniteArray, igniteBoolean, igniteString } from "defaultprops";

export const WhatsIncludedProps = {
  title: igniteString("What is included in a Level 3 Structural Survey?"),
  subtitle: igniteString(""),
  items: igniteArray([
    {
      text: igniteString(
        "A thorough, impartial property assessment from an RPSA Building Surveyor"
      ),
      active: igniteBoolean(true),
    },
    {
      text: igniteString(
        "Visual inspection of all internal and external building elements, including walls and ceilings, roof and guttering, doors and windows"
      ),
      active: igniteBoolean(true),
    },
    {
      text: igniteString(
        "Assessment of structural problems such as subsidence, damp issues and timber decay, including woodworm and rot"
      ),
      active: igniteBoolean(true),
    },
    {
      text: igniteString(
        "Where possible, indicative costs to help understand the value of works required"
      ),
      active: igniteBoolean(true),
    },
    {
      text: igniteString(
        "Advice regarding guarantees, planning and building control issues, disputes etc, to be followed up by your conveyancer"
      ),
      active: igniteBoolean(true),
    },
    {
      text: igniteString(
        "A Jargon free and clear report with clear findings and recommendations, with annotated images"
      ),
      active: igniteBoolean(true),
    },
    {
      text: igniteString(
        "A full report emailed via PDF within 5 working days. Hard copy available for additional cost"
      ),
      active: igniteBoolean(true),
    },
    {
      text: igniteString(
        "Talk to your surveyor on the day of inspection with a follow up phone call to explain their findings. You will also have ongoing access via email and telephone to ask any follow up questions"
      ),
      active: igniteBoolean(true),
    },
  ]),
  layout: igniteString("list"), // list, grid, cards
  variant: igniteString("featured"), // default, featured, minimal
  size: igniteString("md"), // sm, md, lg
};

export default function WhatsIncluded(props) {
  const mergedProps = { ...props };

  const variants = {
    default: "bg-white border border-gray-200 shadow-sm",
    featured:
      "bg-gradient-to-br from-green-50 via-white to-blue-50 border border-green-200 shadow-lg",
    minimal: "bg-transparent border-0 shadow-none",
  };

  const sizes = {
    sm: {
      container: "sm",
      title: 3,
      titleClass: "text-xl",
      subtitleClass: "text-sm",
      itemClass: "text-sm",
      spacing: "md",
      padding: "p-6",
      iconSize: 16,
    },
    md: {
      container: "md",
      title: 2,
      titleClass: "text-2xl md:text-3xl",
      subtitleClass: "text-base",
      itemClass: "text-base",
      spacing: "lg",
      padding: "p-8 md:p-10",
      iconSize: 20,
    },
    lg: {
      container: "lg",
      title: 1,
      titleClass: "text-3xl md:text-4xl",
      subtitleClass: "text-lg",
      itemClass: "text-lg",
      spacing: "xl",
      padding: "p-10 md:p-12",
      iconSize: 24,
    },
  };

  const iconMap = {
    check: IconCheck,
    star: IconStar,
    shield: IconShield,
    list: IconClipboardList,
    home: IconHome,
    file: IconFileText,
  };

  const currentSize = sizes[mergedProps.size.value] || sizes.md;
  const currentVariant =
    variants[mergedProps.variant.value] || variants.default;

  const renderListLayout = () => (
    <List className="space-y-4">
      {mergedProps.items.value.map((item, index) => {
        if (!item.active.value) return null; // Skip inactive items
        return (
          <List.Item
            key={index}
            icon={
              <Box className="text-green-600 mt-1 bg-green-100 rounded-full p-1">
                <IconCheck size={currentSize.iconSize} />
              </Box>
            }
            className={`${currentSize.itemClass} text-slate-700 leading-relaxed font-medium`}
          >
            {item.text.value}
          </List.Item>
        );
      })}
    </List>
  );

  const renderGridLayout = () => (
    <Grid>
      {mergedProps.items.value.map((item, index) => {
        if (!item.active.value) return null; // Skip inactive items
        return (
          <Grid.Col key={index} span={{ base: 12, sm: 6, md: 4 }}>
            <Box className="flex items-start gap-3 p-4 rounded-lg bg-white/50 border border-gray-100">
              <Box className="text-green-600 bg-green-100 rounded-full p-2 flex-shrink-0">
                <IconCheck size={currentSize.iconSize} />
              </Box>
              <Text
                className={`${currentSize.itemClass} text-slate-700 leading-relaxed font-medium`}
              >
                {item.text.value}
              </Text>
            </Box>
          </Grid.Col>
        );
      })}
    </Grid>
  );

  const renderCardsLayout = () => (
    <Grid>
      {mergedProps.items.value.map((item, index) => {
        if (!item.active.value) return null; // Skip inactive items
        return (
          <Grid.Col key={index} span={{ base: 12, sm: 6, lg: 4 }}>
            <Card
              className="h-full bg-white border border-gray-200 hover:border-green-300 hover:shadow-md transition-all duration-300"
              radius="lg"
              padding="lg"
            >
              <Stack align="center" gap="md" className="text-center h-full">
                <Box className="text-green-600 bg-green-100 rounded-full p-3">
                  <IconCheck size={currentSize.iconSize + 4} />
                </Box>
                <Text
                  className={`${currentSize.itemClass} text-slate-700 leading-relaxed font-medium`}
                >
                  {item.text.value}
                </Text>
              </Stack>
            </Card>
          </Grid.Col>
        );
      })}
    </Grid>
  );

  const renderLayout = () => {
    switch (mergedProps.layout.value) {
      case "grid":
        return renderGridLayout();
      case "cards":
        return renderCardsLayout();
      default:
        return renderListLayout();
    }
  };

  return (
    <section className="py-12">
      <Container size={currentSize.container}>
        <Paper
          className={`${currentVariant} rounded-xl ${currentSize.padding}`}
          radius="lg"
        >
          <Stack gap={currentSize.spacing}>
            {/* Header */}
            <Box className="text-center">
              <Title
                order={currentSize.title}
                className={`${currentSize.titleClass} text-slate-800 font-bold leading-tight mb-3`}
              >
                {mergedProps.title.value}
              </Title>

              {mergedProps.subtitle.value && (
                <Text
                  className={`${currentSize.subtitleClass} text-slate-600 leading-relaxed max-w-2xl mx-auto`}
                >
                  {mergedProps.subtitle.value}
                </Text>
              )}

              {/* Decorative element */}
              <div className="flex justify-center mt-4">
                <div className="w-20 h-1 bg-gradient-to-r from-green-500 to-blue-500 rounded-full"></div>
              </div>
            </Box>

            {/* Content */}
            <Box className="mt-8">{renderLayout()}</Box>
          </Stack>
        </Paper>
      </Container>
    </section>
  );
}
