import { useEffect } from "react";
import styles from "./ConfirmModal.module.css";

function ConfirmModal({ isOpen, message, confirmLabel, cancelLabel, onConfirm, onCancel }) {
    // Listen for the Escape key while the modal is open
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

    // If the modal isn't open, render nothing
    if (!isOpen) return null;

    return (
        <div onClick={onCancel} className={styles.overlay}>
            <div onClick={(event) => event.stopPropagation()} className={styles.card}>
                <p className={styles.message}>{message}</p>
                <div className={styles.buttonRow}>
                    <button onClick={onCancel} className={`${styles.button} ${styles.cancelButton}`}>
                        {cancelLabel}
                    </button>
                    <button onClick={onConfirm} className={`${styles.button} ${styles.confirmButton}`}>
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmModal;