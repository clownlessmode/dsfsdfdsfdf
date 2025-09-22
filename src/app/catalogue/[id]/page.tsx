import { IProduct } from "@entities/product/config/types";
import { ProductConfigurator } from "./product-configurator";

export const revalidate = 0; // No caching

async function getProduct(id: number) {
  try {
    const timestamp = Date.now();
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/product-main/${id}?_cb=${timestamp}&_force_reload=true`,
      {
        credentials: "include",
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log(data);

    return data.data || data;
  } catch (error) {
    console.error(`Failed to fetch product ${id}:`, error);
    return null;
  }
}

async function getAllProductIds() {
  try {
    const timestamp = Date.now();
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/product-main?_cb=${timestamp}&_force_reload=true`,
      {
        credentials: "include",
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
    const data = await response.json();
    console.log(data);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
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
