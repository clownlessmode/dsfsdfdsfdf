"use client";

import { NumericKeyboard } from "@shared/ui/numeric-keyboard";
import React from "react";
import { useForm } from "../model";
import { Form, FormControl, FormField, FormItem } from "@shared/ui/form";
import { FormValues } from "../config";

export const LoyalTelephoneForm = () => {
  const form = useForm();

  const handleSubmit = async (data: FormValues) => {
    console.log(data);
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-col"
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
      </form>
    </Form>
  );
};
