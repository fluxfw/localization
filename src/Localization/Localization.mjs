/** @typedef {import("../FluxLocalizationApi.mjs").FluxLocalizationApi} FluxLocalizationApi */

/**
 * @typedef {{direction?: string | null, "fallback-default"?: boolean | null, "fallback-languages"?: string[] | null, getLabel?: (localization: FluxLocalizationApi) => Promise<string>, getTexts?: () => Promise<{[key: string]: string}>, language: string}} Localization
 */
