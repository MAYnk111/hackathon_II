import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import type { Language } from "@/translations";

type FontSize = "small" | "medium" | "large";

interface SettingsContextType {
  darkMode: boolean;
  toggleDarkMode: () => void;
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  loading: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within SettingsProvider");
  }
  return context;
};

const fontSizeMap = {
  small: "14px",
  medium: "16px",
  large: "18px",
};

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const [fontSize, setFontSizeState] = useState<FontSize>("medium");
  const [language, setLanguageState] = useState<Language>("en");
  const [loading, setLoading] = useState(true);

  // Load settings on mount (localStorage first, then Firebase)
  useEffect(() => {
    const loadSettings = async () => {
      // Load from localStorage first (instant)
      const savedLang = localStorage.getItem("app_language") as Language;
      if (savedLang && ["en", "hi", "mr"].includes(savedLang)) {
        setLanguageState(savedLang);
      }

      const savedDarkMode = localStorage.getItem("app_darkMode");
      if (savedDarkMode !== null) {
        const isDark = savedDarkMode === "true";
        setDarkMode(isDark);
        applyTheme(isDark);
      }

      const savedFontSize = localStorage.getItem("app_fontSize") as FontSize;
      if (savedFontSize && ["small", "medium", "large"].includes(savedFontSize)) {
        setFontSizeState(savedFontSize);
        applyFontSize(savedFontSize);
      }

      // If user is logged in, try to load from Firebase (cloud sync)
      if (user) {
        try {
          const settingsDoc = await getDoc(doc(db, "users", user.uid, "settings", "preferences"));
          if (settingsDoc.exists()) {
            const data = settingsDoc.data();
            if (data.darkMode !== undefined) {
              setDarkMode(data.darkMode);
              applyTheme(data.darkMode);
              localStorage.setItem("app_darkMode", String(data.darkMode));
            }
            if (data.fontSize) {
              setFontSizeState(data.fontSize);
              applyFontSize(data.fontSize);
              localStorage.setItem("app_fontSize", data.fontSize);
            }
            if (data.language && ["en", "hi", "mr"].includes(data.language)) {
              setLanguageState(data.language);
              localStorage.setItem("app_language", data.language);
            }
          }
        } catch (error) {
          console.error("Error loading settings from Firebase:", error);
        }
      }
      
      setLoading(false);
    };

    loadSettings();
  }, [user]);

  const applyTheme = (isDark: boolean) => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const applyFontSize = (size: FontSize) => {
    document.documentElement.style.setProperty("--base-font-size", fontSizeMap[size]);
  };

  const toggleDarkMode = async () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    applyTheme(newMode);
    localStorage.setItem("app_darkMode", String(newMode));

    if (user?.uid) {
      try {
        await setDoc(
          doc(db, "users", user.uid, "settings", "preferences"),
          { darkMode: newMode },
          { merge: true }
        );
      } catch (error) {
        console.error("Error saving dark mode to Firestore:", error);
      }
    }
  };

  const setFontSize = async (size: FontSize) => {
    setFontSizeState(size);
    applyFontSize(size);
    localStorage.setItem("app_fontSize", size);

    if (user?.uid) {
      try {
        await setDoc(
          doc(db, "users", user.uid, "settings", "preferences"),
          { fontSize: size },
          { merge: true }
        );
      } catch (error) {
        console.error("Error saving font size to Firestore:", error);
      }
    }
  };

  const setLanguage = async (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("app_language", lang);

    if (user?.uid) {
      try {
        await setDoc(
          doc(db, "users", user.uid, "settings", "preferences"),
          { language: lang },
          { merge: true }
        );
      } catch (error) {
        console.error("Error saving language to Firestore:", error);
      }
    }
  };

  return (
    <SettingsContext.Provider
      value={{
        darkMode,
        toggleDarkMode,
        fontSize,
        setFontSize,
        language,
        setLanguage,
        loading,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};
