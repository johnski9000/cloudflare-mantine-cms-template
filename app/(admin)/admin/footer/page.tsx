import React from "react";
import NavigationGrid from "./FooterGrid";

async function page() {
  const footer = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/footer`, {
    method: "GET",
  });
  const footerData = await footer.json();
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Footer</h1>
      <p className="text-gray-600 mb-4">
        This is the footer section of the admin panel. You can edit the
        navigation items here.
      </p>
      <div className="w-full h-[1px] bg-gray-300 my-4" />
      {footerData && <NavigationGrid footer={footerData} />}
    </div>
  );
}

export default page;
