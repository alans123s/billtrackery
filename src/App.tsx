
/**
 * App Component
 * 
 * Root component that sets up the application's providers and routing.
 * Configures React Query for data fetching and cache management.
 * Sets up authentication context and routing with React Router.
 */

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from './contexts/AuthContext'; 
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Create a client for React Query with default settings
const queryClient = new QueryClient();

/**
 * Root application component that sets up providers and routing
 * Implements a simple routing structure with authentication
 */
const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
