import { useEffect, useRef } from "react";
import styles from "./Dialog.module.scss";
import clsx from "clsx";

const Dialog = ({
  closeDialog,
  isElementCenter = false,
  isFullWidth = false,
  children,
}) => {
  const dialogRef = useRef(null);

  useEffect(() => {
    document.body.style.overflowY = "hidden";

    const handleOutsideClick = (e) => {
      if (dialogRef.current && !dialogRef.current.contains(e.target)) {
        document.body.style.overflowY = "auto";
        closeDialog();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.body.style.overflowY = "auto";
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [closeDialog]);

  return (
    <div
      className={clsx([
        styles.dialog,
        { [styles.item_center]: isElementCenter },
        { [styles.fullWidth]: isFullWidth },
      ])}
      role="dialog"
      aria-modal="true"
    >
      <div className={styles.container} ref={dialogRef}>
        {children}
      </div>
    </div>
  );
};

export default Dialog;
