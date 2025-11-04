import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  getCartFromStorage,
  addToCartStorage,
  updateCartItemStorage,
  removeFromCartStorage,
  clearCartStorage,
} from "@/utils/cartStorage";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const cart = getCartFromStorage();
    setCartItems(cart);
  }, []);

  const addToCart = useCallback((beer, quantity = 1) => {
    try {
      const updatedCart = addToCartStorage(beer, quantity);
      setCartItems(updatedCart);
      return { success: true, message: "Pivo dodano u košaricu" };
    } catch (error) {
      console.error("Error adding to cart:", error);
      return { success: false, error: "Failed to add to cart" };
    }
  }, []);

  const updateQuantity = useCallback((beerId, quantity) => {
    try {
      const updatedCart = updateCartItemStorage(beerId, quantity);
      setCartItems(updatedCart);
      return { success: true };
    } catch (error) {
      console.error("Error updating quantity:", error);
      return { success: false };
    }
  }, []);

  const removeFromCart = useCallback((beerId) => {
    try {
      const updatedCart = removeFromCartStorage(beerId);
      setCartItems(updatedCart);
      return { success: true };
    } catch (error) {
      console.error("Error removing from cart:", error);
      return { success: false };
    }
  }, []);

  const clearCart = useCallback(() => {
    try {
      const updatedCart = clearCartStorage();
      setCartItems(updatedCart);
      return { success: true };
    } catch (error) {
      console.error("Error clearing cart:", error);
      return { success: false };
    }
  }, []);

  const getCartCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.beer?.price || 0;
      return total + price * item.quantity;
    }, 0);
  };

  const value = {
    cartItems,
    loading: false,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartCount,
    getCartTotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
