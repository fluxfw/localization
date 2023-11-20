/** @typedef {import("../FluxLocalization.mjs").FluxLocalization} FluxLocalization */

/**
 * @typedef {{direction?: string | null, "fallback-default"?: boolean | null, "fallback-languages"?: string[] | null, getLabel?: (localization: FluxLocalization) => Promise<string>, getTexts?: () => Promise<{[key: string]: string}>, language: string}} Localization
 */
