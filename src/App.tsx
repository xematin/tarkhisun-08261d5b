import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { PageLoader } from "@/components/Loader";

const Index = lazy(() => import("./pages/Index"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const HSCodeGuide = lazy(() => import("./pages/HSCodeGuide"));
const CustomsTariffGuide = lazy(() => import("./pages/CustomsTariffGuide"));
const ExchangeRateGuide = lazy(() => import("./pages/ExchangeRateGuide"));
const NTSWGuide = lazy(() => import("./pages/NTSWGuide"));
const IncotermsGuide = lazy(() => import("./pages/IncotermsGuide"));
const BusinessCardGuide = lazy(() => import("./pages/BusinessCardGuide"));
const SanaExchangeRateGuide = lazy(() => import("./pages/SanaExchangeRateGuide"));
const ImportExportGuide = lazy(() => import("./pages/ImportExportGuide"));
const Currencies = lazy(() => import("./pages/Currencies"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
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
            <Route path="/blog/import-export-iran-complete-guide" element={<ImportExportGuide />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/currencies" element={<Currencies />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
