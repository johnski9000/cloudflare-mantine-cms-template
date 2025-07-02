import { NextResponse } from "next/server";

export async function GET() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const currentDate = new Date().toISOString();

    // Fetch all keys from Cloudflare KV
    const response = await fetch(`${process.env.KV_WORKER_URL}/api/pages/all`, {
      method: "POST",
      body: JSON.stringify({
        websiteId: process.env.KV_WEBSITE_ID,
      }),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch keys" },
        { status: 500 }
      );
    }

    const data = await response.json();

    const urlMap = data.map((item) => {
      const url = item.key;
      const getPageUrl = (url) => {
        switch (url) {
          case `${process.env.KV_WEBSITE_ID}:page:homepage`:
            return baseUrl;
          default:
            return (
              baseUrl +
              "/" +
              url.replace(`${process.env.KV_WEBSITE_ID}:page:`, "")
            );
        }
      };

      return `  <url>
    <loc>${getPageUrl(url)}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>`;
    });

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlMap.join("\n")}
</urlset>`;

    return new NextResponse(sitemap, {
      status: 200,
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to retrieve data" },
      { status: 500 }
    );
  }
}
