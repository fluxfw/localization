/** @typedef {import("./Localization.mjs").Localization} Localization */

/**
 * @type {Localization[]}
 */
export const LOCALIZATIONS = Object.freeze([
    {
        "fallback-languages": Object.freeze([
            "de-AT",
            "de-CH",
            "de-DE",
            "de-LI"
        ]),
        getTexts: async () => (await import("./TEXTS_DE.mjs")).TEXTS_DE,
        language: "de"
    },
    {
        "fallback-default": true,
        getTexts: async () => (await import("./TEXTS_EN.mjs")).TEXTS_EN,
        language: "en"
    }
].map(localization => Object.freeze(localization)));
