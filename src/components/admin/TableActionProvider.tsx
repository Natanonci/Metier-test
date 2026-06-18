"use client";

import { createContext, useContext, useState, useTransition, ReactNode } from "react";

type ActionContextType = {
  isPending: boolean;
  loadingAction: string | null;
  startAction: (actionKey: string, actionFn: () => Promise<void>) => void;
};

const ActionContext = createContext<ActionContextType | null>(null);

export function TableActionProvider({ children }: { children: ReactNode }) {
  const [isPending, startTransition] = useTransition();
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const startAction = (actionKey: string, actionFn: () => Promise<void>) => {
    setLoadingAction(actionKey);
    startTransition(async () => {
      await actionFn();
      setLoadingAction(null);
    });
  };

  return (
    <ActionContext.Provider value={{ isPending, loadingAction, startAction }}>
      {children}
    </ActionContext.Provider>
  );
}

export function useTableAction() {
  const ctx = useContext(ActionContext);
  if (!ctx) throw new Error("useTableAction must be used within TableActionProvider");
  return ctx;
}
