/** @typedef {import("../../../Adapter/SelectLanguage/afterSelectLanguage.mjs").afterSelectLanguage} afterSelectLanguage */
/** @typedef {import("../../../../../flux-css-api/src/Adapter/Api/CssApi.mjs").CssApi} CssApi */
/** @typedef {import("../../../Adapter/SelectLanguage/ensureBeforeAndAfterSelectLanguage.mjs").ensureBeforeAndAfterSelectLanguage} ensureBeforeAndAfterSelectLanguage */
/** @typedef {import("../Port/LocalizationService.mjs").LocalizationService} LocalizationService */
/** @typedef {import("../../../Adapter/SelectLanguage/SelectLanguageButtonElement.mjs").SelectLanguageButtonElement} SelectLanguageButtonElement */

export class GetSelectLanguageButtonElementCommand {
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
     * @returns {GetSelectLanguageButtonElementCommand}
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
     * @param {ensureBeforeAndAfterSelectLanguage | null} ensure_before_and_after_select_language
     * @param {afterSelectLanguage | null} after_select_language
     * @returns {Promise<SelectLanguageButtonElement>}
     */
    async getSelectLanguageButtonElement(ensure_before_and_after_select_language = null, after_select_language = null) {
        return (await import("../../../Adapter/SelectLanguage/SelectLanguageButtonElement.mjs")).SelectLanguageButtonElement.new(
            this.#css_api,
            this.#localization_service,
            async () => {
                await this.#localization_service.selectLanguage(
                    ensure_before_and_after_select_language,
                    true
                );

                if (after_select_language !== null) {
                    after_select_language();
                }
            }
        );
    }
}
