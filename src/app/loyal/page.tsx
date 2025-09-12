import { AdvertisementCard } from "@entities/advertisement";
import { LoyalTelephoneForm } from "@features/loyal-telephone-form";

export const dynamic = "force-static";
export const revalidate = 1800; // 30 minutes

const getAdvertisements = async () => {
  if (process.env.NODE_ENV !== "production") {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  return [];
};

const LoyalPage = async () => {
  const advertisements = await getAdvertisements();
  return (
    <main className="flex flex-col min-h-screen p-10 gap-8 bg-muted justify-between">
      <AdvertisementCard
        className="w-full h-[630px]"
        advertisements={advertisements ?? []}
      />
      <div className="flex flex-col gap-8">
        <LoyalTelephoneForm />
      </div>
    </main>
  );
};

export default LoyalPage;
