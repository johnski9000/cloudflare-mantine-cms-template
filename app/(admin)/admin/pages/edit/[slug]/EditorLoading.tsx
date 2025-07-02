import { Loader, Paper, Stack, Text } from "@mantine/core";

// Loading component for better UX
export function EditorLoading() {
  return (
    <div className="fixed inset-0 bg-gray-100 z-50 flex items-center justify-center">
      <Paper p="xl" shadow="md" className="text-center">
        <Stack align="center" gap="md">
          <Loader size="lg" />
          <Text size="lg" fw={600}>
            Loading Editor
          </Text>
          <Text size="sm" c="dimmed">
            Preparing your page editing experience...
          </Text>
        </Stack>
      </Paper>
    </div>
  );
}
