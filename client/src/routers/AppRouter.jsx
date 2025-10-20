import { Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "@/views/Login";
import Register from "@/views/Register";
import Error404 from "@/views/Error404";

const AppRouter = () => (
  <BrowserRouter>
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Error404 />} />
      </Routes>
    </Suspense>
  </BrowserRouter>
);

export default AppRouter;
