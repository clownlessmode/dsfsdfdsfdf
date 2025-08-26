import { LoyalTelephoneForm } from "@features/loyal-telephone-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@shared/ui/tabs";

const LoyalPage = () => {
  return (
    <main className="flex flex-col min-h-screen p-8 gap-8">
      <figure className="flex-1 flex items-center justify-center bg-muted text-muted-foreground font-black w-full rounded-xl">
        Реклама
      </figure>
      <Tabs defaultValue="telephone">
        <TabsList className="w-full">
          <TabsTrigger value="telephone">По номеру телефона</TabsTrigger>
          <TabsTrigger value="qr">По QR-Коду</TabsTrigger>
        </TabsList>
        <TabsContent value="telephone">
          <LoyalTelephoneForm />
        </TabsContent>
        <TabsContent value="password">Change your password here.</TabsContent>
      </Tabs>
    </main>
  );
};

export default LoyalPage;
