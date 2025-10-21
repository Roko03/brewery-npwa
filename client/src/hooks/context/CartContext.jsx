import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext";
import CartService from "@/services/cart.service";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      const response = await CartService.getCart();

      if (response.success && response.entities) {
        setCartItems(response.entities);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      // Clear cart when user logs out
      setCartItems([]);
    }
  }, [user, fetchCart]);

  const addToCart = useCallback(async (beerId, quantity = 1) => {
    if (!user) {
      return { success: false, error: "User not authenticated" };
    }

    try {
      const response = await CartService.addToCart({
        beer_id: beerId,
        quantity,
      });

      if (response.success) {
        await fetchCart(); // Refresh cart
        return { success: true, message: response.message };
      }

      return { success: false, error: response.message };
    } catch (error) {
      console.error("Error adding to cart:", error);
      return { success: false, error: "Failed to add to cart" };
    }
  }, [user, fetchCart]);

  const updateQuantity = useCallback(async (cartItemId, quantity) => {
    if (!user) return { success: false };

    try {
      const response = await CartService.updateCartItem(cartItemId, {
        quantity,
      });

      if (response.success) {
        await fetchCart(); // Refresh cart
        return { success: true };
      }

      return { success: false };
    } catch (error) {
      console.error("Error updating quantity:", error);
      return { success: false };
    }
  }, [user, fetchCart]);

  const removeFromCart = useCallback(async (cartItemId) => {
    if (!user) return { success: false };

    try {
      const response = await CartService.removeFromCart(cartItemId);

      if (response.success) {
        await fetchCart(); // Refresh cart
        return { success: true };
      }

      return { success: false };
    } catch (error) {
      console.error("Error removing from cart:", error);
      return { success: false };
    }
  }, [user, fetchCart]);

  const clearCart = useCallback(async () => {
    if (!user) return { success: false };

    try {
      const response = await CartService.clearCart();

      if (response.success) {
        setCartItems([]);
        return { success: true };
      }

      return { success: false };
    } catch (error) {
      console.error("Error clearing cart:", error);
      return { success: false };
    }
  }, [user]);

  const getCartCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.beer_id?.price || 0;
      return total + price * item.quantity;
    }, 0);
  };

  const value = {
    cartItems,
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    fetchCart,
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
