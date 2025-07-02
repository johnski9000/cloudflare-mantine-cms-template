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
  List,
  ListItem,
  GridCol,
} from "@mantine/core";
import { IconCalculator, IconArrowRight } from "@tabler/icons-react";
import { igniteArray, igniteImage, igniteString } from "defaultprops";

export const ResearchDataCardProps = {
  imageUrl: igniteImage(
    "https://images.unsplash.com/photo-1554469384-e58fac16e23a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
  ),
  imageAlt: igniteString(
    "Property survey cost savings and financial protection"
  ),
  imageFit: igniteString("contain"),
  badgeText: igniteString("WHICH TYPE OF SURVEY?"),
  title: igniteString("Which Type of Survey is Right For Me?"),
  introText: igniteString(
    "We offer a wide range of different surveys to fit both your budget and your needs. Properties come in all shapes, sizes, age and condition. Our qualified and experienced RPSA regulated surveyor will assist in determining the most suitable survey for you and your current or prospective new purchase. It is important to understand that the mortgage lenders valuation report is"
  ),
  emphasisText: igniteString("NOT a building survey"),
  researchTitle: igniteString("Anslow Building Surveyors are independent:"),
  dataPoints: igniteArray([
    {
      badge: igniteString("INDEPENDENT"),
      badgeColor: igniteString("green"),
      text: igniteString(
        "not affiliated with any lenders or banking institutions"
      ),
      amount: igniteString("We work"),
      amountColor: igniteString("green"),
      suffix: igniteString("independently for you!"),
    },
    {
      badge: igniteString("QUALIFIED"),
      badgeColor: igniteString("blue"),
      text: igniteString("RPSA regulated surveyor"),
      amount: igniteString("Experienced"),
      amountColor: igniteString("blue"),
      suffix: igniteString("& qualified professional"),
    },
    {
      badge: igniteString("TAILORED"),
      badgeColor: igniteString("purple"),
      text: igniteString("surveys to fit your budget"),
      amount: igniteString("Wide range"),
      amountColor: igniteString("purple"),
      suffix: igniteString("of survey options"),
    },
  ]),
  buttonText: igniteString("Find Your Survey"),
  buttonLink: igniteString("/services"),
};

export default function ResearchDataCard(props) {
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
        <GridCol span={{ base: 12, md: 6 }} order={{ base: 2, md: 1 }}>
          <Stack p="xl" h="100%" justify="center" gap="lg" bg="gray.0">
            <Group>
              <ThemeIcon size="lg" variant="light" color="green">
                <IconCalculator size={20} />
              </ThemeIcon>
              <div>
                <Badge variant="light" color="green" size="sm">
                  {mergedProps.badgeText.value}
                </Badge>
                <Title order={3} mt={4}>
                  {mergedProps.title.value}
                </Title>
              </div>
            </Group>

            <Text c="dimmed" size="md">
              {mergedProps.introText.value}
              <Text component="span" fw={600}>
                {" "}
                {mergedProps.emphasisText.value}
              </Text>
              .
            </Text>

            <div>
              <Text fw={600} mb="sm" c="dark">
                {mergedProps.researchTitle.value}
              </Text>
              <List
                spacing="xs"
                size="sm"
                icon={
                  <ThemeIcon color="red" size={20} radius="xl">
                    <Text size="xs" fw={700}>
                      !
                    </Text>
                  </ThemeIcon>
                }
              >
                {mergedProps.dataPoints.value.map((point, index) => (
                  <ListItem key={index}>
                    <Group gap="xs">
                      <Badge size="xs" color={point.badgeColor.value}>
                        {point.badge.value}
                      </Badge>
                      <Text size="sm">
                        {point.text.value}{" "}
                        <Text
                          component="span"
                          fw={700}
                          c={point.amountColor.value}
                        >
                          {point.amount.value}
                        </Text>{" "}
                        {point.suffix.value}
                      </Text>
                    </Group>
                  </ListItem>
                ))}
              </List>
            </div>

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
        <GridCol span={{ base: 12, md: 6 }} order={{ base: 1, md: 2 }}>
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
              style={{ objectFit: mergedProps.imageFit.value }}
            />
          </div>
        </GridCol>
      </Grid>
    </Card>
  );
}
