"use client";

import { useForm } from "react-hook-form";
import { Button } from "@shared/ui/button";
import { Input } from "@shared/ui/input";
import { Label } from "@shared/ui/label";
import { useVirtualKeyboard } from "@shared/ui/keyboard-input";
import { useEffect, useState } from "react";
import VirtualKeyboard from "@shared/ui/virtual-keyboard";
import { useRouter } from "next/navigation";
import { useTerminalAuth } from "@entities/session/model/terminal-auth";
import { useSession } from "@entities/session";
import { Logotype } from "@shared/ui/logotype";

interface LoginFormData {
  email: string;
  password: string;
  remember: boolean;
}

export default function InitPage() {
  const router = useRouter();
  const form = useForm<LoginFormData>({
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  const [activeField, setActiveField] = useState<keyof LoginFormData | null>(
    null
  );

  const keyboard = useVirtualKeyboard({
    form,
    fieldName: activeField || "email",
  });
  const authStore = useTerminalAuth();
  const { setSession } = useSession();
  const REMEMBERED_EMAIL_KEY = "rememberedEmail";

  useEffect(() => {
    try {
      const savedEmail = localStorage.getItem(REMEMBERED_EMAIL_KEY);
      if (savedEmail) {
        form.setValue("email", savedEmail);
        form.setValue("remember", true);
      }
    } catch {}
  }, [form]);

  const onSubmit = async (data: LoginFormData) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
      {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log(response.json);

    const responseData = await response.json();

    if (responseData.auth === true) {
      try {
        if (data.remember) {
          localStorage.setItem(REMEMBERED_EMAIL_KEY, data.email);
        } else {
          localStorage.removeItem(REMEMBERED_EMAIL_KEY);
        }
      } catch {}
      authStore.authorize();
      console.log(responseData);
      // Сохраняем idStore в сессии, если он есть в ответе
      if (responseData.store.idStore) {
        setSession({
          telephone: "",
          receivingMethod: null,
          idStore: responseData.store.idStore,
        });
      }
      router.push("/");
    } else {
      authStore.deauthorize();
      alert("Авторизация не прошла");
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center px-6 pt-10 pb-[520px] bg-foreground">
      <div className="w-full flex flex-col items-center gap-6 mb-8">
        <Logotype className="w-[520px] h-auto drop-shadow" />
        <div className="text-center">
          <h1 className="text-7xl font-extrabold tracking-tight">
            Вход в терминал
          </h1>
          <p className="text-3xl text-muted-foreground mt-2">
            Авторизуйтесь для продолжения
          </p>
        </div>
      </div>

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full max-w-[960px] rounded-[60px] border bg-card/80 backdrop-blur-md px-12 py-14 grid gap-10"
      >
        <div className="grid gap-4">
          <Label htmlFor="login" className="text-4xl font-bold">
            Логин
          </Label>
          <Input
            id="login"
            {...form.register("email")}
            placeholder="Введите логин"
            onFocus={() => setActiveField("email")}
            className="cursor-pointer"
            readOnly
          />
        </div>

        <div className="grid gap-4">
          <Label htmlFor="password" className="text-4xl font-bold">
            Пароль
          </Label>
          <Input
            id="password"
            type="password"
            {...form.register("password")}
            placeholder="Введите пароль"
            onFocus={() => setActiveField("password")}
            className="cursor-pointer"
            readOnly
          />
        </div>

        <div className="flex items-center gap-4">
          <input
            id="remember"
            type="checkbox"
            {...form.register("remember")}
            className="h-8 w-8 rounded-md border-muted-foreground"
          />
          <Label htmlFor="remember" className="text-3xl font-medium">
            Запомнить логин
          </Label>
        </div>

        <Button type="submit" size="lg" className="w-full rounded-[60px]">
          Войти
        </Button>
      </form>

      <VirtualKeyboard
        onKeyPress={keyboard.handleKeyPress}
        onBackspace={keyboard.handleBackspace}
        onEnter={() => form.handleSubmit(onSubmit)()}
        onSpace={keyboard.handleSpace}
      />
    </div>
  );
}
