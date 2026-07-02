/** Dispatched when a communication analysis row is stored (sidebar can refresh). */
export const COMMUNICATION_SAVED_EVENT = "standex:communication-saved";

export function dispatchCommunicationSaved() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(COMMUNICATION_SAVED_EVENT));
}
