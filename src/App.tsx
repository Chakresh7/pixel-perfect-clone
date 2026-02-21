import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Overview from "./pages/dashboard/Overview";
import NewProject from "./pages/dashboard/NewProject";
import Analytics from "./pages/dashboard/Analytics";
import Documents from "./pages/dashboard/projects/Documents";
import TestConsole from "./pages/dashboard/projects/TestConsole";
import Deploy from "./pages/dashboard/projects/Deploy";
import Configuration from "./pages/dashboard/projects/Configuration";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Overview />} />
          <Route path="/dashboard/new" element={<NewProject />} />
          <Route path="/dashboard/analytics" element={<Analytics />} />
          <Route path="/dashboard/projects/:id/documents" element={<Documents />} />
          <Route path="/dashboard/projects/:id/test" element={<TestConsole />} />
          <Route path="/dashboard/projects/:id/deploy" element={<Deploy />} />
          <Route path="/dashboard/projects/:id/configuration" element={<Configuration />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
