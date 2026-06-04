import { PHASES, DURATIONS } from "../logic/timerConfig.js";
import styles from "./TitleBar.module.css";

function TitleBar({ phase, secondsRemaining }) {
    // Calculate percentage of current phase that's elapsed.
    const total = DURATIONS[phase];
    const elapsed = total - secondsRemaining;
    const percentage = Math.round((elapsed / total) * 100);

    // Choose the right noun: "work" for WORK phase, "break" from any break phase
    const phaseWord = phase === PHASES.WORK ? "work" : "break";

    return (
        <div className={`title-bar ${styles.titleBar}`}>
            <div className="title-bar-text">
                {percentage}% of {phaseWord} Completed
            </div>
            <div className="title-bar-controls">
                <button aria-label="Minimize" onClick={() => window.api.minimizeWindow()} />
                <button aria-label="Maximize" />
                <button aria-label="Close" onClick={() => window.api.closeWindow()} />
            </div>
        </div>
    );
}

export default TitleBar;