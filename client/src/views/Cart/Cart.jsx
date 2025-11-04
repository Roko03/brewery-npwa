import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useCart } from "@/hooks/context/CartContext";
import { useSnackbar } from "@/hooks/context/SnackbarContext";
import CheckoutService from "@/services/checkout.service";
import Button from "@/components/Button";
import Layout from "@/components/Layout";
import styles from "./Cart.module.scss";

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, clearCart, getCartTotal } =
    useCart();
  const { showSnackbar } = useSnackbar();
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const handleQuantityChange = (beerId, newQuantity) => {
    if (newQuantity < 1) return;

    const result = updateQuantity(beerId, newQuantity);
    if (!result.success) {
      showSnackbar("Greška pri ažuriranju količine", "error");
    }
  };

  const handleRemoveItem = (beerId, beerName) => {
    if (!window.confirm(`Želite li ukloniti "${beerName}" iz košarice?`)) {
      return;
    }

    const result = removeFromCart(beerId);
    if (result.success) {
      showSnackbar("Stavka uklonjena iz košarice", "success");
    } else {
      showSnackbar("Greška pri uklanjanju stavke", "error");
    }
  };

  const handleClearCart = () => {
    if (!window.confirm("Želite li isprazniti cijelu košaricu?")) {
      return;
    }

    const result = clearCart();
    if (result.success) {
      showSnackbar("Košarica ispražnjena", "success");
    } else {
      showSnackbar("Greška pri pražnjenju košarice", "error");
    }
  };

  const handleCheckout = async () => {
    setCheckoutLoading(true);
    try {
      const result = await CheckoutService.createCheckoutSession(cartItems);

      if (result.success && result.url) {
        if (result.orderData) {
          sessionStorage.setItem(
            "pendingOrder",
            JSON.stringify(result.orderData)
          );
        }
        window.location.href = result.url;
      } else {
        showSnackbar("Greška pri kreiranju sesije plaćanja", "error");
        setCheckoutLoading(false);
      }
    } catch (error) {
      showSnackbar("Greška pri kreiranju sesije plaćanja", "error");
      setCheckoutLoading(false);
    }
  };

  return (
    <Layout>
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1>Moja Košarica</h1>
            <Button variant="secondary" onClick={() => navigate("/")}>
              Nastavi s kupnjom
            </Button>
          </div>

          {cartItems.length === 0 ? (
            <div className={styles.emptyCart}>
              <h2>Vaša košarica je prazna</h2>
              <p>Dodajte neka piva kako biste nastavili s kupnjom</p>
              <Button variant="primary" onClick={() => navigate("/")}>
                Pregledaj piva
              </Button>
            </div>
          ) : (
            <>
              <div className={styles.cartItems}>
                {cartItems.map((item) => (
                  <div key={item.beer_id} className={styles.cartItem}>
                    {item.beer?.image_url && (
                      <div className={styles.itemImage}>
                        <img src={item.beer.image_url} alt={item.beer.name} />
                      </div>
                    )}

                    <div className={styles.itemDetails}>
                      <h3>{item.beer?.name || "N/A"}</h3>
                      <p className={styles.producer}>
                        {item.beer?.producer_name || "N/A"}
                      </p>
                      <div className={styles.itemInfo}>
                        <span>{item.beer?.beer_type_name || "N/A"}</span>
                        <span>{item.beer?.alcohol_percentage || 0}%</span>
                      </div>
                    </div>

                    <div className={styles.itemQuantity}>
                      <button
                        className={styles.quantityBtn}
                        onClick={() =>
                          handleQuantityChange(item.beer_id, item.quantity - 1)
                        }
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span className={styles.quantity}>{item.quantity}</span>
                      <button
                        className={styles.quantityBtn}
                        onClick={() =>
                          handleQuantityChange(item.beer_id, item.quantity + 1)
                        }
                      >
                        +
                      </button>
                    </div>

                    <div className={styles.itemPrice}>
                      <span className={styles.unitPrice}>
                        €{(item.beer?.price || 0).toFixed(2)}
                      </span>
                      <span className={styles.totalPrice}>
                        €{((item.beer?.price || 0) * item.quantity).toFixed(2)}
                      </span>
                    </div>

                    <button
                      className={styles.removeBtn}
                      onClick={() =>
                        handleRemoveItem(item.beer_id, item.beer?.name)
                      }
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              <div className={styles.cartSummary}>
                <div className={styles.summaryRow}>
                  <span>Ukupno stavki:</span>
                  <span>{cartItems.length}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span>Ukupna količina:</span>
                  <span>
                    {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                </div>
                <div className={`${styles.summaryRow} ${styles.total}`}>
                  <span>Ukupno:</span>
                  <span>€{getCartTotal().toFixed(2)}</span>
                </div>

                <div className={styles.actions}>
                  <Button variant="secondary" onClick={handleClearCart}>
                    Isprazni košaricu
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleCheckout}
                    disabled={checkoutLoading}
                  >
                    {checkoutLoading ? "Učitavanje..." : "Nastavi na plaćanje"}
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </Layout>
  );
};

export default Cart;
