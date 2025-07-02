import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const WORKER_URL = process.env.KV_WORKER_URL;

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const pageUrl = url.searchParams.get("pageUrl");

    if (!pageUrl) {
      return NextResponse.json(
        { error: "pageUrl parameter is required" },
        { status: 400 }
      );
    }

    const key = pageUrl.startsWith(process.env.KV_WEBSITE_ID + ":")
      ? pageUrl
      : `${process.env.KV_WEBSITE_ID}:page:${pageUrl}`;

    const response = await fetch(`${WORKER_URL}/api/pages/${key}`);

    if (!response.ok) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching from Worker:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { slug, pageData } = await req.json();
    const key = slug.startsWith(process.env.KV_WEBSITE_ID + ":")
      ? slug
      : `${process.env.KV_WEBSITE_ID}:page:${slug}`;

    const response = await fetch(`${WORKER_URL}/api/pages/${key}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pageData: pageData,
        websiteId: process.env.KV_WEBSITE_ID,
      }),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to store data" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error posting to Worker:", error);
    return NextResponse.json(
      { error: "Failed to store data" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { slug } = await req.json();
    console.log("Deleting page with slug:", slug);

    const response = await fetch(`${WORKER_URL}/api/pages/delete/${slug}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        websiteId: process.env.KV_WEBSITE_ID,
      }),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to delete data" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting from Worker:", error);
    return NextResponse.json(
      { error: "Failed to delete data" },
      { status: 500 }
    );
  }
}
