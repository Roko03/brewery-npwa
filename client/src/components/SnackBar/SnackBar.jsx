import clsx from "clsx";
import { useEffect } from "react";
import styles from "./SnackBar.module.scss";
import Close from "@/components/SvgIcons/Close";
import Check from "@/components/SvgIcons/Check";

const SnackBar = ({
  variant = "success",
  message = "Uspješno",
  onClick,
  isOpen = false,
}) => {
  const snackBarIcon = (variant) => {
    const iconType = {
      success: <Check />,
      error: <Close />,
      info: <span style={{ fontSize: "20px" }}>ℹ️</span>,
    };
    return iconType[variant];
  };

  if (variant == null) return null;

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (onClick) onClick();
    }, 3000);
    return () => clearTimeout(timeout);
  }, [onClick]);

  return (
    <div
      className={clsx(
        styles.snackbar,
        { [styles.snackbar_open]: isOpen },
        styles[variant]
      )}
      onClick={onClick}
    >
      {snackBarIcon(variant)}
      <p>{message}</p>
    </div>
  );
};

export default SnackBar;
