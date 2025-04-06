import { useStorageState } from "@/hooks/storage";
import { useContext, createContext, type PropsWithChildren } from "react";

const AuthContext = createContext<{
  setSession: (session: string | null) => void;
  session?: string | null;
  isLoading: boolean;
}>({
  setSession: () => null,
  session: null,
  isLoading: false,
});

// This hook can be used to access the user info.
export function useSession() {
  const value = useContext(AuthContext);
  if (process.env.NODE_ENV !== "production") {
    if (!value) {
      throw new Error("useSession must be wrapped in a <SessionProvider />");
    }
  }

  return value;
}

export function SessionProvider({ children }: PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState("session");

  return (
    <AuthContext.Provider
      value={{
        setSession,
        session,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
