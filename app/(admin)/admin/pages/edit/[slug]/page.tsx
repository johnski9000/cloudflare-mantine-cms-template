import { Suspense } from "react";
import { notFound } from "next/navigation";
import Editor from "./Editor";
import { EditorError } from "./EditorError";
import { EditorLoading } from "./EditorLoading";

interface PageProps {
  params: Promise<{ slug: string }>;
}
async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeout = 5000
) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}
export default async function Page({ params }: PageProps) {
  try {
    const { slug } = await params;
    const decodedSlug = decodeURIComponent(slug);

    // Validate slug format
    if (!decodedSlug || typeof decodedSlug !== "string") {
      console.error("Invalid slug provided:", slug);
      notFound();
    }

    const response = await fetchWithTimeout(
      `${process.env.KV_WORKER_URL}/api/getAllData`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
        body: JSON.stringify({
          pageSlug: decodedSlug,
          navigationSlug: `${process.env.KV_WEBSITE_ID}:navigation`,
          footerSlug: `${process.env.KV_WEBSITE_ID}:footer`,
        }),
      }
    );
    const data = await response.json();
    const pageData = data?.page;
    const navigationData = data?.navigation;
    const footerData = data?.footer;

    return (
      <Suspense fallback={<EditorLoading />}>
        <Editor
          slug={decodedSlug}
          pageData={pageData}
          navigationData={navigationData}
          footerData={footerData}
        />
      </Suspense>
    );
  } catch (error) {
    console.error("Unexpected error in Page component:", error);
    return <EditorError error="An unexpected error occurred" slug="unknown" />;
  }
}
