/** @typedef {import("./Localization.mjs").Localization} Localization */
/** @typedef {import("./LocalizationChangeEvent.mjs").LocalizationChangeEvent} LocalizationChangeEvent */

/**
 * @typedef {Localization & {addEventListener: (type: "change", callback: (event: LocalizationChangeEvent) => void, options?: boolean | AddEventListenerOptions) => void, removeEventListener: (type: "change", callback: (event: LocalizationChangeEvent) => void, options?: boolean | EventListenerOptions) => void}} LocalizationWithEvents
 */
