import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

const LottoIndex = lazy(() => import("./pages/LottoIndex"));
const SuperenalottoIndex = lazy(() => import("./pages/SuperenalottoIndex"));
const MilliondayIndex = lazy(() => import("./pages/MilliondayIndex"));
const WinforlifeIndex = lazy(() => import("./pages/WinforlifeIndex"));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center" style={{
    background: 'radial-gradient(ellipse at 50% 0%, hsl(220 25% 14%) 0%, hsl(220 20% 7%) 70%)',
  }}>
    <div className="text-center space-y-3">
      <div className="text-4xl animate-pulse">🎰</div>
      <p className="text-sm" style={{ color: 'hsl(220 15% 55%)' }}>Caricamento...</p>
    </div>
  </div>
);

const App = () => (
  <TooltipProvider>
    <Toaster />
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/giocodellotto" element={<LottoIndex />} />
          <Route path="/superenalotto" element={<SuperenalottoIndex />} />
          <Route path="/millionday" element={<MilliondayIndex />} />
          <Route path="/winforlife" element={<WinforlifeIndex />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  </TooltipProvider>
);

export default App;
