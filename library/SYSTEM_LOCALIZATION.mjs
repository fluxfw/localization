import { LOCALIZATION_MODULE_LOCALIZATION } from "./Localization/LOCALIZATION_MODULE_LOCALIZATION.mjs";
import { LOCALIZATION_KEY_LOCALIZATION_SYSTEM, LOCALIZATION_KEY_LOCALIZATION_SYSTEM_WITH_LANGUAGE } from "./Localization/LOCALIZATION_KEY_LOCALIZATION.mjs";

/** @typedef {import("./LocalizationObject.mjs").LocalizationObject} LocalizationObject */

export const LANGUAGE_SYSTEM = "system";

/**
 * @type {LocalizationObject}
 */
export const SYSTEM_LOCALIZATION = Object.freeze({
    label: async (localization, system_label = null) => system_label !== null ? localization.translate(
        LOCALIZATION_MODULE_LOCALIZATION,
        LOCALIZATION_KEY_LOCALIZATION_SYSTEM_WITH_LANGUAGE,
        {
            language: system_label
        }
    ) : localization.translate(
        LOCALIZATION_MODULE_LOCALIZATION,
        LOCALIZATION_KEY_LOCALIZATION_SYSTEM
    ),
    language: LANGUAGE_SYSTEM
});
