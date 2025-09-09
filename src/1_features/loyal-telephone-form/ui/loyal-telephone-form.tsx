"use client";

import { NumericKeyboard } from "@shared/ui/numeric-keyboard";
import React from "react";
import { useForm } from "../model";
import { Form, FormControl, FormField, FormItem } from "@shared/ui/form";
import { FormValues } from "../config";
import { Button } from "@shared/ui/button";
import Link from "next/link";
import { useSession } from "@entities/session";
import { useRouter } from "next/navigation";

export const LoyalTelephoneForm = () => {
  const form = useForm();
  const { setSession } = useSession();
  const router = useRouter();

  const handleSubmit = async (data: FormValues) => {
    setSession({ telephone: data.telephone, receivingMethod: null });
    router.push("/receiving-method");
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-10"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <FormField
          control={form.control}
          name="telephone"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <NumericKeyboard {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="flex flex-row gap-10 w-full  max-w-[920px]">
          <Button className="bg-white text-foreground shadow-xl flex-1 shrink min-w-0">
            <Link href={"/receiving-method"} className="w-full">
              Пропустить
            </Link>
          </Button>
          <Button
            className="flex-1 shrink min-w-0"
            disabled={!form.formState.isValid}
          >
            Войти
          </Button>
        </div>
        <p className="opacity-40 text-center text-3xl text-foreground pb-10">
          Продолжая, я соглашаюсь с условиями{" "}
          <Link href={"/terms"} className="text-primary">
            Пользовательского соглашения
          </Link>
        </p>
      </form>
    </Form>
  );
};
