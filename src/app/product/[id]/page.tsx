import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PRODUCTS, productById } from "@/lib/catalog";
import ProductDetail from "@/components/ProductDetail";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ id: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = productById(id);
  if (!product) return { title: "Treat not found" };
  return {
    title: product.name,
    description: `${product.tagline}. ${product.description}`,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = productById(id);
  if (!product) notFound();
  return <ProductDetail product={product} />;
}
