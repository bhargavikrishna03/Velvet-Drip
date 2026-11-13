
import { Routes, Route } from "react-router-dom";

import Menu from "./pages/Menu";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import Cart from "./pages/Cart";
import Navbar from "./Components/Navbar";
import Hero from "./Components/Hero";
import Checkout from "./pages/Checkout";
import TrackOrder from "./pages/TrackOrder";
import About from "./Components/About";
import Contact from "./Components/Contact";
import Footer from "./Components/Footer";

function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Menu />
      <About />
      <Contact />
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/menu" element={<Menu />} />

      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminDashboard />} />

      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />

      <Route path="/track/:token" element={<TrackOrder />} />
    </Routes>
  );
}
