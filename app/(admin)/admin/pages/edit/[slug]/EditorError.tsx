import { Paper, Stack, Text } from "@mantine/core";

// Error component for better error handling
export function EditorError({ error, slug }: { error: string; slug: string }) {
  return (
    <div className="fixed inset-0 bg-gray-100 z-50 flex items-center justify-center">
      <Paper p="xl" shadow="md" className="text-center max-w-md">
        <Stack align="center" gap="md">
          <Text size="lg" fw={600} c="red">
            Failed to Load Editor
          </Text>
          <Text size="sm" c="dimmed">
            {error}
          </Text>
          <Text size="xs" c="dimmed">
            Page: {slug}
          </Text>
          <Text size="xs" c="dimmed">
            Please try refreshing the page or contact support if the issue
            persists.
          </Text>
        </Stack>
      </Paper>
    </div>
  );
}
