import { LOCALIZATION_LOCALIZATION_MODULE } from "../Localization/_LOCALIZATION_MODULE.mjs";

/** @typedef {import("../../../flux-css-api/src/FluxCssApi.mjs").FluxCssApi} FluxCssApi */
/** @typedef {import("../Localization/Port/LocalizationService.mjs").LocalizationService} LocalizationService */
/** @typedef {import("./setLanguage.mjs").setLanguage} setLanguage */

const __dirname = import.meta.url.substring(0, import.meta.url.lastIndexOf("/"));

export class SelectLanguageElement extends HTMLElement {
    /**
     * @type {FluxCssApi}
     */
    #flux_css_api;
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
     * @param {FluxCssApi} flux_css_api
     * @param {LocalizationService} localization_service
     * @param {setLanguage} set_language
     * @returns {SelectLanguageElement}
     */
    static new(flux_css_api, localization_service, set_language) {
        return new this(
            flux_css_api,
            localization_service,
            set_language
        );
    }

    /**
     * @param {FluxCssApi} flux_css_api
     * @param {LocalizationService} localization_service
     * @param {setLanguage} set_language
     * @private
     */
    constructor(flux_css_api, localization_service, set_language) {
        super();

        this.#flux_css_api = flux_css_api;
        this.#localization_service = localization_service;
        this.#set_language = set_language;

        this.#shadow = this.attachShadow({ mode: "closed" });
        this.#flux_css_api.importCssToRoot(
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
            button_element.title = name;

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

export const SELECT_LANGUAGE_ELEMENT_TAG_NAME = "flux-select-language";

customElements.define(SELECT_LANGUAGE_ELEMENT_TAG_NAME, SelectLanguageElement);
