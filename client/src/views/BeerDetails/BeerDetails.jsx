import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/context/AuthContext";
import Button from "@/components/Button";
import styles from "./BeerDetails.module.scss";

const BeerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const handleBack = () => {
    if (isAdmin) {
      navigate("/admin");
    } else {
      navigate("/");
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Detalji Piva</h1>
        <Button onClick={handleBack}>Natrag</Button>
      </header>
      <main className={styles.content}>
        <div className={styles.detailsCard}>
          <h2>Pivo ID: {id}</h2>
          <p>Ovdje će biti prikazani detalji piva...</p>
        </div>
      </main>
    </div>
  );
};

export default BeerDetails;
