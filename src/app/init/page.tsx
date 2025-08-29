"use client";

import { useForm } from "react-hook-form";
import { Button } from "@shared/ui/button";
import { Input } from "@shared/ui/input";
import { useVirtualKeyboard } from "@shared/ui/keyboard-input";
import { useState } from "react";
import VirtualKeyboard from "@shared/ui/virtual-keyboard";
import { useRouter } from "next/navigation";
import { useTerminalAuth } from "@entities/session/model/terminal-auth";

interface LoginFormData {
  email: string;
  password: string;
}

export default function InitPage() {
  const router = useRouter();
  const form = useForm<LoginFormData>({
    defaultValues: {
      email: "lebedevvv@volcov.ru",
      password: "djF&2Lip",
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

  const onSubmit = async (data: LoginFormData) => {
    const response = await fetch("http://10.1.16.135:3006/api/v2/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const responseData = await response.json();
    console.log(responseData);

    if (responseData.auth === true) {
      alert("Авторизация прошла успешно");
      authStore.authorize();
      router.push("/");
    } else {
      authStore.deauthorize();
      alert("Авторизация не прошла");
    }
  };

  return (
    <div className="min-h-screen bg-muted flex items-center justify-center p-4">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Input
          id="login"
          {...form.register("email")}
          placeholder="Введите логин"
          onFocus={() => setActiveField("email")}
          className="cursor-pointer shadow-2xl"
          readOnly
        />

        <Input
          id="password"
          type="password"
          {...form.register("password")}
          placeholder="Введите пароль"
          onFocus={() => setActiveField("password")}
          className="cursor-pointer shadow-2xl"
          readOnly
        />

        <Button type="submit" size="lg" className="w-full">
          Войти
        </Button>
      </form>

      <VirtualKeyboard
        onKeyPress={keyboard.handleKeyPress}
        onBackspace={keyboard.handleBackspace}
        onSpace={keyboard.handleSpace}
      />
    </div>
  );
}
