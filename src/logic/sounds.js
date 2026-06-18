import openSound from "../assets/sounds/open-sound.mp3";
import workStart from "../assets/sounds/work-start.mp3";
import shortBreakStart from "../assets/sounds/short-break-start.mp3";
import longBreakStart from "../assets/sounds/long-break-start.mp3";

// Map of sound names to preloaded Audio objects
// Created once at module load — not on every play call
const sounds = {
    openSound: new Audio(openSound),
    workStart: new Audio(workStart),
    shortBreakStart: new Audio(shortBreakStart),
    longBreakStart: new Audio(longBreakStart),
};

// Set a sane default volume on all sounds
// 0.5 means 50% tweak to taste
Object.values(sounds).forEach((audio) => {
    audio.volume = 0.5;
});

// Module-level mute state. Synced from React via setMuted
let muted = false;

export function setMuted(value) {
    muted = value;
}

// Play a sound by name
// If the sound is already playing, restart it from the beginning
// so rapid triggers don't get queued or ignored
export function playSound(name) {
    if (muted) return;

    const sound = sounds[name];
    if (!sound) {
        console.warn(`Unknown sound: ${name}`);
        return;
    }

    sound.currentTime = 0; // rewind to start
    sound.play().catch((err) => {
        // Browsers can block autoplay until the user interacts with the page
        // The launch sound may be blocked on first open; subsequent ones work
        console.warn(`Could not play sound "${name}":`, err);
    });
}