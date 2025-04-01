import { useContext } from "react";
import { ThemeContext } from "@/utils/providers";
import { themes } from "@/utils/theme";

export function useTheme() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const colors = themes[theme as keyof typeof themes];

  return {
    theme,
    toggleTheme,
    colors,
  };
}
