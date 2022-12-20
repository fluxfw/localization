/** @typedef {import("../Port/LocalizationService.mjs").LocalizationService} LocalizationService */
/** @typedef {import("../../../Adapter/Language/Localization.mjs").Localization} Localization */

export class LoadLocalizationCommand {
    /**
     * @type {LocalizationService}
     */
    #localization_service;

    /**
     * @param {LocalizationService} localization_service
     * @returns {LoadLocalizationCommand}
     */
    static new(localization_service) {
        return new this(
            localization_service
        );
    }

    /**
     * @param {LocalizationService} localization_service
     * @private
     */
    constructor(localization_service) {
        this.#localization_service = localization_service;
    }

    /**
     * @param {string} localization_folder
     * @param {string | null} language
     * @returns {Promise<Localization>}
     */
    async loadLocalization(localization_folder, language = null) {
        const available_languages = await this.#localization_service.importAvailableLanguagesJson(
            localization_folder
        );

        for (const _language of language !== null ? [
            language
        ] : "navigator" in globalThis ? navigator.languages : []) {
            let __language;
            if (available_languages !== null) {
                const available_language = available_languages.find(_available_language => _available_language.language === _language || _available_language.fallback_for_languages.includes(_language)) ?? null;

                if (available_language === null) {
                    continue;
                }

                __language = available_language.language;
            } else {
                __language = _language;
            }

            const localization = await this.#localization_service.importLocalizationJson(
                localization_folder,
                __language
            );

            if (localization === null) {
                if (available_languages !== null) {
                    break;
                } else {
                    continue;
                }
            }

            return {
                language: __language,
                localization
            };
        }

        return {
            language: null,
            localization: null
        };
    }
}
