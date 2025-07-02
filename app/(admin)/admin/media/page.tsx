import React from "react";
import MediaGrid from "./MediaGrid";

async function page() {
  const media = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/r2/list`, {
    method: "GET",
  });
  const mediaData = await media.json();
  return (
    <div>
      {" "}
      <h1 className="text-3xl font-bold mb-4">Media</h1>
      <p className="text-gray-600 mb-4">
        This is the media section of the admin panel. You can view and manage
        your media files here.
      </p>
      <div className="w-full h-[1px] bg-gray-300 my-4" />
      <MediaGrid media={mediaData.media} />
    </div>
  );
}

export default page;
