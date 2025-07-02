"use client";

import { useState, useEffect } from "react";
import { Select } from "@mantine/core";

// Define props interface
interface ImageSelectorProps {
  value: string;
  onChange: (newValue: string) => void;
}

// Define type for R2 API response
interface R2Object {
  url: string;
}

interface R2Response {
  objects: R2Object[];
}

export const ImageSelector: React.FC<ImageSelectorProps> = ({
  value,
  onChange,
}) => {
  const [r2Images, setR2Images] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch images from Cloudflare R2
  useEffect(() => {
    const fetchR2Images = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          process.env.NEXT_PUBLIC_BASE_URL + "/api/r2/list",
          {
            method: "GET",
          }
        );
        if (!response.ok) throw new Error("Failed to fetch R2 images");
        const data = (await response.json()) as R2Response;
        const imageUrls = data.objects.map((obj: R2Object) => obj.url);
        setR2Images(imageUrls);
      } catch (error) {
        console.error("Failed to fetch R2 images:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchR2Images();
  }, []);

  return (
    <Select
      label="Select from R2 Images"
      placeholder={loading ? "Loading images..." : "Choose an image"}
      data={r2Images.map((img) => ({
        value: img,
        label: img.split("/").pop() || img,
      }))}
      value={value}
      onChange={(selected) => onChange(selected ?? "")} // Use nullish coalescing for cleaner null handling
      searchable
      disabled={loading}
    />
  );
};
