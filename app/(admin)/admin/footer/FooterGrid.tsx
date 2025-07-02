"use client";
import { Button, Divider, Grid, Modal, Paper, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import React, { useState } from "react";
import { FaBars, FaEye } from "react-icons/fa";
import { FooterMap } from "@/app/components/ComponentMaps/FooterMap";
import { SaveFooter, SaveNavigation, SavePage } from "@/app/utils/savePage";
import NavigationEditor from "../navigation/NavigationEditor";
import { uploadImage } from "@/app/utils/uploadImage";
import { useRouter } from "next/navigation";
import FooterEditor from "./FooterEditor";
import { formatProps } from "@/app/utils/formatProps";

function FooterGrid({ footer }) {
  const sortedFooter = Object.entries(FooterMap).sort(
    ([compKeyA], [compKeyB]) => {
      // Ensure isSaved navigation appears first
      const isSavedA = footer?.value?.compKey === compKeyA;
      const isSavedB = footer?.value?.compKey === compKeyB;

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
    const originalProps = FooterMap[compKey].metadata.props;
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
        const uploadedUrl = await uploadImage(file.logo);
        uploadUrl = uploadedUrl;
        formattedProps = formattedProps.map((prop) => {
          if (prop.format === "image") {
            return { ...prop, value: uploadUrl };
          }
          return prop;
        });
      }
      console.log("Formatted Props:", formattedProps);
      const props = Array.isArray(formattedProps)
        ? formatProps(formattedProps)
        : formattedProps;

      const savedItems = {
        compKey,
        props,
      };
      const response = await SaveFooter(savedItems);
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
        message: "Failed to save footer",
        color: "red",
      });
    } finally {
      router.refresh();
    }
  };

  return (
    <div>
      {edit && (
        <FooterEditor footer={footer} setEdit={setEdit} save={handleSaveEdit} />
      )}
      {!edit && (
        <Grid columns={12} gutter="xs">
          {sortedFooter.map(
            ([compKey, { component: Component, name, metadata }], index) => {
              const isSaved = footer?.value?.compKey === compKey;
              return (
                <Grid.Col key={index} span={4} className="relative">
                  <Paper
                    shadow="sm"
                    p="md"
                    radius="md"
                    className={`flex flex-col justify-between items-center h-full aspect-square text-center transition-all duration-300 ${
                      isSaved
                        ? "border-2 border-blue-600 shadow-lg shadow-blue-500/50 scale-105"
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
                            setEdit({
                              compKey,
                              props:
                                footer?.value?.compKey === compKey
                                  ? footer.value.props
                                  : {},
                            });
                          } else {
                            await SaveFooter({
                              compKey,
                              props: FooterMap[compKey]?.metadata.props || {},
                            });
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

export default FooterGrid;
