import { flux_css_api } from "../../../flux-css-api/src/FluxCssApi.mjs";
import { LOCALIZATION_LOCALIZATION_MODULE } from "../Localization/_LOCALIZATION_MODULE.mjs";

/** @typedef {import("../FluxLocalizationApi.mjs").FluxLocalizationApi} FluxLocalizationApi */
/** @typedef {import("./setLanguage.mjs").setLanguage} setLanguage */

const __dirname = import.meta.url.substring(0, import.meta.url.lastIndexOf("/"));

const css = await flux_css_api.import(
    `${__dirname}/SelectLanguageElement.css`
);

export class SelectLanguageElement extends HTMLElement {
    /**
     * @type {FluxLocalizationApi}
     */
    #flux_localization_api;
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
     * @param {FluxLocalizationApi} flux_localization_api
     * @param {setLanguage} set_language
     * @returns {SelectLanguageElement}
     */
    static new(flux_localization_api, set_language) {
        return new this(
            flux_localization_api,
            set_language
        );
    }

    /**
     * @param {FluxLocalizationApi} flux_localization_api
     * @param {setLanguage} set_language
     * @private
     */
    constructor(flux_localization_api, set_language) {
        super();

        this.#flux_localization_api = flux_localization_api;
        this.#set_language = set_language;

        this.#shadow = this.attachShadow({ mode: "closed" });
        flux_css_api.adopt(
            this.#shadow,
            css
        );

        this.#render();
    }

    /**
     * @returns {Promise<void>}
     */
    async #render() {
        this.#title_element = document.createElement("div");
        this.#title_element.classList.add("title");
        this.#title_element.innerText = await this.#flux_localization_api.translate(
            "Language",
            LOCALIZATION_LOCALIZATION_MODULE
        );
        this.#shadow.appendChild(this.#title_element);

        const _language = await this.#flux_localization_api.getLanguage();

        const buttons_element = document.createElement("div");
        buttons_element.classList.add("buttons");

        for (const [
            language,
            name
        ] of Object.entries((await this.#flux_localization_api.getLanguages()).all)) {
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

                this.#title_element.innerText = await this.#flux_localization_api.translate(
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
