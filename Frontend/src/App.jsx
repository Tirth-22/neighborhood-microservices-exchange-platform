import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Services from "./pages/Services";
import MyRequests from "./pages/MyRequests";
import RequestService from "./pages/RequestService";
import Navbar from "./components/NavBar";
import RequestDetails from "./pages/RequestDetails";
import Footer from "./components/Footer";
import OfferService from "./pages/OfferService";
import "./App.css";
import SignUp from "./pages/SignUp";

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
            <Route path="/services" element={<Services />} />
            <Route path="/request/:id" element={<RequestDetails />} />
            <Route path="/my-requests" element={<MyRequests />} />
            <Route path="/request-service" element={<RequestService />} />
            <Route path="/offer-service" element={<OfferService />} />
          </Routes>
        </div>

        <Footer />

      </div>
    </BrowserRouter>
  );
}

export default App;
