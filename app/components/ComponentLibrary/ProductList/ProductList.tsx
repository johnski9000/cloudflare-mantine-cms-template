"use client";
import React, { useState, useEffect, useMemo } from "react";
import {
  Card,
  Image,
  Text,
  Badge,
  Button,
  Group,
  Container,
  Title,
  Grid,
  Loader,
  Alert,
  TextInput,
  Select,
  RangeSlider,
  Paper,
  Flex,
  ActionIcon,
  Stack,
  Box,
} from "@mantine/core";
import {
  FiShoppingCart,
  FiAlertCircle,
  FiSearch,
  FiFilter,
  FiX,
  FiUsers,
  FiClock,
  FiMapPin,
} from "react-icons/fi";
import { useBasket } from "@/app/context/BasketContext";

interface Product {
  product_id: string;
  title: string;
  description: string;
  image: string;
  price: number;
  adultPrice?: number;
  childPrice?: number;
  offersTitle?: string;
  offersDescription?: string;
  freeGift?: string[];
  offersList?: Array<{ name: string; price: number }>;
  calendarActive?: boolean;
  seasonPrices?: Array<{
    color: string;
    seasonName: string;
    adultPrice: number;
    childPrice: number;
  }>;
}

interface ApiResponse {
  success: boolean;
  count: number;
  data: Product[];
  error?: string;
}

export default function StoreListPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Basket context - only need currency and totalItems for display
  const { totalItems, currency } = useBasket();

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<string>("title");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [showFilters, setShowFilters] = useState(false);

  // Get min and max prices from products
  const priceExtents = useMemo(() => {
    if (products.length === 0) return [0, 1000];
    const prices = products.map((p) => p.price || p.adultPrice || 0);
    return [Math.floor(Math.min(...prices)), Math.ceil(Math.max(...prices))];
  }, [products]);

  // Update price range when products load
  useEffect(() => {
    if (products.length > 0) {
      setPriceRange(priceExtents as [number, number]);
    }
  }, [priceExtents]);

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    let filtered = products.filter((product) => {
      const matchesSearch =
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const productPrice = product.price || product.adultPrice || 0;
      const matchesPrice =
        productPrice >= priceRange[0] && productPrice <= priceRange[1];
      return matchesSearch && matchesPrice;
    });

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          const priceA = a.price || a.adultPrice || 0;
          const priceB = b.price || b.adultPrice || 0;
          return priceA - priceB;
        case "price-high":
          const priceA2 = a.price || a.adultPrice || 0;
          const priceB2 = b.price || b.adultPrice || 0;
          return priceB2 - priceA2;
        case "title":
        default:
          return a.title.localeCompare(b.title);
      }
    });

    return filtered;
  }, [products, searchTerm, sortBy, priceRange]);

  const clearFilters = () => {
    setSearchTerm("");
    setSortBy("title");
    setPriceRange(priceExtents as [number, number]);
  };

  const hasActiveFilters =
    searchTerm !== "" ||
    sortBy !== "title" ||
    priceRange[0] !== priceExtents[0] ||
    priceRange[1] !== priceExtents[1];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/products");

        if (!response.ok) {
          throw new Error(`Failed to fetch products: ${response.status}`);
        }

        const data: ApiResponse = await response.json();

        if (data.success) {
          setProducts(data.data);
        } else {
          throw new Error(data.error || "Failed to fetch products");
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch products"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Product list item component
  const ProductListItem = ({ product }: { product: Product }) => {
    // Determine if package is available (has pricing)
    const isActive =
      (product.adultPrice && product.adultPrice > 0) ||
      (product.childPrice && product.childPrice > 0) ||
      (product.price && product.price > 0);

    // Get the best offer price if available
    const bestOffer =
      product.offersList?.length > 0
        ? Math.min(...product.offersList.map((offer) => offer.price))
        : null;

    // Determine display price (adult price, or best offer, or child price, or regular price)
    const displayPrice =
      product.adultPrice ||
      bestOffer ||
      product.childPrice ||
      product.price ||
      0;
    const originalPrice =
      bestOffer && product.adultPrice ? product.adultPrice : null;

    const hasDiscount = originalPrice && originalPrice > displayPrice;
    const discountPercent = hasDiscount
      ? Math.round(((originalPrice - displayPrice) / originalPrice) * 100)
      : 0;

    return (
      <Card
        shadow="sm"
        padding="lg"
        radius="md"
        withBorder
        className="transition-all duration-300 hover:shadow-lg hover:scale-[1.02] cursor-pointer"
        component="a"
        href={`/ticket/${product.product_id}`}
      >
        <Grid gutter="md" align="center">
          {/* Image Section */}
          <Grid.Col xs={12} sm={4} md={3}>
            <div className="relative">
              <Image
                src={
                  product.image ||
                  "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop"
                }
                height={200}
                alt={product.title}
                fit="cover"
                className="object-cover rounded-lg"
                fallbackSrc="https://via.placeholder.com/300x200?text=No+Image"
              />

              {/* Badges on Image */}
              <div className="absolute top-2 left-2 flex flex-col gap-1">
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
          </Grid.Col>

          {/* Content Section */}
          <Grid.Col xs={12} sm={8} md={6}>
            <Stack spacing="sm">
              <Title
                order={3}
                className="text-gray-900 font-semibold leading-tight hover:text-indigo-600 transition-colors duration-300"
              >
                {product.title}
              </Title>

              {/* Package details */}
              <div className="flex flex-wrap gap-3 text-sm text-gray-500">
                {product.adultPrice && product.childPrice && (
                  <div className="flex items-center gap-1">
                    <FiUsers size={14} />
                    <span>Adults & Children</span>
                  </div>
                )}

                {product.calendarActive && (
                  <div className="flex items-center gap-1">
                    <FiClock size={14} />
                    <span>Flexible Dates</span>
                  </div>
                )}

                {product.seasonPrices?.length > 0 && (
                  <div className="flex items-center gap-1">
                    <FiMapPin size={14} />
                    <span>Seasonal Pricing</span>
                  </div>
                )}
              </div>

              {/* Description */}
              <Text size="sm" color="dimmed" className="line-clamp-3">
                {product.description}
              </Text>

              {/* Free Gifts Display */}
              {product.freeGift?.length > 0 && (
                <div>
                  <Text size="sm" color="blue" className="font-medium mb-1">
                    Includes:
                  </Text>
                  <Text size="sm" color="dimmed">
                    {product.freeGift.join(", ")}
                  </Text>
                </div>
              )}

              {/* Offers Description */}
              {product.offersDescription && (
                <Text size="sm" color="dimmed" className="italic">
                  {product.offersDescription}
                </Text>
              )}
            </Stack>
          </Grid.Col>

          {/* Price and Action Section */}
          <Grid.Col xs={12} sm={12} md={3}>
            <div className="text-center md:text-right">
              {/* Price Display */}
              <div className="mb-4">
                {hasDiscount && (
                  <Text
                    size="sm"
                    td="line-through"
                    color="dimmed"
                    className="mb-1"
                  >
                    {currency}
                    {originalPrice}
                  </Text>
                )}
                <Group spacing="xs" className="md:justify-end">
                  <Text
                    size="xl"
                    weight={700}
                    className="text-indigo-600 font-bold"
                  >
                    From {currency}
                    {displayPrice.toFixed(2)}
                  </Text>
                  {/* <Text size="sm" color="dimmed">
                    {product.adultPrice && product.childPrice
                      ? "from"
                      : "per person"}
                  </Text> */}
                </Group>

                {/* Show price breakdown if both adult and child prices exist */}
                {product.adultPrice && product.childPrice && (
                  <Group
                    spacing="md"
                    className="mt-2 justify-center md:justify-end"
                  >
                    <Text size="xs" color="dimmed">
                      Adult: {currency}
                      {product.adultPrice}
                    </Text>
                    <Text size="xs" color="dimmed">
                      Child: {currency}
                      {product.childPrice}
                    </Text>
                  </Group>
                )}
              </div>

              {/* Action Button */}
              <Button
                variant={isActive ? "gradient" : "outline"}
                gradient={isActive ? { from: "indigo", to: "blue" } : undefined}
                color={isActive ? undefined : "gray"}
                size="md"
                radius="md"
                fullWidth
                disabled={!isActive}
                leftSection={<FiShoppingCart size="1rem" />}
                className={`font-semibold transition-all duration-300 ${
                  isActive
                    ? "hover:shadow-lg hover:shadow-indigo-200"
                    : "cursor-not-allowed"
                }`}
              >
                {isActive ? "View Details" : "Unavailable"}
              </Button>
            </div>
          </Grid.Col>
        </Grid>
      </Card>
    );
  };

  if (loading) {
    return (
      <Container size="xl" className="py-8">
        <div className="flex justify-center items-center min-h-64">
          <div className="text-center">
            <Loader size="lg" className="mb-4" />
            <Text size="lg" c="dimmed">
              Loading products...
            </Text>
          </div>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container size="xl" className="py-8">
        <Alert
          icon={<FiAlertCircle size="1rem" />}
          title="Error"
          color="red"
          className="max-w-md mx-auto"
        >
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container size="xl" className="py-8 pt-20">
      <div className="mb-8 text-center">
        <Title order={1} className="text-4xl font-bold text-gray-800 mb-2">
          Our Store
        </Title>
        <Text size="lg" c="dimmed" className="max-w-2xl !mx-auto">
          Discover our amazing collection of products
        </Text>

        {/* Basket Summary */}
        {totalItems > 0 && (
          <Badge
            size="xl"
            variant="gradient"
            gradient={{ from: "green", to: "teal" }}
            className="mt-4"
          >
            {totalItems} {totalItems === 1 ? "item" : "items"} in basket
          </Badge>
        )}
      </div>

      {/* Filters Section */}
      <Paper shadow="sm" radius="md" className="mb-6 p-4">
        <Flex justify="space-between" align="center" className="mb-4">
          <Group>
            <Badge size="lg" variant="light">
              {filteredProducts.length} of {products.length}{" "}
              {products.length === 1 ? "Product" : "Products"}
            </Badge>
            {hasActiveFilters && (
              <Button
                variant="subtle"
                size="sm"
                leftSection={<FiX size="0.9rem" />}
                onClick={clearFilters}
              >
                Clear Filters
              </Button>
            )}
          </Group>
          <ActionIcon
            variant="subtle"
            size="lg"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FiFilter />
          </ActionIcon>
        </Flex>

        {/* Search Bar - Always Visible */}
        <div className="mb-4">
          <TextInput
            placeholder="Search products..."
            leftSection={<FiSearch size="1rem" />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="md"
            className="max-w-md"
          />
        </div>

        {/* Collapsible Filters */}
        {showFilters && (
          <Grid gutter="md" className="mt-4">
            <Grid.Col xs={12} sm={6} md={4}>
              <Select
                label="Sort by"
                value={sortBy}
                onChange={(value) => setSortBy(value || "title")}
                data={[
                  { value: "title", label: "Name (A-Z)" },
                  { value: "price-low", label: "Price (Low to High)" },
                  { value: "price-high", label: "Price (High to Low)" },
                ]}
              />
            </Grid.Col>

            <Grid.Col xs={12} sm={6} md={4}>
              <div>
                <Text size="sm" fw={500} className="mb-2">
                  Price Range: {currency}
                  {priceRange[0]} - {currency}
                  {priceRange[1]}
                </Text>
                <RangeSlider
                  min={priceExtents[0]}
                  max={priceExtents[1]}
                  step={1}
                  value={priceRange}
                  onChange={setPriceRange}
                  marks={[
                    {
                      value: priceExtents[0],
                      label: `${currency}${priceExtents[0]}`,
                    },
                    {
                      value: priceExtents[1],
                      label: `${currency}${priceExtents[1]}`,
                    },
                  ]}
                />
              </div>
            </Grid.Col>
          </Grid>
        )}
      </Paper>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-16">
          <Text size="xl" c="dimmed">
            {products.length === 0
              ? "No products available at the moment"
              : "No products match your current filters"}
          </Text>
          {hasActiveFilters && (
            <Button variant="light" onClick={clearFilters} className="mt-4">
              Clear all filters
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductListItem key={product.product_id} product={product} />
          ))}
        </div>
      )}
    </Container>
  );
}
