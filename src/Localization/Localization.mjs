/** @typedef {import("../FluxLocalization.mjs").FluxLocalization} FluxLocalization */

/**
 * @typedef {{direction?: string | null, "fallback-default"?: boolean | null, "fallback-languages"?: string[] | null, label?: string | ((localization: FluxLocalization, system_localization_label?: string | null) => Promise<string | null>) | null, language: string, texts?: {[key: string]: string} | (() => Promise<{[key: string]: string} | null>) | null}} Localization
 */
