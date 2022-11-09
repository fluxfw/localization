/** @typedef {import("../../../Adapter/Language/Languages.mjs").Languages} Languages */
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
     * @returns {Promise<Languages>}
     */
    async getLanguages(localization_folder) {
        const available_languages = await this.#localization_service.importAvailableLanguagesJson(
            localization_folder
        );

        const preferred = {};
        const other = {};

        if (available_languages !== null) {
            if ("navigator" in globalThis) {
                for (const language of navigator.languages) {
                    if (!available_languages.includes(language)) {
                        continue;
                    }

                    preferred[language] = await this.#localization_service.getLanguageName(
                        language
                    );
                }
            }

            for (const language of available_languages) {
                if (language in preferred) {
                    continue;
                }

                other[language] = await this.#localization_service.getLanguageName(
                    language
                );
            }
        } else {
            if ("navigator" in globalThis) {
                for (const language of navigator.languages) {
                    if (await this.#localization_service.importLocalizationJson(
                        localization_folder,
                        language
                    ) === null) {
                        continue;
                    }

                    preferred[language] = await this.#localization_service.getLanguageName(
                        language
                    );
                }
            }
        }

        return {
            preferred,
            other
        };
    }
}
