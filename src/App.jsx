import { useState, useEffect } from "react";
import { PHASES, DURATIONS, PHASE_INFO } from "./logic/timerConfig.js";
import { formatTime } from "./logic/formatTime.js";
import { getNextState } from "./logic/timerEngine.js";

function App() {
    const [phase, setPhase] = useState(PHASES.WORK);
    const [completedBreaks, setCompletedBreaks] = useState(0);
    const [secondsRemaining, setSecondsRemaining] = useState(DURATIONS[PHASES.WORK]);
    const [endTime, setEndTime] = useState(null);
    const [isRunning, setIsRunning] = useState(false);

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

    // Reset the whole timer back to a fresh WORK phase, paused
    function reset() {
        setIsRunning(false);
        setEndTime(null);
        setPhase(PHASES.WORK);
        setCompletedBreaks(0);
        setSecondsRemaining(DURATIONS[PHASES.WORK]);
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

    return (
        <div
            style={{
                backgroundColor: info.color,
                color: "white",
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "sans-serif",
                margin: 0,
            }}
        >
            <p style={{ fontSize: "1.5rem", margin: "0 0 0.5rem 0", opacity: 0.9 }}>
                {info.label}
            </p>
            <h1 style={{ fontSize: "5rem", margin: 0, fontVariantNumeric: "tabular-nums" }}>
                {timeString}
            </h1>
            <p style={{ fontSize: "0.9rem", marginTop: "1rem", opacity: 0.7 }}>
                Breaks Completed: {completedBreaks}
            </p>

            <div style={{ marginTop: "2rem", display: "flex", gap: "0.75rem" }}>
                {isRunning ? (
                    <button onClick={pause} style={buttonStyle}>Pause</button>
                ) : (
                    <button onClick={start} style={buttonStyle}>Start</button>
                )}
                <button onClick={reset} style={buttonStyle}>Reset</button>
            </div>
        </div>
    );
}

const buttonStyle = {
    padding: "0.5rem 1.25rem",
    fontSize: "1rem",
    border: "none",
    borderRadius: "4px",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    color: "white",
    cursor: "pointer",
};

export default App;