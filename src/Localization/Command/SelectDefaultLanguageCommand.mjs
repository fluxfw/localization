/** @typedef {import("../Port/LocalizationService.mjs").LocalizationService} LocalizationService */

export class SelectDefaultLanguageCommand {
    /**
     * @type {LocalizationService}
     */
    #localization_service;

    /**
     * @param {LocalizationService} localization_service
     * @returns {SelectDefaultLanguageCommand}
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
     * @returns {Promise<void>}
     */
    async selectDefaultLanguage() {
        let language = await this.#localization_service.getLanguageSetting();

        if (language === "") {
            ({
                language
            } = await this.#localization_service.getLanguage());
            await this.#localization_service.setLanguageSetting(
                language
            );
        }

        await this.#localization_service.setDefaultLanguage(
            language
        );
    }
}
