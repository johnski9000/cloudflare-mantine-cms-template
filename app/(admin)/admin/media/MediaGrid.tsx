"use client";
import React, { useState } from "react";
import { MdUpload, MdDelete, MdClose } from "react-icons/md";
import { notifications } from "@mantine/notifications";
import { uploadImage } from "@/app/utils/uploadImage";
import {
  ActionIcon,
  Card,
  Grid,
  Group,
  LoadingOverlay,
  Stack,
  Text,
} from "@mantine/core";

function MediaGrid({ media: initialMedia = [] }) {
  const [loading, setLoading] = useState(false);
  const [media, setMedia] = useState(initialMedia);
  const [dragActive, setDragActive] = useState(false);
  const [pendingFiles, setPendingFiles] = useState([]); // Files waiting to be uploaded

  // Convert bytes to MB with 2 decimal places
  const bytesToMB = (bytes) => {
    return (bytes / (1024 * 1024)).toFixed(2);
  };

  // Extract filename from key
  const getFileName = (key) => {
    if (!key) return "Unknown file";
    const parts = key.split("/");
    return parts[parts.length - 1]; // Get the last part after the last slash
  };

  // Get file type from filename extension
  const getFileType = (filename) => {
    const extension = filename.split(".").pop()?.toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(extension)) {
      return "image";
    } else if (["mp4", "webm", "ogg", "avi", "mov"].includes(extension)) {
      return "video";
    } else if (["mp3", "wav", "ogg", "aac"].includes(extension)) {
      return "audio";
    }
    return "file";
  };

  // Handle file selection (creates preview)
  const handleFileSelection = (files) => {
    const newPendingFiles = Array.from(files).map((file, index) => ({
      id: Date.now() + index,
      name: file.name,
      size: file.size,
      url: URL.createObjectURL(file),
      type: file.type,
      file: file, // Keep reference to original file for upload
    }));

    setPendingFiles((prev) => [...prev, ...newPendingFiles]);
  };

  // Handle file input change
  const handleInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelection(e.target.files);
      e.target.value = ""; // Reset input
    }
  };

  // Handle drag events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Handle drop
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelection(e.dataTransfer.files);
    }
  };

  // Remove pending file from preview
  const removePendingFile = (index) => {
    setPendingFiles((prev) => {
      const newFiles = [...prev];
      // Revoke object URL to prevent memory leaks
      URL.revokeObjectURL(newFiles[index].url);
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  // Upload all pending files
  const uploadPendingFiles = async () => {
    if (pendingFiles.length === 0) return;

    console.log("Uploading files:", pendingFiles);

    const uploadPromises = pendingFiles.map(async (file, index) => {
      try {
        console.log(`Uploading file ${index + 1}:`, {
          name: file.name,
          size: file.size,
          type: file.type,
        });

        const uploadedUrl = await uploadImage(file.file);

        if (typeof uploadedUrl === "string" && uploadedUrl.startsWith("http")) {
          // Success - uploadedUrl is the URL
          return {
            id: file.id,
            key: `uploads/${file.name}`,
            name: file.name,
            size: file.size,
            url: uploadedUrl, // Use the uploaded URL instead of the local blob URL
            type: file.type,
            success: true,
          };
        } else {
          // Error - uploadedUrl contains error message
          console.error(`Failed to upload ${file.name}:`, uploadedUrl);
          return {
            ...file,
            success: false,
            error: uploadedUrl,
          };
        }
      } catch (error) {
        console.error(`Error uploading ${file.name}:`, error);
        return {
          ...file,
          success: false,
          error: error.message || "Upload failed",
        };
      }
    });

    try {
      const results = await Promise.all(uploadPromises);

      // Separate successful and failed uploads
      const successfulUploads = results.filter((result) => result.success);
      const failedUploads = results.filter((result) => !result.success);

      // Add successful uploads to media
      if (successfulUploads.length > 0) {
        setMedia((prev) => [...prev, ...successfulUploads]);
      }

      // Clean up blob URLs for pending files
      pendingFiles.forEach((file) => URL.revokeObjectURL(file.url));
      setPendingFiles([]);

      // Show notifications
      if (successfulUploads.length > 0) {
        notifications.show({
          title: "Upload successful",
          message: `${successfulUploads.length} file(s) uploaded successfully`,
          color: "green",
          autoClose: 3000,
        });
      }

      if (failedUploads.length > 0) {
        notifications.show({
          title: "Some uploads failed",
          message: `${failedUploads.length} file(s) failed to upload. Check console for details.`,
          color: "red",
          autoClose: 5000,
        });
      }
    } catch (error) {
      console.error("Error during upload process:", error);
      notifications.show({
        title: "Upload failed",
        message: "An error occurred during the upload process",
        color: "red",
        autoClose: 5000,
      });
    }
  };

  // Delete media item with confirmation
  const deleteMedia = async (index, item) => {
    const fileName = getFileName(item.key);
    if (window.confirm(`Are you sure you want to delete "${fileName}"?`)) {
      try {
        const response = await fetch(
          `/api/r2/delete?key=${encodeURIComponent(item.key)}`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          const result = await response.json();
          console.log("Successfully deleted:", item);

          // Remove from state
          setMedia((prev) => prev.filter((_, i) => i !== index));

          // Show success notification
          notifications.show({
            title: "File deleted successfully",
            message: `${fileName} has been deleted from your media library`,
            color: "green",
            autoClose: 3000,
          });
        } else {
          const error = await response.json();
          console.error("Failed to delete:", error);

          // Show error notification
          notifications.show({
            title: "Delete failed",
            message: error.details || "Failed to delete the file",
            color: "red",
            autoClose: 5000,
          });
        }
      } catch (error) {
        console.error("Delete error:", error);

        // Show error notification
        notifications.show({
          title: "Delete failed",
          message: "Network error occurred while deleting the file",
          color: "red",
          autoClose: 5000,
        });
      }
    }
  };

  return (
    <div className="">
      {/* Upload Area */}
      <LoadingOverlay visible={loading} />

      <div
        className={`border-2 border-dashed rounded-lg p-8 mb-6 text-center transition-colors duration-300 ${
          dragActive
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-gray-400"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <MdUpload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-lg font-medium text-gray-700 mb-2">
          Drop files here or click to upload
        </p>
        <p className="text-sm text-gray-500 mb-4">
          Support for images, videos, and other media files
        </p>
        <input
          type="file"
          multiple
          accept="image/*,video/*,audio/*"
          onChange={handleInputChange}
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer transition-colors duration-200"
        >
          <MdUpload className="h-4 w-4 mr-2" />
          Choose Files
        </label>
      </div>

      {pendingFiles.length > 0 && !loading && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-700">
              Files ready to upload ({pendingFiles.length})
            </h3>
            <div className="flex gap-2">
              <button
                onClick={uploadPendingFiles}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200"
              >
                Upload All
              </button>
              <button
                onClick={() => {
                  // Clean up object URLs
                  pendingFiles.forEach((file) => URL.revokeObjectURL(file.url));
                  setPendingFiles([]);
                }}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors duration-200"
              >
                Cancel All
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            {pendingFiles.map((item, index) => {
              const fileName = item.name;
              const fileType = getFileType(fileName);
              return (
                <div
                  key={item.id}
                  className="relative border rounded-lg p-4 bg-white shadow-sm group"
                >
                  {/* Remove Button */}
                  <button
                    onClick={() => removePendingFile(index)}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600 z-10"
                    title="Remove file"
                  >
                    <MdClose className="h-4 w-4" />
                  </button>

                  {/* Media Preview */}
                  {fileType === "image" ? (
                    <img
                      src={item.url}
                      alt={fileName}
                      className="w-full h-32 object-cover rounded-md mb-2"
                    />
                  ) : fileType === "video" ? (
                    <video
                      src={item.url}
                      className="w-full h-32 object-cover rounded-md mb-2"
                    />
                  ) : (
                    <div className="w-full h-32 bg-gray-200 rounded-md mb-2 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-xl mb-1">📄</div>
                        <div className="text-xs text-gray-600">
                          {fileName.split(".").pop()?.toUpperCase() || "File"}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* File Info */}
                  <h4 className="text-sm font-medium truncate" title={fileName}>
                    {fileName}
                  </h4>
                  <p className="text-xs text-gray-500">
                    {bytesToMB(item.size)} MB
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Uploaded Media Grid */}
      {media && media.length > 0 && !loading ? (
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Uploaded Media ({media.length})
          </h3>
          <Grid>
            {media.map((item, index) => {
              const fileName = getFileName(item.key);
              const fileType = getFileType(fileName);
              console.log("size", item.size, bytesToMB(item.size));

              return (
                <Grid.Col key={index} span={{ base: 12, md: 6, lg: 4 }}>
                  <Card
                    shadow="sm"
                    padding="lg"
                    radius="md"
                    withBorder
                    className="h-full"
                  >
                    <Card.Section>
                      {fileType === "image" ? (
                        <img
                          src={item?.url}
                          alt={fileName}
                          className="w-full h-48 object-cover rounded-md mb-2"
                        />
                      ) : fileType === "video" ? (
                        <video
                          src={item?.url}
                          className="w-full h-48 object-cover rounded-md mb-2"
                          controls
                        />
                      ) : (
                        <div className="w-full h-48 bg-gray-200 rounded-md mb-2 flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-2xl mb-2">📄</div>
                            <div className="text-sm text-gray-600">
                              {fileName.split(".").pop()?.toUpperCase() ||
                                "File"}
                            </div>
                          </div>
                        </div>
                      )}
                    </Card.Section>

                    <Stack gap="md" className="mt-4">
                      <div>
                        <Text fw={500} size="lg" lineClamp={2}>
                          {fileName.split(".").pop()?.toUpperCase() || "File"}
                        </Text>
                        <Text
                          size="sm"
                          c="dimmed"
                          lineClamp={3}
                          className="mt-1"
                        >
                          {fileName}
                        </Text>
                        <Text
                          size="sm"
                          c="dimmed"
                          lineClamp={3}
                          className="mt-1"
                        >
                          {" "}
                          {bytesToMB(item.size)} MB
                        </Text>
                      </div>

                      <Group justify="space-between">
                        <Group>
                          <ActionIcon
                            variant="light"
                            color="red"
                            onClick={() => deleteMedia(index, item)}
                          >
                            <MdDelete size="1rem" />
                          </ActionIcon>
                        </Group>
                      </Group>
                    </Stack>
                  </Card>
                </Grid.Col>
              );
            })}
          </Grid>
        </div>
      ) : (
        <div className="text-center text-gray-500 py-12">
          <MdUpload className="mx-auto h-16 w-16 text-gray-300 mb-4" />
          <p className="text-lg">No media files available.</p>
          <p className="text-sm">Upload some files to get started!</p>
        </div>
      )}
    </div>
  );
}

export default MediaGrid;
