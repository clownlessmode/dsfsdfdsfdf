"use client";
import { useAdvertisementsController } from "@entities/advertisement/api";
import { AdvertisementCard } from "@entities/advertisement/ui/advertisement-card";
import { LoyalTelephoneForm } from "@features/loyal-telephone-form";
import { Button } from "@shared/ui/button";
import { NumericKeyboard } from "@shared/ui/numeric-keyboard";

const LoyalPage = () => {
  const { advertisements } = useAdvertisementsController();
  return (
    <main className="flex flex-col min-h-screen p-20 gap-8 bg-muted justify-between">
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
