import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Services from "../pages/Services";
import Menu from "../pages/Menu";
import Gallery from "../pages/Gallery";
import BanquetHalls from "../pages/BanquetHalls";
import BanquetHallDetail from "../pages/BanquetHallDetail";
import Packages from "../pages/Packages";
import EnquireNow from "../pages/EnquireNow";
import Reviews from "../pages/Reviews";
import About from "../pages/About";
import Contact from "../pages/Contact";
import FAQs from "../pages/FAQs";
import NotFound from "../pages/NotFound";
import AdminLogin from "../pages/admin/AdminLogin";
import Dashboard from "../pages/admin/Dashboard";
import ManageBookings from "../pages/admin/ManageBookings";
import ClientDatabase from "../pages/admin/ClientDatabase";
import ManageGallery from "../pages/admin/ManageGallery";
import ManageBanquetHalls from "../pages/admin/ManageBanquetHalls";
import ManageMenu from "../pages/admin/ManageMenu";
import ManageReviews from "../pages/admin/ManageReviews";
import ProtectedRoute from "./ProtectedRoute";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { useLocation } from "react-router-dom";

export default function AppRouter() {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith("/admin");
  return (
    <>
      {!isAdmin && <Navbar />}
      <main className={!isAdmin ? "pt-20" : ""}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/banquet-halls" element={<BanquetHalls />} />
          <Route path="/banquet-halls/:id" element={<BanquetHallDetail />} />
          <Route path="/packages" element={<Packages />} />
          <Route path="/enquire" element={<EnquireNow />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faqs" element={<FAQs />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/admin/bookings" element={<ProtectedRoute><ManageBookings /></ProtectedRoute>} />
          <Route path="/admin/clients" element={<ProtectedRoute><ClientDatabase /></ProtectedRoute>} />
          <Route path="/admin/gallery" element={<ProtectedRoute><ManageGallery /></ProtectedRoute>} />
          <Route path="/admin/banquet-halls" element={<ProtectedRoute><ManageBanquetHalls /></ProtectedRoute>} />
          <Route path="/admin/menu" element={<ProtectedRoute><ManageMenu /></ProtectedRoute>} />
          <Route path="/admin/reviews" element={<ProtectedRoute><ManageReviews /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!isAdmin && <Footer />}
    </>
  );
}