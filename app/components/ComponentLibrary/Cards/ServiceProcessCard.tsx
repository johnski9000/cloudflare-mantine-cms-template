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
  Button,
  GridCol,
} from "@mantine/core";
import { IconClipboardCheck, IconArrowRight } from "@tabler/icons-react";
import { igniteImage, igniteString } from "defaultprops";

export const serviceProcessCardProps = {
  imageUrl: igniteImage(
    "https://images.unsplash.com/photo-1581092160562-40aa08e78837?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
  ),
  imageAlt: igniteString(
    "Professional surveyor conducting detailed property inspection"
  ),
  badgeText: igniteString("OUR SURVEY PROCESS"),
  title: igniteString("What Can I Expect from my Building Survey?"),
  description: igniteString(
    "The format of our varied Buildings Surveys is consistent with the Residential Property Surveyors Association's Survey Inspection and Reporting Standards Edition 1 v5.2 and the RICS Home Survey Standard which came into effect on 1 March 2021. Our survey reports use a clear '1, 2, 3' rating system, in an easy-to-read format, with relevant supporting images."
  ),
  emphasisText: igniteString(
    "Survey reports provide clear, concise and jargon free reporting on the condition of a domestic property, advising on existing defects, and dependent upon the level of desired survey, whether there are potential hidden problems which should be investigated further."
  ),
  additionalInfo: igniteString(
    "In order to carry out a thorough inspection at height, such as roofing inspections, we utilise state of the art technology to achieve the desired result. Where necessary, a camera drone survey may be carried out at the surveyor's discretion to facilitate inspection of any high level or hard to access areas; hidden defects can be serious and costly to repair. Our drone operator is insured and registered with the Civil Aviation Authority (CAA). Drone surveys area subject to weather conditions, and carried out in accordance with law and local regulations."
  ),
  callToActionText: igniteString(
    "Following instruction, we aim to inspect the property and compile an individually tailored report within 5 working days. The report is comprehensive, and clear, broken down in to individual sections and summaries, all supported with detailed images to supplement any important findings. Our survey reports will give you the confidence to move forwards with your property journey!"
  ),
  buttonText: igniteString("Get Your Survey"),
  buttonLink: igniteString("/services"),
};

const getYouTubeEmbedUrl = (url) => {
  const videoId = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/
  );
  return videoId ? `https://www.youtube.com/embed/${videoId[1]}` : url;
};
export default function ServiceProcessCard(props) {
  const mergedProps = { props };
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
            {/* <Image
              src={mergedProps.imageUrl.value}
              alt={mergedProps.imageAlt.value}
              //   src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
              //   alt="Professional surveyor conducting detailed property inspection"
              fill
              style={{ objectFit: "cover" }}
            /> */}
            <iframe
              src={getYouTubeEmbedUrl("https://youtu.be/CYOKuDw858c")}
              title="Company Video"
              className="w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </GridCol>
        <GridCol span={{ base: 12, md: 6 }}>
          <Stack p="xl" h="100%" justify="center" gap="lg" bg="gray.0">
            <Group>
              <ThemeIcon size="lg" variant="light" color="violet">
                <IconClipboardCheck size={20} />
              </ThemeIcon>
              <div>
                <Badge variant="light" color="violet" size="sm">
                  {/* OUR SERVICE */}
                  {mergedProps.badgeText.value || "OUR SERVICE"}
                </Badge>
                <Title order={3} mt={4}>
                  {/* Tailored Property Inspection and Reporting */}
                  {mergedProps.title.value ||
                    "Tailored Property Inspection and Reporting"}
                </Title>
              </div>
            </Group>

            <Text c="dimmed" size="md">
              {mergedProps.description.value ||
                "We provide a comprehensive property inspection service, tailored to your specific needs. Our qualified surveyor will visit the property and conduct a thorough inspection, identifying any potential issues or areas of concern."}
              <Text component="span" fw={600} c="violet">
                {" "}
                {mergedProps.emphasisText.value ||
                  "This inspection is not a standard valuation report."}
              </Text>
              .
            </Text>

            <Text c="dimmed" size="md">
              {mergedProps.additionalInfo.value ||
                "Our service includes a detailed report with high-quality images, highlighting any issues found during the inspection. We also offer a personal consultation to discuss the findings and answer any questions you may have."}
            </Text>

            <Card withBorder radius="md" p="sm" bg="violet.0">
              <Text size="sm" fw={500} c="violet.7">
                {mergedProps.callToActionText.value ||
                  "Ready to ensure your property is in top condition? Contact us today to schedule your tailored inspection and receive a comprehensive report."}
              </Text>
            </Card>

            <Group mt="md">
              <Button
                component={Link}
                // href="/contact"
                href={mergedProps.buttonLink || "/contact"}
                size="md"
                rightSection={<IconArrowRight size={16} />}
              >
                {mergedProps.buttonText.value || "Contact Us"}
              </Button>
            </Group>
          </Stack>
        </GridCol>
      </Grid>
    </Card>
  );
}
