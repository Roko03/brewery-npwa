import { Link } from "react-router";
import { useAuth } from "@/hooks/context/AuthContext";
import styles from "./AdminDashboard.module.scss";

const AdminDashboard = () => {
  const { user } = useAuth();

  const dashboardCards = [
    {
      title: "Piva",
      description: "Upravljanje pivima - dodavanje, uređivanje i brisanje",
      link: "/admin/beers",
      icon: "🍺",
      color: "blue",
    },
    {
      title: "Tipovi Piva",
      description: "Upravljanje tipovima piva",
      link: "/admin/beer-types",
      icon: "📋",
      color: "green",
    },
    {
      title: "Boje Piva",
      description: "Upravljanje bojama piva",
      link: "/admin/beer-colors",
      icon: "🎨",
      color: "yellow",
    },
    {
      title: "Proizvođači",
      description: "Upravljanje proizvođačima piva",
      link: "/admin/producers",
      icon: "🏭",
      color: "red",
    },
    {
      title: "Korisnici",
      description: "Upravljanje korisničkim računima",
      link: "/admin/users",
      icon: "👥",
      color: "purple",
    },
  ];

  return (
    <div className={styles.adminDashboard}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1>Admin Dashboard</h1>
          <p>Dobrodošli, {user?.name || "Admin"}</p>
        </header>

        <div className={styles.grid}>
          {dashboardCards.map((card) => (
            <Link
              key={card.link}
              to={card.link}
              className={`${styles.card} ${styles[card.color]}`}
            >
              <div className={styles.icon}>{card.icon}</div>
              <h2>{card.title}</h2>
              <p>{card.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
