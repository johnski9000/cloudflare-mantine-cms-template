import { getAllPageData } from "@/app/utils/pageData";
import React from "react";
import WebsitePagesTable from "./Table";

async function page() {
  const pages = await getAllPageData();

  return <WebsitePagesTable pages={pages} />;
}

export default page;
