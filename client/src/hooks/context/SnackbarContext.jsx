import { createContext, useContext, useState } from "react";
import Snackbar from "@/components/SnackBar";

const SnackbarContext = createContext(null);

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context) throw new Error("It must be used as provider");
  return context;
};

export const SnackbarManagerProvider = ({ children }) => {
  const [snackbar, setSnackbar] = useState({
    variant: null,
    message: "",
    isOpen: false,
  });

  const showSnackbar = (message, variant = "success") =>
    setSnackbar({ variant, message, isOpen: true });

  const hideSnackbar = () => {
    setSnackbar({ variant: null, message: "", isOpen: false });
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      {snackbar.isOpen && (
        <Snackbar
          variant={snackbar.variant}
          message={snackbar.message}
          onClick={hideSnackbar}
          isOpen={snackbar.isOpen}
        />
      )}
    </SnackbarContext.Provider>
  );
};
