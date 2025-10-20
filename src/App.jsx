import AppRouter from "@/routers/AppRouter";
import { SnackbarManagerProvider } from "./hooks/context/SnackbarContext";

const App = () => {
  return (
    <SnackbarManagerProvider>
      <AppRouter />
    </SnackbarManagerProvider>
  );
};

export default App;
