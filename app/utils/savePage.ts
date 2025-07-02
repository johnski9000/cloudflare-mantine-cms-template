import { showNotification } from "@mantine/notifications";
import { FooterMap } from "../components/ComponentMaps/FooterMap";
import { NavigationMap } from "../components/ComponentMaps/NavigationMap";
import { formatProps } from "./formatProps";
import { uploadImage } from "./uploadImage";

export const SavePage = async (pageData) => {
  try {
    console.log(pageData);
    const response = await fetch("/api/pages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(pageData),
    });
    if (!response.ok) {
      throw new Error("Failed to save page");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    return { error: (error as Error).message };
  }
};
export const SaveNavigation = async (savedItems: {
  compKey: string;
  props: {};
}) => {
  try {
    const formattedProps = Array.isArray(savedItems.props)
      ? formatProps(savedItems.props)
      : savedItems.props;
    const updatedItems = {
      compKey: savedItems.compKey,
      props: formattedProps,
    };
    const response = await fetch("/api/navigation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pageData: updatedItems,
      }),
    });
    if (!response.ok) {
      throw new Error("Failed to save page");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    return { error: (error as Error).message };
  }
};
export const handleSaveEditNavigation = async (
  compKey: string,
  updatedProps: object,
  file: Record<string, File>
) => {
  const originalProps = NavigationMap[compKey].metadata.props;
  let formattedProps;
  if (updatedProps) {
    formattedProps = Object.entries(originalProps).map(([key, propItem]) => {
      if (propItem.type === "array") {
        // Handle array fields (e.g., banners)
        const updatedArray = propItem.value.map((originalItem, index) => {
          const updatedItem = updatedProps[key]?.[index] || {};
          return Object.fromEntries(
            Object.entries(originalItem).map(([subKey, subPropItem]) => [
              subKey,
              {
                ...subPropItem,
                value:
                  updatedItem[subKey] !== undefined
                    ? updatedItem[subKey]
                    : subPropItem.value,
              },
            ])
          );
        });

        return { ...propItem, key, value: updatedArray };
      } else {
        // Handle simple fields
        return {
          ...propItem,
          key,
          value:
            updatedProps[key] !== undefined
              ? updatedProps[key]
              : propItem.value,
        };
      }
    });
  }
  try {
    let uploadUrl;
    if (file.logo) {
      console.log("file", file.logo);
      const uploadedUrl = await uploadImage(file.logo);
      uploadUrl = uploadedUrl;
      console.log("uploadUrl", uploadUrl);
      formattedProps = formattedProps.map((prop) => {
        if (prop.format === "image") {
          return { ...prop, value: uploadUrl };
        }
        return prop;
      });
      console.log("formattedProps", formattedProps);
    }
    const props = Array.isArray(formattedProps)
      ? formatProps(formattedProps)
      : formattedProps;

    const savedItems = {
      compKey,
      props,
    };
    console.log("savedItems", savedItems);
    const response = await SaveNavigation(savedItems);
    if (response?.success) {
      showNotification({
        title: "Navigation Saved",
        message: "Your navigation has been successfully saved.",
        color: "green",
      });
      return response;
    }
  } catch (error) {
    showNotification({
      title: "Error Saving Navigation",
      message: (error as Error).message,
      color: "red",
    });
    return { error: (error as Error).message };
  }
};
export const SaveFooter = async (savedItems: {
  compKey: string;
  props: {};
}) => {
  try {
    const response = await fetch("/api/footer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pageData: savedItems,
      }),
    });
    if (!response.ok) {
      throw new Error("Failed to save page");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    return { error: (error as Error).message };
  }
};

export const handleSaveEditFooter = async (
  compKey: string,
  updatedProps: object,
  file: Record<string, File>
) => {
  console.log("hiii", compKey, updatedProps, file);
  const originalProps = FooterMap[compKey].metadata.props;

  let formattedProps;
  if (updatedProps) {
    formattedProps = Object.entries(originalProps).map(([key, propItem]) => {
      if (propItem.type === "array") {
        // Handle array fields (e.g., banners)
        const updatedArray = propItem.value.map((originalItem, index) => {
          const updatedItem = updatedProps[key]?.[index] || {};
          return Object.fromEntries(
            Object.entries(originalItem).map(([subKey, subPropItem]) => [
              subKey,
              {
                ...subPropItem,
                value:
                  updatedItem[subKey] !== undefined
                    ? updatedItem[subKey]
                    : subPropItem.value,
              },
            ])
          );
        });

        return { ...propItem, key, value: updatedArray };
      } else {
        // Handle simple fields
        return {
          ...propItem,
          key,
          value:
            updatedProps[key] !== undefined
              ? updatedProps[key]
              : propItem.value,
        };
      }
    });
  }
  try {
    let uploadUrl;
    if (file?.logo) {
      console.log("file", file.logo);
      const uploadedUrl = await uploadImage(file.logo);
      uploadUrl = uploadedUrl;
      console.log("uploadUrl", uploadUrl);
      formattedProps = formattedProps.map((prop) => {
        if (prop.format === "image") {
          return { ...prop, value: uploadUrl };
        }
        return prop;
      });
      console.log("formattedProps", formattedProps);
    }
    const props = Array.isArray(formattedProps)
      ? formatProps(formattedProps)
      : formattedProps;

    const savedItems = {
      compKey,
      props,
    };
    const response = await SaveFooter(savedItems);
    if (response?.success) {
      return response;
    }
  } catch (error) {
    return { error: (error as Error).message };
  }
};
