import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useCart } from "@/hooks/context/CartContext";
import { useSnackbar } from "@/hooks/context/SnackbarContext";
import CartService from "@/services/cart.service";
import Button from "@/components/Button";
import Header from "@/components/Header";
import styles from "./Cart.module.scss";

const Cart = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    loading,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
  } = useCart();
  const { showSnackbar } = useSnackbar();
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const handleQuantityChange = async (cartItemId, newQuantity) => {
    if (newQuantity < 1) return;

    const result = await updateQuantity(cartItemId, newQuantity);
    if (!result.success) {
      showSnackbar("Greška pri ažuriranju količine", "error");
    }
  };

  const handleRemoveItem = async (cartItemId, beerName) => {
    if (!window.confirm(`Želite li ukloniti "${beerName}" iz košarice?`)) {
      return;
    }

    const result = await removeFromCart(cartItemId);
    if (result.success) {
      showSnackbar("Stavka uklonjena iz košarice", "success");
    } else {
      showSnackbar("Greška pri uklanjanju stavke", "error");
    }
  };

  const handleClearCart = async () => {
    if (!window.confirm("Želite li isprazniti cijelu košaricu?")) {
      return;
    }

    const result = await clearCart();
    if (result.success) {
      showSnackbar("Košarica ispražnjena", "success");
    } else {
      showSnackbar("Greška pri pražnjenju košarice", "error");
    }
  };

  const handleCheckout = async () => {
    setCheckoutLoading(true);
    try {
      const result = await CartService.createCheckoutSession();

      if (result.success && result.url) {
        // Save order data to sessionStorage for later use
        if (result.orderData) {
          sessionStorage.setItem("pendingOrder", JSON.stringify(result.orderData));
        }
        // Redirect to Stripe checkout page
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

  if (loading) {
    return (
      <div className={styles.cart}>
        <Header />
        <div className={styles.loading}>Učitavanje košarice...</div>
      </div>
    );
  }

  return (
    <div className={styles.cart}>
      <Header />

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
                  <div key={item._id} className={styles.cartItem}>
                    {item.beer_id?.image_url && (
                      <div className={styles.itemImage}>
                        <img
                          src={item.beer_id.image_url}
                          alt={item.beer_id.name}
                        />
                      </div>
                    )}

                    <div className={styles.itemDetails}>
                      <h3>{item.beer_id?.name || "N/A"}</h3>
                      <p className={styles.producer}>
                        {item.beer_id?.producer_name || "N/A"}
                      </p>
                      <div className={styles.itemInfo}>
                        <span>{item.beer_id?.beer_type_name}</span>
                        <span>{item.beer_id?.alcohol_percentage}%</span>
                      </div>
                    </div>

                    <div className={styles.itemQuantity}>
                      <button
                        className={styles.quantityBtn}
                        onClick={() =>
                          handleQuantityChange(item._id, item.quantity - 1)
                        }
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span className={styles.quantity}>{item.quantity}</span>
                      <button
                        className={styles.quantityBtn}
                        onClick={() =>
                          handleQuantityChange(item._id, item.quantity + 1)
                        }
                      >
                        +
                      </button>
                    </div>

                    <div className={styles.itemPrice}>
                      <span className={styles.unitPrice}>
                        €{(item.beer_id?.price || 0).toFixed(2)}
                      </span>
                      <span className={styles.totalPrice}>
                        €
                        {((item.beer_id?.price || 0) * item.quantity).toFixed(
                          2
                        )}
                      </span>
                    </div>

                    <button
                      className={styles.removeBtn}
                      onClick={() =>
                        handleRemoveItem(item._id, item.beer_id?.name)
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
    </div>
  );
};

export default Cart;
