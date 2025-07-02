import React from "react";
import NavigationGrid from "./NavigationGrid";

async function page() {
  const navigation = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/navigation`,
    {
      method: "GET",
    }
  );
  const navigationData = await navigation.json();
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Navigation</h1>
      <p className="text-gray-600 mb-4">
        Here you can edit the navigation of your website. You can add, edit, and
        delete pages from the navigation menu.
      </p>
      <div className="w-full h-[1px] bg-gray-300 my-4" />
      {navigation && <NavigationGrid navigation={navigationData} />}
    </div>
  );
}

export default page;
