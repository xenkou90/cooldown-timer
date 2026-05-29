import { useEffect } from "react";

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
        <div
            onClick={onCancel}
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                backgroundFilter: "blur(4px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1000,
            }}
        >
            <div
                onClick={(event) => event.stopPropagation()}
                style={{
                    backgroundColor: "#2a2a2a",
                    color: "white",
                    padding: "1.5rem 2rem",
                    borderRadius: "8px",
                    maxWidth: "320px",
                    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.4)",
                    textAlign: "center",
                    fontFamily: "sans-serif,"
                }}
            >
                <p style={{ fontSize: "1.05rem", margin: "0 0 1.25rem 0" }}>{message}</p>
                <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
                    <button onClick={onCancel} style={cancelButtonStyle}>
                        {cancelLabel}
                    </button>
                    <button onClick={onConfirm} style={confirmButtonStyle}>
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}

const baseButtonStyle = {
    padding: "0.5rem 1.25rem",
    fontSize: "1rem",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontFamily: "inherit",
};

const cancelButtonStyle = {
    ...baseButtonStyle,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    color: "white",
};

const confirmButtonStyle = {
    ...baseButtonStyle,
    backgroundColor: "#c14444",
    color: "white",
};

export default ConfirmModal;