// Define a type for the pages
interface PageData {
  key: string;
  value: string; // Assuming value is a JSON string that needs parsing
}

// Fetch page data on request
export async function getPageData(slug: string): Promise<PageData | null> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/pages/page?pageUrl=${slug}`,
    {
      cache: "no-store",
    }
  );
  console.log("Fetching page data for slug:", slug, response);
  if (!response.ok) return null;
  return response.json();
}

// Fetch all pages
export async function getAllPageData(): Promise<
  { key: string; value: any }[] | null
> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/pages/all`,
    {
      cache: "no-store",
    }
  );
  // Check if the response is ok
  if (!response.ok) return null;

  const data: PageData[] = await response.json(); // Explicitly define type
  return data.map((page) => ({
    key: page.key,
    value: JSON.parse(page.value), // Ensure `value` is parseds correctly
  }));
}
