import { ProductService } from "@entities/product/api/service";
import { ProductConfigurator } from "./product-configurator";

const CatalogueIdPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const product = await ProductService.getProduct(Number(id));
  return <ProductConfigurator product={product ?? null} />;
};

export default CatalogueIdPage;
