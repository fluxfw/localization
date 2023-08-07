import { LOCALIZATION_KEY_SYSTEM_BASED } from "./LOCALIZATION_KEY.mjs";
import { LOCALIZATION_MODULE } from "./LOCALIZATION_MODULE.mjs";

/** @typedef {import("./Localization.mjs").Localization} Localization */

export const LANGUAGE_SYSTEM = "system";

/**
 * @type {Localization}
 */
export const SYSTEM_LOCALIZATION = Object.freeze({
    getLabel: async localization => localization.translate(
        LOCALIZATION_MODULE,
        LOCALIZATION_KEY_SYSTEM_BASED
    ),
    language: LANGUAGE_SYSTEM
});
