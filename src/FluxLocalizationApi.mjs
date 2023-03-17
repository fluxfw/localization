import { LOCALIZATION_LOCALIZATION_MODULE } from "./Localization/_LOCALIZATION_MODULE.mjs";

/** @typedef {import("./SelectLanguage/afterSelectLanguage.mjs").afterSelectLanguage} afterSelectLanguage */
/** @typedef {import("../../flux-css-api/src/FluxCssApi.mjs").FluxCssApi} FluxCssApi */
/** @typedef {import("../../flux-http-api/src/FluxHttpApi.mjs").FluxHttpApi} FluxHttpApi */
/** @typedef {import("../../flux-settings-api/src/FluxSettingsApi.mjs").FluxSettingsApi} FluxSettingsApi */
/** @typedef {import("./Language/Language.mjs").Language} Language */
/** @typedef {import("./Language/Languages.mjs").Languages} Languages */
/** @typedef {import("./Localization/Port/LocalizationService.mjs").LocalizationService} LocalizationService */
/** @typedef {import("./Language/Placeholders.mjs").Placeholders} Placeholders */
/** @typedef {import("./SelectLanguage/SelectLanguageElement.mjs").SelectLanguageElement} SelectLanguageElement */

const __dirname = import.meta.url.substring(0, import.meta.url.lastIndexOf("/"));

export class FluxLocalizationApi {
    /**
     * @type {FluxCssApi | null}
     */
    #flux_css_api;
    /**
     * @type {FluxHttpApi | null}
     */
    #flux_http_api;
    /**
     * @type {FluxSettingsApi | null}
     */
    #flux_settings_api;
    /**
     * @type {LocalizationService | null}
     */
    #localization_service = null;

    /**
     * @param {FluxCssApi | null} flux_css_api
     * @param {FluxHttpApi | null} flux_http_api
     * @param {FluxSettingsApi | null} flux_settings_api
     * @returns {FluxLocalizationApi}
     */
    static new(flux_css_api = null, flux_http_api = null, flux_settings_api = null) {
        return new this(
            flux_css_api,
            flux_http_api,
            flux_settings_api
        );
    }

    /**
     * @param {FluxCssApi | null} flux_css_api
     * @param {FluxHttpApi | null} flux_http_api
     * @param {FluxSettingsApi | null} flux_settings_api
     * @private
     */
    constructor(flux_css_api, flux_http_api, flux_settings_api) {
        this.#flux_css_api = flux_css_api;
        this.#flux_http_api = flux_http_api;
        this.#flux_settings_api = flux_settings_api;
    }

    /**
     * @returns {Promise<void>}
     */
    async init() {
        await this.addModule(
            `${__dirname}/Localization`,
            LOCALIZATION_LOCALIZATION_MODULE
        );

        if (this.#flux_css_api !== null) {
            this.#flux_css_api.importCssToRoot(
                document,
                `${__dirname}/SelectLanguage/SelectLanguageVariables.css`
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
     * @param {afterSelectLanguage | null} after_select_language
     * @returns {Promise<SelectLanguageElement>}
     */
    async getSelectLanguageElement(after_select_language = null) {
        return (await this.#getLocalizationService()).getSelectLanguageElement(
            after_select_language
        );
    }

    /**
     * @returns {Promise<void>}
     */
    async selectDefaultLanguage() {
        await (await this.#getLocalizationService()).selectDefaultLanguage();
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
        this.#localization_service ??= (await import("./Localization/Port/LocalizationService.mjs")).LocalizationService.new(
            this.#flux_css_api,
            this.#flux_http_api,
            this.#flux_settings_api
        );

        return this.#localization_service;
    }
}
