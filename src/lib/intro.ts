export const INTRO_STORAGE_KEY = "svetara-intro";
export const INTRO_DONE_EVENT = "svetara:intro-done";

function isIntroDone(): boolean {
  const state = document.documentElement.dataset.intro;
  return state === "done" || state === "skip";
}

export function markIntroDone(): void {
  const root = document.documentElement;
  if (root.dataset.intro !== "skip") root.dataset.intro = "done";
  window.dispatchEvent(new Event(INTRO_DONE_EVENT));
}

export function onIntroDone(callback: () => void): () => void {
  if (isIntroDone()) {
    callback();
    return () => {};
  }
  window.addEventListener(INTRO_DONE_EVENT, callback, { once: true });
  return () => window.removeEventListener(INTRO_DONE_EVENT, callback);
}
