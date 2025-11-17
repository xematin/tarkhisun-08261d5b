import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import Index from "./pages/Index";
import Blog from "./pages/Blog";
import Currencies from "./pages/Currencies";
import NotFound from "./pages/NotFound";

// Lazy load blog pages for better performance
const BlogPost = lazy(() => import("./pages/BlogPost"));
const HSCodeGuide = lazy(() => import("./pages/HSCodeGuide"));
const CustomsTariffGuide = lazy(() => import("./pages/CustomsTariffGuide"));
const ExchangeRateGuide = lazy(() => import("./pages/ExchangeRateGuide"));
const NTSWGuide = lazy(() => import("./pages/NTSWGuide"));
const IncotermsGuide = lazy(() => import("./pages/IncotermsGuide"));
const BusinessCardGuide = lazy(() => import("./pages/BusinessCardGuide"));
const SanaExchangeRateGuide = lazy(() => import("./pages/SanaExchangeRateGuide"));
const ImportExportGuide = lazy(() => import("./pages/ImportExportGuide"));
const ManifestGuide = lazy(() => import("./pages/ManifestGuide"));
const TahLanjiImportGuide = lazy(() => import("./pages/TahLanjiImportGuide"));
const ExcavationMachineryGuide = lazy(() => import("./pages/ExcavationMachineryGuide"));
const Article1CommissionGuide = lazy(() => import("./pages/Article1CommissionGuide"));
const KuwaitAfghanistanTransitGuide = lazy(() => import("./pages/KuwaitAfghanistanTransitGuide"));
const IslamQalaGuide = lazy(() => import("./pages/IslamQalaGuide"));
const GeneratorClearanceBandarAbbasGuide = lazy(() => import("./pages/GeneratorClearanceBandarAbbasGuide"));
const DubaiToAbbasImportGuide = lazy(() => import("./pages/DubaiToAbbasImportGuide"));
const WaterTankClearanceGuide = lazy(() => import("./pages/WaterTankClearanceGuide"));
const CarPartsImportGuide = lazy(() => import("./pages/CarPartsImportGuide"));
const BandarAbbasComprehensiveGuide = lazy(() => import("./pages/BandarAbbasComprehensiveGuide"));
const HomeAppliancesClearanceGuide = lazy(() => import("./pages/HomeAppliancesClearanceGuide"));
const MobileRegistryGuide = lazy(() => import("./pages/MobileRegistryGuide"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen text-persian">در حال بارگذاری...</div>}>
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
            <Route path="/blog/manifest-customs-complete-guide" element={<ManifestGuide />} />
            <Route path="/blog/tah-lanji-mavani-import-guide" element={<TahLanjiImportGuide />} />
            <Route path="/blog/excavation-machinery-customs-clearance-guide" element={<ExcavationMachineryGuide />} />
            <Route path="/blog/article-1-commission-customs-guide" element={<Article1CommissionGuide />} />
            <Route path="/blog/kuwait-afghanistan-transit-guide" element={<KuwaitAfghanistanTransitGuide />} />
            <Route path="/blog/islam-qala-border-crossing-guide" element={<IslamQalaGuide />} />
            <Route path="/blog/generator-clearance-bandar-abbas-guide" element={<GeneratorClearanceBandarAbbasGuide />} />
            <Route path="/blog/dubai-to-abbas-import-guide" element={<DubaiToAbbasImportGuide />} />
            <Route path="/blog/water-tank-clearance-bandar-abbas-guide" element={<WaterTankClearanceGuide />} />
            <Route path="/blog/car-parts-import-customs-clearance-guide" element={<CarPartsImportGuide />} />
            <Route path="/blog/zero-to-hundred-bandar-abbas-customs-clearance" element={<BandarAbbasComprehensiveGuide />} />
            <Route path="/blog/home-appliances-clearance-bandar-abbas-guide" element={<HomeAppliancesClearanceGuide />} />
            <Route path="/blog/mobile-phone-customs-clearance-registry-guide" element={<MobileRegistryGuide />} />
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
