import AppRouter from "@/routers/AppRouter";
import { SnackbarManagerProvider } from "./hooks/context/SnackbarContext";
import { AuthProvider } from "./hooks/context/AuthContext";
import { CartProvider } from "./hooks/context/CartContext";

const App = () => {
  return (
    <SnackbarManagerProvider>
      <AuthProvider>
        <CartProvider>
          <AppRouter />
        </CartProvider>
      </AuthProvider>
    </SnackbarManagerProvider>
  );
};

export default App;
