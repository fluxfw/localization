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
        ] : navigator.languages) {
            if (available_languages !== null && !available_languages.includes(_language)) {
                continue;
            }

            const localization = await this.#localization_service.importLocalizationJson(
                localization_folder,
                _language
            );

            if (localization === null) {
                if (available_languages !== null) {
                    break;
                } else {
                    continue;
                }
            }

            return {
                language: _language,
                localization
            };
        }

        return {
            language: null,
            localization: null
        };
    }
}
