// Convert a number of seconds into a "MM:SS" string
// Example: 3600 -> "60:00", 75 -> "01:15", 5 -> "00:05"
export function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    // padStart(2, "0") ensures two digits: 5 -> "05", 15 -> "15"
    const mm = String(minutes).padStart(2, "0");
    const ss = String(seconds).padStart(2, "0");

    return `${mm}:${ss}`;
}