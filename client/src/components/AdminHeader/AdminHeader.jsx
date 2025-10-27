import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/context/AuthContext";
import Button from "@/components/Button";
import styles from "./AdminHeader.module.scss";

const AdminHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const navItems = [
    { path: "/admin", label: "Dashboard", icon: "🏠" },
    { path: "/admin/beers", label: "Piva", icon: "🍺" },
    { path: "/admin/beer-types", label: "Tipovi", icon: "📋" },
    { path: "/admin/beer-colors", label: "Boje", icon: "🎨" },
    { path: "/admin/producers", label: "Proizvođači", icon: "🏭" },
    { path: "/admin/users", label: "Korisnici", icon: "👥" },
    { path: "/admin/profile", label: "Profil", icon: "👥" },
  ];

  const isActive = (path) => {
    if (path === "/admin") {
      return location.pathname === "/admin";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header className={styles.adminHeader}>
      <div className={styles.container}>
        <div className={styles.brand}>
          <Link to="/admin" className={styles.logo}>
            <h1>Admin Panel</h1>
          </Link>
        </div>

        <nav className={styles.nav}>
          <div className={styles.navLinks}>
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`${styles.navLink} ${
                  isActive(item.path) ? styles.active : ""
                }`}
              >
                <span className={styles.icon}>{item.icon}</span>
                <span className={styles.label}>{item.label}</span>
              </Link>
            ))}
          </div>

          <div className={styles.userActions}>
            <span className={styles.userName}>{user?.username}</span>
            <Button variant="secondary" onClick={handleLogout} size="small">
              Odjava
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default AdminHeader;
