import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import OrderService from "@/services/order.service";
import { useSnackbar } from "@/hooks/context/SnackbarContext";
import Header from "@/components/Header";
import Button from "@/components/Button";
import styles from "./OrderHistory.module.scss";

const OrderHistory = () => {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const result = await OrderService.getUserOrders();
      if (result.success) {
        setOrders(result.entities);
      } else {
        showSnackbar("Greška pri učitavanju narudžbi", "error");
      }
    } catch (error) {
      showSnackbar("Greška pri učitavanju narudžbi", "error");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("hr-HR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusLabel = (status) => {
    const statusMap = {
      pending: "Na čekanju",
      completed: "Završeno",
      failed: "Neuspješno",
      refunded: "Refundirano",
    };
    return statusMap[status] || status;
  };

  const getStatusClass = (status) => {
    return styles[`status-${status}`] || "";
  };

  if (loading) {
    return (
      <div className={styles.orderHistory}>
        <Header />
        <main className={styles.main}>
          <div className={styles.loading}>Učitavanje narudžbi...</div>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.orderHistory}>
      <Header />

      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1>Moje Narudžbe</h1>
            <Button variant="secondary" onClick={() => navigate("/")}>
              Vrati se na početnu
            </Button>
          </div>

          {orders.length === 0 ? (
            <div className={styles.emptyState}>
              <h2>Nemate narudžbi</h2>
              <p>Započnite kupnju pregledavajući naše pive</p>
              <Button variant="primary" onClick={() => navigate("/beers")}>
                Pregledaj piva
              </Button>
            </div>
          ) : (
            <div className={styles.ordersList}>
              {orders.map((order) => (
                <div
                  key={order._id}
                  className={styles.orderCard}
                  onClick={() =>
                    setSelectedOrder(
                      selectedOrder?._id === order._id ? null : order
                    )
                  }
                >
                  <div className={styles.orderHeader}>
                    <div className={styles.orderInfo}>
                      <h3>Narudžba #{order.order_number}</h3>
                      <p className={styles.orderDate}>
                        {formatDate(order.created_at)}
                      </p>
                    </div>
                    <div className={styles.orderMeta}>
                      <span
                        className={`${styles.status} ${getStatusClass(order.status)}`}
                      >
                        {getStatusLabel(order.status)}
                      </span>
                      <span className={styles.total}>
                        €{order.total_amount.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {selectedOrder?._id === order._id && (
                    <div className={styles.orderDetails}>
                      <h4>Stavke narudžbe:</h4>
                      <div className={styles.orderItems}>
                        {order.items.map((item, index) => (
                          <div key={index} className={styles.orderItem}>
                            {item.beer_image_url && (
                              <img
                                src={item.beer_image_url}
                                alt={item.beer_name}
                                className={styles.itemImage}
                              />
                            )}
                            <div className={styles.itemDetails}>
                              <h5>{item.beer_name}</h5>
                              {item.producer_name && (
                                <p className={styles.producer}>
                                  {item.producer_name}
                                </p>
                              )}
                              {item.beer_type_name && (
                                <p className={styles.type}>
                                  {item.beer_type_name}
                                </p>
                              )}
                            </div>
                            <div className={styles.itemQuantity}>
                              <span>x{item.quantity}</span>
                            </div>
                            <div className={styles.itemPrice}>
                              <span className={styles.unitPrice}>
                                €{item.beer_price.toFixed(2)}
                              </span>
                              <span className={styles.subtotal}>
                                €{item.subtotal.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className={styles.orderSummary}>
                        <span>Ukupno:</span>
                        <span className={styles.totalAmount}>
                          €{order.total_amount.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default OrderHistory;
