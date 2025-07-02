// app/admin/products/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Container, Title, Alert } from "@mantine/core";
import { CiCircleAlert } from "react-icons/ci";
import ProductsGrid from "./ProductsGrid";

interface Product {
  product_id: number;
  title: string;
  description: string;
  price: number;
  image?: string | null;
}

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  count?: number;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/products");
      const result: ApiResponse<Product[]> = await response.json();
      console.log("API Response:", result);

      if (result.success && result.data) {
        setProducts(result.data);
      } else {
        setError(result.error || "Failed to fetch products");
      }
    } catch (err) {
      setError("Failed to fetch products");
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleProductsChange = () => {
    fetchProducts(); // Refresh the list after any CRUD operation
  };

  return (
    <Container size="xl" className="py-8">
      <div className="mb-8">
        <Title order={1} className="text-3xl font-bold text-gray-900 mb-2">
          Products Management
        </Title>
        <p className="text-gray-600">
          Manage your product catalog - create, edit, and delete products.
        </p>
      </div>

      {error && (
        <Alert
          icon={<CiCircleAlert size="1rem" />}
          title="Error"
          color="red"
          className="mb-6"
        >
          {error}
        </Alert>
      )}

      <ProductsGrid
        products={products}
        loading={loading}
        onProductsChange={handleProductsChange}
      />
    </Container>
  );
}
