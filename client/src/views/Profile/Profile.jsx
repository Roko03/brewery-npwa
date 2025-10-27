import { useAuth } from "@/hooks/context/AuthContext";
import { useNavigate } from "react-router-dom";
import Button from "@/components/Button";
import Layout from "@/components/Layout";
import styles from "./Profile.module.scss";

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <Layout>
      <div className={styles.container}>
        <main className={styles.content}>
          <div className={styles.profileCard}>
            <div className={styles.avatarSection}>
              <div className={styles.avatar}>
                {user?.username?.charAt(0).toUpperCase()}
              </div>
              <h2>{user?.username}</h2>
            </div>
            <div className={styles.infoSection}>
              <div className={styles.infoRow}>
                <span className={styles.label}>Email:</span>
                <span className={styles.value}>{user?.email}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.label}>Uloga:</span>
                <span className={styles.value}>
                  {user?.role === "ADMIN" ? "Administrator" : "Korisnik"}
                </span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.label}>ID:</span>
                <span className={styles.value}>{user?.id}</span>
              </div>
            </div>
            <div className={styles.actions}>
              <Button onClick={handleLogout} variant="secondary" fullWidth>
                Odjava
              </Button>
            </div>
          </div>
        </main>
      </div>
    </Layout>
  );
};

export default Profile;
