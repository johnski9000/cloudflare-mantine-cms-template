"use client";
import { useState } from "react";
import {
  ScrollArea,
  Table,
  Select,
  ActionIcon,
  Badge,
  Group,
  Text,
  Paper,
  Title,
  Divider,
  Button,
  Stack,
  Center,
  Loader,
  Tooltip,
  Modal,
  Input,
  List,
  ThemeIcon,
  Alert,
} from "@mantine/core";
import {
  FiEdit,
  FiTrash2,
  FiPlus,
  FiEye,
  FiInfo,
  FiRefreshCw,
} from "react-icons/fi";
import { FaCheck, FaArrowRight } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { notifications } from "@mantine/notifications";
import { SavePage } from "@/app/utils/savePage";
import { getAllPageData } from "@/app/utils/pageData";

// Enhanced Create Page Modal Component
function CreatePageModal({ opened, onClose, onPageCreated }) {
  const [slug, setSlug] = useState("");
  const [error, setError] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const router = useRouter();

  const slugRegex =
    /^[a-z0-9]+(?:[-a-z0-9]*[a-z0-9])?(?:\/[a-z0-9]+(?:[-a-z0-9]*[a-z0-9])?)*$/;

  const handleChange = (e) => {
    const value = e.target.value.trim().toLowerCase();
    setSlug(value);

    if (value && !slugRegex.test(value)) {
      setError(
        "Invalid format: Only lowercase letters, numbers, hyphens (-), and forward slashes (/) are allowed."
      );
    } else {
      setError("");
    }
  };

  const handleClose = () => {
    setSlug("");
    setError("");
    setIsCreating(false);
    onClose();
  };

  const createPage = async () => {
    if (!slug || error) return;

    setIsCreating(true);

    try {
      // Sanitize slug before sending to API
      const cleanedSlug = slug
        .replace(/^\/+/, "") // Remove leading slashes
        .replace(/\/+$/, "") // Remove trailing slashes
        .replace(/\/{2,}/g, "/"); // Remove consecutive slashes

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/pages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            slug: cleanedSlug,
            pageData: {
              status: "draft",
              slug: cleanedSlug,
              components: [],
            },
          }),
        }
      );

      if (response.ok) {
        notifications.show({
          title: "Success",
          message: `Page "${cleanedSlug}" created successfully!`,
          color: "green",
          autoClose: 5000,
          action: {
            label: "Click here to edit",
            onClick: () => router.push(`/admin/pages/edit/${cleanedSlug}`),
          },
        });

        // Notify parent component about the new page
        onPageCreated();

        // Close modal without redirecting
        handleClose();
      } else {
        throw new Error("Failed to create page");
      }
    } catch (error) {
      console.error("Error creating page:", error);
      notifications.show({
        title: "Error",
        message: "Failed to create page?. Please try again.",
        color: "red",
        autoClose: 3000,
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !error && slug) {
      createPage();
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title="Create New Page"
      size="lg"
      centered
      closeOnClickOutside={!isCreating}
      closeOnEscape={!isCreating}
    >
      <Stack gap="md">
        {/* Guidelines Section */}
        <Alert icon={<FiInfo size={16} />} color="blue" variant="light">
          <Text size="sm" fw={500} mb="xs">
            Page Naming Guidelines
          </Text>
          <List size="xs" spacing={4}>
            <List.Item>
              Use lowercase letters, numbers, and hyphens (-) only
            </List.Item>
            <List.Item>For nested pages, use forward slashes (/)</List.Item>
            <List.Item>
              Examples: about-us, services/web-design, team/john-doe
            </List.Item>
          </List>
        </Alert>

        {/* Input Section */}
        <div>
          <Text size="sm" fw={500} mb="xs">
            Page URL Slug
          </Text>
          <Input
            placeholder="e.g., about-us or services/web-design"
            value={slug}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            error={error}
            size="md"
            disabled={isCreating}
          />
          {error && (
            <Text color="red" size="xs" mt={4}>
              {error}
            </Text>
          )}
        </div>

        {/* Examples Section */}
        <Paper p="sm" bg="gray.0" radius="sm">
          <Text size="xs" fw={500} mb="xs" c="dimmed">
            Valid Examples:
          </Text>
          <Group gap="xs">
            <Badge size="xs" variant="light" color="green">
              about-us
            </Badge>
            <Badge size="xs" variant="light" color="green">
              contact
            </Badge>
            <Badge size="xs" variant="light" color="green">
              services/web-design
            </Badge>
            <Badge size="xs" variant="light" color="green">
              blog/first-post
            </Badge>
          </Group>
        </Paper>

        {/* Action Buttons */}
        <Group justify="flex-end" gap="xs" mt="md">
          <Button
            variant="subtle"
            color="gray"
            onClick={handleClose}
            disabled={isCreating}
          >
            Cancel
          </Button>
          <Button
            onClick={createPage}
            disabled={!slug || !!error || isCreating}
            loading={isCreating}
            leftSection={!isCreating && <FiPlus size={14} />}
          >
            {isCreating ? "Creating..." : "Create Page"}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}

export default function WebsitePagesTable({ pages: data, isLoading = false }) {
  const [scrolled, setScrolled] = useState(false);
  const [pages, setPages] = useState(data || []);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [pageToDelete, setPageToDelete] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const router = useRouter();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const pages = await getAllPageData();
      setPages(pages);
      notifications.show({
        title: "Refreshed",
        message: "Page list has been updated",
        color: "blue",
        autoClose: 2000,
      });
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to refresh page list",
        color: "red",
        autoClose: 3000,
      });
    } finally {
      // Add a small delay to show the loading state
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  const handleStatusChange = async (pageToUpdate, newStatus) => {
    console.log("Changing status for page:", pageToUpdate, "to", newStatus);

    setUpdatingStatus(pageToUpdate.key);

    try {
      // Update local state immediately for instant UI feedback
      setPages((prevPages) =>
        prevPages.map((page) =>
          page?.key === pageToUpdate.key
            ? { ...page, value: { ...page?.value, status: newStatus } }
            : page
        )
      );

      await SavePage({
        ...pageToUpdate.value,
        status: newStatus,
      });

      console.log("Page status saved successfully!");
      notifications.show({
        title: "Success",
        message: `Status of "${pageToUpdate.key}" changed to "${newStatus}".`,
        color: "green",
        autoClose: 3000,
      });

      // Optional: refresh to sync with server state
      router.refresh();
    } catch (error) {
      console.error("Error saving page status:", error);

      // Revert the optimistic update on error
      setPages((prevPages) =>
        prevPages.map((page) =>
          page?.key === pageToUpdate.key
            ? {
                ...page,
                value: { ...page?.value, status: pageToUpdate.value?.status },
              }
            : page
        )
      );

      notifications.show({
        title: "Error",
        message: `Failed to change status of "${pageToUpdate.key}". Please try again.`,
        color: "red",
        autoClose: 3000,
      });
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleEdit = (key) => {
    window.location.href = `/admin/pages/edit/${key}`;
  };

  const openDeleteModal = (page) => {
    setPageToDelete(page);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!pageToDelete) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/pages/delete`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ slug: pageToDelete.key }),
        }
      );

      if (response.ok) {
        console.log("Page deleted successfully!");
        setPages((prev) =>
          prev.filter((page) => page?.key !== pageToDelete.key)
        );
        notifications.show({
          title: "Success",
          message: `Page "${pageToDelete.key}" has been deleted.`,
          color: "green",
          autoClose: 3000,
        });
      } else {
        throw new Error("Failed to delete page");
      }
    } catch (error) {
      console.error("Error deleting page:", error);
      notifications.show({
        title: "Error",
        message: "Failed to delete the page?. Please try again.",
        color: "red",
        autoClose: 3000,
      });
    } finally {
      setDeleteModalOpen(false);
      setPageToDelete(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return { bg: "#d1fae5", color: "#065f46", border: "#10b981" };
      case "draft":
        return { bg: "#fef3c7", color: "#92400e", border: "#f59e0b" };
      default:
        return { bg: "#f3f4f6", color: "#374151", border: "#d1d5db" };
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div style={{ margin: "0 auto" }} className="w-full !h-full">
        <Paper
          shadow="sm"
          radius="lg"
          p="lg"
          withBorder
          className="w-full h-full"
        >
          <Center h={400}>
            <Stack align="center" gap="md">
              <Loader size="md" />
              <Text size="sm" c="dimmed">
                Loading pages...
              </Text>
            </Stack>
          </Center>
        </Paper>
      </div>
    );
  }

  // Empty state
  if (!pages || pages.length === 0) {
    return (
      <>
        <div style={{ margin: "0 auto" }} className="w-full !h-full">
          <Paper
            shadow="sm"
            radius="lg"
            p="lg"
            withBorder
            className="w-full h-full"
          >
            <div style={{ marginBottom: "20px" }}>
              <Title order={3} mb="xs">
                Website Pages
              </Title>
              <Text size="sm" c="dimmed">
                Manage your website pages and their status
              </Text>
              <Button
                variant="filled"
                color="blue"
                size="sm"
                leftSection={<FiPlus size={14} />}
                onClick={() => setCreateModalOpen(true)}
              >
                Create Your First Page
              </Button>
              <Divider my="md" />
            </div>

            <Center h={300}>
              <Stack align="center" gap="md">
                <div
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    backgroundColor: "#f1f3f4",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <FiEdit size={32} color="#9ca3af" />
                </div>
                <div style={{ textAlign: "center" }}>
                  <Text size="lg" fw={500} mb="xs">
                    No pages yet
                  </Text>
                  <Text size="sm" c="dimmed" mw={300}>
                    Get started by creating your first page?. You can manage
                    content, set status, and organize your website structure.
                  </Text>
                </div>
                <Button
                  variant="light"
                  color="blue"
                  leftSection={<FiPlus size={16} />}
                  onClick={() => setCreateModalOpen(true)}
                  mt="sm"
                >
                  Create New Page
                </Button>
              </Stack>
            </Center>
          </Paper>
        </div>

        <CreatePageModal
          opened={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          onPageCreated={handleRefresh}
        />
      </>
    );
  }

  const rows = pages.map((page) => {
    const statusColors = getStatusColor(page?.value?.status);
    const isUpdating = updatingStatus === page?.key;
    const cleanedSlug = page?.value?.slug?.includes("homepage")
      ? process.env.NEXT_PUBLIC_BASE_URL
      : (process.env.NEXT_PUBLIC_BASE_URL || "") +
        page?.value?.slug?.replace(
          `${process.env.NEXT_PUBLIC_KV_WEBSITE_ID || ""}:page:`,
          "/"
        );
    console.log("cleanedslug", cleanedSlug);
    return (
      <Table.Tr key={page?.key}>
        {/* <Table.Td>
          <Text size="sm" fw={500}>
            {page?.key}
          </Text>
        </Table.Td> */}
        <Table.Td>
          <Group gap="xs">
            <Text size="sm">{cleanedSlug}</Text>
            {page?.value?.status === "active" && (
              <Tooltip label="View live page">
                <ActionIcon
                  variant="subtle"
                  color="gray"
                  size="xs"
                  component="a"
                  href={cleanedSlug}
                  target="_blank"
                >
                  <FiEye size={12} />
                </ActionIcon>
              </Tooltip>
            )}
          </Group>
        </Table.Td>
        <Table.Td>
          <div style={{ position: "relative" }}>
            <Select
              value={page?.value?.status}
              onChange={(value) => handleStatusChange(page, value)}
              data={[
                { value: "active", label: "Active" },
                { value: "draft", label: "Draft" },
              ]}
              size="xs"
              w={100}
              disabled={isUpdating}
              styles={{
                input: {
                  backgroundColor: statusColors.bg,
                  color: statusColors.color,
                  border: `1px solid ${statusColors.border}`,
                  fontWeight: 500,
                  opacity: isUpdating ? 0.6 : 1,
                },
              }}
            />
            {isUpdating && (
              <Loader
                size="xs"
                style={{
                  position: "absolute",
                  right: 8,
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              />
            )}
          </div>
        </Table.Td>
        <Table.Td>
          <Badge
            size="sm"
            variant="light"
            color={page?.value?.components?.length > 0 ? "blue" : "gray"}
          >
            {page?.value?.components?.length || 0} component
            {page?.value?.components?.length !== 1 ? "s" : ""}
          </Badge>
        </Table.Td>
        <Table.Td>
          <Group gap="xs">
            <Tooltip label="Edit page">
              <ActionIcon
                variant="subtle"
                color="blue"
                size="sm"
                onClick={() => handleEdit(page?.key)}
              >
                <FiEdit size={14} />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Delete page">
              <ActionIcon
                variant="subtle"
                color="red"
                size="sm"
                onClick={() => openDeleteModal(page)}
              >
                <FiTrash2 size={14} />
              </ActionIcon>
            </Tooltip>
          </Group>
        </Table.Td>
      </Table.Tr>
    );
  });

  return (
    <>
      <div style={{ margin: "0 auto" }} className="flex-1 w-full flex flex-col">
        <Paper
          shadow="sm"
          radius="lg"
          p="lg"
          withBorder
          className="w-full h-full flex-1 overflow-y-scroll"
        >
          <div style={{ marginBottom: "20px" }}>
            <Group justify="space-between" align="flex-start">
              <div>
                <Title order={3} mb="xs">
                  Website Pages
                </Title>
                <Text size="sm" c="dimmed">
                  Manage your website pages and their status ({pages.length}{" "}
                  total)
                </Text>
              </div>
              <Group gap="xs">
                <Tooltip label="Refresh page list">
                  <ActionIcon
                    variant="subtle"
                    color="gray"
                    size="lg"
                    onClick={handleRefresh}
                    loading={isRefreshing}
                  >
                    <FiRefreshCw size={16} />
                  </ActionIcon>
                </Tooltip>
                <Button
                  variant="filled"
                  color="blue"
                  size="sm"
                  leftSection={<FiPlus size={14} />}
                  onClick={() => setCreateModalOpen(true)}
                >
                  Create New Page
                </Button>
              </Group>
            </Group>
            <Divider my="md" />
          </div>

          <ScrollArea
            h={400}
            onScrollPositionChange={({ y }) => setScrolled(y !== 0)}
          >
            <Table miw={800} striped highlightOnHover>
              <Table.Thead
                style={{
                  position: "sticky",
                  top: 0,
                  backgroundColor: "white",
                  zIndex: 1,
                  boxShadow: scrolled ? "0 2px 4px rgba(0,0,0,0.1)" : "none",
                  transition: "box-shadow 0.2s",
                }}
              >
                <Table.Tr>
                  {/* <Table.Th>
                    <Text fw={600} size="sm" tt="uppercase" c="dimmed">
                      Key
                    </Text>
                  </Table.Th> */}
                  <Table.Th>
                    <Text fw={600} size="sm" tt="uppercase" c="dimmed">
                      URL
                    </Text>
                  </Table.Th>
                  <Table.Th>
                    <Text fw={600} size="sm" tt="uppercase" c="dimmed">
                      Status
                    </Text>
                  </Table.Th>
                  <Table.Th>
                    <Text fw={600} size="sm" tt="uppercase" c="dimmed">
                      Components
                    </Text>
                  </Table.Th>
                  <Table.Th>
                    <Text fw={600} size="sm" tt="uppercase" c="dimmed">
                      Actions
                    </Text>
                  </Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>{rows}</Table.Tbody>
            </Table>
          </ScrollArea>
        </Paper>
      </div>

      {/* Create Page Modal */}
      <CreatePageModal
        opened={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onPageCreated={handleRefresh}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        opened={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Page"
        centered
        size="sm"
      >
        <Stack gap="md">
          <Text size="sm">
            Are you sure you want to delete the page{" "}
            <strong>"{pageToDelete?.key}"</strong>? This action cannot be
            undone.
          </Text>
          <Group justify="flex-end" gap="xs">
            <Button
              variant="subtle"
              color="gray"
              onClick={() => setDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button color="red" onClick={handleDelete}>
              Delete Page
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
}
