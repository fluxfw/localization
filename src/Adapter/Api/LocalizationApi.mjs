import { LOCALIZATION_LOCALIZATION_MODULE } from "../Localization/_LOCALIZATION_MODULE.mjs";

/** @typedef {import("../SelectLanguage/afterSelectLanguage.mjs").afterSelectLanguage} afterSelectLanguage */
/** @typedef {import("../../../../flux-css-api/src/Adapter/Api/CssApi.mjs").CssApi} CssApi */
/** @typedef {import("../SelectLanguage/ensureBeforeAndAfterSelectLanguage.mjs").ensureBeforeAndAfterSelectLanguage} ensureBeforeAndAfterSelectLanguage */
/** @typedef {import("../../../../flux-json-api/src/Adapter/Api/JsonApi.mjs").JsonApi} JsonApi */
/** @typedef {import("../Language/Language.mjs").Language} Language */
/** @typedef {import("../Language/Languages.mjs").Languages} Languages */
/** @typedef {import("../../Service/Localization/Port/LocalizationService.mjs").LocalizationService} LocalizationService */
/** @typedef {import("../Language/Placeholders.mjs").Placeholders} Placeholders */
/** @typedef {import("../SelectLanguage/SelectLanguageButtonElement.mjs").SelectLanguageButtonElement} SelectLanguageButtonElement */
/** @typedef {import("../../../../flux-settings-api/src/Adapter/Api/SettingsApi.mjs").SettingsApi} SettingsApi */

const __dirname = import.meta.url.substring(0, import.meta.url.lastIndexOf("/"));

export class LocalizationApi {
    /**
     * @type {CssApi | null}
     */
    #css_api;
    /**
     * @type {JsonApi}
     */
    #json_api;
    /**
     * @type {LocalizationService | null}
     */
    #localization_service = null;
    /**
     * @type {SettingsApi | null}
     */
    #settings_api;

    /**
     * @param {JsonApi} json_api
     * @param {CssApi | null} css_api
     * @param {SettingsApi | null} settings_api
     * @returns {LocalizationApi}
     */
    static new(json_api, css_api = null, settings_api = null) {
        return new this(
            json_api,
            css_api,
            settings_api
        );
    }

    /**
     * @param {JsonApi} json_api
     * @param {CssApi | null} css_api
     * @param {SettingsApi | null} settings_api
     * @private
     */
    constructor(json_api, css_api, settings_api) {
        this.#json_api = json_api;
        this.#css_api = css_api;
        this.#settings_api = settings_api;
    }

    /**
     * @returns {Promise<void>}
     */
    async init() {
        await this.addModule(
            `${__dirname}/../Localization`,
            LOCALIZATION_LOCALIZATION_MODULE
        );

        if (this.#css_api !== null) {
            this.#css_api.importCssToRoot(
                document,
                `${__dirname}/../SelectLanguage/SelectLanguageVariables.css`
            );
            this.#css_api.importCssToRoot(
                document,
                `${__dirname}/../SelectLanguage/SelectLanguageButtonVariables.css`
            );
        }
    }

    /**
     * @param {string} localization_folder
     * @param {string | null} module
     * @returns {Promise<void>}
     */
    async addModule(localization_folder, module = null) {
        await (await this.#getLocalizationService()).addModule(
            localization_folder,
            module
        );
    }

    /**
     * @param {string | null} module
     * @param {string | null} language
     * @returns {Promise<Language>}
     */
    async getLanguage(module = null, language = null) {
        return (await this.#getLocalizationService()).getLanguage(
            module,
            language
        );
    }

    /**
     * @param {string | null} module
     * @returns {Promise<Languages>}
     */
    async getLanguages(module = null) {
        return (await this.#getLocalizationService()).getLanguages(
            module
        );
    }

    /**
     * @param {ensureBeforeAndAfterSelectLanguage | null} ensure_before_and_after_select_language
     * @param {afterSelectLanguage | null} after_select_language
     * @returns {Promise<SelectLanguageButtonElement>}
     */
    async getSelectLanguageButtonElement(ensure_before_and_after_select_language = null, after_select_language = null) {
        return (await this.#getLocalizationService()).getSelectLanguageButtonElement(
            ensure_before_and_after_select_language,
            after_select_language
        );
    }

    /**
     * @param {ensureBeforeAndAfterSelectLanguage | null} ensure_before_and_after_select_language
     * @param {boolean | null} force
     * @returns {Promise<void>}
     */
    async selectLanguage(ensure_before_and_after_select_language = null, force = null) {
        await (await this.#getLocalizationService()).selectLanguage(
            ensure_before_and_after_select_language,
            force
        );
    }

    /**
     * @param {string | null} default_language
     * @returns {Promise<void>}
     */
    async setDefaultLanguage(default_language = null) {
        await (await this.#getLocalizationService()).setDefaultLanguage(
            default_language
        );
    }

    /**
     * @param {string | null} default_module
     * @returns {Promise<void>}
     */
    async setDefaultModule(default_module = null) {
        await (await this.#getLocalizationService()).setDefaultModule(
            default_module
        );
    }

    /**
     * @param {string} text
     * @param {string | null} module
     * @param {Placeholders | null} placeholders
     * @param {string | null} language
     * @param {string | null} default_text
     * @returns {Promise<string>}
     */
    async translate(text, module = null, placeholders = null, language = null, default_text = null) {
        return (await this.#getLocalizationService()).translate(
            text,
            module,
            placeholders,
            language,
            default_text
        );
    }

    /**
     * @returns {Promise<LocalizationService>}
     */
    async #getLocalizationService() {
        this.#localization_service ??= (await import("../../Service/Localization/Port/LocalizationService.mjs")).LocalizationService.new(
            this.#json_api,
            this.#css_api,
            this.#settings_api
        );

        return this.#localization_service;
    }
}
