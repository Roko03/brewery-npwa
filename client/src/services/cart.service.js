import {
  POST_REQUEST_PARAMETERS,
  PUT_REQUEST_PARAMETERS,
  DELETE_REQUEST_PARAMETERS,
} from "@/config/constants.config";

export default class CartService {
  static getCart = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_WS_API_URL}/cart`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
          credentials: "include",
        }
      );
      return await response.json();
    } catch (error) {
      return { success: false, error };
    }
  };

  static addToCart = async (data) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_WS_API_URL}/cart`,
        {
          ...POST_REQUEST_PARAMETERS,
          credentials: "include",
          body: JSON.stringify(data),
        }
      );
      return await response.json();
    } catch (error) {
      return { success: false, error };
    }
  };

  static updateCartItem = async (id, data) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_WS_API_URL}/cart/${id}`,
        {
          ...PUT_REQUEST_PARAMETERS,
          credentials: "include",
          body: JSON.stringify(data),
        }
      );
      return await response.json();
    } catch (error) {
      return { success: false, error };
    }
  };

  static removeFromCart = async (id) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_WS_API_URL}/cart/${id}`,
        {
          ...DELETE_REQUEST_PARAMETERS,
          credentials: "include",
        }
      );
      return await response.json();
    } catch (error) {
      return { success: false, error };
    }
  };

  static clearCart = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_WS_API_URL}/cart`,
        {
          ...DELETE_REQUEST_PARAMETERS,
          credentials: "include",
        }
      );
      return await response.json();
    } catch (error) {
      return { success: false, error };
    }
  };

  static createCheckoutSession = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_WS_API_URL}/cart/checkout`,
        {
          ...POST_REQUEST_PARAMETERS,
          credentials: "include",
        }
      );
      return await response.json();
    } catch (error) {
      return { success: false, error };
    }
  };
}
