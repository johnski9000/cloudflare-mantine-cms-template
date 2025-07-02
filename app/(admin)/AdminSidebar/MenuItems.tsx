import { ActionIcon, Button, Divider, Modal } from "@mantine/core";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import {
  FaBars,
  FaChevronDown,
  FaCog,
  FaColumns,
  FaEdit,
  FaFile,
  FaFileAlt,
  FaHome,
  FaTags,
  FaTrash,
} from "react-icons/fa";

// Define page type
interface Page {
  key: string;
}
interface PageData {
  key: string;
  value: any;
}
// Define props interface
interface MenuItemsProps {
  isPagesOpen: boolean;
  setIsPagesOpen: (value: boolean) => void;
  setConfirmDelete: (value: string | false) => void;
  slug: string;
  deletePage: (slug: string) => void;
  confirmDelete: string | false;

  pages: Page[];
  setOpenModal: (value: string) => void;
  setSelectedElement: (value: PageData | null) => void;
}

function MenuItems({
  isPagesOpen,
  setIsPagesOpen,
  setConfirmDelete,
  slug,
  deletePage,
  confirmDelete,

  pages,
  setOpenModal,
  setSelectedElement,
}: MenuItemsProps) {
  const router = useRouter();
  const items = [
    {
      icon: <FaHome className="w-5 h-5" />,
      label: "Dashboard",
      onClick: () => router.push("/"),
    },
    {
      icon: <FaBars className="w-5 h-5" />,
      label: "Navigation",
      onClick: () => setOpenModal("Navigation"),
    },
    {
      icon: <FaFileAlt className="w-5 h-5" />,
      label: "Pages",
      dropdown: true,
      subItems: pages.map((page) => ({
        navigate: true,
        label: page.key,
        onClick: () => {
          if (page.key === "home") {
            router.push("/");
          } else {
            router.push(`/${page.key}`);
          }
        },
      })),
    },
    {
      icon: <FaColumns className="w-5 h-5" />,
      label: "Footer",
      onClick: () => setOpenModal("Footer"),
    },
    {
      icon: <FaFile className="w-5 h-5" />,
      label: "View Templates",
      onClick: () => setOpenModal("Templates"),
    },
    {
      icon: <FaTags className="w-5 h-5" />,
      label: "Metadata",
      onClick: () => setOpenModal("Metadata"),
    },
    {
      icon: <FaCog className="w-5 h-5" />,
      label: "Settings",
      onClick: () => setOpenModal("Settings"),
    },
  ];

  return (
    <ul className="space-y-2 font-medium overflow-y-scroll">
      {items.map((item, index) => (
        <li
          key={index}
          className={`flex items-center ${
            isPagesOpen && "flex-col gap-4"
          } relative px-2 py-3 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition`}
        >
          {item.dropdown ? (
            <>
              <button
                onClick={() => setIsPagesOpen(!isPagesOpen)}
                className="flex items-center justify-between w-full text-sm font-semibold text-gray-700 dark:text-white transition-colors duration-150 hover:text-blue-600"
              >
                <span className="inline-flex items-center">
                  {item.icon}
                  <span className="ml-4">{item.label}</span>
                </span>
                <FaChevronDown
                  className={`w-4 h-4 transition-transform ${
                    isPagesOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {isPagesOpen && (
                <ul className="w-full space-y-2 !list-disc pl-2">
                  {item.subItems.map((subItem, subIndex) => (
                    <li
                      key={subIndex}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <ActionIcon
                          color="blue"
                          variant="light"
                          size="sm"
                          onClick={() => {
                            const currentPage = pages.find(
                              (p) => p.key === subItem.label
                            );
                            setSelectedElement(
                              currentPage ? { ...currentPage, value: {} } : null
                            );
                            setOpenModal("Edit Page");
                          }}
                          className="hover:bg-blue-100 dark:hover:bg-blue-800 hover:scale-125 transition-all"
                        >
                          <FaEdit size={14} />
                        </ActionIcon>
                        <Link
                          href={`/${
                            subItem.label === "home" ? "" : subItem.label
                          }`}
                        >
                          <button
                            className={`block text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 transition-colors ${
                              slug === subItem.label && "font-semibold"
                            }`}
                          >
                            {subItem.label}
                          </button>
                        </Link>
                      </div>

                      <ActionIcon
                        color="red"
                        variant="light"
                        size="sm"
                        onClick={() => setConfirmDelete(subItem.label)}
                        className="ml-2 hover:bg-red-100 dark:hover:bg-red-800 transition-colors"
                      >
                        <FaTrash size={14} />
                      </ActionIcon>
                      {confirmDelete && (
                        <Modal
                          centered
                          opened={confirmDelete === subItem.label}
                          onClose={() => setConfirmDelete(false)}
                          title={
                            <div className="flex items-center space-x-2 text-lg font-semibold">
                              <FaTrash className="text-red-600" />
                              <span>Delete /{subItem.label}?</span>
                            </div>
                          }
                          size="sm"
                          radius="md"
                          classNames={{
                            inner: "animate-fadeUp",
                            content: "p-2 rounded-lg shadow-xl",
                            body: "space-y-4",
                          }}
                        >
                          <Divider className="mb-4" />
                          <div className="flex items-center justify-between">
                            <div className="flex flex-col items-center gap-4 w-full">
                              <Button
                                fullWidth
                                color="red"
                                variant="filled"
                                onClick={() => {
                                  deletePage(subItem.label);
                                  setConfirmDelete(false);
                                }}
                              >
                                Delete
                              </Button>
                              <Button
                                fullWidth
                                color="gray"
                                variant="outline"
                                onClick={() => setConfirmDelete(false)}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        </Modal>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </>
          ) : (
            <button
              onClick={item.onClick}
              className="inline-flex items-center w-full text-sm font-semibold text-gray-700 dark:text-white transition-colors duration-150 hover:text-blue-600"
            >
              {item.icon}
              <span className="ml-4">{item.label}</span>
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}

export default MenuItems;
