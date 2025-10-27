import { useAuth } from "@/hooks/context/AuthContext";
import Header from "@/components/Header";
import AdminHeader from "@/components/AdminHeader";
import styles from "./Layout.module.scss";

const Layout = ({ children }) => {
  const { isAdmin } = useAuth();

  return (
    <div className={styles.layout}>
      {isAdmin ? <AdminHeader /> : <Header />}
      <main className={styles.content}>{children}</main>
    </div>
  );
};

export default Layout;
