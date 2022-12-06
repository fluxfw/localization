import { LOCALIZATION_LOCALIZATION_MODULE } from "../Localization/_LOCALIZATION_MODULE.mjs";

/** @typedef {import("../../../../flux-css-api/src/Adapter/Api/CssApi.mjs").CssApi} CssApi */
/** @typedef {import("../../Service/Localization/Port/LocalizationService.mjs").LocalizationService} LocalizationService */
/** @typedef {import("./setLanguage.mjs").setLanguage} setLanguage */

const __dirname = import.meta.url.substring(0, import.meta.url.lastIndexOf("/"));

export class SelectLanguageButtonsElement extends HTMLElement {
    /**
     * @type {CssApi}
     */
    #css_api;
    /**
     * @type {LocalizationService}
     */
    #localization_service;
    /**
     * @type {setLanguage}
     */
    #set_language;
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
     * @param {setLanguage} set_language
     * @returns {SelectLanguageButtonsElement}
     */
    static new(css_api, localization_service, set_language) {
        return new this(
            css_api,
            localization_service,
            set_language
        );
    }

    /**
     * @param {CssApi} css_api
     * @param {LocalizationService} localization_service
     * @param {setLanguage} set_language
     * @private
     */
    constructor(css_api, localization_service, set_language) {
        super();

        this.#css_api = css_api;
        this.#localization_service = localization_service;
        this.#set_language = set_language;

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
        this.#title_element.innerText = await this.#localization_service.translate(
            "Language",
            LOCALIZATION_LOCALIZATION_MODULE
        );
        this.#shadow.appendChild(this.#title_element);

        const _language = await this.#localization_service.getLanguage();

        const buttons_element = document.createElement("div");
        buttons_element.classList.add("buttons");

        for (const [
            language,
            name
        ] of Object.entries((await this.#localization_service.getLanguages()).all)) {
            const button_element = document.createElement("button");
            button_element.type = "button";

            if (language === _language.language) {
                button_element.dataset.selected = true;
            }

            button_element.innerText = name;

            button_element.addEventListener("click", async () => {
                if (button_element.dataset.selected) {
                    return;
                }

                for (const _button_element of this.#shadow.querySelectorAll("button[data-selected]")) {
                    delete _button_element.dataset.selected;
                }

                button_element.dataset.selected = true;

                this.#title_element.innerText = await this.#localization_service.translate(
                    "Language",
                    LOCALIZATION_LOCALIZATION_MODULE,
                    null,
                    language
                );

                this.#set_language(
                    language
                );
            });

            buttons_element.appendChild(button_element);
        }

        this.#shadow.appendChild(buttons_element);
    }
}

export const SELECT_LANGUAGE_BUTTONS_ELEMENT_TAG_NAME = "flux-select-language-buttons";

customElements.define(SELECT_LANGUAGE_BUTTONS_ELEMENT_TAG_NAME, SelectLanguageButtonsElement);
