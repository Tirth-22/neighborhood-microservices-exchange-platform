import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Services from "./pages/Services";
import MyRequests from "./pages/MyRequests";
import RequestService from "./pages/RequestService";
import RequestDetails from "./pages/RequestDetails";
import OfferService from "./pages/OfferService";
import Notification from "./pages/Notifications";
import SignUp from "./pages/SignUp";
import ProviderDashboard from "./pages/ProviderDashboard";
import ProviderAvailability from "./pages/ProviderAvailability";
import AdminDashboard from "./pages/AdminDashboard";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Footer from "./components/Footer";
import HelpCenter from "./pages/HelpCenter";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import ContactUs from "./pages/ContactUs";
import FAQ from "./pages/FAQ";
import HowItWorks from "./pages/HowItWorks";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerifyEmail from "./pages/VerifyEmail";
import AccountSettings from "./pages/AccountSettings";
import NotFound from "./pages/NotFound";

function AppRoutes() {
  const location = useLocation();
  const isAuthRoute = ["/signin", "/signup", "/forgot-password", "/reset-password", "/verify-email"].includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col">

      <Navbar />

      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<Login />} />
          <Route path="/login" element={<Navigate to="/" replace />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/notifications" element={<Notification />} />
          <Route path="/services" element={<Services />} />
          <Route path="/provider-dashboard" element={<ProtectedRoute><ProviderDashboard /></ProtectedRoute>} />
          <Route path="/provider-availability" element={<ProtectedRoute><ProviderAvailability /></ProtectedRoute>} />
          <Route path="/request/:id" element={<ProtectedRoute><RequestDetails /></ProtectedRoute>} />
          <Route path="/my-requests" element={<ProtectedRoute><MyRequests /></ProtectedRoute>} />
          <Route path="/request-service" element={<ProtectedRoute><RequestService /></ProtectedRoute>} />
          <Route path="/offer-service" element={<ProtectedRoute><OfferService /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/account" element={<ProtectedRoute><AccountSettings /></ProtectedRoute>} />

          <Route path="/help" element={<HelpCenter />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/contact" element={<ContactUs />} />

          <Route path="/faq" element={<FAQ />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>

      {!isAuthRoute && <Footer />}

    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}


export default App;
