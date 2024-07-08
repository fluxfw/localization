/** @typedef {import("./Localization.mjs").Localization} Localization */
/** @typedef {import("./Texts.mjs").Texts} Texts */

/**
 * @typedef {{"additional-system-languages"?: string[] | null, default?: boolean | null, direction?: string | null, label?: string | ((localization: Localization, system_label?: string | null) => Promise<string | null>) | null, language: string, texts?: {[key: string]: Texts} | (() => Promise<{[key: string]: Texts} | null>) | null}} LocalizationObject
 */
