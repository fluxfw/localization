/** @typedef {import("../../../Adapter/SelectLanguage/afterSelectLanguage.mjs").afterSelectLanguage} afterSelectLanguage */
/** @typedef {import("../../../../../flux-css-api/src/Adapter/Api/CssApi.mjs").CssApi} CssApi */
/** @typedef {import("../Port/LocalizationService.mjs").LocalizationService} LocalizationService */
/** @typedef {import("../../../Adapter/SelectLanguage/SelectLanguageButtonsElement.mjs").SelectLanguageButtonsElement} SelectLanguageButtonsElement */

export class GetSelectLanguageButtonsElementCommand {
    /**
     * @type {CssApi}
     */
    #css_api;
    /**
     * @type {LocalizationService}
     */
    #localization_service;

    /**
     * @param {CssApi} css_api
     * @param {LocalizationService} localization_service
     * @returns {GetSelectLanguageButtonsElementCommand}
     */
    static new(css_api, localization_service) {
        return new this(
            css_api,
            localization_service
        );
    }

    /**
     * @param {CssApi} css_api
     * @param {LocalizationService} localization_service
     * @private
     */
    constructor(css_api, localization_service) {
        this.#css_api = css_api;
        this.#localization_service = localization_service;
    }

    /**
     * @param {afterSelectLanguage | null} after_select_language
     * @returns {Promise<SelectLanguageButtonsElement>}
     */
    async getSelectLanguageButtonsElement(after_select_language = null) {
        return (await import("../../../Adapter/SelectLanguage/SelectLanguageButtonsElement.mjs")).SelectLanguageButtonsElement.new(
            this.#css_api,
            this.#localization_service,
            async language => {
                await this.#localization_service.setLanguageSetting(
                    language
                );

                await this.#localization_service.setDefaultLanguage(
                    language
                );

                if (after_select_language !== null) {
                    after_select_language();
                }
            }
        );
    }
}
