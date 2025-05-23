
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Wallet from "./pages/Wallet";
import Analysis from "./pages/Analysis";
import NotFound from "./pages/NotFound";
import AddTransaction from "./pages/AddTransaction";
import DailyTransactionsPage from "./pages/DailyTransactions";
import FilteredTransactions from "./pages/FilteredTransactions";
import { FinanceProvider } from "./context/FinanceContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <FinanceProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/wallet" element={<Wallet />} />
            <Route path="/analysis" element={<Analysis />} />
            <Route path="/add-transaction" element={<AddTransaction />} />
            <Route path="/transactions/:date" element={<DailyTransactionsPage />} />
            <Route path="/filtered-transactions/:filterType/:filterId/:transactionType/:month/:year" element={<FilteredTransactions />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </FinanceProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
