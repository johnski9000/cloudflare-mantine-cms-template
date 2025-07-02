"use client";
import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  Image,
  Badge,
  Title,
  Text,
  Group,
  Stack,
  Container,
  Box,
  Loader,
  Alert,
} from "@mantine/core";
import { FiUsers, FiClock, FiMapPin, FiAlertCircle } from "react-icons/fi";
import { igniteString, igniteArray } from "defaultprops";

// Product interface matching your new structure
interface Product {
  id: string;
  title: string;
  description: string;
  adultPrice?: number;
  childPrice?: number;
  offersTitle?: string;
  offersDescription?: string;
  image?: string | null;
  freeGift: string[];
  offersList: Array<{ name: string; price: number }>;
  calendarActive: boolean;
  seasonPrices: Array<{
    color: string;
    seasonName: string;
    adultPrice: number;
    childPrice: number;
  }>;
}

export const PackageGridProps = {
  id: igniteString("orlando-tickets-grid"),

  badge: igniteString("Best Selling Tickets"),
  title: igniteString("Top Orlando Theme Park Tickets In"),
  titleHighlight: igniteString("Florida"),
  description: igniteString(
    "Discover our hand-picked selection of the most popular Orlando theme park tickets, each offering magical experiences and unforgettable memories. Save up to 40% on authentic Disney World, Universal Studios, and SeaWorld tickets with our exclusive deals!"
  ),

  buttonTextActive: igniteString("Buy Tickets"),
  buttonTextInactive: igniteString("Sold Out"),
  buttonUrl: igniteString("/store"),
  currency: igniteString("$"),

  // Array of product IDs to display
  packageIds: igniteArray([
    { id: igniteString("1986") },
    { id: igniteString("1986") },
    { id: igniteString("1986") },
  ]),
};
const PackageCard = ({ product, mergedProps }) => {
  // Determine if package is available (has pricing)
  const isActive =
    (product.adultPrice && product.adultPrice > 0) ||
    (product.childPrice && product.childPrice > 0);

  // Get the best offer price if available
  const bestOffer =
    product.offersList?.length > 0
      ? Math.min(...product.offersList.map((offer) => offer.price))
      : null;

  // Determine display price (adult price, or best offer, or child price)
  const displayPrice =
    product.adultPrice || bestOffer || product.childPrice || 0;
  const originalPrice =
    bestOffer && product.adultPrice ? product.adultPrice : null;

  const hasDiscount = originalPrice && originalPrice > displayPrice;
  const discountPercent = hasDiscount
    ? Math.round(((originalPrice - displayPrice) / originalPrice) * 100)
    : 0;

  return (
    <Card
      shadow="lg"
      padding={0}
      radius="xl"
      className="group overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 bg-white border border-gray-100 h-full flex flex-col"
    >
      {/* Image Section */}
      <div className="relative overflow-hidden">
        <Image
          src={
            product.image ||
            "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop"
          }
          alt={`${product.title} image`}
          height={240}
          className="transition-transform duration-700 group-hover:scale-110 w-full object-cover"
          fit="cover"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {!isActive && (
            <Badge
              color="red"
              variant="filled"
              size="sm"
              className="font-semibold shadow-lg"
            >
              Unavailable
            </Badge>
          )}

          {product.offersTitle && (
            <Badge
              color="yellow"
              variant="filled"
              size="sm"
              className="font-semibold shadow-lg"
            >
              {product.offersTitle}
            </Badge>
          )}

          {hasDiscount && (
            <Badge
              color="green"
              variant="filled"
              size="sm"
              className="font-semibold shadow-lg"
            >
              -{discountPercent}%
            </Badge>
          )}

          {product.freeGift?.length > 0 && (
            <Badge
              color="blue"
              variant="filled"
              size="sm"
              className="font-semibold shadow-lg"
            >
              Free Gifts
            </Badge>
          )}
        </div>
      </div>

      {/* Content Section */}
      <Box p="lg" className="flex-1 flex flex-col">
        <Stack spacing="md" className="h-full">
          {/* Title */}
          <Title
            order={4}
            className="text-gray-900 font-semibold leading-tight group-hover:text-indigo-600 transition-colors duration-300 text-base sm:text-lg"
          >
            {product.title}
          </Title>

          {/* Package details - showing available info */}
          <div className="flex flex-wrap gap-2 text-xs sm:text-sm text-gray-500">
            {product.adultPrice && product.childPrice && (
              <div className="flex items-center gap-1">
                <FiUsers size={12} />
                <span>Adults & Children</span>
              </div>
            )}

            {product.calendarActive && (
              <div className="flex items-center gap-1">
                <FiClock size={12} />
                <span>Flexible Dates</span>
              </div>
            )}

            {product.seasonPrices?.length > 0 && (
              <div className="flex items-center gap-1">
                <FiMapPin size={12} />
                <span>Seasonal Pricing</span>
              </div>
            )}
          </div>

          {/* Description */}
          {product.description && (
            <Text
              size="sm"
              color="dimmed"
              className="hidden sm:block line-clamp-2 flex-1"
            >
              {product.description}
            </Text>
          )}

          {/* Free Gifts Display */}
          {product.freeGift?.length > 0 && (
            <div className="hidden sm:block">
              <Text size="xs" color="blue" className="font-medium mb-1">
                Includes:
              </Text>
              <Text size="xs" color="dimmed" className="line-clamp-1">
                {product.freeGift.join(", ")}
              </Text>
            </div>
          )}

          {/* Offers Description */}
          {product.offersDescription && (
            <Text
              size="xs"
              color="dimmed"
              className="hidden sm:block line-clamp-1"
            >
              {product.offersDescription}
            </Text>
          )}

          {/* Price Display */}
          <div className="mt-auto">
            <div className="mb-3">
              {hasDiscount && (
                <Text
                  size="sm"
                  td="line-through"
                  color="dimmed"
                  className="mb-1"
                >
                  {mergedProps.currency.value}
                  {originalPrice}
                </Text>
              )}
              <Group spacing="xs" align="baseline">
                <Text
                  size="xl"
                  weight={700}
                  className="text-indigo-600 font-bold"
                >
                  {mergedProps.currency.value}
                  {displayPrice}
                </Text>
                <Text size="sm" color="dimmed">
                  {product.adultPrice && product.childPrice
                    ? "from"
                    : "per person"}
                </Text>
              </Group>

              {/* Show price breakdown if both adult and child prices exist */}
              {product.adultPrice && product.childPrice && (
                <Group spacing="md" className="mt-1">
                  <Text size="xs" color="dimmed">
                    Adult: {mergedProps.currency.value}
                    {product.adultPrice}
                  </Text>
                  <Text size="xs" color="dimmed">
                    Child: {mergedProps.currency.value}
                    {product.childPrice}
                  </Text>
                </Group>
              )}
            </div>

            {/* Main action button */}
            <Button
              component={isActive ? "a" : "div"}
              href={isActive ? `/store/${product.id}` : undefined}
              variant={isActive ? "gradient" : "outline"}
              gradient={isActive ? { from: "indigo", to: "blue" } : undefined}
              color={isActive ? undefined : "gray"}
              size="md"
              radius="md"
              fullWidth
              disabled={!isActive}
              className={`font-semibold transition-all duration-300 ${
                isActive
                  ? "hover:shadow-lg hover:shadow-indigo-200"
                  : "cursor-not-allowed"
              }`}
            >
              {isActive
                ? mergedProps.buttonTextActive.value
                : mergedProps.buttonTextInactive.value}
            </Button>
          </div>
        </Stack>
      </Box>
    </Card>
  );
};

export default function PackageGrid(props) {
  const mergedProps = { ...PackageGridProps, ...props };
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all products
        const response = await fetch("/api/products");
        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || "Failed to fetch products");
        }
        console.log("Fetched products:", data);
        console.log(mergedProps.packageIds);
        // Filter products based on the packageIds
        const requestedIds = mergedProps.packageIds.value.map((item) => {
          return item.id.value;
        });
        console.log("Requested package IDs:", requestedIds);
        const filteredProducts = data.data.filter((product: Product) =>
          requestedIds.includes(product.id)
        );
        console.log("Filtered products:", filteredProducts);

        // Sort products in the same order as packageIds
        const sortedProducts = requestedIds
          .map((id) =>
            filteredProducts.find((product: Product) => product.id === id)
          )
          .filter(Boolean) as Product[];
        console.log("Sorted products:", sortedProducts);

        setProducts(sortedProducts);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load packages"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [mergedProps.packageIds.value]);

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-br from-gray-50 via-white to-indigo-50/30">
        <Container size="xl" className="text-center">
          <Loader size="lg" />
          <Text className="mt-4">Loading packages...</Text>
        </Container>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-gradient-to-br from-gray-50 via-white to-indigo-50/30">
        <Container size="xl">
          <Alert
            icon={<FiAlertCircle size="1rem" />}
            title="Error Loading Packages"
            color="red"
            className="max-w-md mx-auto"
          >
            {error}
          </Alert>
        </Container>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section className="py-16 bg-gradient-to-br from-gray-50 via-white to-indigo-50/30">
        <Container size="xl" className="text-center">
          <Text color="dimmed">No packages found</Text>
        </Container>
      </section>
    );
  }

  return (
    <section
      className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-gray-50 via-white to-indigo-50/30 relative overflow-hidden"
      id={mergedProps.id.value}
    >
      {/* Enhanced Background Decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(79,70,229,0.05),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(139,92,246,0.05),transparent_50%)]" />
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

      <Container size="xl" className="relative z-10 px-4 sm:px-6 lg:px-8">
        <Stack spacing="xl" align="center">
          {/* Enhanced Header Section */}
          <div className="text-center max-w-4xl mx-auto">
            <Badge
              size="lg"
              variant="gradient"
              gradient={{ from: "orange", to: "red" }}
              className="mb-6 sm:mb-8 font-semibold tracking-wide"
            >
              {mergedProps.badge.value}
            </Badge>

            <Title
              order={1}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight mb-4 sm:mb-6"
            >
              {mergedProps.title.value}{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent italic font-extrabold">
                {mergedProps.titleHighlight.value}
              </span>
            </Title>

            <Text
              size="md"
              color="dimmed"
              className="text-sm sm:text-base lg:text-lg max-w-3xl mx-auto leading-relaxed px-4"
            >
              {mergedProps.description.value ||
                "Explore our top-rated Orlando theme park tickets, designed for unforgettable family adventures and magical experiences in Florida."}
            </Text>
          </div>

          {/* Enhanced Packages Grid - Fully Responsive */}
          <div className="w-full mt-8 sm:mt-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-7xl mx-auto">
              {products.map((product, index) => (
                <div
                  key={index}
                  className="animate-fade-in-up w-full"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <PackageCard product={product} mergedProps={mergedProps} />
                </div>
              ))}
            </div>
          </div>

          {/* Enhanced Call to Action - Responsive */}
          <div className="text-center mt-12 sm:mt-16 lg:mt-20 p-6 sm:p-8 bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-200 max-w-2xl mx-auto w-full">
            <Title
              order={3}
              className="text-lg sm:text-xl lg:text-2xl text-gray-800 mb-3 sm:mb-4"
            >
              Can't find what you're looking for?
            </Title>
            <Text size="sm" color="dimmed" className="mb-4 sm:mb-6 px-2">
              Browse our complete collection of packages or contact us for a
              custom experience.
            </Text>
            <div className="pt-4 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
              <Button
                variant="outline"
                size="md"
                radius="md"
                className="font-semibold hover:bg-indigo-50 border-indigo-200 text-indigo-600 w-full sm:w-auto"
                component="a"
                href="/store"
              >
                View All Packages
              </Button>
              <Button
                variant="gradient"
                gradient={{ from: "indigo", to: "blue" }}
                size="md"
                radius="md"
                className="font-semibold w-full sm:w-auto"
                component="a"
                href="/contact"
              >
                Contact Us
              </Button>
            </div>
          </div>
        </Stack>
      </Container>

      {/* Add custom CSS for animations */}
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
          opacity: 0;
        }

        @media (max-width: 640px) {
          .line-clamp-1 {
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }

          .line-clamp-2 {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
        }
      `}</style>
    </section>
  );
}
