import { TranslateCommand } from "../Command/TranslateCommand.mjs";

/** @typedef {import("../../../../../flux-css-api/src/Adapter/Api/CssApi.mjs").CssApi} CssApi */
/** @typedef {import("../../../Adapter/SelectLanguage/getLanguageChangeListeners.mjs").getLanguageChangeListeners} getLanguageChangeListeners */
/** @typedef {import("../../../../../flux-json-api/src/Adapter/Api/JsonApi.mjs").JsonApi} JsonApi */
/** @typedef {import("../../../Adapter/SelectLanguage/loadModule.mjs").loadModule} loadModule */
/** @typedef {import("../../../Adapter/SelectLanguage/Localization.mjs").Localization} Localization */
/** @typedef {import("../../../Adapter/SelectLanguage/selectLanguage.mjs").selectLanguage} selectLanguage */
/** @typedef {import("../../../Adapter/SelectLanguage/SelectLanguageButtonElement.mjs").SelectLanguageButtonElement} SelectLanguageButtonElement */
/** @typedef {import("../../../../../flux-settings-api/src/Adapter/Api/SettingsApi.mjs").SettingsApi} SettingsApi */

export class LocalizationService {
    /**
     * @type {CssApi}
     */
    #css_api;
    /**
     * @type {getLanguageChangeListeners}
     */
    #get_language_change_listeners;
    /**
     * @type {JsonApi}
     */
    #json_api;
    /**
     * @type {SettingsApi}
     */
    #settings_api;

    /**
     * @param {CssApi} css_api
     * @param {getLanguageChangeListeners} get_language_change_listeners
     * @param {JsonApi} json_api
     * @param {SettingsApi} settings_api
     * @returns {LocalizationService}
     */
    static new(css_api, get_language_change_listeners, json_api, settings_api) {
        return new this(
            css_api,
            get_language_change_listeners,
            json_api,
            settings_api
        );
    }

    /**
     * @param {CssApi} css_api
     * @param {getLanguageChangeListeners} get_language_change_listeners
     * @param {JsonApi} json_api
     * @param {SettingsApi} settings_api
     * @private
     */
    constructor(css_api, get_language_change_listeners, json_api, settings_api) {
        this.#css_api = css_api;
        this.#get_language_change_listeners = get_language_change_listeners;
        this.#json_api = json_api;
        this.#settings_api = settings_api;
    }

    /**
     * @param {Localization | null} localization
     * @returns {Promise<string>}
     */
    async getDirection(localization = null) {
        return (await import("../Command/GetDirectionCommand.mjs")).GetDirectionCommand.new()
            .getDirection(
                localization
            );
    }

    /**
     * @param {Localization | null} localization
     * @returns {Promise<string>}
     */
    async getLanguage(localization = null) {
        return (await import("../Command/GetLanguageCommand.mjs")).GetLanguageCommand.new()
            .getLanguage(
                localization
            );
    }

    /**
     * @param {string} language
     * @returns {Promise<string>}
     */
    async getLanguageName(language) {
        return (await import("../Command/GetLanguageNameCommand.mjs")).GetLanguageNameCommand.new()
            .getLanguageName(
                language
            );
    }

    /**
     * @param {selectLanguage} select_language
     * @param {Localization | null} localization
     * @returns {Promise<SelectLanguageButtonElement>}
     */
    async getSelectLanguageButtonElement(select_language, localization = null) {
        return (await import("../Command/GetSelectLanguageButtonElementCommand.mjs")).GetSelectLanguageButtonElementCommand.new(
            this.#css_api,
            this
        )
            .getSelectLanguageButtonElement(
                select_language,
                localization
            );
    }

    /**
     * @param {string} localization_folder
     * @returns {Promise<{preferred: {[key: string]: string}, other: {[key: string]: string}}>}
     */
    async getLanguages(localization_folder) {
        return (await import("../Command/GetLanguagesCommand.mjs")).GetLanguagesCommand.new(
            this
        )
            .getLanguages(
                localization_folder
            );
    }

    /**
     * @param {string} localization_folder
     * @returns {Promise<string[] | null>}
     */
    async importAvailableLanguagesJson(localization_folder) {
        return (await import("../Command/ImportAvailableLanguagesJsonCommand.mjs")).ImportAvailableLanguagesJsonCommand.new(
            this.#json_api
        )
            .importAvailableLanguagesJson(
                localization_folder
            );
    }

    /**
     * @param {string} localization_folder
     * @param {string} language
     * @returns {Promise<{[key: string]: string} | null>}
     */
    async importLocalizationJson(localization_folder, language) {
        return (await import("../Command/ImportLocalizationJsonCommand.mjs")).ImportLocalizationJsonCommand.new(
            this.#json_api
        )
            .importLocalizationJson(
                localization_folder,
                language
            );
    }

    /**
     * @param {string} localization_folder
     * @param {string | null} language
     * @returns {Promise<Localization | null>}
     */
    async loadLocalization(localization_folder, language = null) {
        return (await import("../Command/LoadLocalizationCommand.mjs")).LoadLocalizationCommand.new(
            this
        )
            .loadLocalization(
                localization_folder,
                language
            );
    }

    /**
     * @param {string} localization_folder
     * @param {loadModule} load_module
     * @param {boolean | null} force
     * @returns {Promise<string>}
     */
    async selectLanguage(localization_folder, load_module, force = null) {
        return (await import("../Command/SelectLanguageCommand.mjs")).SelectLanguageCommand.new(
            this.#css_api,
            this.#get_language_change_listeners,
            this,
            this.#settings_api
        )
            .selectLanguage(
                localization_folder,
                load_module,
                force
            );
    }

    /**
     * @param {string} text
     * @param {Localization | null} localization
     * @param {{[key: string]: string} | null} placeholders
     * @returns {string}
     */
    translate(text, localization = null, placeholders = null) {
        return TranslateCommand.new()
            .translate(
                text,
                localization,
                placeholders
            );
    }
}
