import { Link } from "react-router-dom";
import styles from "./Error404.module.scss";

const Error404 = () => {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>404</h1>
        <p className={styles.subtitle}>Stranica nije pronađena</p>
        <p className={styles.description}>
          Žao nam je, stranica koju tražite ne postoji.
        </p>
        <Link to="/" className={styles.link}>
          Povratak na početnu
        </Link>
      </div>
    </div>
  );
};

export default Error404;
