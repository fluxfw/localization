/** @typedef {import("../Port/LocalizationService.mjs").LocalizationService} LocalizationService */

export class GetLanguagesCommand {
    /**
     * @type {LocalizationService}
     */
    #localization_service;

    /**
     * @param {LocalizationService} localization_service
     * @returns {GetLanguagesCommand}
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
     * @returns {Promise<{preferred: {[key: string]: string}, other: {[key: string]: string}}>}
     */
    async getLanguages(localization_folder) {
        const available_languages = await this.#localization_service.importAvailableLanguagesJson(
            localization_folder
        );

        const preferred = {};
        const other = {};

        if (available_languages !== null) {
            for (const language of navigator.languages) {
                if (!available_languages.includes(language)) {
                    continue;
                }

                preferred[language] = this.#localization_service.getLanguageName(
                    language
                );
            }

            for (const language of available_languages) {
                if (language in preferred) {
                    continue;
                }

                other[language] = this.#localization_service.getLanguageName(
                    language
                );
            }
        } else {
            for (const language of navigator.languages) {
                if (await this.#localization_service.importLocalizationJson(
                    localization_folder,
                    language
                ) === null) {
                    continue;
                }

                preferred[language] = this.#localization_service.getLanguageName(
                    language
                );
            }
        }

        return {
            preferred,
            other
        };
    }
}
