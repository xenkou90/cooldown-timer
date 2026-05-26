import { PHASES, DURATIONS, LONG_BREAK_INTERVAL } from "./timerConfig.js";

// Given how many breaks have been COMPLETED so far, decide what the
// NEXT break should be. The next break's number is (completedBreaks + 1)
function getNextBreakPhase(completedBreaks) {
    const nextBreakNumber = completedBreaks + 1;
    const isLong = nextBreakNumber % LONG_BREAK_INTERVAL === 0;
    return isLong ? PHASES.LONG_BREAK : PHASES.SHORT_BREAK;
}

// The core transition function. Given the current phase and how many
// breaks have been completed, return what comes next
//
// it returns an OBJECT describing the next situation:
// { phase, durationSeconds, completedBreaks }
//
// This is a PURE function: no timers, no React, no side effects
// Same inputs always produce the same output
export function getNextState(currentPhase, completedBreaks) {
    if (currentPhase === PHASES.WORK) {
        // Work just finished → time for a break
        const nextPhase = getNextBreakPhase(completedBreaks);
        return {
            phase: nextPhase,
            durationSeconds: DURATIONS[nextPhase],
            completedBreaks: completedBreaks, // not incremented yet — break hasn't finished
        };
    } else {
        // A break just finished → back to work and count that break
        return {
            phase: PHASES.WORK,
            durationSeconds: DURATIONS[PHASES.WORK],
            completedBreaks: completedBreaks + 1 // this break is now complete
        };
    }
}