/** @typedef {import("../../Language/Language.mjs").Language} Language */
/** @typedef {import("../../Language/Localization.mjs").Localization} Localization */
/** @typedef {import("../Port/LocalizationService.mjs").LocalizationService} LocalizationService */

export class GetLanguageCommand {
    /**
     * @type {LocalizationService}
     */
    #localization_service;

    /**
     * @param {LocalizationService} localization_service
     * @returns {GetLanguageCommand}
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
     * @param {Localization} localization
     * @returns {Promise<Language>}
     */
    async getLanguage(localization) {
        const language = localization.language ?? "en";

        return {
            language,
            name: await this.#localization_service.getLanguageName(
                language
            ),
            direction: await this.#localization_service.getDirection(
                language
            )
        };
    }
}
