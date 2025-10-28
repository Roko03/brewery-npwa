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
    { path: "/admin", label: "Dashboard" },
    { path: "/admin/beers", label: "Piva" },
    { path: "/admin/beer-types", label: "Tipovi" },
    { path: "/admin/beer-colors", label: "Boje" },
    { path: "/admin/producers", label: "Proizvođači" },
    { path: "/admin/users", label: "Korisnici" },
    { path: "/admin/profile", label: "Profil" },
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
            <Button variant="secondary" onClick={handleLogout}>
              Odjava
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default AdminHeader;
