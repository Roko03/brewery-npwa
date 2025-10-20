import { Link } from "react-router-dom";
import { useState } from "react";
import styles from "./Header.module.scss";
import Profile from "@/components/Profile";
import Links from "@/components/Links";
import Modal from "@/components/Modal";

const Header = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <header className={styles.header}>
        <div className={styles.header__container}>
          <Link to="/admin" className={styles.header__logo}>
            <img src="/favicons/whistle-white.svg" alt="logo" />
          </Link>
          <div className={styles.header__container__content}>
            <Links />
            <Profile openProfileModal={openModal} role={user?.role} />
          </div>
        </div>
      </header>
      {isModalOpen && (
        <Modal isElementCenter closeModal={closeModal}>
          <div className={styles.profil_data}>
            <p>
              <span>Korisničko ime: </span>
              Ivan
            </p>
            <p>
              <span>Email: </span>
              ivic
            </p>
          </div>
        </Modal>
      )}
    </>
  );
};

export default Header;
