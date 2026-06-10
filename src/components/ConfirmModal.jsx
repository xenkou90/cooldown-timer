import { useEffect } from "react";
import folderImg from "../assets/folder.png";
import styles from "./ConfirmModal.module.css";

function ConfirmModal({
  isOpen,
  title,
  message,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
}) {
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onCancel();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div onClick={onCancel} className={styles.overlay}>
      <div
        onClick={(event) => event.stopPropagation()}
        className={`window ${styles.modalWindow}`}
      >
        <div className="title-bar">
          <div className="title-bar-text">{title}</div>
          <div className="title-bar-controls">
            <button aria-label="Close" onClick={onCancel} />
          </div>
        </div>
        <div className={`window-body ${styles.modalBody}`}>
          <img src={folderImg} alt="" className={styles.icon} />
          <p className={styles.message}>{message}</p>
        </div>
        <div className={styles.buttonRow}>
          <button onClick={onConfirm} className={styles.actionButton}>
            {confirmLabel}
          </button>
          <button onClick={onCancel} className={styles.actionButton}>
            {cancelLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;