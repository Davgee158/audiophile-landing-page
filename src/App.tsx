import "./App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ModalProvider } from "./context/modalContext.tsx";
import { AuthProvider } from "./context/authContext.tsx";
import { CartProvider } from "./context/cartContext.tsx";
import HomePage from "./pages/HomePage.tsx";
import { lazy, Suspense, useEffect } from "react";
import Spinner from "./components/Spinner.tsx";

// Lazy load pages
const CategoryPage = lazy(() => import("./pages/CategoryPage.tsx"));
const DetailsPage = lazy(() => import("./pages/DetailsPage.tsx"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage.tsx"));
const OrderHistoryPage = lazy(() => import("./pages/OrderHistoryPage.tsx"));

function AppContent() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <Suspense fallback={<Spinner />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/category/:type" element={<CategoryPage />} />
        <Route path="/category/:type/:id" element={<DetailsPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/orders" element={<OrderHistoryPage />} />
      </Routes>
    </Suspense>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ModalProvider>
          <CartProvider>
            <AppContent />
          </CartProvider>
        </ModalProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
