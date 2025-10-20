import { Link } from "react-router-dom";
import styles from "./Error403.module.scss";

const Error404 = () => {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>403</h1>
        <p className={styles.subtitle}>Nemate dozvolu za tu stranicu</p>
        <p className={styles.description}>
          Žao nam je, nemate dozvolu za stranica koju tražite.
        </p>
        <Link to="/" className={styles.link}>
          Povratak na početnu
        </Link>
      </div>
    </div>
  );
};

export default Error404;
