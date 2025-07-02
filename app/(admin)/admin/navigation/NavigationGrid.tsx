"use client";
import { Button, Divider, Grid, Modal, Paper, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import React, { useState } from "react";
import { FaBars, FaEye } from "react-icons/fa";
import { NavigationMap } from "../../../components/ComponentMaps/NavigationMap";
import { SaveNavigation, SavePage } from "@/app/utils/savePage";
import NavigationEditor from "./NavigationEditor";
import { uploadImage } from "@/app/utils/uploadImage";
import { useRouter } from "next/navigation";
import { formatProps } from "@/app/utils/formatProps";

function NavigationGrid({ navigation }) {
  const sortedNavigation = Object.entries(NavigationMap).sort(
    ([compKeyA], [compKeyB]) => {
      // Ensure isSaved navigation appears first
      const isSavedA = navigation?.value?.compKey === compKeyA;
      const isSavedB = navigation?.value?.compKey === compKeyB;

      return isSavedB - isSavedA; // isSavedB should come first
    }
  );
  const [previewComponent, setPreviewComponent] = useState<React.FC | null>(
    null
  );
  const [edit, setEdit] = useState<React.FC | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const router = useRouter();

  const handlePreview = (Component: React.FC) => {
    setPreviewComponent(() => Component); // Store the component reference
    setPreviewOpen(true);
  };

  const handleSaveEdit = async (
    compKey: string,
    updatedProps: object,
    file: Record<string, File>
  ) => {
    const originalProps = NavigationMap[compKey].metadata.props;
    let formattedProps;
    if (updatedProps) {
      formattedProps = Object.entries(originalProps).map(([key, propItem]) => {
        if (propItem.type === "array") {
          // Handle array fields (e.g., banners)
          const updatedArray = propItem.value.map((originalItem, index) => {
            const updatedItem = updatedProps[key]?.[index] || {};
            return Object.fromEntries(
              Object.entries(originalItem).map(([subKey, subPropItem]) => [
                subKey,
                {
                  ...subPropItem,
                  value:
                    updatedItem[subKey] !== undefined
                      ? updatedItem[subKey]
                      : subPropItem.value,
                },
              ])
            );
          });

          return { ...propItem, key, value: updatedArray };
        } else {
          // Handle simple fields
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
    }
    try {
      let uploadUrl;
      if (file.logo) {
        console.log("file", file.logo);
        const uploadedUrl = await uploadImage(file.logo);
        uploadUrl = uploadedUrl;
        console.log("uploadUrl", uploadUrl);
        formattedProps = formattedProps.map((prop) => {
          if (prop.format === "image") {
            return { ...prop, value: uploadUrl };
          }
          return prop;
        });
        console.log("formattedProps", formattedProps);
      }
      const props = Array.isArray(formattedProps)
        ? formatProps(formattedProps)
        : formattedProps;

      const savedItems = {
        compKey,
        props,
      };
      const response = await SaveNavigation(savedItems);
      if (response?.success) {
        notifications.show({
          title: "Success",
          message: "Navigation saved successfully",
          color: "green",
        });
      }
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to save navigation",
        color: "red",
      });
    } finally {
      router.refresh();
    }
  };

  return (
    <div>
      {edit && (
        <NavigationEditor
          navigation={navigation}
          setEdit={setEdit}
          save={handleSaveEdit}
        />
      )}
      {!edit && (
        <Grid columns={12} gutter="xs">
          {sortedNavigation.map(
            ([compKey, { component: Component, name }], index) => {
              const isSaved = navigation?.value?.compKey === compKey;
              console.log("isSaved", isSaved);

              return (
                <Grid.Col
                  key={index}
                  span={{ base: 12, md: 6, lg: 3 }}
                  className="relative"
                >
                  <Paper
                    shadow="sm"
                    p="md"
                    radius="md"
                    className={`flex flex-col justify-between items-center h-full aspect-square text-center transition-all duration-300 ${
                      isSaved
                        ? "border-2 border-blue-600 shadow-lg shadow-blue-500/50 "
                        : "border border-gray-300 hover:shadow-xl"
                    }`}
                  >
                    <Text className="text-lg !font-semibold">{name}</Text>

                    <div className="absolute bottom-4 left-4 right-4 flex justify-center space-x-2 mt-4">
                      {/* Preview Button */}
                      <Button
                        size="xs"
                        variant="light"
                        onClick={() => handlePreview(Component)}
                      >
                        <FaEye />
                      </Button>

                      {/* Save/Edit Button */}
                      <Button
                        size="xs"
                        color="blue"
                        onClick={async () => {
                          if (isSaved) {
                            await setEdit({
                              compKey,
                              props:
                                navigation?.value?.compKey === compKey
                                  ? navigation.value.props
                                  : {},
                            });
                          } else {
                            await SaveNavigation({
                              compKey,
                              props:
                                NavigationMap[compKey]?.metadata.props || {},
                            });
                            router.refresh();
                          }
                        }}
                      >
                        {isSaved ? "Edit" : "Select"}
                      </Button>
                    </div>
                  </Paper>
                </Grid.Col>
              );
            }
          )}
        </Grid>
      )}
      <Modal
        opened={!!previewComponent}
        onClose={() => setPreviewComponent(null)}
        title="Component Preview"
        fullScreen
      >
        <div className=" flex justify-center items-center h-full">
          {previewComponent ? (
            <div className="translate-y-1 relative h-full w-full">
              {React.createElement(previewComponent, { isPreview: true })}
            </div>
          ) : (
            <Text>No preview available</Text>
          )}
        </div>
      </Modal>
    </div>
  );
}

export default NavigationGrid;
