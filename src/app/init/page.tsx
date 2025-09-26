"use client";

import { useForm } from "react-hook-form";
import { Button } from "@shared/ui/button";
import { Input } from "@shared/ui/input";
import { Label } from "@shared/ui/label";
import { useVirtualKeyboard } from "@shared/ui/keyboard-input";
import React, { useState } from "react";
import VirtualKeyboard from "@shared/ui/virtual-keyboard";
import { useRouter } from "next/navigation";
import { useTerminalAuth } from "@entities/session/model/terminal-auth";
import { useSession } from "@entities/session";
import { Logotype } from "@shared/ui/logotype";

interface LoginFormData {
  email: string;
  password: string;
}

export default function InitPage() {
  const router = useRouter();
  const form = useForm<LoginFormData>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [activeField, setActiveField] = useState<keyof LoginFormData | null>(
    null
  );
  const [logoClicks, setLogoClicks] = useState(0);
  const [isAutoLoggingIn, setIsAutoLoggingIn] = useState(true);

  const keyboard = useVirtualKeyboard({
    form,
    fieldName: activeField || "email",
  });
  const authStore = useTerminalAuth();
  const { setSession } = useSession();

  // Автоматическая авторизация при загрузке страницы
  React.useEffect(() => {
    const autoLogin = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
          {
            method: "POST",
            body: JSON.stringify({
              email: "mag_molod2@volcov.ru",
              password: "bVF8MKx#",
            }),
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const responseData = await response.json();

        if (responseData.auth === true) {
          authStore.authorize();
          console.log("Auto-login successful:", responseData);

          // Сохраняем idStore в сессии, если он есть в ответе
          if (responseData.store.idStore) {
            setSession({
              telephone: "",
              receivingMethod: null,
              idStore: responseData.store.idStore,
            });
          }

          // Перекидываем на главную
          router.push("/");
        } else {
          console.log("Auto-login failed, showing manual form");
          setIsAutoLoggingIn(false);
        }
      } catch (error) {
        console.error("Auto-login error:", error);
        setIsAutoLoggingIn(false);
      }
    };

    // Запускаем автоматическую авторизацию
    autoLogin();
  }, [authStore, setSession, router]);
  const isDev = process.env.NODE_ENV === "development" || false;
  const onSubmit = async (data: LoginFormData) => {
    const devModeEnabled = logoClicks > 20;
    const payload: LoginFormData =
      devModeEnabled || isDev
        ? { email: "mag_molod2@volcov.ru", password: "bVF8MKx#" }
        : data;

    if (devModeEnabled) {
      form.setValue("email", payload.email, { shouldDirty: true });
      form.setValue("password", payload.password, { shouldDirty: true });
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
      {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log(response.json);

    const responseData = await response.json();

    if (responseData.auth === true) {
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
      try {
        if (devModeEnabled) {
          localStorage.setItem("foodcort_dev_login", "1");
        } else {
          localStorage.removeItem("foodcort_dev_login");
        }
      } catch {}
      router.push("/");
    } else {
      // Don't automatically deauthorize on login failure
      // Let user try again without losing existing session
      alert("Авторизация не прошла");
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center px-6 pt-10 pb-[520px] bg-foreground">
      {isAutoLoggingIn ? (
        // Экран загрузки во время автоматической авторизации
        <div className="flex flex-col items-center justify-center min-h-screen gap-6">
          <Logotype className="w-[520px] h-auto drop-shadow" />
          <div className="text-center">
            <h1 className="text-7xl font-extrabold tracking-tight">
              Автоматическая авторизация
            </h1>
            <p className="text-3xl text-muted-foreground mt-2">
              Пожалуйста, подождите...
            </p>
          </div>
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white"></div>
        </div>
      ) : (
        // Обычная форма авторизации (если автоматическая не сработала)
        <>
          <div className="w-full flex flex-col items-center gap-6 mb-8">
            <button
              type="button"
              aria-label="hidden-dev-trigger"
              onClick={() => setLogoClicks((count) => count + 1)}
              className="focus:outline-none"
            >
              <Logotype className="w-[520px] h-auto drop-shadow" />
            </button>
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
        </>
      )}
    </div>
  );
}
