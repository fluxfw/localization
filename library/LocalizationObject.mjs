/** @typedef {import("./LocalizationWithEvents.mjs").LocalizationWithEvents} LocalizationWithEvents */
/** @typedef {import("./Texts.mjs").Texts} Texts */

/**
 * @typedef {{"additional-system-languages"?: string[] | null, default?: boolean | null, direction?: string | null, label?: string | ((localization: LocalizationWithEvents, system_label?: string | null) => Promise<string | null>) | null, language: string, texts?: {[key: string]: Texts} | ((module: string) => Promise<Texts | null>) | null}} LocalizationObject
 */
