"use client";

import React, { useEffect, useState } from "react";

function useDarkMode() {
  const [theme, setTheme] = useState<string>(
    typeof window !== "undefined"
      ? localStorage.getItem("theme") || "light"
      : "light"
  );

  useEffect(() => {
    const root = window.document.documentElement;
    const prevMode = theme === "dark" ? "light" : "dark";
    root.classList.remove(prevMode);
    root.classList.add(theme);
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", theme);
    }
  }, [theme]);

  return [theme, setTheme] as const;
}

export default useDarkMode;
