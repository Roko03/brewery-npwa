import {
  POST_REQUEST_PARAMETERS,
  PATCH_REQUEST_PARAMETERS,
} from "@/config/constants.config";

export default class OrderService {
  static createOrder = async (data) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_WS_API_URL}/orders`,
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

  static getUserOrders = async (page = 1, limit = 10) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_WS_API_URL}/orders?page=${page}&limit=${limit}`,
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

  static getOrderById = async (orderId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_WS_API_URL}/orders/${orderId}`,
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

  static getAllOrders = async (page = 1, limit = 10) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_WS_API_URL}/orders/admin/all?page=${page}&limit=${limit}`,
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

  static updateOrderStatus = async (orderId, data) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_WS_API_URL}/orders/admin/${orderId}`,
        {
          ...PATCH_REQUEST_PARAMETERS,
          credentials: "include",
          body: JSON.stringify(data),
        }
      );
      return await response.json();
    } catch (error) {
      return { success: false, error };
    }
  };
}
