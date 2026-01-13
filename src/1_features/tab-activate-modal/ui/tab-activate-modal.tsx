"use client";

import React, { FC } from "react";
import { Button } from "@shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@shared/ui/dialog";
import { useTerminalAuth } from "@entities/session/model/terminal-auth";
import { useRouter } from "next/navigation";

interface TabActivateModalProps {
  code: number;
  showModal: boolean;
  setShowModal: (show: boolean) => void;
}

export const TabActivateModal: FC<TabActivateModalProps> = ({
  code,
  showModal,
  setShowModal,
}) => {
  const authStore = useTerminalAuth();
  const router = useRouter();

  const handleClose = () => {
    setShowModal(false);
    authStore.authorize();
    router.push("/");
  };

  return (
    <Dialog open={showModal} onOpenChange={setShowModal}>
      <DialogContent className="min-w-[80vw] rounded-[60px]" showCloseButton={false} aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>Введите код на планшете</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <span className="text-9xl text-center py-12">{code}</span>
          <Button onClick={handleClose} className="w-full">
            Хорошо
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
