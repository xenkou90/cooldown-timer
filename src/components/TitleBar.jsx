import { PHASES } from "../logic/timerConfig.js";
import styles from "./TitleBar.module.css";

function TitleBar({ phase, percentage }) {
    const phaseWord = phase === PHASES.WORK ? "work" : "break";

    return (
        <div className={`title-bar ${styles.titleBar}`}>
            <div className="title-bar-text">
                {percentage}% of {phaseWord} Completed
            </div>
            <div className="title-bar-controls">
                <button aria-label="Minimize" onClick={() => window.api.minimizeWindow()} />
                <button aria-label="Maximize" disabled />
                <button aria-label="Close" onClick={() => window.api.closeWindow()} />
            </div>
        </div>
    );
}

export default TitleBar;