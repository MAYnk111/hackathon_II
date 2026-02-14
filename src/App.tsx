import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import MedicineSafety from "./pages/MedicineSafety";
import SymptomAwareness from "./pages/SymptomAwareness";
import Nutrition from "./pages/Nutrition";
import TrustEthics from "./pages/TrustEthics";
import RequireAuth from "@/components/RequireAuth";
import RootRedirect from "@/components/RootRedirect";
import { AuthProvider } from "@/hooks/useAuth";
import { SettingsProvider } from "@/contexts/SettingsContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <SettingsProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<RootRedirect />} />
              <Route path="/login" element={<Auth />} />
              <Route
                path="/dashboard"
                element={
                  <RequireAuth>
                    <Index />
                  </RequireAuth>
                }
              />
              <Route
                path="/profile"
                element={
                  <RequireAuth>
                    <Profile />
                  </RequireAuth>
                }
              />
              <Route
                path="/medicine-safety"
                element={
                  <RequireAuth>
                    <MedicineSafety />
                  </RequireAuth>
                }
              />
              <Route
                path="/symptom-awareness"
                element={
                  <RequireAuth>
                    <SymptomAwareness />
                  </RequireAuth>
                }
              />
              <Route
                path="/nutrition"
                element={
                  <RequireAuth>
                    <Nutrition />
                  </RequireAuth>
                }
              />
              <Route
                path="/trust-ethics"
                element={
                  <RequireAuth>
                    <TrustEthics />
                  </RequireAuth>
                }
              />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </SettingsProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
