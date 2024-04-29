/** @typedef {import("../FluxLocalization.mjs").FluxLocalization} FluxLocalization */

/**
 * @typedef {{default?: boolean | null, direction?: string | null, label?: string | ((localization: FluxLocalization, system_localization_label?: string | null) => Promise<string | null>) | null, language: string, "system-languages"?: string[] | null, texts?: {[key: string]: {[key: string]: string}} | (() => Promise<{[key: string]: {[key: string]: string}} | null>) | null}} Localization
 */
