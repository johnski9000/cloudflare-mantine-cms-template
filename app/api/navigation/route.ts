import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const WORKER_URL = process.env.KV_WORKER_URL;

// Fix the type definition for params
export async function GET(req: NextRequest) {
  try {
    const response = await fetch(
      `${process.env.KV_WORKER_URL}/api/navigation/${process.env.KV_WEBSITE_ID}`
    );
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
    const { pageData } = await req.json(); // ✅ Fixed - No need for `req.body`
    console.log("pageData", pageData);
    const response = await fetch(`${WORKER_URL}/api/navigation`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        websiteId: process.env.KV_WEBSITE_ID,
        pageData: pageData,
      }),
    });
    console.log("response", response);
    const data = await response.json();
    console.log("data", data);
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
