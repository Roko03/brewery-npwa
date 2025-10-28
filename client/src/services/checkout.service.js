import { POST_REQUEST_PARAMETERS } from "@/config/constants.config";

export default class CheckoutService {
  static createCheckoutSession = async (cartItems) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_WS_API_URL}/checkout`,
        {
          ...POST_REQUEST_PARAMETERS,
          credentials: "include",
          body: JSON.stringify({ cartItems }),
        }
      );
      return await response.json();
    } catch (error) {
      return { success: false, error };
    }
  };
}
