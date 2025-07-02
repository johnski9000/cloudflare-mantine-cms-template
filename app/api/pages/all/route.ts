import { NextResponse } from "next/server";

const WORKER_URL = process.env.KV_WORKER_URL;

export async function GET() {
  try {
    // Fetch all keys from Cloudflare KV
    const response = await fetch(`${WORKER_URL}/api/pages/all`, {
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

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to retrieve data" },
      { status: 500 }
    );
  }
}
