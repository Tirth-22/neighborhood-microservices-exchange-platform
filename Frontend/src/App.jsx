import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import Navbar from "./components/NavBar";
import ProtectedRoute from "./components/ProtectedRoute";
import Footer from "./components/Footer";
import HelpCenter from "./pages/HelpCenter";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import ContactUs from "./pages/ContactUs";

import FAQ from "./pages/FAQ";
import HowItWorks from "./pages/HowItWorks";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">

        <Navbar />

        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/notifications" element={<Notification />} />
            <Route path="/services" element={<Services />} />
            <Route path="/provider-dashboard" element={<ProtectedRoute><ProviderDashboard /></ProtectedRoute>} />
            <Route path="/request/:id" element={<ProtectedRoute><RequestDetails /></ProtectedRoute>} />
            <Route path="/my-requests" element={<ProtectedRoute><MyRequests /></ProtectedRoute>} />
            <Route path="/request-service" element={<ProtectedRoute><RequestService /></ProtectedRoute>} />
            <Route path="/offer-service" element={<ProtectedRoute><OfferService /></ProtectedRoute>} />

            <Route path="/help" element={<HelpCenter />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/contact" element={<ContactUs />} />

            <Route path="/faq" element={<FAQ />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
          </Routes>
        </div>

        <Footer />

      </div>
    </BrowserRouter>
  );

}

export default App;
