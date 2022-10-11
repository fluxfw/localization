import { SelectLanguageButtonElement } from "../../../Adapter/SelectLanguage/SelectLanguageButtonElement.mjs";

/** @typedef {import("../../../../../flux-css-api/src/Adapter/Api/CssApi.mjs").CssApi} CssApi */
/** @typedef {import("../../../Adapter/SelectLanguage/Localization.mjs").Localization} Localization */
/** @typedef {import("../Port/LocalizationService.mjs").LocalizationService} LocalizationService */
/** @typedef {import("../../../Adapter/SelectLanguage/selectLanguage.mjs").selectLanguage} selectLanguage */

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
     * @param {selectLanguage} select_language
     * @param {Localization | null} localization
     * @returns {SelectLanguageButtonElement}
     */
    getSelectLanguageButtonElement(select_language, localization = null) {
        return SelectLanguageButtonElement.new(
            this.#css_api,
            this.#localization_service.getLanguageName(
                this.#localization_service.getLanguage(
                    localization
                )
            ),
            this.#localization_service,
            () => {
                select_language();
            },
            localization
        );
    }
}
