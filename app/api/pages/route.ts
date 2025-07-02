import { NextResponse } from "next/server";

const WORKER_URL = process.env.KV_WORKER_URL;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body) {
      return NextResponse.json(
        { error: "Missing slug or pageData" },
        { status: 400 }
      );
    }

    const response = await fetch(`${WORKER_URL}/api/pages/${body.slug}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pageData: body,
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
