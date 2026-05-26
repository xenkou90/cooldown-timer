// A manual test script. I run it with Node to verify the logic
import { getNextState } from "./timerEngine.js";
import { PHASES } from "./timerConfig.js";

// Simulate a full cycle and print each transition
let phase = PHASES.WORK;
let completedBreaks = 0;

console.log("Starting simulation:\n");

for (let i =0; i < 10; i++) {
    const next = getNextState(phase, completedBreaks);
    console.log(
        `${phase.padEnd(12)} (completed=${completedBreaks}) --> ` +
        `${next.phase.padEnd(12)} for ${next.durationSeconds / 60} min ` +
        `(completed=${next.completedBreaks})`
    );
    phase = next.phase;
    completedBreaks = next.completedBreaks;
}