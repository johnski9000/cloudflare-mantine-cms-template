import CreatePage from "@/app/(admin)/AdminSidebar/CreatePage";
import { Button, Divider, Text, Title } from "@mantine/core";
import React from "react";
import { IoMdArrowRoundBack } from "react-icons/io";

function CreateWebPage() {
  return (
    <div>
      <Button
        variant="light"
        component="a"
        href="/admin/pages"
        className="mb-4"
        leftSection={<IoMdArrowRoundBack size={16} />}
        aria-label="Go back to previous page"
      >
        Go Back
      </Button>
      <Title order={3} mb="xs">
        Create New Web Page
      </Title>
      <Text size="sm" c="dimmed">
        Use the form below to create a new web page. Enter a unique URL name
        that will be used to access the page. Ensure the name is descriptive and
        follows the guidelines provided.
      </Text>
      <Divider className="my-4" />
      <CreatePage />
    </div>
  );
}

export default CreateWebPage;
