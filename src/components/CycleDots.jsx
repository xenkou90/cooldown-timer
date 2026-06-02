import { LONG_BREAK_INTERVAL } from "../logic/timerConfig.js";

function CycleDots({ completedBreaks }) {
    // How far into the current cycle (4 breaks per cycle)
    const breaksThisCycle = completedBreaks % LONG_BREAK_INTERVAL;

    // Build an array of 4 indices [0, 1, 2, 3] to render a dot per index.
    const dotIndices = Array.from({ length: LONG_BREAK_INTERVAL }, (_, i) => i);

    return (
        <div
            style={{
                display: "flex",
                gap: "0.5rem",
                marginTop: "1rem",
                alignItems: "center",
            }}
            aria-label={`Cycle progress: ${breaksThisCycle} of ${LONG_BREAK_INTERVAL} breaks completed`}
        >
            {dotIndices.map((i) => {
                const isCompleted = i < breaksThisCycle;
                const isLongBreakDot = i === LONG_BREAK_INTERVAL - 1;

                return (
                    <span
                        key={i}
                        style={{
                            width: isLongBreakDot ? "12px" : "8px",
                            height: isLongBreakDot ? "12px" : "8px",
                            borderRadius: "50%",
                            backgroundColor: isCompleted
                                ? "rgba(255, 255, 255, 0.85)"
                                : "rgba(255, 255, 255, 0.25)",
                            border: isLongBreakDot
                                ? "2px solid rgba(255, 255, 255, 0.85)"
                                : "none",
                            backgroundClip: isLongBreakDot && !isCompleted ? "padding-box" : "border-box",
                            transition: "background-color 0.3s ease",
                        }}
                    />
                );
            })}
        </div>
    );
}

export default CycleDots;