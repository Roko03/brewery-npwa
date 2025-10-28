const CART_STORAGE_KEY = "cart";

// Cart item structure: { beer_id: string, quantity: number, beer: {...} }

export const getCartFromStorage = () => {
  try {
    const cart = localStorage.getItem(CART_STORAGE_KEY);
    return cart ? JSON.parse(cart) : [];
  } catch (error) {
    console.error("Error reading cart from localStorage:", error);
    return [];
  }
};

export const saveCartToStorage = (cartItems) => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  } catch (error) {
    console.error("Error saving cart to localStorage:", error);
  }
};

export const addToCartStorage = (beer, quantity = 1) => {
  const cart = getCartFromStorage();
  const existingItemIndex = cart.findIndex(
    (item) => item.beer_id === beer._id
  );

  if (existingItemIndex >= 0) {
    // Update quantity
    cart[existingItemIndex].quantity += quantity;
  } else {
    // Add new item
    cart.push({
      beer_id: beer._id,
      quantity,
      beer,
    });
  }

  saveCartToStorage(cart);
  return cart;
};

export const updateCartItemStorage = (beerId, quantity) => {
  const cart = getCartFromStorage();
  const itemIndex = cart.findIndex((item) => item.beer_id === beerId);

  if (itemIndex >= 0) {
    if (quantity <= 0) {
      // Remove item if quantity is 0 or less
      cart.splice(itemIndex, 1);
    } else {
      cart[itemIndex].quantity = quantity;
    }
    saveCartToStorage(cart);
  }

  return cart;
};

export const removeFromCartStorage = (beerId) => {
  const cart = getCartFromStorage();
  const updatedCart = cart.filter((item) => item.beer_id !== beerId);
  saveCartToStorage(updatedCart);
  return updatedCart;
};

export const clearCartStorage = () => {
  try {
    localStorage.removeItem(CART_STORAGE_KEY);
    return [];
  } catch (error) {
    console.error("Error clearing cart from localStorage:", error);
    return [];
  }
};

export const getCartCount = () => {
  const cart = getCartFromStorage();
  return cart.reduce((total, item) => total + item.quantity, 0);
};

export const getCartTotal = () => {
  const cart = getCartFromStorage();
  return cart.reduce((total, item) => {
    const price = item.beer?.price || 0;
    return total + price * item.quantity;
  }, 0);
};
