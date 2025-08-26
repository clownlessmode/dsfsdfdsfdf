import { useQuery } from "@tanstack/react-query";
import { AdvertisementService } from "./service";

export const useAdvertisementsController = () => {
  const advertisements = useQuery({
    queryKey: ["advertisements"],
    queryFn: () => AdvertisementService.getAdvertisements(),
  });

  return {
    advertisements: advertisements.data,
    isAdvertisementsLoading: advertisements.isLoading,
  };
};
