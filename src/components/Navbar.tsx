import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useSettings } from "@/contexts/SettingsContext";
import { languageNames, type Language } from "@/translations";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const { language, setLanguage } = useSettings();
  const navigate = useNavigate();

  const links = [
    { label: "Medicine Safety", path: "/medicine-safety" },
    { label: "Symptom Awareness", path: "/symptom-awareness" },
    { label: "Nutrition", path: "/nutrition" },
    { label: "AI Assistant", path: "/chat" },
    { label: "Trust & Ethics", path: "/trust-ethics" },
  ];

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50"
    >
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link to={user ? "/dashboard" : "/login"} className="flex items-center gap-3">
          <img 
            src="/sudha-logo.png"
            alt="SUDHA Healthcare Logo"
            className="h-8 sm:h-10 w-auto object-contain drop-shadow-sm"
          />
          <div className="hidden sm:flex flex-col -space-y-1">
            <span className="font-heading font-bold text-xl text-foreground tracking-tight">SUDHA</span>
            <span className="text-xs text-primary/70 font-medium">सुधा</span>
          </div>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <button
              key={link.label}
              onClick={() => navigate(link.path)}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-300 cursor-pointer"
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => navigate("/dashboard#sos")}
            className="text-sm font-semibold bg-sos text-sos-foreground px-4 py-2 rounded-xl hover:opacity-90 transition-opacity duration-300 cursor-pointer"
          >
            SOS
          </button>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as Language)}
            className="text-sm font-medium bg-muted text-foreground px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
          >
            {Object.entries(languageNames).map(([code, name]) => (
              <option key={code} value={code}>
                {name}
              </option>
            ))}
          </select>
          {user ? (
            <>
              <Button variant="ghost" asChild>
                <Link to="/profile">Profile</Link>
              </Button>
              <Button
                variant="ghost"
                onClick={async () => {
                  await logout();
                  navigate("/login");
                }}
              >
                Log out
              </Button>
            </>
          ) : (
            <Button asChild>
              <Link to="/login">Log in</Link>
            </Button>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-foreground"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-background border-b border-border overflow-hidden"
          >
            <div className="px-6 py-4 flex flex-col gap-4">
              {links.map((link) => (
                <button
                  key={link.label}
                  onClick={() => {
                    navigate(link.path);
                    setIsOpen(false);
                  }}
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors text-left"
                >
                  {link.label}
                </button>
              ))}
              <button
                onClick={() => {
                  navigate("/dashboard#sos");
                  setIsOpen(false);
                }}
                className="text-sm font-semibold bg-sos text-sos-foreground px-4 py-2 rounded-xl text-center"
              >
                SOS Emergency
              </button>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="text-sm font-medium bg-muted text-foreground px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary w-full"
              >
                {Object.entries(languageNames).map(([code, name]) => (
                  <option key={code} value={code}>
                    {name}
                  </option>
                ))}
              </select>
              {user ? (
                <>
                  <Button variant="ghost" asChild onClick={() => setIsOpen(false)}>
                    <Link to="/profile">Profile</Link>
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={async () => {
                      await logout();
                      navigate("/login");
                      setIsOpen(false);
                    }}
                  >
                    Log out
                  </Button>
                </>
              ) : (
                <Button asChild onClick={() => setIsOpen(false)}>
                  <Link to="/login">Log in</Link>
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
