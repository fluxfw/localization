import { LOCALIZATION_LOCALIZATION_MODULE } from "../Localization/_LOCALIZATION_MODULE.mjs";

/** @typedef {import("../../../../flux-css-api/src/Adapter/Api/CssApi.mjs").CssApi} CssApi */
/** @typedef {import("../../../../flux-json-api/src/Adapter/Api/JsonApi.mjs").JsonApi} JsonApi */
/** @typedef {import("../SelectLanguage/languageChangeListener.mjs").languageChangeListener} languageChangeListener */
/** @typedef {import("../../Service/Localization/Port/LocalizationService.mjs").LocalizationService} LocalizationService */
/** @typedef {import("../SelectLanguage/Localization.mjs").Localization} Localization */
/** @typedef {import("../SelectLanguage/Module.mjs").Module} Module */
/** @typedef {import("../SelectLanguage/selectLanguage.mjs").selectLanguage} selectLanguage */
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
     * @type {string | null}
     */
    #language = null;
    /**
     * @type {languageChangeListener[]}
     */
    #language_change_listeners;
    /**
     * @type {LocalizationService | null}
     */
    #localization_service = null;
    /**
     * @type {Map<string, Localization | null> | null}
     */
    #localizations = null;
    /**
     * @type {Map<string, Module> | null}
     */
    #modules = null;
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
        this.#language_change_listeners = [];
    }

    /**
     * @returns {Promise<void>}
     */
    async init() {
        this.#modules ??= new Map();
        this.#localizations ??= new Map();

        await this.#getLocalizationService();

        this.addModule(
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
     * @returns {void}
     */
    addModule(localization_folder, module = null) {
        this.#modules.set(module ?? "", {
            localization_folder
        });
    }

    /**
     * @param {string | null} module
     * @returns {Promise<string>}
     */
    async getDirection(module = null) {
        return (await this.#getLocalizationService()).getDirection(
            this.#getLocalization(
                module
            )
        );
    }

    /**
     * @param {string | null} module
     * @returns {Promise<string>}
     */
    async getLanguage(module = null) {
        return (await this.#getLocalizationService()).getLanguage(
            this.#getLocalization(
                module
            )
        );
    }

    /**
     * @param {string} localization_folder
     * @param {string | null} module
     * @param {() => Promise<void> | null} ensure
     * @param {selectLanguage | null} after_select
     * @returns {Promise<SelectLanguageButtonElement>}
     */
    async getSelectLanguageButtonElement(localization_folder, module = null, ensure = null, after_select = null) {
        return (await this.#getLocalizationService()).getSelectLanguageButtonElement(
            async () => {
                await this.selectLanguage(
                    localization_folder,
                    module,
                    ensure,
                    true
                );

                if (after_select !== null) {
                    after_select();
                }
            },
            this.#getLocalization(
                LOCALIZATION_LOCALIZATION_MODULE
            )
        );
    }

    /**
     * @param {string} localization_folder
     * @param {string | null} module
     * @param {() => Promise<void> | null} ensure
     * @param {boolean | null} force
     * @returns {Promise<void>}
     */
    async selectLanguage(localization_folder, module = null, ensure = null, force = null) {
        this.addModule(
            localization_folder,
            module
        );

        await this.#setLanguage(
            await (await this.#getLocalizationService()).selectLanguage(
                localization_folder,
                async () => {
                    await this.#loadModule(
                        module
                    );

                    if (ensure !== null) {
                        await ensure();
                    }

                    await this.#loadModule(
                        LOCALIZATION_LOCALIZATION_MODULE
                    );

                    return {
                        localization: this.#getLocalization(
                            LOCALIZATION_LOCALIZATION_MODULE
                        ),
                        language: await this.getLanguage(
                            module
                        )
                    };
                },
                force
            )
        );

        if (ensure !== null) {
            await ensure();
        }
    }

    /**
     * @param {string} text
     * @param {string | null} module
     * @param {{[key: string]: string} | null} placeholders
     * @returns {string}
     */
    translate(text, module = null, placeholders = null) {
        return this.#localization_service.translate(
            text,
            this.#getLocalization(
                module
            ),
            placeholders
        );
    }

    /**
     * @param {languageChangeListener} language_change_listener
     * @returns {Promise<void>}
     */
    async addLanguageChangeListener(language_change_listener) {
        this.#language_change_listeners.push(language_change_listener);

        if (this.#language !== null) {
            language_change_listener(
                await this.getLanguage()
            );
        }
    }

    /**
     * @param {Localization | null} localization
     * @param {string | null} module
     * @returns {void}
     */
    #addLocalization(localization, module = null) {
        this.#localizations.set(module ?? "", localization);
    }

    /**
     * @param {string | null} module
     * @returns {Localization | null}
     */
    #getLocalization(module = null) {
        return this.#localizations.get(module ?? "") ?? null;
    }

    /**
     * @returns {Promise<LocalizationService>}
     */
    async #getLocalizationService() {
        this.#localization_service ??= (await import("../../Service/Localization/Port/LocalizationService.mjs")).LocalizationService.new(
            this.#json_api,
            this.#css_api,
            () => this.#language_change_listeners,
            this.#settings_api
        );

        return this.#localization_service;
    }

    /**
     * @param {string | null} module
     * @returns {Module | null}
     */
    #getModule(module = null) {
        return this.#modules.get(module ?? "") ?? null;
    }

    /**
     * @param {string} localization_folder
     * @param {string | null} module
     * @returns {Promise<void>}
     */
    async #loadLocalization(localization_folder, module = null) {
        this.#addLocalization(
            await (await this.#getLocalizationService()).loadLocalization(
                localization_folder,
                this.#language
            ),
            module
        );
    }

    /**
     * @param {string | null} module
     * @returns {Promise<void>}
     */
    async #loadModule(module = null) {
        const _module = this.#getModule(
            module
        );

        if (_module === null) {
            throw new Error(`Missing module ${module}`);
        }

        await this.#loadLocalization(
            _module.localization_folder,
            module
        );
    }

    /**
     * @returns {Promise<void>}
     */
    async #loadModules() {
        for (const module of this.#modules.keys()) {
            await this.#loadModule(
                module
            );
        }
    }

    /**
     * @param {string | null} language
     * @returns {Promise<void>}
     */
    async #setLanguage(language = null) {
        this.#language = language;

        await this.#loadModules();
    }
}