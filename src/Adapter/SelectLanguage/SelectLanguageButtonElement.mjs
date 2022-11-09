import { LOCALIZATION_LOCALIZATION_MODULE } from "../Localization/_LOCALIZATION_MODULE.mjs";

/** @typedef {import("../../../../flux-css-api/src/Adapter/Api/CssApi.mjs").CssApi} CssApi */
/** @typedef {import("../../Service/Localization/Port/LocalizationService.mjs").LocalizationService} LocalizationService */
/** @typedef {import("./selectLanguage.mjs").selectLanguage} selectLanguage */

const __dirname = import.meta.url.substring(0, import.meta.url.lastIndexOf("/"));

export class SelectLanguageButtonElement extends HTMLElement {
    /**
     * @type {HTMLDivElement}
     */
    #button_element;
    /**
     * @type {CssApi}
     */
    #css_api;
    /**
     * @type {LocalizationService}
     */
    #localization_service;
    /**
     * @type {selectLanguage}
     */
    #select_language;
    /**
     * @type {ShadowRoot}
     */
    #shadow;
    /**
     * @type {HTMLDivElement}
     */
    #title_element;

    /**
     * @param {CssApi} css_api
     * @param {LocalizationService} localization_service
     * @param {selectLanguage} select_language
     * @returns {SelectLanguageButtonElement}
     */
    static new(css_api, localization_service, select_language) {
        return new this(
            css_api,
            localization_service,
            select_language
        );
    }

    /**
     * @param {CssApi} css_api
     * @param {LocalizationService} localization_service
     * @param {selectLanguage} select_language
     * @private
     */
    constructor(css_api, localization_service, select_language) {
        super();

        this.#css_api = css_api;
        this.#localization_service = localization_service;
        this.#select_language = select_language;

        this.#shadow = this.attachShadow({ mode: "closed" });
        this.#css_api.importCssToRoot(
            this.#shadow,
            `${__dirname}/${this.constructor.name}.css`
        );

        this.#render();
    }

    /**
     * @returns {Promise<void>}
     */
    async #render() {
        this.#title_element = document.createElement("div");
        this.#title_element.classList.add("title");
        this.#shadow.appendChild(this.#title_element);

        this.#button_element = document.createElement("div");
        this.#button_element.classList.add("button");
        this.#button_element.addEventListener("click", async () => {
            await this.#select_language();
            await this.#setText();
        });
        this.#shadow.appendChild(this.#button_element);

        await this.#setText();
    }

    /**
     * @returns {Promise<void>}
     */
    async #setText() {
        this.#title_element.innerText = await this.#localization_service.translate(
            "Language",
            LOCALIZATION_LOCALIZATION_MODULE
        );

        this.#button_element.innerText = (await this.#localization_service.getLanguage()).name;
    }
}

export const SELECT_LANGUAGE_BUTTON_ELEMENT_TAG_NAME = "flux-select-language-button";

customElements.define(SELECT_LANGUAGE_BUTTON_ELEMENT_TAG_NAME, SelectLanguageButtonElement);
