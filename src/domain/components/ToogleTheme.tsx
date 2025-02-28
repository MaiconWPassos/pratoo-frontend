import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Button } from "@/external/components/ui/button";
import { Moon, Sun } from "lucide-react";
import constants from "../styles/constants";

function ToggleTheme() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      aria-label="Toogle Theme"
    >
      {theme === "light" ? (
        <Moon size={constants.iconSize} />
      ) : (
        <Sun size={constants.iconSize} />
      )}
    </Button>
  );
}

export default ToggleTheme;
