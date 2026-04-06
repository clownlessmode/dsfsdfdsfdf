import { ProductConfigurator } from "./product-configurator";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";
// Cache product pages for 5 minutes to avoid excessive API requests
export const revalidate = 300;
const API_BASE_URLS = [
  process.env.API_INTERNAL_URL,
  process.env.NEXT_PUBLIC_API_URL,
].filter((v, i, arr): v is string => Boolean(v) && arr.indexOf(v) === i);

async function getProduct(id: number) {
  const cookieStore = await cookies();
  const idStore = cookieStore.get("foodcort_store_id")?.value;

  if (!idStore || API_BASE_URLS.length === 0) {
    console.warn("Store ID cookie or API base URL is missing");
    return null;
  }

  for (const baseUrl of API_BASE_URLS) {
    try {
      const response = await fetch(
        `${baseUrl}/product-main/find-all-product-per-store/${idStore}/${id}`,
        {
          next: { revalidate },
          credentials: "include",
        }
      );

      if (!response.ok || response.status === 204) {
        continue;
      }

      // Проверяем что ответ содержит контент
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        continue;
      }

      // Проверяем что тело ответа не пустое
      const text = await response.text();
      if (!text || text.trim() === "") {
        continue;
      }

      // Парсим JSON только если есть валидный контент
      const data = JSON.parse(text);
      if (!data) continue;

      return data.data || data;
    } catch (error) {
      console.error(`Failed to fetch product ${id} from ${baseUrl}:`, error);
    }
  }
  return null;
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
