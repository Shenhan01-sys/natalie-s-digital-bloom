import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Loader2 } from "lucide-react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { SiteContentProvider } from "./lib/site-content";
import { AuthProvider } from "./lib/auth";

// Shop and dashboard are split out so the portfolio stays light.
const ShopHome = lazy(() => import("./pages/shop/ShopHome"));
const ProductPage = lazy(() => import("./pages/shop/ProductPage"));
const CheckoutPage = lazy(() => import("./pages/shop/CheckoutPage"));
const OrderPage = lazy(() => import("./pages/shop/OrderPage").then((m) => ({ default: m.OrderPage })));
const MyOrdersPage = lazy(() => import("./pages/shop/OrderPage").then((m) => ({ default: m.MyOrdersPage })));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout"));
const Overview = lazy(() => import("./pages/admin/Overview"));
const Orders = lazy(() => import("./pages/admin/Orders"));
const Products = lazy(() => import("./pages/admin/Products"));
const ProductEditor = lazy(() => import("./pages/admin/ProductEditor"));
const ShopSettings = lazy(() => import("./pages/admin/ShopSettings"));
const ContentPage = lazy(() => import("./pages/admin/ContentPage"));

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false } },
});

const PageLoader = () => (
  <div className="grid min-h-screen place-items-center bg-background">
    <Loader2 className="h-6 w-6 animate-spin text-primary" aria-label="Loading" />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SiteContentProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner position="top-center" richColors />
          <BrowserRouter>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Index />} />

                {/* Public shop */}
                <Route path="/shop" element={<ShopHome />} />
                <Route path="/shop/:slug" element={<ProductPage />} />
                <Route path="/shop/:slug/checkout" element={<CheckoutPage />} />
                <Route path="/order" element={<MyOrdersPage />} />
                <Route path="/order/:id" element={<OrderPage />} />

                {/* Owner only */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<Overview />} />
                  <Route path="orders" element={<Orders />} />
                  <Route path="products" element={<Products />} />
                  <Route path="products/:id" element={<ProductEditor />} />
                  <Route path="shop" element={<ShopSettings />} />
                  <Route path="content" element={<ContentPage />} />
                </Route>

                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </SiteContentProvider>
  </QueryClientProvider>
);

export default App;
