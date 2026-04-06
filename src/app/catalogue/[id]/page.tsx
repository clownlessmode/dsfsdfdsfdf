import { ProductConfigurator } from "./product-configurator";
import { cookies } from "next/headers";

// Cache product pages for 5 minutes to avoid excessive API requests
export const revalidate = 0;

async function getProduct(id: number) {
  const cookieStore = await cookies();
  const idStore = cookieStore.get("foodcort_store_id")?.value;

  if (!idStore) {
    console.warn("Store ID not found in cookies");
    return null;
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/product-main/find-all-product-per-store/${idStore}/${id}`,
      {
        next: { revalidate },
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Проверяем что ответ содержит контент
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error(`Invalid content type: ${contentType}`);
    }

    // Проверяем что тело ответа не пустое
    const text = await response.text();
    if (!text || text.trim() === "") {
      throw new Error("Empty response body");
    }

    // Парсим JSON только если есть валидный контент
    const data = JSON.parse(text);
    console.log(data);

    return data.data || data;
  } catch (error) {
    console.error(`Failed to fetch product ${id}:`, error);
    return null;
  }
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
