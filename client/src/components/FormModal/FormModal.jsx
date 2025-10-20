import Modal from "@/components/Modal";
import Button from "@/components/Button";
import Close from "@/components/SvgIcons/Close";
import styles from "./FormModal.module.scss";

const FormModal = ({
  title,
  isOpen,
  onClose,
  onConfirm,
  children,
  confirmText = "Spremi",
  cancelText = "Odustani",
  isConfirming = false,
  confirmBtnProps = {},
  cancelBtnProps = {},
  size = "medium",
  hideFooter = false,
}) => {
  if (!isOpen) return null;

  return (
    <Modal closeModal={onClose} size={size}>
      <div className={styles.formModal}>
        <div className={styles.header}>
          <h2>{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className={styles.closeButton}
            aria-label="Zatvori"
          >
            <Close />
          </button>
        </div>

        <div className={styles.content}>{children}</div>

        {!hideFooter && (
          <div className={styles.footer}>
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={isConfirming}
              {...cancelBtnProps}
            >
              {cancelText}
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={onConfirm}
              disabled={isConfirming}
              {...confirmBtnProps}
            >
              {isConfirming ? "Spremanje..." : confirmText}
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default FormModal;
