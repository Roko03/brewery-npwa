import clsx from "clsx";
import styles from "./Button.module.scss";

const Button = ({
  children,
  className,
  onClick,
  variant = "primary",
  fullWidth = false,
  icon,
  ...rest
}) => {
  return (
    <button
      type="button"
      className={clsx(
        styles.button,
        styles[variant],
        { [styles.fullWidth]: fullWidth },
        className
      )}
      onClick={onClick}
      {...rest}
    >
      {icon || null}
      {children}
    </button>
  );
};

export default Button;
