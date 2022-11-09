import { LOCALIZATION_LOCALIZATION_MODULE } from "../Localization/_LOCALIZATION_MODULE.mjs";

/** @typedef {import("../../../../flux-css-api/src/Adapter/Api/CssApi.mjs").CssApi} CssApi */
/** @typedef {import("../../Service/Localization/Port/LocalizationService.mjs").LocalizationService} LocalizationService */
/** @typedef {import("./setLanguage.mjs").setLanguage} setLanguage */

const __dirname = import.meta.url.substring(0, import.meta.url.lastIndexOf("/"));

export class SelectLanguageElement extends HTMLElement {
    /**
     * @type {CssApi}
     */
    #css_api;
    /**
     * @type {string}
     */
    #language;
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
     * @param {CssApi} css_api
     * @param {string} language
     * @param {LocalizationService} localization_service
     * @param {setLanguage} set_language
     * @returns {SelectLanguageElement}
     */
    static new(css_api, language, localization_service, set_language) {
        return new this(
            css_api,
            language,
            localization_service,
            set_language
        );
    }

    /**
     * @param {CssApi} css_api
     * @param {string} language
     * @param {LocalizationService} localization_service
     * @param {setLanguage} set_language
     * @private
     */
    constructor(css_api, language, localization_service, set_language) {
        super();

        this.#css_api = css_api;
        this.#language = language;
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
     * @param {Event} e
     * @returns {void}
     */
    handleEvent(e) {
        switch (true) {
            case e.target === document.body:
                switch (e.type) {
                    case "keydown":
                        switch (e.code) {
                            case "Enter":
                                this.#shadow.querySelector("button[data-select]").click();
                                break;

                            case "Escape":
                                this.#shadow.querySelector("button[data-cancel]").click();
                                break;

                            default:
                                break;
                        }
                        break;

                    default:
                        break;
                }
                break;

            default:
                break;
        }
    }

    /**
     * @param {string | null} language
     * @returns {void}
     */
    #click(language = null) {
        const selector = this.#shadow.querySelector("select");

        if (selector.disabled) {
            return;
        }

        selector.disabled = true;
        this.#shadow.querySelector("button[data-cancel]").disabled = true;
        this.#shadow.querySelector("button[data-select]").disabled = true;

        removeEventListener("keydown", this);

        this.#set_language(
            language
        );
    }

    /**
     * @returns {Promise<void>}
     */
    async #render() {
        const title = document.createElement("div");
        title.classList.add("title");
        title.innerText = await this.#localization_service.translate(
            "Select language",
            LOCALIZATION_LOCALIZATION_MODULE
        );
        this.#shadow.appendChild(title);

        const selector = document.createElement("select");
        this.#shadow.appendChild(selector);

        let value = this.#language;
        if (value === "") {
            value = (await this.#localization_service.getLanguage()).language;
        }

        const languages = await this.#localization_service.getLanguages();

        for (const [
            language,
            name
        ] of Object.entries(languages.preferred)) {
            const option = document.createElement("option");
            option.text = name;
            option.value = language;
            selector.appendChild(option);
        }
        if (Object.keys(languages.other).length > 0) {
            const other = document.createElement("optgroup");
            other.label = await this.#localization_service.translate(
                "Other",
                LOCALIZATION_LOCALIZATION_MODULE
            );
            selector.appendChild(other);

            for (const [
                language,
                name
            ] of Object.entries(languages.other)) {
                const option = document.createElement("option");
                option.text = name;
                option.value = language;
                selector.appendChild(option);
            }
        }
        selector.value = value;

        const buttons = document.createElement("div");
        this.#shadow.appendChild(buttons);

        const cancel_button = document.createElement("button");
        cancel_button.dataset.cancel = true;
        cancel_button.disabled = this.#language === "";
        cancel_button.innerText = await this.#localization_service.translate(
            "Cancel",
            LOCALIZATION_LOCALIZATION_MODULE
        );
        buttons.appendChild(cancel_button);

        buttons.append(" ");

        const select_button = document.createElement("button");
        select_button.dataset.select = true;
        select_button.disabled = selector.value === "";
        select_button.innerText = await this.#localization_service.translate(
            "Select",
            LOCALIZATION_LOCALIZATION_MODULE
        );
        buttons.appendChild(select_button);

        selector.addEventListener("change", () => {
            select_button.disabled = selector.value === "";
        });
        cancel_button.addEventListener("click", () => {
            this.#click();
        });
        select_button.addEventListener("click", () => {
            this.#click(
                selector.value
            );
        });
        addEventListener("keydown", this);
    }
}

export const SELECT_LANGUAGE_ELEMENT_TAG_NAME = "flux-select-language";

customElements.define(SELECT_LANGUAGE_ELEMENT_TAG_NAME, SelectLanguageElement);
