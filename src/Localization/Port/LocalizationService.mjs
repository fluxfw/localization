/** @typedef {import("../../SelectLanguage/afterSelectLanguage.mjs").afterSelectLanguage} afterSelectLanguage */
/** @typedef {import("../../Language/AvailableLanguage.mjs").AvailableLanguage} AvailableLanguage */
/** @typedef {import("../../../../flux-css-api/src/FluxCssApi.mjs").FluxCssApi} FluxCssApi */
/** @typedef {import("../../../../flux-http-api/src/FluxHttpApi.mjs").FluxHttpApi} FluxHttpApi */
/** @typedef {import("../../../../flux-settings-api/src/FluxSettingsApi.mjs").FluxSettingsApi} FluxSettingsApi */
/** @typedef {import("../../Language/Language.mjs").Language} Language */
/** @typedef {import("../../Language/Languages.mjs").Languages} Languages */
/** @typedef {import("../../Language/Localization.mjs").Localization} Localization */
/** @typedef {import("../../Language/Module.mjs").Module} Module */
/** @typedef {import("../../Language/Placeholders.mjs").Placeholders} Placeholders */
/** @typedef {import("../../SelectLanguage/SelectLanguageElement.mjs").SelectLanguageElement} SelectLanguageElement */

export class LocalizationService {
    /**
     * @type {string | null}
     */
    #default_language = null;
    /**
     * @type {string | null}
     */
    #default_module = null;
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
     * @type {Map<string, Localization>}
     */
    #localizations;
    /**
     * @type {Map<string, Module>}
     */
    #modules;

    /**
     * @param {FluxCssApi | null} flux_css_api
     * @param {FluxHttpApi | null} flux_http_api
     * @param {FluxSettingsApi | null} flux_settings_api
     * @returns {LocalizationService}
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
        this.#localizations = new Map();
        this.#modules = new Map();
    }

    /**
     * @param {Localization} localization
     * @param {string | null} module
     * @param {string | null} language
     * @returns {Promise<void>}
     */
    async addLocalization(localization, module = null, language = null) {
        const _module = module ?? this.#default_module ?? "";

        const _language = language ?? this.#default_language ?? "";
        if (_language !== "") {
            this.#localizations.set(`${_module}_${_language}`, localization);
        }

        const __language = localization.language ?? "";
        if (__language !== "") {
            this.#localizations.set(`${_module}_${__language}`, localization);
        }
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

        Array.from(this.#localizations.keys()).filter(key => key.startsWith(`${_module}_`)).forEach(key => {
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
        if (this.#flux_settings_api === null) {
            throw new Error("Missing FluxSettingsApi");
        }

        return (await import("../Command/GetLanguageSettingCommand.mjs")).GetLanguageSettingCommand.new(
            this.#flux_settings_api
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
            module,
            language
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
     * @param {afterSelectLanguage | null} after_select_language
     * @returns {Promise<SelectLanguageElement>}
     */
    async getSelectLanguageElement(after_select_language = null) {
        if (this.#flux_css_api === null) {
            throw new Error("Missing FluxCssApi");
        }

        return (await import("../Command/GetSelectLanguageElementCommand.mjs")).GetSelectLanguageElementCommand.new(
            this.#flux_css_api,
            this
        )
            .getSelectLanguageElement(
                after_select_language
            );
    }

    /**
     * @param {string} localization_folder
     * @returns {Promise<AvailableLanguage[] | null>}
     */
    async importAvailableLanguagesJson(localization_folder) {
        return (await import("../Command/ImportAvailableLanguagesJsonCommand.mjs")).ImportAvailableLanguagesJsonCommand.new(
            this.#flux_http_api
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
            this.#flux_http_api
        )
            .importLocalizationJson(
                localization_folder,
                language
            );
    }

    /**
     * @returns {Promise<void>}
     */
    async selectDefaultLanguage() {
        await (await import("../Command/SelectDefaultLanguageCommand.mjs")).SelectDefaultLanguageCommand.new(
            this
        )
            .selectDefaultLanguage();
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
        if (this.#flux_settings_api === null) {
            throw new Error("Missing FluxSettingsApi");
        }

        await (await import("../Command/SetLanguageSettingCommand.mjs")).SetLanguageSettingCommand.new(
            this.#flux_settings_api
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
