import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import HSCodeGuide from "./pages/HSCodeGuide";
import CustomsTariffGuide from "./pages/CustomsTariffGuide";
import ExchangeRateGuide from "./pages/ExchangeRateGuide";
import NTSWGuide from "./pages/NTSWGuide";
import IncotermsGuide from "./pages/IncotermsGuide";
import BusinessCardGuide from "./pages/BusinessCardGuide";
import SanaExchangeRateGuide from "./pages/SanaExchangeRateGuide";
import Currencies from "./pages/Currencies";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/customs-tariff-definition-importance" element={<CustomsTariffGuide />} />
          <Route path="/blog/hs-code-guide-harmonized-system" element={<HSCodeGuide />} />
          <Route path="/blog/exchange-rate-guide" element={<ExchangeRateGuide />} />
          <Route path="/blog/ntsw-complete-guide" element={<NTSWGuide />} />
          <Route path="/blog/incoterms-complete-guide" element={<IncotermsGuide />} />
          <Route path="/blog/business-card-complete-guide" element={<BusinessCardGuide />} />
          <Route path="/blog/sana-nima-exchange-rate-difference" element={<SanaExchangeRateGuide />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/currencies" element={<Currencies />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
