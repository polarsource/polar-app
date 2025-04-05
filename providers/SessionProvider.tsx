import { useStorageState } from "@/hooks/storage";
import { router } from "expo-router";
import {
  useContext,
  createContext,
  type PropsWithChildren,
  useCallback,
} from "react";

const AuthContext = createContext<{
  setSession: (session: string | null) => void;
  signOut: () => void;
  session?: string | null;
  isLoading: boolean;
}>({
  setSession: () => null,
  signOut: () => null,
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

  const signOut = useCallback(() => {
    setSession(null);
    router.replace("/");
  }, [setSession]);

  return (
    <AuthContext.Provider
      value={{
        setSession,
        signOut,
        session,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
