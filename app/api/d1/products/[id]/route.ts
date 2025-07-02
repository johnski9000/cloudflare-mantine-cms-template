// app/api/products/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";

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

interface UpdateProductRequest {
  title?: string;
  description?: string;
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
}

// GET /api/products/[id] - Get single product from worker
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const { id } = params;

    const response = await fetch(`${WORKER_URL}/products/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data: WorkerResponse<Product> = await response.json();

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error("Error fetching product from worker:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch product from worker",
      },
      { status: 500 }
    );
  }
}

// PUT /api/products/[id] - Update product via worker
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const { id } = params;
    const body: UpdateProductRequest = await request.json();

    console.log("Updating product with ID:", id, "Data:", body);

    const response = await fetch(`${WORKER_URL}/products/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data: WorkerResponse<Product> = await response.json();

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error("Error updating product via worker:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update product via worker",
      },
      { status: 500 }
    );
  }
}

// DELETE /api/products/[id] - Delete product via worker
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const { id } = params;

    console.log("Deleting product with ID:", id);

    const response = await fetch(`${WORKER_URL}/products/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data: WorkerResponse = await response.json();

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error("Error deleting product via worker:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete product via worker",
      },
      { status: 500 }
    );
  }
}
