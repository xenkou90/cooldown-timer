import { useState, useEffect } from "react";
import { PHASES, DURATIONS, PHASE_INFO } from "./logic/timerConfig.js";
import { formatTime } from "./logic/formatTime.js";
import { getNextState } from "./logic/timerEngine.js";
import ConfirmModal from "./components/ConfirmModal.jsx";
import CycleDots from "./components/CycleDots.jsx";
import styles from "./App.module.css";
import TitleBar from "./components/TitleBar.jsx";

function App() {
    const [phase, setPhase] = useState(PHASES.WORK);
    const [completedBreaks, setCompletedBreaks] = useState(0);
    const [secondsRemaining, setSecondsRemaining] = useState(DURATIONS[PHASES.WORK]);
    const [endTime, setEndTime] = useState(null);
    const [isRunning, setIsRunning] = useState(false);
    const [isResetModalOpen, setIsResetModalOpen] = useState(false);

    // Start the current phase: set the endTime and mark as running
    function start() {
        const newEndTime = Date.now() + secondsRemaining * 1000;
        setEndTime(newEndTime);
        setIsRunning(true);
    }

    // Pause: stop ticking but keep secondsRemaining where it is
    function pause() {
        setIsRunning(false);
        setEndTime(null);
    }

    // The actual reset logic. Only called from the modal's Confirm button
    function performReset() {
        setIsRunning(false);
        setEndTime(null);
        setPhase(PHASES.WORK);
        setCompletedBreaks(0);
        setSecondsRemaining(DURATIONS[PHASES.WORK]);
        setIsResetModalOpen(false);
    }

    // Clicking the Reset button just opens the modal - doesn't reset yet
    function requestReset() {
        setIsResetModalOpen(true);
    }

    function cancelReset() {
        setIsResetModalOpen(false);
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
            if (isResetModalOpen) return;

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
    }, [isRunning, isResetModalOpen]);

    return (
        <div className="window" style={{ width: "100%", height: "100vh", margin: 0 }}>
            <TitleBar phase={phase} secondsRemaining={secondsRemaining} />
            <div className="window-body" style={{ height: "calc(100% - 33px", margin: 0, padding: 0 }}>
                <div className={styles.container} style={{ backgroundColor: info.color }}>
                    <p className={styles.phaseLabel}>{info.label}</p>
                    <h1 className={styles.timeDisplay}>{timeString}</h1>
                    <CycleDots completedBreaks={completedBreaks} />

                    <div className={styles.controlsRow}>
                        {isRunning ? (
                            <button onClick={pause} className={styles.button}>Pause</button>
                        ) : (
                            <button onClick={start} className={styles.button}>Start</button>
                        )}
                        <button onClick={requestReset} className={styles.button}>Reset</button>
                    </div>

                    <p className={styles.shortcutHint}>Press Space to start or pause</p>

                    <ConfirmModal
                        isOpen={isResetModalOpen}
                        message="Reset the timer? Your current session will be lost."
                        confirmLabel="Reset"
                        cancelLabel="Cancel"
                        onConfirm={performReset}
                        onCancel={cancelReset}
                    />
                </div>
            </div>
        </div>
    );
}

export default App;