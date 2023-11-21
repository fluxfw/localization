import { LOCALIZATION_MODULE } from "./LOCALIZATION_MODULE.mjs";
import { LOCALIZATION_KEY_SYSTEM, LOCALIZATION_KEY_SYSTEM_WITH_LANGUAGE } from "./LOCALIZATION_KEY.mjs";

/** @typedef {import("./Localization.mjs").Localization} Localization */

export const LANGUAGE_SYSTEM = "system";

/**
 * @type {Localization}
 */
export const SYSTEM_LOCALIZATION = Object.freeze({
    getLabel: async (localization, system_localization_label = null) => system_localization_label !== null ? localization.translate(
        LOCALIZATION_MODULE,
        LOCALIZATION_KEY_SYSTEM_WITH_LANGUAGE,
        {
            language: system_localization_label
        }
    ) : localization.translate(
        LOCALIZATION_MODULE,
        LOCALIZATION_KEY_SYSTEM
    ),
    language: LANGUAGE_SYSTEM
});
