import { useEffect, useState } from "react";

type Theme = "impulsion-dark" | "impulsion-light";

const DEFAULT_THEME: Theme = "impulsion-dark";
const THEME_STORAGE_KEY = "impulsion-theme";

function getInitialTheme(): Theme {
  const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);

  if (storedTheme === "impulsion-dark" || storedTheme === "impulsion-light") {
    return storedTheme;
  }

  return DEFAULT_THEME;
}

function useTheme() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((currentTheme) =>
      currentTheme === "impulsion-dark" ? "impulsion-light" : "impulsion-dark",
    );
  }

  return { theme, toggleTheme };
}

export default useTheme;
