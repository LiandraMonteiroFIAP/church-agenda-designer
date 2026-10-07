import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { Moon, Sun } from "lucide-react";

type ThemeContextValue = { isDark: boolean; toggleTheme: () => void };
const ThemeContext = createContext<ThemeContextValue | null>(null);
const THEME_STORAGE_KEY = "churchDesignerTheme";

function readInitialTheme() {
    const isDark = localStorage.getItem(THEME_STORAGE_KEY) === "dark";
    document.documentElement.classList.toggle("dark", isDark);
    return isDark;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [isDark, setIsDark] = useState(readInitialTheme);

    useEffect(() => {
        document.documentElement.classList.toggle("dark", isDark);
        localStorage.setItem(THEME_STORAGE_KEY, isDark ? "dark" : "light");
    }, [isDark]);

    function toggleTheme() { setIsDark(current => !current); }

    return <ThemeContext.Provider value={{ isDark, toggleTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) throw new Error("useTheme precisa ser usado dentro de ThemeProvider.");
    return context;
}

export function ThemeToggle() {
    const { isDark, toggleTheme } = useTheme();
    return (
        <button
            type="button"
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={isDark ? "Ativar tema claro" : "Ativar tema escuro"}
            aria-pressed={isDark}
            title={isDark ? "Ativar tema claro" : "Ativar tema escuro"}
        >
            {isDark ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
        </button>
    );
}
