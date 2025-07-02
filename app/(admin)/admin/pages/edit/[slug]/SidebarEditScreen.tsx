"use client";

import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import {
  FaEdit,
  FaGripVertical,
  FaArrowLeft,
  FaSyncAlt,
  FaPlus,
} from "react-icons/fa";
import { FaDeleteLeft } from "react-icons/fa6";
import {
  Button,
  Text,
  Tooltip,
  Divider,
  Loader,
  ActionIcon,
  Group,
  Stack,
  Badge,
  Card,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useListState } from "@mantine/hooks";
import { useEffect, useState, useCallback, useMemo } from "react";
import { modals } from "@mantine/modals";
import cx from "clsx";
import classes from "./Sidebar.module.css";
import { PropsEditor } from "./PropsEditor";
import {
  handleSaveEditFooter,
  handleSaveEditNavigation,
  SavePage,
} from "@/app/utils/savePage";
import AddComponent from "./AddComponent";
import { uploadImage } from "@/app/utils/uploadImage";
import { formatProps } from "@/app/utils/formatProps";
import { TiThMenu } from "react-icons/ti";
import { RiLayoutBottom2Line } from "react-icons/ri";
import ComponentMap from "@/app/components/ComponentMaps/ComponentMap";
import {
  showErrorNotification,
  showSuccessNotification,
} from "@/app/utils/notifications";
import { FiInfo } from "react-icons/fi";
import MetadataEditor from "./MetadataEditor";

interface ComponentState {
  component: string;
  props: { key: string; value: any }[];
}

interface EditingComponent {
  navigation?: boolean;
  metaData?: any;
  footer?: boolean;
  index?: number;
  component?: string;
  props?: { key: string; value: any }[];
}

interface SidebarEditScreenProps {
  pageContent: any;
  slug: string;
  refreshSidebar: () => void;
  updatePageContent: any;
  metaDataUpdate: any;
  updateNavigationContent: any;
  updateFooterContent: any;
  footerContent?: any;
  navigationContent?: any;
}

export function SidebarEditScreen({
  pageContent,
  slug,
  refreshSidebar,
  updatePageContent,
  metaDataUpdate,
  updateNavigationContent,
  updateFooterContent,
  footerContent: footerData,
  navigationContent: navigationData,
}: SidebarEditScreenProps) {
  const parsedValue = pageContent?.components || { components: [] };
  const [state, handlers] = useListState<ComponentState>(parsedValue || []);
  const [editingComponent, setEditingComponent] =
    useState<EditingComponent | null>(null);
  const [addingComponent, setAddingComponent] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Add useEffect to sync state with pageContent changes
  useEffect(() => {
    const newComponents = pageContent?.components || [];
    // Only update if the components have actually changed
    if (JSON.stringify(newComponents) !== JSON.stringify(state)) {
      handlers.setState(newComponents);
    }
  }, [pageContent?.components]); // Only depend on pageContent.components, not handlers or state

  // Memoize component count for performance
  const componentCount = useMemo(() => state.length, [state.length]);

  // Enhanced save function with better error handling
  const handleSaveEdit = useCallback(
    async (updatedProps: any, files: Record<string, File>): Promise<void> => {
      if (!slug) {
        showErrorNotification("No page selected to save.");
        return;
      }

      try {
        setUploading(true);
        let savedItems = updatedProps;

        if (editingComponent && updatedProps) {
          // Upload images if files exist
          const uploadedUrls: Record<string, string> = {};

          if (Object.keys(files).length > 0) {
            const uploadPromises = Object.entries(files).map(
              async ([keyPath, file]) => {
                try {
                  const uploadedUrl = await uploadImage(file);
                  if (uploadedUrl) {
                    uploadedUrls[keyPath] = uploadedUrl;
                  }
                } catch (error) {
                  console.warn(`Failed to upload image for ${keyPath}:`, error);
                }
              }
            );

            await Promise.all(uploadPromises);
          }

          // Update props with uploaded URLs
          const finalProps = updatedProps.map((prop: any) => {
            if (prop.type === "image" && prop.key && prop.key in uploadedUrls) {
              return { ...prop, value: uploadedUrls[prop.key] };
            } else if (prop.type === "array") {
              const updatedValue = prop.value.map(
                (item: any, index: number) => {
                  const updatedItem = { ...item };
                  Object.keys(item).forEach((subKey) => {
                    const imageKey = `${prop.key}[${index}].${subKey}`;
                    if (
                      item[subKey].type === "image" &&
                      imageKey in uploadedUrls
                    ) {
                      updatedItem[subKey] = {
                        ...item[subKey],
                        value: uploadedUrls[imageKey],
                      };
                    }
                  });
                  return updatedItem;
                }
              );
              return { ...prop, value: updatedValue };
            }
            return prop;
          });

          // Update state
          handlers.setItem(editingComponent.index, {
            component: state[editingComponent.index].component,
            props: finalProps,
          });

          savedItems = state.map((item, index) =>
            index === editingComponent.index
              ? {
                  ...item,
                  props: finalProps,
                  component: item.component || "",
                }
              : item
          );
        }

        // Format props for saving
        const formattedProps = savedItems.map((item: ComponentState) => {
          if (Array.isArray(item.props)) {
            return {
              ...item,
              props: formatProps(item.props),
            };
          }
          return item;
        });
        console.log();
        const response = await SavePage({
          slug: slug,
          components: formattedProps,
          status: pageContent.status || "draft",
          metaData: pageContent.metaData || {},
        });

        updatePageContent(formattedProps);
        if (response?.success) {
          showSuccessNotification("Page saved successfully!");
        } else {
          throw new Error(response?.message || "Failed to save page");
        }
      } catch (error) {
        showErrorNotification("Failed to save page", error);
      } finally {
        setUploading(false);
      }
    },
    [
      slug,
      editingComponent,
      state,
      handlers,
      showErrorNotification,
      showSuccessNotification,
      refreshSidebar,
    ]
  );

  // Enhanced delete with confirmation modal
  const handleDelete = useCallback(
    async (index: number) => {
      const componentName = state[index]?.component || "component";

      modals.openConfirmModal({
        title: "Delete Component",
        children: (
          <Text size="sm">
            Are you sure you want to delete this{" "}
            <strong>{componentName}</strong> component? This action cannot be
            undone.
          </Text>
        ),
        labels: { confirm: "Delete", cancel: "Cancel" },
        confirmProps: { color: "red" },
        onConfirm: async () => {
          try {
            const updatedItems = state.filter((_, i) => i !== index);

            const response = await SavePage({
              slug: slug,
              components: updatedItems,
              status: pageContent.status || "draft",
              metaData: pageContent.metaData || {},
            });

            if (response?.success) {
              handlers.setState(updatedItems);
              refreshSidebar();
              showSuccessNotification("Component deleted successfully.");
            } else {
              throw new Error("Failed to delete component");
            }
          } catch (error) {
            showErrorNotification("Failed to delete component", error);
          }
        },
      });
    },
    [
      state,
      slug,
      handlers,
      refreshSidebar,
      showErrorNotification,
      showSuccessNotification,
    ]
  );

  // Enhanced drag end handler
  const handleDragEnd = useCallback(
    ({ destination, source }: any) => {
      if (!destination || destination.index === source.index) return;

      const newState = [...state];
      const [movedItem] = newState.splice(source.index, 1);
      newState.splice(destination.index, 0, movedItem);

      handlers.setState(newState);
      handleSaveEdit(newState, {});
    },
    [state, handlers, handleSaveEdit]
  );

  // Reusable component for fixed elements (Navigation/Footer)
  const FixedElement = ({
    title,
    icon: Icon,
    onEdit,
    tooltip,
  }: {
    title: string;
    icon: React.ComponentType<any>;
    onEdit: () => void;
    tooltip: string;
  }) => (
    <Card withBorder p="md" mb="xs" className="min-h-[65px]">
      <Group justify="space-between">
        <Group gap="sm">
          <Icon size={18} />
          <Text fw={500}>{title}</Text>
        </Group>
        <Tooltip label={tooltip}>
          <ActionIcon variant="light" onClick={onEdit}>
            <FaEdit size={14} />
          </ActionIcon>
        </Tooltip>
      </Group>
    </Card>
  );

  // Navigation editing view
  if (editingComponent?.navigation) {
    return (
      <Stack p="0">
        <Group>
          <Button
            leftSection={<FaArrowLeft />}
            variant="light"
            onClick={() => setEditingComponent(null)}
          >
            Back to Components
          </Button>
        </Group>
        <Text size="lg" fw={600}>
          Edit Navigation
        </Text>
        <Divider />
        <PropsEditor
          props={navigationData?.props || {}}
          onSave={handleSaveEditNavigation}
          navigationEditor={true}
          compKey={navigationData?.component.name}
        />
      </Stack>
    );
  }

  // Footer editing view
  if (editingComponent?.footer) {
    return (
      <Stack p="0" className="">
        <Group>
          <Button
            leftSection={<FaArrowLeft />}
            variant="light"
            onClick={() => setEditingComponent(null)}
          >
            Back to Components
          </Button>
        </Group>
        <Text size="lg" fw={600}>
          Edit Footer
        </Text>
        <Divider />
        <PropsEditor
          props={footerData?.props || {}}
          onSave={handleSaveEditFooter}
          navigationEditor={true}
          compKey={footerData?.component.name}
        />
      </Stack>
    );
  }
  if (editingComponent?.metaData) {
    return (
      <Stack p="0" className="">
        <Group>
          <Button
            leftSection={<FaArrowLeft />}
            variant="light"
            onClick={() => setEditingComponent(null)}
          >
            Back to Components
          </Button>
        </Group>

        <MetadataEditor
          pageData={pageContent}
          updatePageContent={metaDataUpdate}
        />
      </Stack>
    );
  }

  // Component editing view
  if (editingComponent) {
    if (uploading) {
      return (
        <Stack align="center" p="xl">
          <Loader size="lg" />
          <Text size="lg" fw={500}>
            Uploading and saving...
          </Text>
          <Text size="sm" c="dimmed">
            Please wait while we process your changes
          </Text>
        </Stack>
      );
    }

    return (
      <Stack p="0" className="relative">
        <Group className="!flex !gap-0">
          <Button
            className="!p-0"
            leftSection={<FaArrowLeft />}
            variant="subtle"
            onClick={() => setEditingComponent(null)}
          />{" "}
          <Text size="lg" fw={600}>
            Edit Component
          </Text>
          <Badge variant="filled">{editingComponent.component}</Badge>
        </Group>

        <Group></Group>

        <Divider />

        <PropsEditor
          props={editingComponent?.props || {}}
          onSave={(updatedProps, files) => {
            const formattedProps = Object.entries(
              editingComponent?.props || {}
            ).map(([key, propItem]: [string, any]) => {
              if (propItem.type === "array") {
                const updatedArray = propItem.value.map(
                  (originalItem: any, index: number) => {
                    const updatedItem = updatedProps[key]?.[index] || {};
                    return Object.fromEntries(
                      Object.entries(originalItem).map(
                        ([subKey, subPropItem]: [string, any]) => [
                          subKey,
                          {
                            ...subPropItem,
                            value:
                              updatedItem[subKey] !== undefined
                                ? updatedItem[subKey]
                                : subPropItem.value,
                          },
                        ]
                      )
                    );
                  }
                );
                return { ...propItem, key, value: updatedArray };
              } else {
                return {
                  ...propItem,
                  key,
                  value:
                    updatedProps[key] !== undefined
                      ? updatedProps[key]
                      : propItem.value,
                };
              }
            });
            handleSaveEdit(formattedProps, files);
          }}
          compKey={editingComponent.component}
        />
      </Stack>
    );
  }

  // Add component view
  if (addingComponent) {
    return (
      <AddComponent
        setAddingComponent={setAddingComponent}
        state={state}
        selectedPage={slug}
        pageContent={pageContent}
        updatePageContent={updatePageContent}
      />
    );
  }

  // Main component list view
  return (
    <Stack h="100%">
      {/* Header */}
      <Group justify="space-between" p="md" pb="xs">
        <div>
          <Text size="lg" fw={600}>
            Page Components
          </Text>
          <Text size="sm" c="dimmed">
            {componentCount} components
          </Text>
        </div>
        <Tooltip label="Refresh Data">
          <ActionIcon variant="light" onClick={refreshSidebar}>
            <FaSyncAlt />
          </ActionIcon>
        </Tooltip>
      </Group>

      <Stack px="0" gap="xs" style={{ flex: 1, overflow: "auto" }}>
        <FixedElement
          title="Metadata"
          icon={FiInfo}
          onEdit={() =>
            setEditingComponent({
              metaData: true,
            })
          }
          tooltip="Edit Metadata"
        />
        {/* Fixed Navigation */}
        <FixedElement
          title="Navigation"
          icon={TiThMenu}
          onEdit={() =>
            setEditingComponent({ ...navigationData, navigation: true })
          }
          tooltip="Edit Navigation"
        />

        {/* Draggable Components */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="dnd-list" direction="vertical">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {state.map((item, index) => {
                  const mapProps = ComponentMap[item.component];
                  const itemProps = Array.isArray(item.props)
                    ? formatProps(item.props)
                    : item.props;
                  const editableProps = {
                    component: item?.component,
                    props: { ...mapProps?.metadata?.props, ...itemProps },
                  };
                  return (
                    <Draggable
                      key={index}
                      index={index}
                      draggableId={index.toString()}
                    >
                      {(provided, snapshot) => (
                        <Card
                          className={cx(classes.item, {
                            [classes.itemDragging]: snapshot.isDragging,
                          })}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          withBorder
                          p="md"
                          mb="xs"
                          shadow={snapshot.isDragging ? "lg" : "sm"}
                          {...provided.dragHandleProps}
                        >
                          <Badge
                            variant="light"
                            size="md"
                            p={0}
                            className="absolute top-[-5px] left-[-5px] !w-[20px] !h-[20px] text-[12px]"
                          >
                            {index + 1}
                          </Badge>
                          <Group justify="space-between" w="100%">
                            <Group gap="sm" style={{ flex: 1 }}>
                              <Text fw={500} style={{ flex: 1 }}>
                                {item.component}
                              </Text>
                            </Group>

                            <div className="!flex gap-2 flex-col">
                              <Tooltip label={`Edit ${item.component}`}>
                                <ActionIcon
                                  variant="light"
                                  onClick={() =>
                                    setEditingComponent({
                                      ...editableProps,
                                      index,
                                    })
                                  }
                                >
                                  <FaEdit size={14} />
                                </ActionIcon>
                              </Tooltip>
                              <Tooltip label={`Delete ${item.component}`}>
                                <ActionIcon
                                  variant="light"
                                  color="red"
                                  onClick={() => handleDelete(index)}
                                >
                                  <FaDeleteLeft size={14} />
                                </ActionIcon>
                              </Tooltip>
                            </div>
                          </Group>
                        </Card>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        {/* Fixed Footer */}
        <FixedElement
          title="Footer"
          icon={RiLayoutBottom2Line}
          onEdit={() => setEditingComponent({ ...footerData, footer: true })}
          tooltip="Edit Footer"
        />
      </Stack>

      {/* Add Component Button */}
      <div style={{ padding: "16px" }}>
        <Button
          fullWidth
          leftSection={<FaPlus />}
          variant="light"
          onClick={() => setAddingComponent(true)}
        >
          Add New Component
        </Button>
      </div>
    </Stack>
  );
}
