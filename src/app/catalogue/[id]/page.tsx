import { ProductService } from "@entities/product/api/service";
import { ProductConfigurator } from "./product-configurator";
import { mock as productsMock } from "@entities/product";

export const dynamic = "force-static";
export const revalidate = 1800; // 30 minutes

export function generateStaticParams() {
  return productsMock.map((product) => ({ id: product.id.toString() }));
}

const CatalogueIdPage = async ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const product = await ProductService.getProduct(Number(id));
  return <ProductConfigurator product={product ?? null} />;
};

export default CatalogueIdPage;
