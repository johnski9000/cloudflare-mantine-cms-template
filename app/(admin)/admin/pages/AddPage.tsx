import { Modal } from "@mantine/core";
import React from "react";
import { FaPlus } from "react-icons/fa";
import CreatePage from "../../AdminSidebar/CreatePage";

function AddPage({ openModal, setOpenModal, refreshSidebar }) {
  return (
    <Modal
      classNames={{
        inner: "animate-fadeUp",
        content: "p-2 rounded-lg shadow-xl ",
        body: "space-y-4",
      }}
      centered
      opened={openModal === "Add Page"}
      onClose={() => setOpenModal(false)}
      title={
        <div className="flex items-center space-x-2 text-lg font-semibold ">
          <FaPlus className="text-green-600" />
          <span>Add New Page</span>
        </div>
      }
      size="xl"
      radius="md"
    >
      <CreatePage
        refreshSidebar={refreshSidebar}
        closeModal={() => setOpenModal("Add Page")}
      />
    </Modal>
  );
}

export default AddPage;
