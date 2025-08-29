import { useQuery } from "@tanstack/react-query";
import { ProductService } from "./service";

export const useProductsController = (id?: number) => {
  const products = useQuery({
    queryKey: ["products", id],
    queryFn: () => ProductService.getProducts(),
  });

  const product = useQuery({
    queryKey: ["product", id],
    enabled: !!id,
    queryFn: () => ProductService.getProduct(id!),
  });
  return {
    products: products.data,
    isProductsLoading: products.isLoading,

    product: product.data,
    isProductLoading: product.isLoading,
  };
};
