import { Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";
import Login from "@/views/Login";
import Register from "@/views/Register";
import Home from "@/views/Home";
import AdminDashboard from "@/views/AdminDashboard";
import Profile from "@/views/Profile";
import BeerDetails from "@/views/BeerDetails";
import BeerList from "@/views/BeerList";
import BeerTypeList from "@/views/BeerTypeList";
import BeerColorList from "@/views/BeerColorList";
import ProducerList from "@/views/ProducerList";
import UserList from "@/views/UserList";
import Favorites from "@/views/Favorites";
import Cart from "@/views/Cart";
import CheckoutSuccess from "@/views/CheckoutSuccess";
import OrderHistory from "@/views/OrderHistory";
import Error403 from "@/views/Error403";
import Error404 from "@/views/Error404";

const AppRouter = () => (
  <BrowserRouter>
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/beers"
          element={
            <ProtectedRoute>
              <BeerList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/beer/:id"
          element={
            <ProtectedRoute>
              <BeerDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/favorites"
          element={
            <ProtectedRoute>
              <Favorites />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout/success"
          element={
            <ProtectedRoute>
              <CheckoutSuccess />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <OrderHistory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute requireAdmin={true}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/beers"
          element={
            <ProtectedRoute requireAdmin={true}>
              <BeerList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/beer-types"
          element={
            <ProtectedRoute requireAdmin={true}>
              <BeerTypeList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/beer-colors"
          element={
            <ProtectedRoute requireAdmin={true}>
              <BeerColorList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/producers"
          element={
            <ProtectedRoute requireAdmin={true}>
              <ProducerList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute requireAdmin={true}>
              <UserList />
            </ProtectedRoute>
          }
        />
        <Route path="/403" element={<Error403 />} />
        <Route path="*" element={<Error404 />} />
      </Routes>
    </Suspense>
  </BrowserRouter>
);

export default AppRouter;
