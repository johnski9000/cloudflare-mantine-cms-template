import { Menu, Avatar, Text } from "@mantine/core";
import { signOut } from "next-auth/react";
import { FaSignOutAlt } from "react-icons/fa";

export default function UserAvatar() {
  const handleSignOut = async () => {
    try {
      console.log("Signing out...");
      await signOut();
      // // Redirect to login page or show a success message
      window.location.href = "/login"; // Adjust the redirect URL as needed
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };
  return (
    <Menu>
      <Menu.Target>
        <Avatar
          radius="xl"
          size={40}
          src="https://i.pravatar.cc/300"
          alt="User Avatar"
          className="cursor-pointer"
        />
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item onClick={() => handleSignOut()} color="red">
          <div className="!flex items-center justify-start">
            <FaSignOutAlt className="text-red-500 mr-2" />
            <Text size="sm">Sign Out</Text>
          </div>
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
