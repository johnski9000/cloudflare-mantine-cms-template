import React, { useState, useEffect } from "react";
import {
  Modal,
  Grid,
  Card,
  Image,
  Text,
  Button,
  Loader,
  Center,
  Group,
  Stack,
  Badge,
  ActionIcon,
} from "@mantine/core";
import {
  MdPhoto,
  MdVideoLibrary,
  MdInsertDriveFile,
  MdCheck,
} from "react-icons/md";

function MediaModal({ onChange }) {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    if (opened) {
      fetchMedia();
    }
  }, [opened]);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/r2/list`,
        {
          method: "GET",
        }
      );
      const mediaData = await response.json();
      console.log("Fetched media data:", mediaData);
      setMedia(mediaData.media || []);
    } catch (error) {
      console.error("Error fetching media:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMediaSelect = (mediaUrl) => {
    setSelectedMedia(mediaUrl);
  };

  const handleConfirmSelection = () => {
    if (selectedMedia) {
      const fileUrl = selectedMedia;
      console.log("Selected media URL:", fileUrl);
      onChange(fileUrl);
      setOpened(false);
      setSelectedMedia(null);
    }
  };

  const openModal = () => setOpened(true);
  const closeModal = () => setOpened(false);

  const getFileIcon = (fileName) => {
    const extension = fileName.split(".").pop().toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(extension)) {
      return <MdPhoto size={20} />;
    }
    if (["mp4", "avi", "mov", "webm"].includes(extension)) {
      return <MdVideoLibrary size={20} />;
    }
    return <MdInsertDriveFile size={20} />;
  };

  const getFileType = (fileName) => {
    const extension = fileName.split(".").pop().toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(extension)) {
      return "image";
    }
    if (["mp4", "avi", "mov", "webm"].includes(extension)) {
      return "video";
    }
    return "file";
  };

  const renderMediaCard = (item) => {
    const fileType = getFileType(item.name || item.key);
    const mediaUrl = item.url || item.key;
    const isSelected = selectedMedia === mediaUrl;

    return (
      <Card
        key={mediaUrl}
        shadow="sm"
        padding="md"
        radius="md"
        withBorder
        style={{
          cursor: "pointer",
          border: isSelected ? "2px solid #228be6" : undefined,
          position: "relative",
        }}
        onClick={() => handleMediaSelect(mediaUrl)}
      >
        {isSelected && (
          <ActionIcon
            color="blue"
            size="sm"
            radius="xl"
            style={{
              position: "absolute",
              top: 8,
              right: 8,
              zIndex: 1,
            }}
          >
            <MdCheck size={16} />
          </ActionIcon>
        )}

        <Card.Section>
          {fileType === "image" ? (
            <Image
              src={mediaUrl}
              height={160}
              alt={item.name || "Media"}
              fit="cover"
              fallbackSrc="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE2MCIgdmlld0JveD0iMCAwIDIwMCAxNjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTYwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik03NSA2MEM3NSA1NS41ODE3IDc4LjU4MTcgNTIgODMgNTJIMTE3QzEyMS40MTggNTIgMTI1IDU1LjU4MTcgMTI1IDYwVjEwMEMxMjUgMTA0LjQxOCAxMjEuNDE4IDEwOCAxMTcgMTA4SDgzQzc4LjU4MTcgMTA4IDc1IDEwNC40MTggNzUgMTAwVjYwWiIgZmlsbD0iI0U5RUNFRiIvPgo8L3N2Zz4K"
            />
          ) : fileType === "video" ? (
            <Center h={160} style={{ backgroundColor: "#f8f9fa" }}>
              <Stack align="center" gap="xs">
                <MdVideoLibrary size={40} color="#868e96" />
                <Text size="sm" color="dimmed">
                  Video File
                </Text>
              </Stack>
            </Center>
          ) : (
            <Center h={160} style={{ backgroundColor: "#f8f9fa" }}>
              {/* <Stack align="center" gap="xs">
                <MdInsertDriveFile size={40} color="#868e96" />
                <Text size="sm" color="dimmed">
                  File
                </Text>
              </Stack> */}
              <Image src={mediaUrl} width={200} height={200} />
            </Center>
          )}
        </Card.Section>

        <Stack gap="xs" mt="md">
          <Group justify="space-between" align="flex-start">
            <Text fw={500} size="sm" lineClamp={1}>
              {item.name || item.key || "Unnamed file"}
            </Text>
            {getFileIcon(item.name || item.key)}
          </Group>

          {item.size && (
            <Badge variant="light" size="xs">
              {(item.size / 1024 / 1024).toFixed(2)} MB
            </Badge>
          )}
        </Stack>
      </Card>
    );
  };

  return (
    <>
      <Button onClick={openModal} className="mx-auto " fullWidth>
        Select Media
      </Button>

      <Modal
        opened={opened}
        onClose={closeModal}
        title="Select Media"
        size="xl"
        padding="md"
      >
        {loading ? (
          <Center h={200}>
            <Loader size="md" />
          </Center>
        ) : (
          <Stack gap="md">
            {media.length > 0 ? (
              <>
                <Grid>
                  {media.map((item) => (
                    <Grid.Col
                      key={item.url || item.key}
                      span={{ base: 12, sm: 6, md: 4 }}
                    >
                      {renderMediaCard(item)}
                    </Grid.Col>
                  ))}
                </Grid>

                <Group justify="flex-end" mt="md">
                  <Button variant="default" onClick={closeModal}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleConfirmSelection}
                    disabled={!selectedMedia}
                  >
                    Select Media
                  </Button>
                </Group>
              </>
            ) : (
              <Center h={200}>
                <Stack align="center" gap="md">
                  <MdPhoto size={48} color="#868e96" />
                  <Text color="dimmed">No media files found</Text>
                </Stack>
              </Center>
            )}
          </Stack>
        )}
      </Modal>
    </>
  );
}

export default MediaModal;
