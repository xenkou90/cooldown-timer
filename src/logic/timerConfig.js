// Phase names as constants. using a frozen object instead of loose
// strings means typos become errors insteas of silent bugs
export const PHASES = Object.freeze({
    WORK: "WORK",
    SHORT_BREAK: "SHORT_BREAK",
    LONG_BREAK: "LONG_BREAK",
});

// Durations in SECONDS. I keep them here so there is one single
// place to change them later (and easy to shorten for testing!)
export const DURATIONS = Object.freeze({
    [PHASES.WORK]: 60*60, //3600 seconds = 60 minutes
    [PHASES.SHORT_BREAK]: 15*60, // 900 seconds = 15 minutes
    [PHASES.LONG_BREAK]: 30*60, // 1800 seconds = 30 minutes
});

// Every Nth break is a long break
export const LONG_BREAK_INTERVAL = 4;

// Human-friendly labels and a color for each phase
// Kept here so all "what does each phase look like" info lives in one place
export const PHASE_INFO = Object.freeze({
    [PHASES.WORK]: { label: "Focus Time", color: "#2f6f4f" },
    [PHASES.SHORT_BREAK]: { label: "Short Break", color: "#1f5673" },
    [PHASES.LONG_BREAK]: { label: "Long Break", color: "#6b4f8c" },
});