"use client";

import { create } from "zustand";

interface TerminalAuthState {
  authorized: boolean;
  authorize: () => void;
  deauthorize: () => void;
}

export const useTerminalAuth = create<TerminalAuthState>((set) => ({
  authorized: false,
  authorize: () => set({ authorized: true }),
  deauthorize: () => set({ authorized: false }),
}));
