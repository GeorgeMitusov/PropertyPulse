"use client";
import { createContext, useContext, useState, ReactNode } from "react";

type GlobalContextType = {
  unreadCount: number;
  setUnreadCount: React.Dispatch<React.SetStateAction<number>>;
};

const GlobalContext = createContext<GlobalContextType>({
  unreadCount: 0,
  setUnreadCount: () => {},
});

export function GlobalProvider({ children }: { children: ReactNode }) {
  const [unreadCount, setUnreadCount] = useState<number>(1);

  return (
    <GlobalContext.Provider
      value={{
        unreadCount,
        setUnreadCount,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}
export function useGlobalContext() {
  return useContext(GlobalContext);
}
