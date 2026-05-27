import { useState } from "react";
import { PHASES, DURATIONS, PHASE_INFO } from "./logic/timerConfig.js";
import { formatTime } from "./logic/formatTime.js";

function App() {
    // State: which phase we are in. Starts as WORK.
    const [phase, setPhase] = useState(PHASES.WORK);

    // State: seconds left in the current phase. Startts at the WORK duration
    const [secondsRemaining, setSecondsRemaining] = useState(DURATIONS[PHASES.WORK]);

    // Derive display values from state (not stored separately — computed each render)
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
        </div>
    );
}

export default App;