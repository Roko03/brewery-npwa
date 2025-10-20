import styles from "./Modal.module.scss";
import clsx from "clsx";
import Dialog from "../Dialog";

const Modal = ({
  size = "medium",
  isElementCenter = false,
  isFullWidth = false,
  closeModal,
  children,
}) => {
  return (
    <Dialog
      closeDialog={closeModal}
      isElementCenter={isElementCenter}
      isFullWidth={isFullWidth}
    >
      <div className={clsx([styles.modal, styles[size]])}>{children}</div>
    </Dialog>
  );
};

export default Modal;
