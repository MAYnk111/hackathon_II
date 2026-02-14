import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useTranslation } from "react-i18next";

type FontSize = "small" | "medium" | "large";
type Language = "en" | "hi";

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
  const { i18n } = useTranslation();
  const [darkMode, setDarkMode] = useState(false);
  const [fontSize, setFontSizeState] = useState<FontSize>("medium");
  const [language, setLanguageState] = useState<Language>("en");
  const [loading, setLoading] = useState(true);

  // Load settings from Firestore
  useEffect(() => {
    const loadSettings = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const settingsDoc = await getDoc(doc(db, "users", user.uid, "settings", "preferences"));
        if (settingsDoc.exists()) {
          const data = settingsDoc.data();
          if (data.darkMode !== undefined) {
            setDarkMode(data.darkMode);
            applyTheme(data.darkMode);
          }
          if (data.fontSize) {
            setFontSizeState(data.fontSize);
            applyFontSize(data.fontSize);
          }
          if (data.language) {
            setLanguageState(data.language);
            await i18n.changeLanguage(data.language);
            console.log("Language loaded from Firestore:", data.language);
          }
        }
      } catch (error) {
        console.error("Error loading settings:", error);
      } finally {
        setLoading(false);
      }
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
    console.log("Dark mode toggled to:", newMode);

    if (user?.uid) {
      try {
        await setDoc(
          doc(db, "users", user.uid, "settings", "preferences"),
          { darkMode: newMode },
          { merge: true }
        );
        console.log("Dark mode saved to Firestore:", newMode);
      } catch (error) {
        console.error("Error saving dark mode to Firestore:", error);
      }
    } else {
      console.warn("Cannot save dark mode: User not authenticated");
    }
  };

  const setFontSize = async (size: FontSize) => {
    setFontSizeState(size);
    applyFontSize(size);
    console.log("Font size changed to:", size, "(", fontSizeMap[size], ")");

    if (user?.uid) {
      try {
        await setDoc(
          doc(db, "users", user.uid, "settings", "preferences"),
          { fontSize: size },
          { merge: true }
        );
        console.log("Font size saved to Firestore:", size);
      } catch (error) {
        console.error("Error saving font size to Firestore:", error);
      }
    } else {
      console.warn("Cannot save font size: User not authenticated");
    }
  };

  const setLanguage = async (lang: Language) => {
    console.log("Setting language to:", lang);
    setLanguageState(lang);
    
    // Update i18next language immediately
    try {
      await i18n.changeLanguage(lang);
      console.log("i18next language changed to:", lang);
    } catch (error) {
      console.error("Error changing i18next language:", error);
    }

    // Save to Firestore if user is logged in
    if (user?.uid) {
      try {
        await setDoc(
          doc(db, "users", user.uid, "settings", "preferences"),
          { language: lang },
          { merge: true }
        );
        console.log("Language saved to Firestore:", lang);
      } catch (error) {
        console.error("Error saving language to Firestore:", error);
      }
    } else {
      console.warn("Cannot save language: User not authenticated");
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
