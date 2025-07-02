"use client";
import {
  Button,
  Divider,
  Modal,
  Text,
  Group,
  Badge,
  Transition,
  Card,
  Stack,
} from "@mantine/core";
import React, { useState, useMemo } from "react";
import { FaArrowLeft, FaEye } from "react-icons/fa";
import ComponentMap from "../../../../../components/ComponentMaps/ComponentMap";
import { SavePage } from "@/app/utils/savePage";
import { useRouter } from "next/navigation";

interface AddComponentProps {
  setAddingComponent: (value: boolean) => void;
  state: { component: string; props: Record<string, any> }[];
  selectedPage: string;
  pageContent?: any;
  updatePageContent?: any;
}

function AddComponent({
  setAddingComponent,
  state,
  selectedPage,
  pageContent,
  updatePageContent,
}: AddComponentProps) {
  console.log("page content", pageContent);
  const [previewComponent, setPreviewComponent] = useState<React.FC | null>(
    null
  );
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const router = useRouter();

  // Extract unique categories from ComponentMap
  const categories = useMemo(() => {
    const categorySet = new Set<string>();
    Object.values(ComponentMap).forEach(({ category }) => {
      categorySet.add(category);
    });
    return Array.from(categorySet).sort();
  }, []);

  // Filter components by selected category
  const filteredComponents = useMemo(() => {
    if (!selectedCategory) return {};
    return Object.entries(ComponentMap).reduce((acc, [key, value]) => {
      if (value.category === selectedCategory) {
        acc[key] = value;
      }
      return acc;
    }, {} as typeof ComponentMap);
  }, [selectedCategory]);

  const handlePreview = (Component: React.FC) => {
    setPreviewComponent(() => Component);
    setPreviewOpen(true);
  };

  const handleAddComponent = async (componentKey: string) => {
    try {
      const newComponent = {
        component: componentKey,
        props: ComponentMap[componentKey].metadata.props,
      };
      const mergedState = [...state, newComponent];
      const status = pageContent?.status || "draft";
      const response = await SavePage({
        slug: selectedPage,
        components: mergedState,
        status,
      });
      updatePageContent(mergedState);
      if (response?.success) {
        router.refresh();
      } else {
        console.error("Failed to save page:", response);
      }
    } catch (error) {
      console.error("Error adding component:", error);
    }
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
  };

  return (
    <div className=" space-y-4">
      <div className="flex items-center gap-4">
        <Button variant="subtle" onClick={() => setAddingComponent(false)}>
          <FaArrowLeft className="mr-2" /> Page Content
        </Button>
      </div>

      <Divider />

      {/* Category Selection View */}
      <Transition
        mounted={!selectedCategory}
        transition="slide-right"
        duration={300}
        timingFunction="ease"
      >
        {(styles) => (
          <div style={styles}>
            <Text size="md" fw={500} mb="md">
              Choose a Category
            </Text>
            <Stack gap="sm">
              {categories.map((category) => {
                const componentCount = Object.values(ComponentMap).filter(
                  (comp) => comp.category === category
                ).length;

                return (
                  <Card
                    key={category}
                    shadow="sm"
                    padding="md"
                    radius="md"
                    withBorder
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setSelectedCategory(category)}
                  >
                    <Group justify="space-between">
                      <div>
                        <Text fw={500}>{category}</Text>
                        <Text size="sm" c="dimmed">
                          {componentCount} component
                          {componentCount !== 1 ? "s" : ""}
                        </Text>
                      </div>
                      <Badge variant="light" size="sm">
                        {componentCount}
                      </Badge>
                    </Group>
                  </Card>
                );
              })}
            </Stack>
          </div>
        )}
      </Transition>

      {/* Components List View */}
      <Transition
        mounted={!!selectedCategory}
        transition="slide-left"
        duration={300}
        timingFunction="ease"
      >
        {(styles) => (
          <div style={styles}>
            {selectedCategory && (
              <>
                <Group mb="md">
                  <Button
                    variant="subtle"
                    size="sm"
                    onClick={handleBackToCategories}
                  >
                    <FaArrowLeft className="mr-2" /> Categories
                  </Button>
                  <Badge variant="filled" size="lg">
                    {selectedCategory}
                  </Badge>
                </Group>

                <Stack gap="sm">
                  {Object.entries(filteredComponents).map(
                    ([compKey, { component: Component, name }]) => (
                      <Card
                        key={compKey}
                        shadow="sm"
                        padding="md"
                        radius="md"
                        withBorder
                      >
                        <Group justify="space-between">
                          <Text fw={500}>{name}</Text>
                          <Group gap="xs">
                            <Button
                              size="xs"
                              variant="light"
                              onClick={() => handlePreview(Component)}
                            >
                              <FaEye className="mr-1" /> Preview
                            </Button>
                            <Button
                              size="xs"
                              onClick={() => handleAddComponent(compKey)}
                            >
                              Add
                            </Button>
                          </Group>
                        </Group>
                      </Card>
                    )
                  )}
                </Stack>
              </>
            )}
          </div>
        )}
      </Transition>

      {/* Full-Screen Preview Modal */}
      <Modal
        fullScreen
        opened={previewOpen}
        onClose={() => setPreviewOpen(false)}
        title="Component Preview"
      >
        <div className="flex justify-center items-center h-full">
          {previewComponent ? (
            <div className="h-full w-full">
              {React.createElement(previewComponent)}
            </div>
          ) : (
            <Text>No preview available</Text>
          )}
        </div>
      </Modal>
    </div>
  );
}

export default AddComponent;
