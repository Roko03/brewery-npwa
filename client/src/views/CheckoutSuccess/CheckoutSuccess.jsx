import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCart } from "@/hooks/context/CartContext";
import { useSnackbar } from "@/hooks/context/SnackbarContext";
import OrderService from "@/services/order.service";
import Button from "@/components/Button";
import Header from "@/components/Header";
import styles from "./CheckoutSuccess.module.scss";

const CheckoutSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { clearCart } = useCart();
  const { showSnackbar } = useSnackbar();
  const [orderNumber, setOrderNumber] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saveOrder = async () => {
      if (!sessionId) {
        setLoading(false);
        return;
      }

      try {
        // Get order data from sessionStorage (saved during checkout)
        const orderDataStr = sessionStorage.getItem("pendingOrder");

        if (!orderDataStr) {
          console.error("No pending order data found");
          setLoading(false);
          return;
        }

        const orderData = JSON.parse(orderDataStr);

        // Create order in database
        const result = await OrderService.createOrder({
          stripe_session_id: sessionId,
          items: orderData.items,
          total_amount: orderData.total_amount,
          customer_email: orderData.customer_email,
        });

        if (result.success) {
          setOrderNumber(result.entity.order_number);
          // Clear the cart after successful order creation
          await clearCart();
          // Remove pending order from sessionStorage
          sessionStorage.removeItem("pendingOrder");
        } else {
          showSnackbar("Greška pri spremanju narudžbe", "error");
        }
      } catch (error) {
        console.error("Error saving order:", error);
        showSnackbar("Greška pri spremanju narudžbe", "error");
      } finally {
        setLoading(false);
      }
    };

    saveOrder();
  }, [sessionId, clearCart, showSnackbar]);

  if (loading) {
    return (
      <div className={styles.checkoutSuccess}>
        <Header />
        <main className={styles.main}>
          <div className={styles.container}>
            <div className={styles.loading}>Procesiranje narudžbe...</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.checkoutSuccess}>
      <Header />

      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.successCard}>
            <div className={styles.icon}>✓</div>
            <h1>Plaćanje uspješno!</h1>
            <p>Hvala vam na kupnji. Vaša narudžba je uspješno procesirana.</p>
            {orderNumber && (
              <p className={styles.orderNumber}>
                Broj narudžbe: <strong>{orderNumber}</strong>
              </p>
            )}
            {sessionId && (
              <p className={styles.sessionId}>
                ID sesije: <code>{sessionId}</code>
              </p>
            )}
            <div className={styles.actions}>
              <Button variant="primary" onClick={() => navigate("/")}>
                Vrati se na početnu
              </Button>
              <Button variant="secondary" onClick={() => navigate("/orders")}>
                Moje narudžbe
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CheckoutSuccess;
