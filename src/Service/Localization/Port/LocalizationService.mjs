/** @typedef {import("../../../Adapter/SelectLanguage/afterSelectLanguage.mjs").afterSelectLanguage} afterSelectLanguage */
/** @typedef {import("../../../../../flux-css-api/src/Adapter/Api/CssApi.mjs").CssApi} CssApi */
/** @typedef {import("../../../Adapter/SelectLanguage/ensureBeforeAndAfterSelectLanguage.mjs").ensureBeforeAndAfterSelectLanguage} ensureBeforeAndAfterSelectLanguage */
/** @typedef {import("../../../../../flux-json-api/src/Adapter/Api/JsonApi.mjs").JsonApi} JsonApi */
/** @typedef {import("../../../Adapter/Language/Language.mjs").Language} Language */
/** @typedef {import("../../../Adapter/Language/Languages.mjs").Languages} Languages */
/** @typedef {import("../../../Adapter/Language/Localization.mjs").Localization} Localization */
/** @typedef {import("../../../Adapter/Language/Module.mjs").Module} Module */
/** @typedef {import("../../../Adapter/Language/Placeholders.mjs").Placeholders} Placeholders */
/** @typedef {import("../../../Adapter/SelectLanguage/SelectLanguageButtonElement.mjs").SelectLanguageButtonElement} SelectLanguageButtonElement */
/** @typedef {import("../../../Adapter/SelectLanguage/SelectLanguageButtonsElement.mjs").SelectLanguageButtonsElement} SelectLanguageButtonsElement */
/** @typedef {import("../../../../../flux-settings-api/src/Adapter/Api/SettingsApi.mjs").SettingsApi} SettingsApi */

export class LocalizationService {
    /**
     * @type {CssApi | null}
     */
    #css_api;
    /**
     * @type {string | null}
     */
    #default_language = null;
    /**
     * @type {string | null}
     */
    #default_module = null;
    /**
     * @type {JsonApi}
     */
    #json_api;
    /**
     * @type {Map<string, Localization>}
     */
    #localizations;
    /**
     * @type {Map<string, Module>}
     */
    #modules;
    /**
     * @type {SettingsApi | null}
     */
    #settings_api;

    /**
     * @param {JsonApi} json_api
     * @param {CssApi | null} css_api
     * @param {SettingsApi | null} settings_api
     * @returns {LocalizationService}
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
        this.#localizations = new Map();
        this.#modules = new Map();
    }

    /**
     * @param {Localization} localization
     * @param {string | null} module
     * @returns {Promise<void>}
     */
    async addLocalization(localization, module = null) {
        this.#localizations.set(`${module ?? this.#default_module ?? ""}_${localization.language ?? ""}`, localization);
    }

    /**
     * @param {string} localization_folder
     * @param {string | null} module
     * @returns {Promise<void>}
     */
    async addModule(localization_folder, module = null) {
        const _module = module ?? this.#default_module ?? "";

        this.#modules.set(_module, {
            localization_folder
        });

        [
            ...this.#localizations.keys()
        ].filter(key => key.startsWith(`${_module}_`)).forEach(key => {
            this.#modules.delete(key);
        });
    }

    /**
     * @param {string} language
     * @returns {Promise<string>}
     */
    async getDirection(language) {
        return (await import("../Command/GetDirectionCommand.mjs")).GetDirectionCommand.new()
            .getDirection(
                language
            );
    }

    /**
     * @param {string | null} module
     * @param {string | null} language
     * @returns {Promise<Language>}
     */
    async getLanguage(module = null, language = null) {
        return (await import("../Command/GetLanguageCommand.mjs")).GetLanguageCommand.new(
            this
        )
            .getLanguage(
                await this.getLocalization(
                    module,
                    language
                )
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
     * @param {string | null} module
     * @returns {Promise<Languages>}
     */
    async getLanguages(module = null) {
        return (await import("../Command/GetLanguagesCommand.mjs")).GetLanguagesCommand.new(
            this
        )
            .getLanguages(
                (await this.getModule(
                    module
                )).localization_folder
            );
    }

    /**
     * @returns {Promise<string>}
     */
    async getLanguageSetting() {
        if (this.#settings_api === null) {
            throw new Error("Missing SettingsApi");
        }

        return (await import("../Command/GetLanguageSettingCommand.mjs")).GetLanguageSettingCommand.new(
            this.#settings_api
        )
            .getLanguageSetting();
    }

    /**
     * @param {string | null} module
     * @param {string | null} language
     * @returns {Promise<Localization>}
     */
    async getLocalization(module = null, language = null) {
        const _language = language ?? this.#default_language;

        const _localization = this.#localizations.get(`${module ?? this.#default_module ?? ""}_${_language ?? ""}`) ?? null;

        if (_localization !== null) {
            return _localization;
        }

        const localization = await (await import("../Command/LoadLocalizationCommand.mjs")).LoadLocalizationCommand.new(
            this
        )
            .loadLocalization(
                (await this.getModule(
                    module
                )).localization_folder,
                _language
            );

        await this.addLocalization(
            localization,
            module
        );

        return localization;
    }

    /**
     * @param {string | null} module
     * @returns {Promise<Module>}
     */
    async getModule(module = null) {
        const _module = this.#modules.get(module ?? this.#default_module ?? "") ?? null;

        if (_module === null) {
            throw new Error(`Missing module ${module ?? this.#default_module ?? ""}`);
        }

        return _module;
    }

    /**
     * @param {ensureBeforeAndAfterSelectLanguage | null} ensure_before_and_after_select_language
     * @param {afterSelectLanguage | null} after_select_language
     * @returns {Promise<SelectLanguageButtonElement>}
     */
    async getSelectLanguageButtonElement(ensure_before_and_after_select_language = null, after_select_language = null) {
        if (this.#css_api === null) {
            throw new Error("Missing CssApi");
        }

        return (await import("../Command/GetSelectLanguageButtonElementCommand.mjs")).GetSelectLanguageButtonElementCommand.new(
            this.#css_api,
            this
        )
            .getSelectLanguageButtonElement(
                ensure_before_and_after_select_language,
                after_select_language
            );
    }

    /**
     * @param {afterSelectLanguage | null} after_select_language
     * @returns {Promise<SelectLanguageButtonsElement>}
     */
    async getSelectLanguageButtonsElement(after_select_language = null) {
        if (this.#css_api === null) {
            throw new Error("Missing CssApi");
        }

        return (await import("../Command/GetSelectLanguageButtonsElementCommand.mjs")).GetSelectLanguageButtonsElementCommand.new(
            this.#css_api,
            this
        )
            .getSelectLanguageButtonsElement(
                after_select_language
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
     * @param {ensureBeforeAndAfterSelectLanguage | null} ensure_before_and_after_select_language
     * @param {boolean | null} force
     * @returns {Promise<void>}
     */
    async selectLanguage(ensure_before_and_after_select_language = null, force = null) {
        if (this.#css_api === null) {
            throw new Error("Missing CssApi");
        }

        await (await import("../Command/SelectLanguageCommand.mjs")).SelectLanguageCommand.new(
            this.#css_api,
            this
        )
            .selectLanguage(
                ensure_before_and_after_select_language,
                force
            );
    }

    /**
     * @param {string | null} default_language
     * @returns {Promise<void>}
     */
    async setDefaultLanguage(default_language = null) {
        this.#default_language = default_language;
    }

    /**
     * @param {string | null} default_module
     * @returns {Promise<void>}
     */
    async setDefaultModule(default_module = null) {
        this.#default_module = default_module;
    }

    /**
     * @param {string} language
     * @returns {Promise<void>}
     */
    async setLanguageSetting(language) {
        if (this.#settings_api === null) {
            throw new Error("Missing SettingsApi");
        }

        await (await import("../Command/SetLanguageSettingCommand.mjs")).SetLanguageSettingCommand.new(
            this.#settings_api
        )
            .setLanguageSetting(
                language
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
        return (await import("../Command/TranslateCommand.mjs")).TranslateCommand.new()
            .translate(
                text,
                await this.getLocalization(
                    module,
                    language
                ),
                placeholders,
                default_text
            );
    }
}
