/** @typedef {import("../../../../flux-css-api/src/Adapter/Api/CssApi.mjs").CssApi} CssApi */
/** @typedef {import("./Localization.mjs").Localization} Localization */
/** @typedef {import("../../Service/Localization/Port/LocalizationService.mjs").LocalizationService} LocalizationService */
/** @typedef {import("./selectLanguage.mjs").selectLanguage} selectLanguage */

const __dirname = import.meta.url.substring(0, import.meta.url.lastIndexOf("/"));

export class SelectLanguageButtonElement extends HTMLElement {
    /**
     * @type {CssApi}
     */
    #css_api;
    /**
     * @type {string}
     */
    #language;
    /**
     * @type {Localization | null}
     */
    #localization;
    /**
     * @type {LocalizationService}
     */
    #localization_service;
    /**
     * @type {selectLanguage}
     */
    #select;
    /**
     * @type {ShadowRoot}
     */
    #shadow;

    /**
     * @param {CssApi} css_api
     * @param {string} language
     * @param {LocalizationService} localization_service
     * @param {selectLanguage} select
     * @param {Localization | null} localization
     * @returns {SelectLanguageButtonElement}
     */
    static new(css_api, language, localization_service, select, localization = null) {
        return new this(
            css_api,
            language,
            localization_service,
            select,
            localization
        );
    }

    /**
     * @param {CssApi} css_api
     * @param {string} language
     * @param {LocalizationService} localization_service
     * @param {selectLanguage} select
     * @param {Localization | null} localization
     * @private
     */
    constructor(css_api, language, localization_service, select, localization) {
        super();

        this.#css_api = css_api;
        this.#language = language;
        this.#localization_service = localization_service;
        this.#select = select;
        this.#localization = localization;

        this.#shadow = this.attachShadow({ mode: "closed" });
        this.#css_api.importCssToRoot(
            this.#shadow,
            `${__dirname}/${this.constructor.name}.css`
        );

        this.#render();
    }

    /**
     * @returns {void}
     */
    #render() {
        const title = document.createElement("div");
        title.classList.add("title");
        title.innerText = this.#localization_service.translate(
            "Language",
            this.#localization
        );
        this.#shadow.appendChild(title);

        const button = document.createElement("div");
        button.classList.add("button");
        button.innerText = this.#language;
        button.addEventListener("click", async () => {
            this.#select();
        });
        this.#shadow.appendChild(button);
    }
}

export const SELECT_LANGUAGE_BUTTON_ELEMENT_TAG_NAME = "flux-select-language-button";

customElements.define(SELECT_LANGUAGE_BUTTON_ELEMENT_TAG_NAME, SelectLanguageButtonElement);
