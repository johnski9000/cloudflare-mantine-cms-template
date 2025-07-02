import { notifications } from "@mantine/notifications";
import { useCallback } from "react";

// Improved error handling with useCallback
export const showErrorNotification = (message: string, error?: any) => {
  notifications.show({
    title: "Error",
    message,
    color: "red",
  });
};

export const showSuccessNotification = (message: string) => {
  notifications.show({
    title: "Success",
    message,
    color: "green",
  });
};
