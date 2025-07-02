import { Modal } from "@mantine/core";
import React from "react";
import { FaCog } from "react-icons/fa";

function Settings({ openModal, setOpenModal }) {
  return (
    <Modal
      centered
      opened={openModal === "Settings"}
      onClose={() => setOpenModal(false)}
      title={
        <div className="flex items-center space-x-2 text-lg font-semibold ">
          <FaCog className="text-green-600" />
          <span>Settings</span>
        </div>
      }
      size="xl"
      radius="md"
      classNames={{
        inner: "animate-fadeUp",
        content: "p-2 rounded-lg shadow-xl ",
        body: "space-y-4",
      }}
    >
      Settings bits
    </Modal>
  );
}

export default Settings;
