/** @typedef {import("../../../../flux-css-api/src/Adapter/Api/CssApi.mjs").CssApi} CssApi */
/** @typedef {import("./Localization.mjs").Localization} Localization */
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
    #fallback_language;
    /**
     * @type {string}
     */
    #language;
    /**
     * @type {{preferred: {[key: string]: string}, other: {[key: string]: string}}}
     */
    #languages;
    /**
     * @type {Localization | null}
     */
    #localization;
    /**
     * @type {LocalizationService}
     */
    #localization_service;
    /**
     * @type {setLanguage}
     */
    #select;
    /**
     * @type {ShadowRoot}
     */
    #shadow;

    /**
     * @param {CssApi} css_api
     * @param {string} fallback_language
     * @param {string} language
     * @param {{preferred: {[key: string]: string}, other: {[key: string]: string}}} languages
     * @param {LocalizationService} localization_service
     * @param {setLanguage} select
     * @param {Localization | null} localization
     * @returns {SelectLanguageElement}
     */
    static new(css_api, fallback_language, language, languages, localization_service, select, localization = null) {
        return new this(
            css_api,
            fallback_language,
            language,
            languages,
            localization_service,
            select,
            localization
        );
    }

    /**
     * @param {CssApi} css_api
     * @param {string} fallback_language
     * @param {string} language
     * @param {{preferred: {[key: string]: string}, other: {[key: string]: string}}} languages
     * @param {LocalizationService} localization_service
     * @param {setLanguage} select
     * @param {Localization | null} localization
     * @private
     */
    constructor(css_api, fallback_language, language, languages, localization_service, select, localization) {
        super();

        this.#css_api = css_api;
        this.#fallback_language = fallback_language;
        this.#language = language;
        this.#languages = languages;
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
     * @param {Event} e
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

        this.#select(
            language
        );
    }

    /**
     * @returns {void}
     */
    #render() {
        const title = document.createElement("div");
        title.classList.add("title");
        title.innerText = this.#localization_service.translate(
            "Select language",
            this.#localization
        );
        this.#shadow.appendChild(title);

        const selector = document.createElement("select");
        this.#shadow.appendChild(selector);

        let value = this.#language;
        if (value === "") {
            value = this.#fallback_language;
        }

        for (const [
            language,
            name
        ] of Object.entries(this.#languages.preferred)) {
            const option = document.createElement("option");
            option.text = name;
            option.value = language;
            selector.appendChild(option);
        }
        if (Object.keys(this.#languages.other).length > 0) {
            const other = document.createElement("optgroup");
            other.label = this.#localization_service.translate(
                "Other",
                this.#localization
            );
            selector.appendChild(other);

            for (const [
                language,
                name
            ] of Object.entries(this.#languages.other)) {
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
        cancel_button.innerText = this.#localization_service.translate(
            "Cancel",
            this.#localization
        );
        buttons.appendChild(cancel_button);

        buttons.append(" ");

        const select_button = document.createElement("button");
        select_button.dataset.select = true;
        select_button.disabled = selector.value === "";
        select_button.innerText = this.#localization_service.translate(
            "Select",
            this.#localization
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
