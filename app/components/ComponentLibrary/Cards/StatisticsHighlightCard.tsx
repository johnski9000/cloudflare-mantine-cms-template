import Image from "next/image";
import Link from "next/link";
import {
  Card,
  Grid,
  Group,
  Stack,
  ThemeIcon,
  Badge,
  Title,
  Text,
  Highlight,
  Button,
  GridCol,
} from "@mantine/core";
import { IconHome, IconArrowRight } from "@tabler/icons-react";
import { igniteImage, igniteString } from "defaultprops";

export const StatisticsHighlightCardProps = {
  imageUrl: igniteImage(
    "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
  ),
  imageAlt: igniteString("Home inspection and survey process"),
  badgeText: igniteString("SURVEY STANDARDS"),
  title: igniteString("Professional Survey Standards & Technology"),
  statisticText: igniteString("5 Days"),
  mainDescription: igniteString(
    "Following instruction, we aim to inspect the property and compile an individually tailored report within 5 working days"
  ),
  consequenceText: igniteString(
    ". The report is comprehensive, and clear, broken down in to individual sections and summaries, all supported with detailed images to supplement any important findings."
  ),
  benefitDescription: igniteString(
    "We utilise state of the art technology including drone surveys where necessary. Our drone operator is insured and registered with the Civil Aviation Authority (CAA). Our survey reports will"
  ),
  benefitEmphasis: igniteString("give you the confidence to move forwards"),
  benefitContinuation: igniteString(" with your property journey!"),
  endorsementText: igniteString(
    "Our surveys follow RPSA Survey Inspection and Reporting Standards Edition 1 v5.2 and RICS Home Survey Standard effective 1 March 2021."
  ),
  buttonText: igniteString("Book Survey"),
  buttonLink: igniteString("/contact"),
};

export default function StatisticsHighlightCard(props) {
  const mergedProps = { ...props };
  return (
    <Card
      shadow="md"
      // radius="xl"
      withBorder
      p={0}
      style={{ overflow: "hidden" }}
    >
      <Grid gutter={0}>
        <GridCol span={{ base: 12, md: 6 }}>
          <div
            style={{
              position: "relative",
              height: "100%",
              minHeight: "400px",
            }}
          >
            <Image
              src={mergedProps.imageUrl.value}
              alt={mergedProps.imageAlt.value}
              fill
              style={{ objectFit: "cover" }}
              priority
            />
          </div>
        </GridCol>
        <GridCol span={{ base: 12, md: 6 }}>
          <Stack p="xl" h="100%" justify="center" gap="lg" bg="gray.0">
            <Group>
              <ThemeIcon size="lg" variant="light" color="blue">
                <IconHome size={20} />
              </ThemeIcon>
              <div>
                <Badge variant="light" color="gray" size="sm">
                  {mergedProps.badgeText.value}
                </Badge>
                <Title order={3} mt={4}>
                  {mergedProps.title.value}
                </Title>
              </div>
            </Group>

            <Text c="dimmed" size="md">
              <Highlight
                highlight={[mergedProps.statisticText.value]}
                highlightStyles={{
                  backgroundColor: "yellow.2",
                  fontWeight: 600,
                }}
                component="span"
              >
                {mergedProps.mainDescription.value}
              </Highlight>
              {mergedProps.consequenceText.value}
            </Text>

            <Text c="dimmed" size="md">
              {mergedProps.benefitDescription.value}
              <Text component="span" fw={600} c="blue">
                {" "}
                {mergedProps.benefitEmphasis.value}
              </Text>
              {mergedProps.benefitContinuation.value}
            </Text>

            <Text c="dimmed" size="sm" fs="italic">
              {mergedProps.endorsementText.value}
            </Text>

            <Group mt="md">
              <Button
                component={Link}
                href={mergedProps.buttonLink.value}
                size="md"
                rightSection={<IconArrowRight size={16} />}
              >
                {mergedProps.buttonText.value}
              </Button>
            </Group>
          </Stack>
        </GridCol>
      </Grid>
    </Card>
  );
}
