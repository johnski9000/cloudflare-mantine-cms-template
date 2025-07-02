"use client";
import { useState } from "react";
import { Container, Button, Text, Flex, Box, Group } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { FaCalendarAlt } from "react-icons/fa";
import { igniteString, igniteArray, igniteImage } from "defaultprops";
export const BookingBannerProps = {
  id: igniteString("orlando-theme-park-booking-banner"),
  title: igniteString("Book Orlando Florida Theme Park Tickets"),
  description: igniteString(
    "Save up to 40% on authentic Disney World, Universal Orlando, SeaWorld, and Central Florida attraction tickets. Guaranteed lowest prices with instant delivery and expert Orlando vacation planning."
  ),
  checkInLabel: igniteString("Visit Date"),
  checkOutLabel: igniteString("Return Date"),
  bookNowLabel: igniteString("Find Best Deals"),
  bottomDescription: igniteString(
    "Experience the magic of Orlando's world-famous theme parks with guaranteed authentic tickets at unbeatable prices. From Disney World's four magical parks to Universal's thrilling attractions, create unforgettable memories with Florida's premier discount ticket specialists."
  ),
  backgroundImage: igniteImage(
    "https://media-cdn.tripadvisor.com/media/photo-m/1280/29/bd/c2/fd/caption.jpg"
  ),

  stats: igniteArray([
    {
      label: igniteString("30+ Orlando Attractions Available"),
    },
    {
      label: igniteString("50,000+ Happy Families Served"),
    },
    {
      label: igniteString("Up to 40% Savings Guaranteed"),
    },
  ]),
};
// export const BookingBannerProps = {
//   id: igniteString("booking-banner"),
//   title: igniteString("Book Your Dream Stay"),
//   description: igniteString(
//     "Discover luxury accommodations and exclusive offers for your next getaway. Experience unparalleled comfort and service."
//   ),
//   checkInLabel: igniteString("Check In"),
//   checkOutLabel: igniteString("Check Out"),
//   bookNowLabel: igniteString("Book Now"),
//   bottomDescription: igniteString(
//     "Experience the epitome of luxury with our exclusive hotel offerings. From world-class amenities to personalized services, we ensure your stay is nothing short of extraordinary."
//   ),
//   backgroundImage: igniteImage(
//     "https://media-cdn.tripadvisor.com/media/photo-m/1280/29/bd/c2/fd/caption.jpg"
//   ),

//   stats: igniteArray([
//     {
//       label: igniteString("100+ Destinations Available"),
//     },
//     {
//       label: igniteString("90+ Happy Customers"),
//     },
//     {
//       label: igniteString("50+ Luxury Hotels"),
//     },
//   ]),
// };

export default function BookingBanner(props) {
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const mergedProps = { ...props };

  const handleCheckInChange = (date) => {
    setCheckInDate(date);
    // Automatically set check-out date to one day after check-in
    if (date) {
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);
      setCheckOutDate(nextDay);
    } else {
      setCheckOutDate(null);
    }
  };

  const handleCheckOutChange = (date) => {
    setCheckOutDate(date);
  };

  return (
    <section className="relative bg-cover min-h-screen">
      <div
        className="w-full min-h-screen bg-center bg-cover pt-40 md:pt-24 pb-18 overflow-hidden relative z-0 flex items-center justify-center bg-fixed"
        style={{
          backgroundImage: `url(${mergedProps.backgroundImage.value})`,
        }}
      >
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <Container size="lg" className="relative z-20 h-full">
          <Flex
            direction="column"
            justify="center"
            align="center"
            className="h-full"
          >
            {/* Header */}
            <Box className="text-center">
              <h1 className="!mx-auto text-center font-semibold text-4xl sm:text-5xl md:text-6xl text-white max-w-xl mb-4">
                {mergedProps.title.value}
              </h1>
              <Text className="text-lg !text-white mb-7 text-center">
                {mergedProps.description.value}
              </Text>
            </Box>

            {/* Booking Form */}
            <div className="p-4 flex flex-col md:flex-row items-center borderw-full sm:w-auto mx-auto mt-10 lg:mt-20 !gap-6">
              <Group
                gap={20}
                className="flex flex-col sm:flex-row items-center gap-6 sm:divide-x sm:w-auto"
                spacing="none"
              >
                {/* <Box className="flex flex-col items-start md:pr-4 w-full sm:w-auto">
                  <Text size="md" fw={500} c="white" pb={5}>
                    {mergedProps.checkInLabel.value}
                  </Text>
                  <DateInput
                    className="w-full sm:w-auto text-gray-400 bg-white"
                    value={checkInDate}
                    placeholder="Select Date"
                    minDate={new Date()}
                    rightSection={<FaCalendarAlt size={16} />}
                    onChange={handleCheckInChange}
                  />
                </Box>

                <Box className="flex flex-col items-start md:pr-4 md:pl-4 w-full sm:w-auto">
                  <Text size="md" fw={500} c="white" pb={5}>
                    {mergedProps.checkOutLabel.value}
                  </Text>
                  <DateInput
                    className="w-full sm:w-auto text-gray-400 bg-white"
                    value={checkOutDate}
                    onChange={handleCheckOutChange}
                    disabled={!checkInDate}
                    placeholder="Select Date"
                    minDate={checkInDate || new Date()}
                    rightSection={<FaCalendarAlt size={16} />}
                    classNames={{
                      input:
                        "bg-transparent text-white placeholder:text-gray-400 border-none",
                    }}
                  />
                </Box> */}

                <Button
                  size="lg"
                  radius="xl"
                  variant="gradient"
                  className="w-full sm:w-auto mt-4 sm:mt-0 mx-auto"
                >
                  {mergedProps.bookNowLabel.value}
                </Button>
              </Group>
            </div>

            {/* Footer Stats */}
            <Flex
              direction={{ base: "column", lg: "row" }}
              align={{ base: "center", lg: "center" }}
              justify="space-between"
              className="w-full mt-16 gap-10"
            >
              <Text
                size="md"
                c="white"
                className="max-w-2xl max-lg:text-center pr-10"
              >
                {mergedProps.bottomDescription.value}
              </Text>
              <Flex
                direction={{ base: "column", sm: "row" }}
                align="center"
                gap="xl"
                className="max-lg:justify-center"
              >
                {mergedProps.stats.value.map((stat, index) => (
                  <Box
                    key={index}
                    className="text-center text-white font-semibold"
                  >
                    <Text size="md" fw={500}>
                      {stat.label.value}
                    </Text>
                  </Box>
                ))}
              </Flex>
            </Flex>
          </Flex>
        </Container>
      </div>
    </section>
  );
}
