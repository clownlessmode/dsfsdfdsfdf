import { useQuery } from "@tanstack/react-query";
import { ProductService } from "./service";

export const useProductsController = () => {
  const products = useQuery({
    queryKey: ["products"],
    queryFn: () => ProductService.getProducts(),
  });

  return {
    products: products.data,
    isProductsLoading: products.isLoading,
  };
};
