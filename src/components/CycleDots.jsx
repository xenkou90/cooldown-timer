import { LONG_BREAK_INTERVAL } from "../logic/timerConfig.js";
import styles from "./CycleDots.module.css";

function CycleDots({ completedBreaks }) {
  const breaksThisCycle = completedBreaks % LONG_BREAK_INTERVAL;
  const dotIndices = Array.from({ length: LONG_BREAK_INTERVAL }, (_, i) => i);

  return (
    <div
      className={styles.dotsRow}
      aria-label={`Cycle progress: ${breaksThisCycle} of ${LONG_BREAK_INTERVAL} breaks completed`}
    >
      {dotIndices.map((i) => {
        const isCompleted = i < breaksThisCycle;
        const isLongBreakDot = i === LONG_BREAK_INTERVAL - 1;

        const classes = [styles.dot];
        if (isLongBreakDot) classes.push(styles.dotLong);
        if (isCompleted && !isLongBreakDot) classes.push(styles.dotCompleted);
        if (isCompleted && isLongBreakDot) classes.push(styles.dotLongCompleted);

        return <span key={i} className={classes.join(" ")} />;
      })}
    </div>
  );
}

export default CycleDots;