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
                    const available_language = available_languages.find(_available_language => _available_language.language === language || _available_language.fallback_for_languages.includes(language)) ?? null;

                    if (available_language === null) {
                        continue;
                    }

                    preferred[available_language.language] = await this.#localization_service.getLanguageName(
                        available_language.language
                    );
                }
            }

            for (const available_language of available_languages) {
                if (available_language.language in preferred) {
                    continue;
                }

                other[available_language.language] = await this.#localization_service.getLanguageName(
                    available_language.language
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
            other,
            all: {
                ...preferred,
                ...other
            }
        };
    }
}
