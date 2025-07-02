// app/api/products/route.ts
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

const WORKER_URL = "https://d1.jwdigitalltd.workers.dev";

interface Product {
  id: string;
  title: string;
  description: string;
  adultPrice?: number;
  childPrice?: number;
  offersTitle?: string;
  offersDescription?: string;
  image?: string | null;
  freeGift: string[];
  offersList: Array<{ name: string; price: number }>;
  calendarActive: boolean;
  seasonPrices: Array<{
    color: string;
    seasonName: string;
    adultPrice: number;
    childPrice: number;
  }>;
}

interface CreateProductRequest {
  id?: string; // Optional, will be generated if not provided
  title: string;
  description: string;
  adultPrice?: number;
  childPrice?: number;
  offersTitle?: string;
  offersDescription?: string;
  image?: string;
  freeGift?: string[];
  offersList?: Array<{ name: string; price: number }>;
  calendarActive?: boolean;
  seasonPrices?: Array<{
    color: string;
    seasonName: string;
    adultPrice: number;
    childPrice: number;
  }>;
}

interface WorkerResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  count?: number;
}

// GET /api/products - Get all products from worker
export async function GET(): Promise<NextResponse> {
  try {
    const response = await fetch(`${WORKER_URL}/products`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Worker responded with status: ${response.status}`);
    }

    const data: WorkerResponse<Product[]> = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching products from worker:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch products from worker",
      },
      { status: 500 }
    );
  }
}

// POST /api/products - Create new product via worker
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body: CreateProductRequest = await request.json();

    // Basic validation before sending to worker
    if (!body.title) {
      return NextResponse.json(
        { success: false, error: "Title is required" },
        { status: 400 }
      );
    }

    // Generate a unique ID if not provided
    if (!body.id) {
      body.id = uuidv4();
    }

    // Set defaults for optional fields
    const productData = {
      id: body.id,
      title: body.title,
      description: body.description || "",
      adultPrice: body.adultPrice || 0,
      childPrice: body.childPrice || 0,
      offersTitle: body.offersTitle || "",
      offersDescription: body.offersDescription || "",
      image: body.image || "",
      freeGift: body.freeGift || [],
      offersList: body.offersList || [],
      calendarActive: body.calendarActive || false,
      seasonPrices: body.seasonPrices || [],
    };

    console.log("Creating product with data:", productData);

    const response = await fetch(`${WORKER_URL}/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
    });

    const data: WorkerResponse<Product> = await response.json();

    // Return the same status code as the worker
    return NextResponse.json(data, {
      status: response.ok ? (data.data ? 201 : 200) : response.status,
    });
  } catch (error) {
    console.error("Error creating product via worker:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create product via worker",
      },
      { status: 500 }
    );
  }
}
