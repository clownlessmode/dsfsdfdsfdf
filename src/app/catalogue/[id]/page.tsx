import { ProductConfigurator } from "./product-configurator";
import { cookies } from "next/headers";

// Cache product pages for 5 minutes to avoid excessive API requests
export const revalidate = 300;

const API_BASE_URL =
  process.env.API_INTERNAL_URL ?? process.env.NEXT_PUBLIC_API_URL;
const API_BASE_URL_NORMALIZED = API_BASE_URL?.replace(/\/+$/, "");

async function getProduct(id: number) {
  const cookieStore = await cookies();
  const idStore = cookieStore.get("foodcort_store_id")?.value;

  if (!idStore || !API_BASE_URL_NORMALIZED) {
    console.warn("[catalogue:id:getProduct] Missing context", {
      id,
      hasIdStore: Boolean(idStore),
      hasApiBaseUrl: Boolean(API_BASE_URL_NORMALIZED),
    });
    return null;
  }

  try {
    const url = `${API_BASE_URL_NORMALIZED}/product-main/find-all-product-per-store/${idStore}/${id}`;
    const response = await fetch(
      url,
      {
        next: { revalidate },
        credentials: "include",
      }
    );

    if (!response.ok) {
      const bodySnippet = (await response.text()).slice(0, 300);
      console.error("[catalogue:id:getProduct] Non-OK response", {
        id,
        idStore,
        url,
        status: response.status,
        statusText: response.statusText,
        bodySnippet,
      });
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
    const product = data.data || data;
    console.log("[catalogue:id:getProduct] Success", {
      id,
      idStore,
      hasProduct: Boolean(product),
      productId: product?.id ?? null,
      productName: product?.name ?? null,
    });

    return product;
  } catch (error) {
    console.error("[catalogue:id:getProduct] Request failed", {
      id,
      idStore,
      error,
    });
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
