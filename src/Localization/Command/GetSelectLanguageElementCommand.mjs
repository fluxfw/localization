/** @typedef {import("../../SelectLanguage/afterSelectLanguage.mjs").afterSelectLanguage} afterSelectLanguage */
/** @typedef {import("../../../../flux-css-api/src/FluxCssApi.mjs").FluxCssApi} FluxCssApi */
/** @typedef {import("../Port/LocalizationService.mjs").LocalizationService} LocalizationService */
/** @typedef {import("../../SelectLanguage/SelectLanguageElement.mjs").SelectLanguageElement} SelectLanguageElement */

export class GetSelectLanguageElementCommand {
    /**
     * @type {FluxCssApi}
     */
    #flux_css_api;
    /**
     * @type {LocalizationService}
     */
    #localization_service;

    /**
     * @param {FluxCssApi} flux_css_api
     * @param {LocalizationService} localization_service
     * @returns {GetSelectLanguageElementCommand}
     */
    static new(flux_css_api, localization_service) {
        return new this(
            flux_css_api,
            localization_service
        );
    }

    /**
     * @param {FluxCssApi} flux_css_api
     * @param {LocalizationService} localization_service
     * @private
     */
    constructor(flux_css_api, localization_service) {
        this.#flux_css_api = flux_css_api;
        this.#localization_service = localization_service;
    }

    /**
     * @param {afterSelectLanguage | null} after_select_language
     * @returns {Promise<SelectLanguageElement>}
     */
    async getSelectLanguageElement(after_select_language = null) {
        return (await import("../../SelectLanguage/SelectLanguageElement.mjs")).SelectLanguageElement.new(
            this.#flux_css_api,
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
