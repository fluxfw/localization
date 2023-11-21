/** @typedef {import("../FluxLocalization.mjs").FluxLocalization} FluxLocalization */

/**
 * @typedef {{direction?: string | null, "fallback-default"?: boolean | null, "fallback-languages"?: string[] | null, getLabel?: ((localization: FluxLocalization, system_localization_label?: string | null) => Promise<string>) | null, getTexts?: (() => Promise<{[key: string]: string}>) | null, language: string}} Localization
 */
