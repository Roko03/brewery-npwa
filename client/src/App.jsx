import AppRouter from "@/routers/AppRouter";
import { SnackbarManagerProvider } from "./hooks/context/SnackbarContext";
import { AuthProvider } from "./hooks/context/AuthContext";

const App = () => {
  return (
    <SnackbarManagerProvider>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </SnackbarManagerProvider>
  );
};

export default App;
