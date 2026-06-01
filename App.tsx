import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ConfirmDialogProvider } from "@/components/ui/confirm-dialog";
import Index from "./pages/Index";
import About from "./pages/About";
import Services from "./pages/Services";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
import Calendar from "./pages/Calendar";
import ActivityCenter from "./pages/ActivityCenter";
import Profile from "./pages/Profile";
import WhatsNew from "./pages/WhatsNew";
import Sparks from "./pages/Sparks";
import Discounts from "./pages/Discounts";
import Donations from "./pages/Donations";
import Contact from "./pages/Contact";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <AuthProvider>
          <ConfirmDialogProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/about" element={<About />} />
                <Route path="/services" element={<Services />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/activity-center" element={<ActivityCenter />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/whats-new" element={<WhatsNew />} />
                <Route path="/sparks" element={<Sparks />} />
                <Route path="/discounts" element={<Discounts />} />
                <Route path="/donations" element={<Donations />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </ConfirmDialogProvider>
        </AuthProvider>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
