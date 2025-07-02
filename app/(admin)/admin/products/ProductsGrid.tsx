// app/admin/products/components/ProductsGrid.tsx
"use client";

import { useState } from "react";
import {
  Card,
  Group,
  Text,
  Button,
  Modal,
  TextInput,
  Textarea,
  NumberInput,
  LoadingOverlay,
  ActionIcon,
  Badge,
  Image,
  Grid as MantineGrid,
  Stack,
  Alert,
  Switch,
  Tabs,
  Divider,
  ColorPicker,
  Paper,
  CloseButton,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";

import { TiPlus } from "react-icons/ti";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { CiCircleAlert } from "react-icons/ci";
import { MdOutlineAddPhotoAlternate } from "react-icons/md";

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

interface ProductFormData {
  id: string;
  title: string;
  description: string;
  adultPrice: number;
  childPrice: number;
  offersTitle: string;
  offersDescription: string;
  image: string;
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

interface ProductsGridProps {
  products: Product[];
  loading: boolean;
  onProductsChange: () => void;
}

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export default function ProductsGrid({
  products,
  loading,
  onProductsChange,
}: ProductsGridProps) {
  const [createOpened, { open: openCreate, close: closeCreate }] =
    useDisclosure(false);
  const [editOpened, { open: openEdit, close: closeEdit }] =
    useDisclosure(false);
  const [deleteOpened, { open: openDelete, close: closeDelete }] =
    useDisclosure(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const createForm = useForm<ProductFormData>({
    initialValues: {
      id: "",
      title: "",
      description: "",
      adultPrice: 0,
      childPrice: 0,
      offersTitle: "",
      offersDescription: "",
      image: "",
      freeGift: [],
      offersList: [],
      calendarActive: false,
      seasonPrices: [],
    },
    validate: {
      id: (value) => (!value ? "ID is required" : null),
      title: (value) => (!value ? "Title is required" : null),
      description: (value) => (!value ? "Description is required" : null),
      adultPrice: (value) =>
        value < 0 ? "Adult price cannot be negative" : null,
      childPrice: (value) =>
        value < 0 ? "Child price cannot be negative" : null,
    },
  });

  const editForm = useForm<ProductFormData>({
    initialValues: {
      id: "",
      title: "",
      description: "",
      adultPrice: 0,
      childPrice: 0,
      offersTitle: "",
      offersDescription: "",
      image: "",
      freeGift: [],
      offersList: [],
      calendarActive: false,
      seasonPrices: [],
    },
    validate: {
      id: (value) => (!value ? "ID is required" : null),
      title: (value) => (!value ? "Title is required" : null),
      description: (value) => (!value ? "Description is required" : null),
      adultPrice: (value) =>
        value < 0 ? "Adult price cannot be negative" : null,
      childPrice: (value) =>
        value < 0 ? "Child price cannot be negative" : null,
    },
  });

  const handleCreate = async (values: ProductFormData) => {
    try {
      setActionLoading(true);
      console.log("Creating product with values:", values);

      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const result: ApiResponse<Product> = await response.json();

      if (result.success) {
        notifications.show({
          title: "Success",
          message: "Product created successfully",
          color: "green",
        });
        createForm.reset();
        closeCreate();
        onProductsChange();
      } else {
        notifications.show({
          title: "Error",
          message: result.error || "Failed to create product",
          color: "red",
        });
      }
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to create product",
        color: "red",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    editForm.setValues({
      id: product.id,
      title: product.title,
      description: product.description,
      adultPrice: product.adultPrice || 0,
      childPrice: product.childPrice || 0,
      offersTitle: product.offersTitle || "",
      offersDescription: product.offersDescription || "",
      image: product.image || "",
      freeGift: product.freeGift || [],
      offersList: product.offersList || [],
      calendarActive: product.calendarActive || false,
      seasonPrices: product.seasonPrices || [],
    });
    openEdit();
  };

  const handleUpdate = async (values: ProductFormData) => {
    if (!selectedProduct) return;

    try {
      setActionLoading(true);

      const response = await fetch(`/api/products/${selectedProduct.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const result: ApiResponse<Product> = await response.json();

      if (result.success) {
        notifications.show({
          title: "Success",
          message: "Product updated successfully",
          color: "green",
        });
        closeEdit();
        onProductsChange();
      } else {
        notifications.show({
          title: "Error",
          message: result.error || "Failed to update product",
          color: "red",
        });
      }
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to update product",
        color: "red",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteClick = (product: Product) => {
    setSelectedProduct(product);
    openDelete();
  };

  const handleDelete = async () => {
    if (!selectedProduct) return;

    try {
      setActionLoading(true);

      const response = await fetch(`/api/products/${selectedProduct.id}`, {
        method: "DELETE",
      });

      const result: ApiResponse = await response.json();

      if (result.success) {
        notifications.show({
          title: "Success",
          message: "Product deleted successfully",
          color: "green",
        });
        closeDelete();
        onProductsChange();
      } else {
        notifications.show({
          title: "Error",
          message: result.error || "Failed to delete product",
          color: "red",
        });
      }
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to delete product",
        color: "red",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
    }).format(price);
  };

  const renderProductForm = (form: typeof createForm, isEdit = false) => (
    <Tabs defaultValue="basic">
      <Tabs.List>
        <Tabs.Tab value="basic">Basic Info</Tabs.Tab>
        <Tabs.Tab value="pricing">Pricing</Tabs.Tab>
        <Tabs.Tab value="offers">Offers</Tabs.Tab>
        {/* <Tabs.Tab value="advanced">Advanced</Tabs.Tab> */}
      </Tabs.List>

      <Tabs.Panel value="basic" pt="md">
        <Stack gap="md">
          <TextInput
            label="Product ID"
            placeholder="attraction-123"
            required
            disabled={isEdit}
            {...form.getInputProps("id")}
          />

          <TextInput
            label="Title"
            placeholder="Enter product title"
            required
            {...form.getInputProps("title")}
          />

          <Textarea
            label="Description"
            placeholder="Enter product description"
            required
            minRows={3}
            {...form.getInputProps("description")}
          />

          <TextInput
            label="Image URL"
            placeholder="https://example.com/image.jpg"
            {...form.getInputProps("image")}
          />
        </Stack>
      </Tabs.Panel>

      <Tabs.Panel value="pricing" pt="md">
        <Stack gap="md">
          <NumberInput
            label="Adult Price (£)"
            placeholder="0.00"
            min={0}
            decimalScale={2}
            fixedDecimalScale
            {...form.getInputProps("adultPrice")}
          />

          <NumberInput
            label="Child Price (£)"
            placeholder="0.00"
            min={0}
            decimalScale={2}
            fixedDecimalScale
            {...form.getInputProps("childPrice")}
          />

          <Switch
            label="Calendar Active"
            description="Enable calendar-based pricing"
            {...form.getInputProps("calendarActive", { type: "checkbox" })}
          />

          <Divider label="Season Pricing" />

          <div>
            <Group justify="space-between" mb="sm">
              <Text size="sm" fw={500}>
                Season Prices
              </Text>
              <Button
                size="xs"
                variant="light"
                onClick={() => {
                  const currentSeasons = form.values.seasonPrices;
                  form.setFieldValue("seasonPrices", [
                    ...currentSeasons,
                    {
                      color: "#228be6",
                      seasonName: "",
                      adultPrice: 0,
                      childPrice: 0,
                    },
                  ]);
                }}
              >
                Add Season
              </Button>
            </Group>

            {form.values.seasonPrices.map((season, index) => (
              <Paper key={index} withBorder p="md" mb="sm">
                <Group justify="space-between" mb="md">
                  <Text size="sm" fw={500}>
                    Season {index + 1}
                  </Text>
                  <CloseButton
                    onClick={() => {
                      const newSeasons = form.values.seasonPrices.filter(
                        (_, i) => i !== index
                      );
                      form.setFieldValue("seasonPrices", newSeasons);
                    }}
                  />
                </Group>

                <Stack gap="sm">
                  <TextInput
                    label="Season Name"
                    placeholder="Summer"
                    value={season.seasonName}
                    onChange={(e) => {
                      const newSeasons = [...form.values.seasonPrices];
                      newSeasons[index].seasonName = e.currentTarget.value;
                      form.setFieldValue("seasonPrices", newSeasons);
                    }}
                  />

                  <div>
                    <Text size="sm" mb="xs">
                      Color
                    </Text>
                    <ColorPicker
                      value={season.color}
                      onChange={(color) => {
                        const newSeasons = [...form.values.seasonPrices];
                        newSeasons[index].color = color;
                        form.setFieldValue("seasonPrices", newSeasons);
                      }}
                    />

                    <TextInput
                      label="Hex Color Code"
                      placeholder="#ff8000"
                      value={season.color}
                      onChange={(e) => {
                        const newSeasons = [...form.values.seasonPrices];
                        let hexValue = e.currentTarget.value;

                        // Auto-add # if not present
                        if (hexValue && !hexValue.startsWith("#")) {
                          hexValue = "#" + hexValue;
                        }

                        // Validate hex format (optional, but helps prevent errors)
                        const hexRegex = /^#[0-9A-Fa-f]{0,6}$/;
                        if (hexValue === "" || hexRegex.test(hexValue)) {
                          newSeasons[index].color = hexValue;
                          form.setFieldValue("seasonPrices", newSeasons);
                        }
                      }}
                      description="Enter exact hex color (e.g., #ff8000)"
                    />
                  </div>

                  <Group grow>
                    <NumberInput
                      label="Adult Price"
                      min={0}
                      decimalScale={2}
                      value={season.adultPrice}
                      onChange={(value) => {
                        const newSeasons = [...form.values.seasonPrices];
                        newSeasons[index].adultPrice = Number(value) || 0;
                        form.setFieldValue("seasonPrices", newSeasons);
                      }}
                    />
                    <NumberInput
                      label="Child Price"
                      min={0}
                      decimalScale={2}
                      value={season.childPrice}
                      onChange={(value) => {
                        const newSeasons = [...form.values.seasonPrices];
                        newSeasons[index].childPrice = Number(value) || 0;
                        form.setFieldValue("seasonPrices", newSeasons);
                      }}
                    />
                  </Group>
                </Stack>
              </Paper>
            ))}
          </div>
        </Stack>
      </Tabs.Panel>

      <Tabs.Panel value="offers" pt="md">
        <Stack gap="md">
          <TextInput
            label="Offers Title"
            placeholder="Summer Special"
            {...form.getInputProps("offersTitle")}
          />

          <Textarea
            label="Offers Description"
            placeholder="Limited time offer"
            minRows={2}
            {...form.getInputProps("offersDescription")}
          />

          <div>
            <Group justify="space-between" mb="sm">
              <Text size="sm" fw={500}>
                Free Gifts
              </Text>
              <Button
                size="xs"
                variant="light"
                onClick={() => {
                  const currentGifts = form.values.freeGift;
                  form.setFieldValue("freeGift", [...currentGifts, ""]);
                }}
              >
                Add Gift
              </Button>
            </Group>

            {form.values.freeGift.map((gift, index) => (
              <Group key={index} mb="sm">
                <TextInput
                  placeholder="Beach Towel"
                  value={gift}
                  onChange={(e) => {
                    const newGifts = [...form.values.freeGift];
                    newGifts[index] = e.currentTarget.value;
                    form.setFieldValue("freeGift", newGifts);
                  }}
                  style={{ flex: 1 }}
                />
                <CloseButton
                  onClick={() => {
                    const newGifts = form.values.freeGift.filter(
                      (_, i) => i !== index
                    );
                    form.setFieldValue("freeGift", newGifts);
                  }}
                />
              </Group>
            ))}
          </div>

          <div>
            <Group justify="space-between" mb="sm">
              <Text size="sm" fw={500}>
                Offers List
              </Text>
              <Button
                size="xs"
                variant="light"
                onClick={() => {
                  const currentOffers = form.values.offersList;
                  form.setFieldValue("offersList", [
                    ...currentOffers,
                    { name: "", price: 0 },
                  ]);
                }}
              >
                Add Offer
              </Button>
            </Group>

            {form.values.offersList.map((offer, index) => (
              <Paper key={index} withBorder p="md" mb="sm">
                <Group justify="space-between" mb="md">
                  <Text size="sm" fw={500}>
                    Offer {index + 1}
                  </Text>
                  <CloseButton
                    onClick={() => {
                      const newOffers = form.values.offersList.filter(
                        (_, i) => i !== index
                      );
                      form.setFieldValue("offersList", newOffers);
                    }}
                  />
                </Group>

                <Group grow>
                  <TextInput
                    label="Offer Name"
                    placeholder="Early Bird"
                    value={offer.name}
                    onChange={(e) => {
                      const newOffers = [...form.values.offersList];
                      newOffers[index].name = e.currentTarget.value;
                      form.setFieldValue("offersList", newOffers);
                    }}
                  />
                  <NumberInput
                    label="Price (£)"
                    min={0}
                    decimalScale={2}
                    value={offer.price}
                    onChange={(value) => {
                      const newOffers = [...form.values.offersList];
                      newOffers[index].price = Number(value) || 0;
                      form.setFieldValue("offersList", newOffers);
                    }}
                  />
                </Group>
              </Paper>
            ))}
          </div>
        </Stack>
      </Tabs.Panel>

      <Tabs.Panel value="advanced" pt="md">
        <Stack gap="md">
          <Text size="sm" c="dimmed">
            Advanced settings and configurations
          </Text>

          <Alert color="blue">
            Additional features like booking rules, availability settings, and
            integration options can be added here in the future.
          </Alert>
        </Stack>
      </Tabs.Panel>
    </Tabs>
  );

  return (
    <div className="relative">
      <LoadingOverlay visible={loading} />

      {/* Header with Create Button */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <Text size="lg" fw={500}>
            {products.length} {products.length === 1 ? "Product" : "Products"}
          </Text>
        </div>
        <Button
          leftSection={<TiPlus size="1rem" />}
          onClick={openCreate}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Add Product
        </Button>
      </div>

      {/* Products Grid */}
      {products.length === 0 && !loading ? (
        <Card className="text-center py-12">
          <MdOutlineAddPhotoAlternate
            size="3rem"
            className="mx-auto text-gray-400 mb-4"
          />
          <Text size="lg" c="dimmed" mb="md">
            No products found
          </Text>
          <Text size="sm" c="dimmed" mb="lg">
            Get started by creating your first product
          </Text>
          <Button
            onClick={openCreate}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Create Product
          </Button>
        </Card>
      ) : (
        <MantineGrid>
          {products.map((product) => (
            <MantineGrid.Col key={product.id} span={{ base: 12, md: 6, lg: 4 }}>
              <Card
                shadow="sm"
                padding="lg"
                radius="md"
                withBorder
                className="h-full"
              >
                <Card.Section>
                  {product.image ? (
                    <Image
                      src={product.image}
                      height={200}
                      alt={product.title}
                      fallbackSrc="https://via.placeholder.com/400x200?text=No+Image"
                    />
                  ) : (
                    <div className="h-[200px] bg-gray-100 flex items-center justify-center">
                      <MdOutlineAddPhotoAlternate
                        size="2rem"
                        className="text-gray-400"
                      />
                    </div>
                  )}
                </Card.Section>

                <Stack gap="md" className="mt-4">
                  <div>
                    <Text fw={500} size="lg" lineClamp={2}>
                      {product.title}
                    </Text>
                    <Text size="sm" c="dimmed" lineClamp={3} className="mt-1">
                      {product.description}
                    </Text>
                  </div>

                  <Group gap="xs">
                    {product.adultPrice && (
                      <Badge variant="light" color="green" size="sm">
                        Adult: {formatPrice(product.adultPrice)}
                      </Badge>
                    )}
                    {product.childPrice && (
                      <Badge variant="light" color="blue" size="sm">
                        Child: {formatPrice(product.childPrice)}
                      </Badge>
                    )}
                    {product.calendarActive && (
                      <Badge variant="light" color="orange" size="sm">
                        Calendar
                      </Badge>
                    )}
                  </Group>

                  {product.offersTitle && (
                    <Text size="xs" c="dimmed">
                      Offer: {product.offersTitle}
                    </Text>
                  )}

                  <Group justify="space-between">
                    <Group>
                      <ActionIcon
                        variant="light"
                        color="blue"
                        onClick={() => handleEdit(product)}
                      >
                        <FaEdit size="1rem" />
                      </ActionIcon>
                      <ActionIcon
                        variant="light"
                        color="red"
                        onClick={() => handleDeleteClick(product)}
                      >
                        <MdDelete size="1rem" />
                      </ActionIcon>
                    </Group>
                    <Text size="xs" c="dimmed">
                      ID: {product.id}
                    </Text>
                  </Group>
                </Stack>
              </Card>
            </MantineGrid.Col>
          ))}
        </MantineGrid>
      )}

      {/* Create Product Modal */}
      <Modal
        opened={createOpened}
        onClose={closeCreate}
        title="Create New Product"
        size="lg"
      >
        <form onSubmit={createForm.onSubmit(handleCreate)}>
          {renderProductForm(createForm, false)}

          <Group justify="flex-end" mt="xl">
            <Button variant="light" onClick={closeCreate}>
              Cancel
            </Button>
            <Button
              type="submit"
              loading={actionLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Create Product
            </Button>
          </Group>
        </form>
      </Modal>

      {/* Edit Product Modal */}
      <Modal
        opened={editOpened}
        onClose={closeEdit}
        title="Edit Product"
        size="lg"
      >
        <form onSubmit={editForm.onSubmit(handleUpdate)}>
          {renderProductForm(editForm, true)}

          <Group justify="flex-end" mt="xl">
            <Button variant="light" onClick={closeEdit}>
              Cancel
            </Button>
            <Button
              type="submit"
              loading={actionLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Update Product
            </Button>
          </Group>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        opened={deleteOpened}
        onClose={closeDelete}
        title="Delete Product"
        size="sm"
      >
        <Stack gap="md">
          <Alert icon={<CiCircleAlert size="1rem" />} color="red">
            Are you sure you want to delete this product? This action cannot be
            undone.
          </Alert>

          {selectedProduct && (
            <div className="bg-gray-50 p-3 rounded">
              <Text fw={500}>{selectedProduct.title}</Text>
              <Group gap="xs" mt="xs">
                {selectedProduct.adultPrice && (
                  <Text size="sm" c="dimmed">
                    Adult: {formatPrice(selectedProduct.adultPrice)}
                  </Text>
                )}
                {selectedProduct.childPrice && (
                  <Text size="sm" c="dimmed">
                    Child: {formatPrice(selectedProduct.childPrice)}
                  </Text>
                )}
              </Group>
            </div>
          )}

          <Group justify="flex-end" mt="md">
            <Button variant="light" onClick={closeDelete}>
              Cancel
            </Button>
            <Button color="red" onClick={handleDelete} loading={actionLoading}>
              Delete Product
            </Button>
          </Group>
        </Stack>
      </Modal>
    </div>
  );
}
