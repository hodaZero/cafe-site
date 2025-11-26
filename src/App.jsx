// import React from "react";
// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import { Provider } from "react-redux";
// import { store } from "./redux/store";
// import { useAuth } from "./context/AuthContext";

// // Pages
// import Login from "./pages/Auth/Login";
// import Register from "./pages/Auth/Register";
// import ProfilePage from "./pages/ProfilePage";
// import CartPage from "./pages/Cart";
// import CheckoutPage from "./pages/Checkout";
// import Menu from "./pages/Menu";
// import ProductDetails from "./pages/ProductDetails";
// import Home from "./pages/Home";
// import UserTables from "./pages/UserTables";
// import AdminOrders from "./pages/AdminOrders";
// import Favorites from "./pages/Favorites";
// import AdminTables from "./pages/AdminTable";
// import DashboardLayout from "./pages/Dashboard/DashboardLayout";
// import ProductsDashboard from "./pages/Dashboard/ProductsDashboard";
// import Orders from "./pages/Orders";
// import AdminProfile from "./pages/Dashboard/AdminProfile";
// import ForgotPassword from "./pages/Auth/ForgotPssword";

// // Components
// import Navbar from "./components/Navbar";
// import Footer from "./components/Footer";

// function PrivateRoute({ children }) {
//   const { user, loading } = useAuth();
//   if (loading) return null;
//   return user ? children : <Navigate to="/login" />;
// }

// function AdminRoute({ children }) {
//   const { user, role, loading } = useAuth();
//   if (loading) return null;
//   return user && role === "admin" ? children : <Navigate to="/" />;
// }

// function AppContent() {
//   const { user, role } = useAuth();
//   const isAdminRoute = window.location.pathname.startsWith("/admin");

//   return (
//     <>
//       {!isAdminRoute && <Navbar />}

//       <Routes>
//         {/* Public pages */}
//         <Route path="/login" element={<Login />} />   
//         <Route path="/register" element={<Register />} /> 

//         <Route path="/forgot-password" element={<ForgotPassword />} />

//         {/* User protected routes */}
//         <Route path="/" element={<Home />} />
//         <Route path="/menu" element={<Menu />} />
//         <Route path="/product/:id" element={<ProductDetails />} />

//         <Route
//           path="/profile"
//           element={
//             <PrivateRoute>
//               <ProfilePage />
//             </PrivateRoute>
//           }
//         />

//         <Route
//           path="/favorites"
//           element={
//             <PrivateRoute>
//               <Favorites />
//             </PrivateRoute>
//           }
//         />

//         <Route
//           path="/cart"
//           element={
//             <PrivateRoute>
//               <CartPage />
//             </PrivateRoute>
//           }
        
//         />
//         <Route
//           path="/checkout"
//           element={
//             <PrivateRoute>
//               <CheckoutPage />
//             </PrivateRoute>
//           }
        
//         />


//         <Route
//           path="/orders"
//           element={
//             <PrivateRoute>
//               <Orders />
//             </PrivateRoute>
//           }
//         />

//         <Route
//           path="/tables"
//           element={
//             <PrivateRoute>
//               <UserTables />
//             </PrivateRoute>
//           }
//         />

//         {/* Admin protected routes */}
//         <Route
//           path="/admin/orders"
//           element={
//             <AdminRoute>
//               <DashboardLayout>
//                 <AdminOrders />
//               </DashboardLayout>
//             </AdminRoute>
//           }
//         />

//         <Route
//           path="/admin/products"
//           element={
//             <AdminRoute>
//               <DashboardLayout>
//                 <ProductsDashboard />
//               </DashboardLayout>
//             </AdminRoute>
//           }
//         />

//         <Route
//           path="/admin/tables"
//           element={
//             <AdminRoute>
//               <DashboardLayout>
//                 <AdminTables />
//               </DashboardLayout>
//             </AdminRoute>
//           }
//         />

//         <Route
//           path="/admin/profile"
//           element={
//             <AdminRoute>
//               <DashboardLayout>
//                 <AdminProfile />
//               </DashboardLayout>
//             </AdminRoute>
//           }
//         />

//         <Route path="*" element={<h1 className="text-center mt-20 text-2xl">404</h1>} />
//       </Routes>

//       {!isAdminRoute && <Footer />}
//     </>
//   );
// }

// export default function App() {
//   return (
//     <Provider store={store}>
//       <Router>
//         <AppContent />
//       </Router>
//     </Provider>
//   );
// }




















import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { useAuth } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext"; // ✅ استدعاء NotificationProvider

// Pages
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import ProfilePage from "./pages/ProfilePage";
import CartPage from "./pages/Cart";
import CheckoutPage from "./pages/Checkout";
import Menu from "./pages/Menu";
import ProductDetails from "./pages/ProductDetails";
import Home from "./pages/Home";
import UserTables from "./pages/UserTables";
import AdminOrders from "./pages/AdminOrders";
import Favorites from "./pages/Favorites";
import AdminTables from "./pages/AdminTable";
import DashboardLayout from "./pages/Dashboard/DashboardLayout";
import ProductsDashboard from "./pages/Dashboard/ProductsDashboard";
import Orders from "./pages/Orders";
import AdminProfile from "./pages/Dashboard/AdminProfile";
import ForgotPassword from "./pages/Auth/ForgotPssword";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? children : <Navigate to="/login" />;
}

function AdminRoute({ children }) {
  const { user, role, loading } = useAuth();
  if (loading) return null;
  return user && role === "admin" ? children : <Navigate to="/" />;
}

function AppContent() {
  const isAdminRoute = window.location.pathname.startsWith("/admin");

  return (
    <NotificationProvider>
      {!isAdminRoute && <Navbar />}

      <Routes>
        {/* Public pages */}
        <Route path="/login" element={<Login />} />   
        <Route path="/register" element={<Register />} /> 
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* User protected routes */}
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/favorites"
          element={
            <PrivateRoute>
              <Favorites />
            </PrivateRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <PrivateRoute>
              <CartPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <PrivateRoute>
              <CheckoutPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <PrivateRoute>
              <Orders />
            </PrivateRoute>
          }
        />
        <Route
          path="/tables"
          element={
            <PrivateRoute>
              <UserTables />
            </PrivateRoute>
          }
        />

        {/* Admin protected routes */}
        <Route
          path="/admin/orders"
          element={
            <AdminRoute>
              <DashboardLayout>
                <AdminOrders />
              </DashboardLayout>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/products"
          element={
            <AdminRoute>
              <DashboardLayout>
                <ProductsDashboard />
              </DashboardLayout>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/tables"
          element={
            <AdminRoute>
              <DashboardLayout>
                <AdminTables />
              </DashboardLayout>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/profile"
          element={
            <AdminRoute>
              <DashboardLayout>
                <AdminProfile />
              </DashboardLayout>
            </AdminRoute>
          }
        />

        <Route path="*" element={<h1 className="text-center mt-20 text-2xl">404</h1>} />
      </Routes>

      {!isAdminRoute && <Footer />}
    </NotificationProvider>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <Router>
        <AppContent />
      </Router>
    </Provider>
  );
}
