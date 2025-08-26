import { useQuery } from "@tanstack/react-query";
import { CategoryService } from "./service";

export const useCategoriesController = () => {
  const categories = useQuery({
    queryKey: ["categories"],
    queryFn: () => CategoryService.getCategories(),
  });

  return {
    categories: categories.data,
    isCategoriesLoading: categories.isLoading,
  };
};
