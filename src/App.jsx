import { useState, useEffect } from "react";
import { PHASES, DURATIONS, PHASE_INFO } from "./logic/timerConfig.js";
import { formatTime } from "./logic/formatTime.js";
import { getNextState } from "./logic/timerEngine.js";
import ConfirmModal from "./components/ConfirmModal.jsx";
import CycleDots from "./components/CycleDots.jsx";
import styles from "./App.module.css";
import TitleBar from "./components/TitleBar.jsx";
import computerImg from "./assets/computer.png";
import folderImg from "./assets/folder.png";
import acImg from "./assets/ac.png";
import { playSound } from "./logic/sounds.js";

function App() {
    const [phase, setPhase] = useState(PHASES.WORK);
    const [completedBreaks, setCompletedBreaks] = useState(0);
    const [secondsRemaining, setSecondsRemaining] = useState(DURATIONS[PHASES.WORK]);
    const [endTime, setEndTime] = useState(null);
    const [isRunning, setIsRunning] = useState(false);
    const [isResetModalOpen, setIsResetModalOpen] = useState(false);
    const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);

    function start() {
        const newEndTime = Date.now() + secondsRemaining * 1000;
        setEndTime(newEndTime);
        setIsRunning(true);
    }

    function pause() {
        setIsRunning(false);
        setEndTime(null);
    }

    function performReset() {
        setIsRunning(false);
        setEndTime(null);
        setPhase(PHASES.WORK);
        setCompletedBreaks(0);
        setSecondsRemaining(DURATIONS[PHASES.WORK]);
        setIsResetModalOpen(false);
    }

    function requestReset() {
        setIsResetModalOpen(true);
    }

    function cancelReset() {
        setIsResetModalOpen(false);
    }

    function requestClose() {
        setIsCloseModalOpen(true);
    }

    function performClose() {
        setIsCloseModalOpen(false);
        window.api.closeWindow();
    }

    function cancelClose() {
        setIsCloseModalOpen(false);
    }

    // The tick effect: while running, recompute secondsRemaining every 250ms
    // by comparing the clock to endTime. When it hits zero, transition
    useEffect(() => {
        if (!isRunning || endTime === null) {
            return; // not running -> no interval to set up
        }

        const intervalId = setInterval(() => {
            const msLeft = endTime - Date.now();
            const secondsLeft = Math.max(0, Math.ceil(msLeft / 1000));
            setSecondsRemaining(secondsLeft);

            if (msLeft <= 0) {
                // Phase ended -> ask the engine what's next
                const next = getNextState(phase, completedBreaks);
                setPhase(next.phase);
                setCompletedBreaks(next.completedBreaks);
                setSecondsRemaining(next.durationSeconds);
                setEndTime(Date.now() + next.durationSeconds * 1000);
            }
        }, 250);

        // Cleanup: stop the interval when isRunning/endTime changes or component unmounts
        return () => clearInterval(intervalId);
    }, [isRunning, endTime, phase, completedBreaks]);

    const info = PHASE_INFO[phase];
    const timeString = formatTime(secondsRemaining);

    // Percentage of current phase that has elapsed
    const totalSeconds = DURATIONS[phase];
    const elapsedSeconds = totalSeconds - secondsRemaining;
    const percentage = Math.round((elapsedSeconds / totalSeconds) * 100);

    // Keep the window title in sync with the current time and phase
    // Visible in the OS taskbar/ Alt-Tab switcher even when minimized
    useEffect(() => {
        document.title = `${timeString} — ${info.label}`;
    }, [timeString, info.label]);

    // Global keyboard shortcuts
    // Spacebar toggles start/pause
    useEffect(() => {
        function handleKeyDown(event) {
            // Ignore auto-repeat from holding the key down
            if (event.repeat) return;

            // Ignore shortcut when the reset modal is open
            // let the modal own the keyboard while it is up
            if (isResetModalOpen || isCloseModalOpen) return;

            // Ignore shortcut when the user is typing into an ipnut or text area
            // (future-proofing for when I add settings etc.)
            const target = event.target;
            const isTyping =
                target.tagName === "INPUT" ||
                target.tagName === "TEXTAREA" ||
                target.isContentEditable;
            if (isTyping) return;

            if (event.code === "Space") {
                event.preventDefault(); // stop the browser from scrolling or re-clicking buttons
                if (isRunning) {
                    pause();
                } else {
                    start();
                }
            }
        }

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isRunning, isResetModalOpen, isCloseModalOpen]);

    // Play the open sound once when the app launches.
    // Note: browsers may block this on first-ever launch due to autoplay policy.
    // It will work normally on subsequent app starts after the user has interacted.
    useEffect(() => {
        playSound("openSound");
    }, []);

    return (
        <div
            className="window"
            style={{
                width: "100%",
                height: "100vh",
                margin: 0,
                display: "flex",
                flexDirection: "column",
            }}
        >
            <TitleBar phase={phase} percentage={percentage} />

            <div className={`window-body ${styles.windowBody}`}>
                {/* Row 1: icons */}
                <div className={styles.iconRow}>
                    <img src={computerImg} alt="Computer" className={styles.computerIcon} />
                    <img
                        src={folderImg}
                        alt="Folder being copied"
                        className={`${styles.folderIcon} ${!isRunning ? styles.folderIconPaused : ""}`}
                    />
                    <img src={acImg} alt="Air conditioner" className={styles.acIcon} />
                </div>

                {/* Row 2: Saving in label */}
                <p className={styles.savingLabel}>Saving In:</p>

                {/* Row 3: progress bar (static for now - wired in next commit) */}
                <div
                    role="progressbar"
                    aria-valuenow={percentage}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    className="progress-indicator segmented"
                >
                    <span className="progress-indicator-bar" style={{ width: `${percentage}%` }} />
                </div>

                {/* Row 4: time left */}
                <p className={styles.timeRow}>
                    <span className={styles.timeRowLabel}>Estimated time left:</span>
                    <span className={styles.timeRowValue}>{timeString}</span>
                </p>

                {/* Row 5: shortcut hint */}
                <div className={styles.shortcutHintRow}>
                    <input type="checkbox" defaultChecked id="space-hint" readOnly />
                    <label htmlFor="space-hint" className={styles.shortcutHintLabel}>
                        Press Space to Start or Pause
                    </label>
                </div>

                {/* Row 6: buttons */}
                <div className={styles.buttonRow}>
                    {isRunning ? (
                        <button onClick={pause} className={styles.actionButton}>Pause</button>
                    ) : (
                        <button onClick={start} className={styles.actionButton}>Start</button>
                    )}
                    <button onClick={requestReset} className={styles.actionButton}>Reset</button>
                    <button onClick={requestClose} className={styles.actionButton}>Cancel</button>
                </div>

                <ConfirmModal
                    isOpen={isResetModalOpen}
                    title="Confirm reset"
                    message="Reset the timer? Your current session will be lost."
                    confirmLabel="Yes"
                    cancelLabel="No"
                    onConfirm={performReset}
                    onCancel={cancelReset}
                />

                <ConfirmModal
                    isOpen={isCloseModalOpen}
                    title="Close Cooldown Timer"
                    message="Close Cooldown Timer? Your current session will be lost."
                    confirmLabel="Yes"
                    cancelLabel="No"
                    onConfirm={performClose}
                    onCancel={cancelClose}
                />
            </div>
        </div>
    );
}

export default App;