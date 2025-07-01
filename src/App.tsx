
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import AnalysisResults from "./pages/AnalysisResults";
import Settings from "./pages/Settings";
import Analytics from "./pages/Analytics";
import AnalysisPage from "./pages/AnalysisPage";
import GraphPage from "./pages/GraphPage";
import LiveTestPage from "./pages/LiveTestPage";
import BottomNavigation from "./components/BottomNavigation";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark" storageKey="sperm-analysis-theme">
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="min-h-screen pb-20 bg-[#0D1B2A] text-white">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/analysis" element={<AnalysisPage />} />
                <Route path="/analysis-results" element={<AnalysisResults />} />
                <Route path="/graphs" element={<GraphPage />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/live-test" element={<LiveTestPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
            <BottomNavigation />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
