import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/context/AuthContext";
import { useCart } from "@/hooks/context/CartContext";
import Button from "@/components/Button";
import styles from "./Header.module.scss";

const Header = () => {
  const { user, logout, isAdmin } = useAuth();
  const { getCartCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          <h1>Beer Catalog</h1>
        </Link>

        <nav className={styles.nav}>
          {user ? (
            <>
              <span className={styles.greeting}>Pozdrav, {user.username}!</span>

              {user && (
                <Link to="/cart" className={styles.cartLink}>
                  <span className={styles.cartIcon}>🛒</span>
                  {getCartCount() > 0 && (
                    <span className={styles.cartBadge}>{getCartCount()}</span>
                  )}
                </Link>
              )}

              <Link to="/favorites" className={styles.navLink}>
                Favoriti
              </Link>

              <Link to="/orders" className={styles.navLink}>
                Narudžbe
              </Link>

              {isAdmin && (
                <Link to="/admin" className={styles.navLink}>
                  Admin
                </Link>
              )}

              <Link to="/profile" className={styles.navLink}>
                Profil
              </Link>

              <Button variant="secondary" onClick={handleLogout}>
                Odjava
              </Button>
            </>
          ) : (
            <>
              <Button variant="secondary" onClick={() => navigate("/login")}>
                Prijava
              </Button>
              <Button variant="primary" onClick={() => navigate("/register")}>
                Registracija
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
