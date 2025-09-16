import { IProduct } from "@entities/product/config/types";
import { ProductConfigurator } from "./product-configurator";

export const revalidate = 30; // 30 seconds

async function getProduct(id: number) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/product-main/${id}`,
      {
        next: { revalidate: 30 },
        credentials: "include",
      }
    );
    console.log(response);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    console.log(response);

    const data = await response.json();
    return data.data || data;
  } catch (error) {
    console.error(`Failed to fetch product ${id}:`, error);
    return null;
  }
}

async function getAllProductIds() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/product-main`,
      {
        next: { revalidate: 30 },
        credentials: "include",
      }
    );
    console.log(response);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.data || data;
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return [];
  }
}

export async function generateStaticParams() {
  const products = await getAllProductIds();

  return products.map((product: IProduct) => ({
    id: product.id.toString(),
  }));
}

const CatalogueIdPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const product = await getProduct(Number(id));
  return <ProductConfigurator product={product ?? null} />;
};

export default CatalogueIdPage;
