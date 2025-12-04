import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./Components/Header.jsx";
import Footer from "./Components/Footer.jsx";
import HomePage from "./Pages/HomePage.jsx";
import LoginPage from "./Pages/LoginPage.jsx";
import RegisterPage from "./Pages/RegisterPage.jsx";
import ProtectedRoute from "./Components/ProtectedRoute.jsx";
import UserDashboard from "./Pages/UserDashboard.jsx";
import AdminDashboard from "./Pages/AdminDashboard.jsx";
import ManageMovies from "./Pages/Admin/ManageMovies.jsx";
import ManageUsers from "./Pages/Admin/ManageUsers.jsx";
import ManageReviews from "./Pages/Admin/ManageReviews.jsx";
import AdminOverview from "./Pages/Admin/AdminOverview.jsx";
import MovieDetailsPage from "./Pages/MovieDetailsPage.jsx";
import ContactPage from "./Pages/ContactPage.jsx";
import PaymentSuccess from "./Pages/PaymentSuccess.jsx";
import { useAuth } from "./context/AuthContext.jsx";

function App() {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light"
  );

  const { loading } = useAuth();

  useEffect(() => {
    if (theme === "dark") {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  //  Prevent showing old username during loading
  if (loading) {
    return <div className="h-screen bg-gray-100 dark:bg-gray-900"></div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-500">
      <Header theme={theme} setTheme={setTheme} />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/movie/:id" element={<MovieDetailsPage />} />

          <Route
            path="/user-dashboard"
            element={
              <ProtectedRoute allowedRole="user">
                <UserDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute allowedRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminOverview />} />
            <Route path="manage-movies" element={<ManageMovies />} />
            <Route path="manage-users" element={<ManageUsers />} />
            <Route path="manage-reviews" element={<ManageReviews />} />
            <Route path="movie/:id" element={<MovieDetailsPage />} />
          </Route>

          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/payment-cancelled" element={<div>Payment Cancelled</div>} />

          <Route path="/contact" element={<ContactPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
