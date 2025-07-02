"use client";
import React, { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Button,
  Drawer,
  Group,
  Stack,
  Divider,
  Text,
  ActionIcon,
  Badge,
  Tooltip,
  Paper,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { HiMenu, HiPhone, HiMail, HiShoppingBag } from "react-icons/hi";
import { FiPlus, FiMinus, FiTrash2, FiCalendar, FiUsers } from "react-icons/fi";
import { useBasket } from "@/app/context/BasketContext";
import {
  igniteString,
  igniteArray,
  igniteImage,
  igniteBoolean,
} from "defaultprops";

export const CenteredLogoNavigationProps = {
  id: igniteString("centered-logo-navigation"),

  logo: igniteImage("/logo-placeholder-image.png"),

  menuItems: igniteArray([
    {
      label: igniteString("Home"),
      href: igniteString("/"),
      hasDropdown: igniteBoolean(false),
      dropdownItems: igniteArray([
        {
          label: igniteString("Store"),
          href: igniteString("/store"),
          description: igniteString("description"),
        },
      ]),
    },
    {
      label: igniteString("About Us"),
      href: igniteString("/about"),
      hasDropdown: igniteBoolean(false),
      dropdownItems: igniteArray([
        {
          label: igniteString("Store"),
          href: igniteString("/store"),
          description: igniteString("description"),
        },
      ]),
    },
    {
      label: igniteString("Products"),
      href: igniteString("/products"),
      hasDropdown: igniteBoolean(false),
      dropdownItems: igniteArray([
        {
          label: igniteString("Store"),
          href: igniteString("/store"),
          description: igniteString("description"),
        },
      ]),
    },
    {
      label: igniteString("Features"),
      href: igniteString("/features"),
      hasDropdown: igniteBoolean(false),
      dropdownItems: igniteArray([
        {
          label: igniteString("Store"),
          href: igniteString("/store"),
          description: igniteString("description"),
        },
      ]),
    },
  ]),

  ctaText: igniteString("Sign Up"),
  ctaHref: igniteString("/signup"),
  ecommerce: igniteBoolean(true),
};

export default function CenteredLogoNavigation(props) {
  const mergedProps = props.isPreview
    ? CenteredLogoNavigationProps
    : { ...props };

  const [opened, { open, close }] = useDisclosure(false);
  const [basketDrawerOpened, { open: openBasket, close: closeBasket }] =
    useDisclosure(false);
  const [openDropdowns, setOpenDropdowns] = useState({});

  // Use the basket context
  const {
    items: basketItems,
    totalItems,
    finalTotal: totalPrice,
    currency,
    updateQuantity,
    removeItem,
    clearBasket,
  } = useBasket();

  // Add ref for dropdown container
  const dropdownRef = useRef(null);

  // Check if ecommerce is enabled
  const isEcommerceEnabled = mergedProps.ecommerce?.value ?? true;

  // Dropdown functions
  const toggleDropdown = (index) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const closeAllDropdowns = () => {
    setOpenDropdowns({});
  };

  const BasketIcon = () => (
    <ActionIcon
      size="lg"
      variant="subtle"
      onClick={openBasket}
      className={`relative transition-colors duration-300 !overflow-visible text-gray-700 hover:text-indigo-600`}
    >
      <HiShoppingBag size={24} />
      {totalItems > 0 && (
        <Badge
          size="sm"
          variant="filled"
          color="red"
          className="absolute -top-2 -right-2 min-w-[20px] h-5 flex items-center justify-center text-xs font-bold"
        >
          {totalItems > 99 ? "99+" : totalItems}
        </Badge>
      )}
    </ActionIcon>
  );

  const BasketItemCard = ({ item }) => {
    // Calculate item display price
    const itemTotal =
      (item.finalAdultPrice * item.numAdults +
        item.finalChildPrice * item.numChildren) *
      item.quantity;
    const offerTotal = item.selectedOffer
      ? item.selectedOffer.price * item.quantity
      : 0;
    const displayTotal = itemTotal + offerTotal;

    return (
      <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 hover:shadow-md transition-shadow">
        <div className="flex gap-3">
          <img
            src={item.image}
            alt={item.title}
            className="w-16 h-16 object-cover rounded-md flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <Text size="sm" weight={500} className="truncate mb-1">
              {item.title}
            </Text>
            <Text size="xs" color="dimmed" className="mb-2 line-clamp-2">
              {item.description}
            </Text>

            {/* Booking Details */}
            <div className="space-y-1 mb-3">
              <Group spacing="xs" align="center">
                <FiUsers size={12} />
                <Text size="xs" color="dimmed">
                  {item.numAdults} Adults, {item.numChildren} Children
                </Text>
              </Group>

              {item.selectedDate && (
                <Group spacing="xs" align="center">
                  <FiCalendar size={12} />
                  <Text size="xs" color="dimmed">
                    {item.selectedDate.day}/{item.selectedDate.month}/
                    {item.selectedDate.year}
                    {item.selectedDate.seasonPrice && (
                      <Badge
                        variant="dot"
                        color="green"
                        size="xs"
                        className="ml-1"
                      >
                        {item.selectedDate.seasonPrice.seasonName}
                      </Badge>
                    )}
                  </Text>
                </Group>
              )}

              {item.selectedOffer && (
                <Text size="xs" color="blue">
                  + {item.selectedOffer.name} (£{item.selectedOffer.price})
                </Text>
              )}

              {item.selectedFreeGift && (
                <Text size="xs" color="green">
                  🎁 {item.selectedFreeGift}
                </Text>
              )}
            </div>

            {/* Pricing Display */}
            <div className="space-y-1 mb-3">
              <Text size="xs" color="dimmed">
                Adults: £{item.finalAdultPrice} × {item.numAdults} = £
                {(item.finalAdultPrice * item.numAdults).toFixed(2)}
              </Text>
              {item.numChildren > 0 && (
                <Text size="xs" color="dimmed">
                  Children: £{item.finalChildPrice} × {item.numChildren} = £
                  {(item.finalChildPrice * item.numChildren).toFixed(2)}
                </Text>
              )}
            </div>

            {/* Quantity Controls */}
            <Group spacing="xs" className="mb-2">
              <Badge variant="light" color="blue" size="sm" className="px-2">
                {item.quantity}
              </Badge>
            </Group>

            <Group position="apart" align="center">
              <Text size="sm" weight={600} color="indigo">
                {currency}
                {displayTotal.toFixed(2)}
              </Text>

              <Tooltip label="Remove item" position="top">
                <ActionIcon
                  size="sm"
                  variant="subtle"
                  color="red"
                  onClick={() => removeItem(item.product_id)}
                  className="hover:bg-red-50"
                >
                  <FiTrash2 size="0.75rem" />
                </ActionIcon>
              </Tooltip>
            </Group>
          </div>
        </div>

        {/* Guest Names (Collapsible) */}
        {(item.adultNames?.length > 0 || item.childrenNames?.length > 0) && (
          <Paper p="xs" mt="sm" bg="gray.1" radius="sm">
            <Text size="xs" weight={500} color="dimmed" mb="xs">
              Guest Names:
            </Text>
            <div className="space-y-1">
              {item.adultNames?.map((name, index) => (
                <Text key={`adult-${index}`} size="xs" color="dimmed">
                  Adult {index + 1}: {name}
                </Text>
              ))}
              {item.childrenNames?.map((name, index) => (
                <Text key={`child-${index}`} size="xs" color="dimmed">
                  Child {index + 1}: {name}
                </Text>
              ))}
            </div>
          </Paper>
        )}
      </div>
    );
  };

  const BasketDrawer = () => (
    <Drawer
      position="right"
      size="lg"
      opened={basketDrawerOpened}
      onClose={closeBasket}
      title={
        <Group position="apart" className="w-full">
          <Group>
            <HiShoppingBag size={20} />
            <Text weight={600}>Shopping Basket</Text>
          </Group>
          {basketItems.length > 0 && (
            <Button
              variant="subtle"
              color="red"
              size="xs"
              onClick={clearBasket}
              className="hover:bg-red-50"
            >
              Clear All
            </Button>
          )}
        </Group>
      }
      styles={{
        header: {
          padding: "1rem 1.5rem",
          borderBottom: "1px solid #e9ecef",
        },
        body: {
          padding: 0,
        },
      }}
    >
      <div className="h-full flex flex-col">
        {basketItems.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <HiShoppingBag size={48} className="text-gray-400 mb-4" />
            <Text size="lg" color="dimmed" className="mb-2">
              Your basket is empty
            </Text>
            <Text size="sm" color="dimmed">
              Add some items to get started
            </Text>
            <Button
              component={Link}
              href="/store"
              variant="light"
              className="mt-4"
              onClick={closeBasket}
            >
              Browse Products
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-4">
              <Stack spacing="md">
                {basketItems.map((item) => (
                  <BasketItemCard key={item.product_id} item={item} />
                ))}
              </Stack>
            </div>

            {/* Basket Summary Footer */}
            <div className="border-t bg-white p-4">
              <div className="space-y-3">
                <Group position="apart">
                  <Text size="sm" color="dimmed">
                    Items: {totalItems}
                  </Text>
                  <Text size="sm" color="dimmed">
                    Subtotal: {currency}
                    {totalPrice.toFixed(2)}
                  </Text>
                </Group>

                <Divider />

                <div className="flex justify-between items-center">
                  <Text weight={600} size="lg">
                    Total:
                  </Text>
                  <Text size="xl" weight={700} color="indigo">
                    {currency}
                    {totalPrice.toFixed(2)}
                  </Text>
                </div>

                <div className="space-y-2">
                  <Button
                    component={Link}
                    href="/checkout"
                    fullWidth
                    size="md"
                    variant="gradient"
                    gradient={{ from: "indigo", to: "blue" }}
                    onClick={closeBasket}
                  >
                    Proceed to Checkout
                  </Button>

                  <Button
                    component={Link}
                    href="/store"
                    fullWidth
                    variant="light"
                    size="sm"
                    onClick={closeBasket}
                  >
                    Continue Shopping
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </Drawer>
  );

  // Split menu items for left and right sides
  const halfLength = Math.ceil(mergedProps.menuItems.value.length / 2);
  const leftMenuItems = mergedProps.menuItems.value.slice(0, halfLength);
  const rightMenuItems = mergedProps.menuItems.value.slice(halfLength);

  return (
    <>
      <div className="w-full h-20" />
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white backdrop-blur-md shadow-lg border-b border-gray-200`}
        id={mergedProps.id.value}
      >
        <div className="text-center bg-gray-100 py-2">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex md:flex-row flex-col justify-center items-center space-x-6 text-sm text-gray-600">
              <a
                href="tel:+447488230720"
                className="flex items-center space-x-2 hover:text-indigo-600 transition-colors"
              >
                <HiPhone className="h-4 w-4" />
                <span>03306330137</span>
              </a>
              <div className="h-4 w-px bg-gray-300 hidden md:block"></div>
              <a
                href="mailto:Laura@letsbookflorida.co.uk"
                className="flex items-center space-x-2 hover:text-indigo-600 transition-colors"
              >
                <HiMail className="h-4 w-4" />
                <span>customerservice@letsbookflorida.com</span>
              </a>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Mobile Header */}
            <div className="flex lg:hidden w-full justify-between items-center">
              <Link href="/" className="flex items-center">
                <img
                  src={mergedProps.logo.value}
                  alt="logo"
                  className="h-12 w-auto"
                />
              </Link>
              <div className="flex items-center space-x-3">
                {/* Basket Icon - Only render if ecommerce is enabled */}
                {isEcommerceEnabled && <BasketIcon />}

                {/* Mobile menu toggle button */}
                <ActionIcon
                  size="lg"
                  variant="subtle"
                  className={`transition-colors duration-300 text-gray-700 hover:text-indigo-600`}
                  onClick={open}
                >
                  <HiMenu size={24} />
                </ActionIcon>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex w-full justify-between items-center">
              {/* Left Navigation */}
              <ul className="flex items-center flex-row gap-6 flex-1">
                {leftMenuItems.map((item, index) => (
                  <div key={index} className="relative">
                    {item.hasDropdown.value ? (
                      <div className="relative">
                        <button
                          onMouseEnter={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleDropdown(index);
                          }}
                          className={`px-3 py-2 !text-sm !font-semibold transition-all duration-300 hover:scale-105 flex items-center gap-1 text-gray-700 hover:text-indigo-600`}
                        >
                          {item.label.value}
                          <svg
                            className={`w-4 h-4 transition-transform duration-200 ${
                              openDropdowns[index] ? "rotate-180" : ""
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </button>

                        {/* Dropdown Menu */}
                        {openDropdowns[index] && (
                          <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 animate-in slide-in-from-top-2 duration-200">
                            {item.dropdownItems.value.map(
                              (dropdownItem, dropdownIndex) => (
                                <Link
                                  key={dropdownIndex}
                                  href={dropdownItem.href.value}
                                  className="block px-4 py-3 hover:bg-gray-50 transition-colors duration-200"
                                  onClick={() => {
                                    closeAllDropdowns();
                                  }}
                                >
                                  <div className="font-medium text-gray-900 text-sm">
                                    {dropdownItem.label.value}
                                  </div>
                                  {dropdownItem.description.value && (
                                    <div className="text-gray-500 text-xs mt-1">
                                      {dropdownItem.description.value}
                                    </div>
                                  )}
                                </Link>
                              )
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <Link
                        href={item.href.value}
                        className={`px-3 py-2 text-sm font-medium transition-all duration-300 hover:scale-105 text-gray-700 hover:text-indigo-600`}
                      >
                        {item.label.value}
                      </Link>
                    )}
                  </div>
                ))}
              </ul>

              {/* Centered Logo */}
              <Link href="/" className="flex items-center px-8">
                <img
                  src={mergedProps.logo.value}
                  alt="logo"
                  className="h-12 w-auto"
                />
              </Link>

              {/* Right Navigation + CTAs */}
              <div className="flex items-center justify-end flex-row gap-6 flex-1">
                <ul className="flex items-center flex-row gap-6">
                  {rightMenuItems.map((item, index) => (
                    <div key={halfLength + index} className="relative">
                      {item.hasDropdown.value ? (
                        <div className="relative">
                          <button
                            onMouseEnter={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              toggleDropdown(halfLength + index);
                            }}
                            className={`px-3 py-2 !text-sm !font-semibold transition-all duration-300 hover:scale-105 flex items-center gap-1 text-gray-700 hover:text-indigo-600`}
                          >
                            {item.label.value}
                            <svg
                              className={`w-4 h-4 transition-transform duration-200 ${
                                openDropdowns[halfLength + index]
                                  ? "rotate-180"
                                  : ""
                              }`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                          </button>

                          {/* Dropdown Menu */}
                          {openDropdowns[halfLength + index] && (
                            <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 animate-in slide-in-from-top-2 duration-200">
                              {item.dropdownItems.value.map(
                                (dropdownItem, dropdownIndex) => (
                                  <Link
                                    key={dropdownIndex}
                                    href={dropdownItem.href.value}
                                    className="block px-4 py-3 hover:bg-gray-50 transition-colors duration-200"
                                    onClick={() => {
                                      closeAllDropdowns();
                                    }}
                                  >
                                    <div className="font-medium text-gray-900 text-sm">
                                      {dropdownItem.label.value}
                                    </div>
                                    {dropdownItem.description.value && (
                                      <div className="text-gray-500 text-xs mt-1">
                                        {dropdownItem.description.value}
                                      </div>
                                    )}
                                  </Link>
                                )
                              )}
                            </div>
                          )}
                        </div>
                      ) : (
                        <Link
                          href={item.href.value}
                          className={`px-3 py-2 text-sm font-medium transition-all duration-300 hover:scale-105 text-gray-700 hover:text-indigo-600`}
                        >
                          {item.label.value}
                        </Link>
                      )}
                    </div>
                  ))}
                </ul>

                <div className="flex items-center gap-3 ml-4">
                  {/* Basket Icon - Only render if ecommerce is enabled */}
                  {isEcommerceEnabled && <BasketIcon />}

                  <Link href={mergedProps.ctaHref.value}>
                    <Button
                      variant="gradient"
                      radius="xl"
                      size="sm"
                      className="font-medium shadow-md hover:shadow-lg transition-shadow duration-300"
                    >
                      {mergedProps.ctaText.value}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Drawer */}
      <Drawer
        position="right"
        size="sm"
        opened={opened}
        onClose={close}
        title={
          <img
            src={mergedProps.logo.value}
            className="h-24 w-auto"
            alt="Logo"
          />
        }
        styles={{
          header: { backgroundColor: "white", color: "black" },
          body: { backgroundColor: "white", padding: "1.5rem" },
        }}
      >
        <Divider className="pb-2" />
        <Stack spacing="lg" className="h-full">
          {/* Navigation Links */}
          <Stack spacing="sm">
            {mergedProps.menuItems.value.map((item, index) => (
              <div key={index}>
                {item.hasDropdown.value ? (
                  <div>
                    <button
                      onClick={() => toggleDropdown(`mobile-${index}`)}
                      className="w-full flex items-center justify-between py-3 px-4 text-black rounded-lg transition-all duration-300 hover:bg-gray-800 hover:text-white"
                    >
                      <Text size="md" weight={500}>
                        {item.label.value}
                      </Text>
                      <svg
                        className={`w-4 h-4 transition-transform duration-200 ${
                          openDropdowns[`mobile-${index}`] ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                    {openDropdowns[`mobile-${index}`] && (
                      <div className="ml-4 mt-2 space-y-2">
                        {item.dropdownItems.value.map(
                          (dropdownItem, dropdownIndex) => (
                            <Link
                              key={dropdownIndex}
                              href={dropdownItem.href.value}
                              className="block py-2 px-4 text-sm text-gray-600 rounded-lg transition-all duration-300 hover:bg-gray-100"
                              onClick={close}
                            >
                              <div className="font-medium">
                                {dropdownItem.label.value}
                              </div>
                              {dropdownItem.description.value && (
                                <div className="text-xs text-gray-500 mt-1">
                                  {dropdownItem.description.value}
                                </div>
                              )}
                            </Link>
                          )
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href.value}
                    onClick={close}
                    className="block py-3 px-4 text-black rounded-lg transition-all duration-300 hover:bg-gray-800 hover:text-white"
                  >
                    <Text size="md" weight={500}>
                      {item.label.value}
                    </Text>
                  </Link>
                )}
              </div>
            ))}
          </Stack>

          <Divider />

          {/* Basket Summary - Only render if ecommerce is enabled */}
          {isEcommerceEnabled && (
            <div className="rounded-lg p-4">
              <Group position="apart" className="mb-2">
                <Text color="black" weight={500}>
                  Basket
                </Text>
                <Badge color="yellow" variant="filled">
                  {totalItems} items
                </Badge>
              </Group>
              <Text color="dimmed" size="sm" className="mb-3">
                Total: {currency}
                {totalPrice.toFixed(2)}
              </Text>
              <div className="space-y-2">
                <Button
                  fullWidth
                  variant="outline"
                  color="yellow"
                  size="sm"
                  onClick={() => {
                    close();
                    openBasket();
                  }}
                >
                  View Basket
                </Button>
                {totalItems > 0 && (
                  <Button
                    component={Link}
                    href="/checkout"
                    fullWidth
                    variant="filled"
                    color="yellow"
                    size="sm"
                    onClick={close}
                  >
                    Checkout
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Mobile CTA */}
          <div className="mt-auto">
            <Link href={mergedProps.ctaHref.value}>
              <Button
                fullWidth
                variant="gradient"
                size="md"
                className="font-medium"
                onClick={close}
              >
                {mergedProps.ctaText.value}
              </Button>
            </Link>
          </div>
        </Stack>
      </Drawer>

      {/* Basket Drawer - Only render if ecommerce is enabled */}
      {isEcommerceEnabled && <BasketDrawer />}
    </>
  );
}
