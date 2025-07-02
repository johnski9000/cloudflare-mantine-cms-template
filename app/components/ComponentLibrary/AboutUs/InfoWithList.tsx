"use client";
import { Container, Title, Text, Stack, List, Paper, Box } from "@mantine/core";
import { IconAlertTriangle, IconCheck } from "@tabler/icons-react";
import { igniteArray, igniteString } from "defaultprops";

export const InfoWithListProps = {
  title: igniteString("Defects Surveys"),
  introduction: igniteString(
    "Issues and defects with properties can emerge at any time, and if left untreated can lead to extensive and significant damage to your property."
  ),
  listTitle: igniteString(
    "Some of the most common defects our surveyors find in properties include:"
  ),
  listItems: igniteArray([
    igniteString("Subsidence and heave"),
    igniteString("Cracking brickwork"),
    igniteString("Structural movement"),
    igniteString("Timber decay and rot"),
    igniteString("Damp"),
    igniteString("Roofing defects"),
    igniteString("Poor design and construction"),
  ]),
  conclusion: igniteString(
    "We offer an independent and unbiased Defects Survey, where we look to inspect, identify and offer advice on the associated costs and required steps to rectify any defects found at the property, and to help the property owner maintain their investment."
  ),
  variant: igniteString("default"), // default, featured, minimal
  size: igniteString("md"), // sm, md, lg
  listIcon: igniteString("alert"), // alert, check
};

export default function InfoWithList(props) {
  const mergedProps = { ...props };

  const variants = {
    default: "bg-white border border-gray-200 shadow-sm",
    featured:
      "bg-gradient-to-br from-amber-50 via-white to-orange-50 border border-amber-200 shadow-lg",
    minimal: "bg-transparent border-0 shadow-none",
  };

  const sizes = {
    sm: {
      container: "sm",
      title: 3,
      titleClass: "text-xl",
      textClass: "text-sm",
      listTextClass: "text-sm",
      spacing: "md",
      padding: "p-6",
      iconSize: 16,
    },
    md: {
      container: "md",
      title: 2,
      titleClass: "text-2xl md:text-3xl",
      textClass: "text-base",
      listTextClass: "text-base",
      spacing: "lg",
      padding: "p-8 md:p-10",
      iconSize: 18,
    },
    lg: {
      container: "lg",
      title: 1,
      titleClass: "text-3xl md:text-4xl",
      textClass: "text-lg",
      listTextClass: "text-lg",
      spacing: "xl",
      padding: "p-10 md:p-12",
      iconSize: 20,
    },
  };

  const currentSize = sizes[mergedProps.size.value] || sizes.md;
  const currentVariant =
    variants[mergedProps.variant.value] || variants.default;

  const getIconComponent = () => {
    return mergedProps.listIcon.value === "check"
      ? IconCheck
      : IconAlertTriangle;
  };

  const getIconStyles = () => {
    return mergedProps.listIcon.value === "check"
      ? "text-green-600 bg-green-100"
      : "text-amber-600 bg-amber-100";
  };

  const IconComponent = getIconComponent();
  const iconStyles = getIconStyles();

  return (
    <section className="py-12">
      <Container size={currentSize.container}>
        <Paper
          className={`${currentVariant} rounded-xl ${currentSize.padding}`}
          radius="lg"
        >
          <Stack gap={currentSize.spacing}>
            {/* Title */}
            {mergedProps.title.value && (
              <Box>
                <Title
                  order={currentSize.title}
                  className={`${currentSize.titleClass} text-slate-800 font-bold leading-tight`}
                >
                  {mergedProps.title.value}
                </Title>
                {/* Decorative underline */}
                <div className="w-16 h-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full mt-3"></div>
              </Box>
            )}

            {/* Introduction */}
            {mergedProps.introduction.value && (
              <Text
                className={`${currentSize.textClass} text-slate-600 leading-relaxed`}
              >
                {mergedProps.introduction.value}
              </Text>
            )}

            {/* List Section */}
            {mergedProps.listItems.value.length > 0 && (
              <Box>
                {/* List Title */}
                {mergedProps.listTitle.value && (
                  <Text
                    className={`${currentSize.textClass} text-slate-700 font-medium mb-4 leading-relaxed`}
                  >
                    {mergedProps.listTitle.value}
                  </Text>
                )}

                {/* List Items */}
                <List className="space-y-3">
                  {mergedProps.listItems.value.map((item, index) => (
                    <List.Item
                      key={index}
                      icon={
                        <Box className={`${iconStyles} rounded-full p-1 mt-1`}>
                          <IconComponent size={currentSize.iconSize} />
                        </Box>
                      }
                      className={`${currentSize.listTextClass} text-slate-700 leading-relaxed font-medium`}
                    >
                      {item.value}
                    </List.Item>
                  ))}
                </List>
              </Box>
            )}

            {/* Conclusion */}
            {mergedProps.conclusion.value && (
              <Text
                className={`${currentSize.textClass} text-slate-600 leading-relaxed mt-4`}
              >
                {mergedProps.conclusion.value}
              </Text>
            )}
          </Stack>
        </Paper>
      </Container>
    </section>
  );
}
