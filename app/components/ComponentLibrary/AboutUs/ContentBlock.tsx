import { ReactMarkdownElement } from "@/app/utils/parseMarkdown";
import { Container, Title, Text, Stack, List, Paper, Box } from "@mantine/core";
import { IconCheck, IconStar, IconInfoCircle } from "@tabler/icons-react";
import { igniteString } from "defaultprops";

export const ContentBlockProps = {
  title: igniteString("Pre-completion Survey"),
  description: igniteString(
    "The pre-completion survey is an inspection of a newly built property, by a suitably qualified inspector (RICS/RPSA) on a non-disruptive and non-invasive basis."
  ),
  content: igniteString(
    "The pre-completion survey assesses fixtures, fittings and services by way of checks comparable with normal daily use.\n\nApproved by an industry-wide technical working group in collaboration with the New Homes Quality Board (NHQB). The availability of the pre-completion survey is a requirement of the New Homes Quality Code.\n\nThe purpose of a pre-completion check of a completion new home is to provide the home buyer with a Finishing Checklist. This process is commonly referred to as 'snagging'. The finishing checklist can then be presented to the builder/developer for the remediation of any defects noted at the time of inspection, generally referred to as 'snags', on behalf of the property buyer."
  ),
  variant: igniteString("default"), // default, featured, minimal
  size: igniteString("md"), // sm, md, lg
};

export default function ContentBlock(props) {
  const mergedProps = { ...props };
  console.log("ContentBlock Props:", mergedProps);

  const variants = {
    default: "bg-white border border-gray-200 shadow-sm",
    featured:
      "bg-gradient-to-br from-blue-50 via-white to-slate-50 border border-blue-200 shadow-lg",
    minimal: "bg-transparent border-0 shadow-none",
  };

  const sizes = {
    sm: {
      container: "sm",
      title: 3,
      titleClass: "text-xl",
      descClass: "text-sm",
      contentClass: "text-sm",
      spacing: "md",
      padding: "p-6",
    },
    md: {
      container: "md",
      title: 2,
      titleClass: "text-2xl md:text-3xl",
      descClass: "text-base",
      contentClass: "text-base",
      spacing: "lg",
      padding: "p-8 md:p-10",
    },
    lg: {
      container: "lg",
      title: 1,
      titleClass: "text-3xl md:text-4xl",
      descClass: "text-lg",
      contentClass: "text-lg",
      spacing: "xl",
      padding: "p-10 md:p-12",
    },
  };

  const currentSize = sizes[mergedProps.size.value] || sizes.md;
  const currentVariant =
    variants[mergedProps.variant.value] || variants.default;

  // Split content by double line breaks to create paragraphs
  const paragraphs = mergedProps.content.value
    .split("\n\n")
    .filter((p) => p.trim());

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
                <div className="w-16 h-1 bg-gradient-to-r from-blue-600 to-slate-600 rounded-full mt-3"></div>
              </Box>
            )}

            {/* Description/Intro */}
            {mergedProps.description.value && (
              <Text
                className={`${currentSize.descClass} text-blue-700 font-medium leading-relaxed`}
              >
                {mergedProps.description.value}
              </Text>
            )}

            {/* Main Content Paragraphs */}
            {paragraphs.length > 0 && (
              <Stack gap="md" className="mt-4">
                {paragraphs.map((paragraph, index) => (
                  <div
                    key={index}
                    className={`${currentSize.contentClass} text-slate-600 leading-relaxed`}
                  >
                    <ReactMarkdownElement>
                      {paragraph.trim()}
                    </ReactMarkdownElement>
                  </div>
                ))}
              </Stack>
            )}
          </Stack>
        </Paper>
      </Container>
    </section>
  );
}
