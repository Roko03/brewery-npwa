import { useAuth } from "@/hooks/context/AuthContext";
import { useNavigate } from "react-router-dom";
import Button from "@/components/Button";
import styles from "./Home.module.scss";

const Home = () => {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Beer Catalog</h1>
        <div className={styles.userInfo}>
          {loading ? (
            <span>Učitavanje...</span>
          ) : user ? (
            <>
              <span>Dobrodošli, {user.username}!</span>
              {user.role === "ADMIN" && (
                <Button onClick={() => navigate("/admin")}>
                  Admin Dashboard
                </Button>
              )}
              <Button onClick={() => navigate("/profile")}>Profil</Button>
              <Button onClick={handleLogout} variant="secondary">
                Odjava
              </Button>
            </>
          ) : (
            <>
              <Button onClick={() => navigate("/login")}>Prijava</Button>
              <Button onClick={() => navigate("/register")} variant="secondary">
                Registracija
              </Button>
            </>
          )}
        </div>
      </header>
      <main className={styles.content}>
        <h2>Katalog piva</h2>
        <p>Ovdje će biti prikazana lista piva...</p>
        {!user && !loading && (
          <div className={styles.guestMessage}>
            <p>Prijavite se ili registrirajte kako biste vidjeli sve detalje piva.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
