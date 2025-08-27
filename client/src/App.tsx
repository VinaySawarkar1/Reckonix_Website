import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { queryClient } from "./lib/queryClient";
import CartPage from "./pages/cart";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "./context/auth-context";
import { CartProvider } from "./context/cart-context";
import Header from "./components/header";
import Footer from "./components/footer";
import Home from "./pages/home";
import Products from "./pages/products";
import ProductDetail from "./pages/product-detail";
import About from "./pages/about";
import Contact from "./pages/contact";
import Customers from "./pages/customers";
import AdminLogin from "./pages/admin/login";
import AdminDashboard from "./pages/admin/dashboard";
import NotFound from "@/pages/not-found";
import Career from "./pages/Career";
import GalleryPage from "./pages/gallery";
import ChatbotSummariesAdmin from "./pages/admin/chatbot-summaries";
import CategoryManagement from "./pages/admin/category-management";
import { CategoryProvider } from "@/context/category-context";
import Chatbot from "./components/chatbot";
import Performance from "./components/performance";
import MultifunctionCalibrator from "./pages/product-categories/multifunction-calibrator";
import VisionMeasuringMachine from "./pages/product-categories/vision-measuring-machine";
import TapeScaleCalibrator from "./pages/product-categories/tape-scale-calibrator";
import EventDetail from "./pages/event-detail";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/products" component={Products} />
      <Route path="/products/:id" component={ProductDetail} />
      <Route path="/products/multifunction-calibrator" component={MultifunctionCalibrator} />
      <Route path="/products/vision-measuring-machine" component={VisionMeasuringMachine} />
      <Route path="/products/tape-scale-calibrator" component={TapeScaleCalibrator} />
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
      <Route path="/customers" component={Customers} />

      <Route path="/cart" component={CartPage} />

      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/category-management" component={CategoryManagement} />
      <Route path="/career" component={Career} />
      <Route path="/gallery" component={GalleryPage} />
      <Route path="/event-detail" component={EventDetail} />
      <Route path="/admin/chatbot-summaries" component={ChatbotSummariesAdmin} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <CategoryProvider>
        <TooltipProvider>
          <AuthProvider>
            <CartProvider>
              <Performance />
              <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1">
                  <Router />
                </main>
                <Footer />
              </div>
              <Toaster />
              <Chatbot />
            </CartProvider>
          </AuthProvider>
        </TooltipProvider>
        </CategoryProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;