import { LANGUAGE_SETTINGS_KEY } from "./Settings/LANGUAGE_SETTINGS_KEY.mjs";

/** @typedef {import("./Language/afterSelectLanguage.mjs").afterSelectLanguage} afterSelectLanguage */
/** @typedef {import("./Language/AvailableLanguage.mjs").AvailableLanguage} AvailableLanguage */
/** @typedef {import("../../flux-button-group/src/FluxButtonGroupElement.mjs").FluxButtonGroupElement} FluxButtonGroupElement */
/** @typedef {import("../../flux-http-api/src/FluxHttpApi.mjs").FluxHttpApi} FluxHttpApi */
/** @typedef {import("../../flux-settings-api/src/FluxSettingsApi.mjs").FluxSettingsApi} FluxSettingsApi */
/** @typedef {import("./Language/Language.mjs").Language} Language */
/** @typedef {import("./Language/Languages.mjs").Languages} Languages */
/** @typedef {import("./Language/Localization.mjs").Localization} Localization */
/** @typedef {import("./Language/Module.mjs").Module} Module */
/** @typedef {import("./Language/Placeholders.mjs").Placeholders} Placeholders */

export class FluxLocalizationApi {
    /**
     * @type {string | null}
     */
    #default_language = null;
    /**
     * @type {string | null}
     */
    #default_module = null;
    /**
     * @type {FluxHttpApi | null}
     */
    #flux_http_api;
    /**
     * @type {FluxSettingsApi | null}
     */
    #flux_settings_api;
    /**
     * @type {Map<string, *>}
     */
    #import_jsons;
    /**
     * @type {Map<string, Localization>}
     */
    #localizations;
    /**
     * @type {Map<string, Module>}
     */
    #modules;

    /**
     * @param {FluxHttpApi | null} flux_http_api
     * @param {FluxSettingsApi | null} flux_settings_api
     * @returns {FluxLocalizationApi}
     */
    static new(flux_http_api = null, flux_settings_api = null) {
        return new this(
            flux_http_api,
            flux_settings_api
        );
    }

    /**
     * @param {FluxHttpApi | null} flux_http_api
     * @param {FluxSettingsApi | null} flux_settings_api
     * @private
     */
    constructor(flux_http_api, flux_settings_api) {
        this.#flux_http_api = flux_http_api;
        this.#flux_settings_api = flux_settings_api;
        this.#import_jsons = new Map();
        this.#localizations = new Map();
        this.#modules = new Map();
    }

    /**
     * @param {string} localization_folder
     * @param {string | null} module
     * @returns {void}
     */
    addModule(localization_folder, module = null) {
        const _module = module ?? this.#default_module ?? "";

        this.#modules.set(_module, {
            localization_folder
        });

        Array.from(this.#localizations.keys()).filter(key => key.startsWith(`${_module}_`)).forEach(key => {
            this.#localizations.delete(key);
        });
    }

    /**
     * @param {string | null} module
     * @param {string | null} language
     * @returns {Promise<Language>}
     */
    async getLanguage(module = null, language = null) {
        const _language = (await this.#getLocalization(
            module,
            language
        )).language ?? "en";

        return {
            language: _language,
            name: await this.#getLanguageName(
                _language
            ),
            direction: await this.#getDirection(
                _language
            )
        };
    }

    /**
     * @param {string | null} module
     * @returns {Promise<Languages>}
     */
    async getLanguages(module = null) {
        const {
            localization_folder
        } = await this.#getModule(
            module
        );

        const available_languages = await this.#importAvailableLanguagesJson(
            localization_folder
        );

        const preferred = {};
        const other = {};

        if (available_languages !== null) {
            if ("navigator" in globalThis) {
                for (const language of navigator.languages) {
                    const available_language = available_languages.find(_available_language => _available_language.language === language || _available_language.fallback_for_languages.includes(language)) ?? null;

                    if (available_language === null) {
                        continue;
                    }

                    preferred[available_language.language] = await this.#getLanguageName(
                        available_language.language
                    );
                }
            }

            for (const available_language of available_languages) {
                if (Object.hasOwn(preferred, available_language.language)) {
                    continue;
                }

                other[available_language.language] = await this.#getLanguageName(
                    available_language.language
                );
            }
        } else {
            if ("navigator" in globalThis) {
                for (const language of navigator.languages) {
                    if (await this.#importLocalizationJson(
                        localization_folder,
                        language
                    ) === null) {
                        continue;
                    }

                    preferred[language] = await this.#getLanguageName(
                        language
                    );
                }
            }
        }

        return {
            preferred,
            other,
            all: {
                ...preferred,
                ...other
            }
        };
    }

    /**
     * @param {afterSelectLanguage | null} after_select_language
     * @returns {Promise<FluxButtonGroupElement>}
     */
    async getSelectLanguageElement(after_select_language = null) {
        const _language = await this.getLanguage();

        const {
            FLUX_BUTTON_GROUP_INPUT_EVENT,
            FluxButtonGroupElement
        } = await import("../../flux-button-group/src/FluxButtonGroupElement.mjs");

        const flux_button_group_element = FluxButtonGroupElement.new(
            Object.entries((await this.getLanguages()).all).map(([
                language,
                name
            ]) => ({
                label: name,
                selected: language === _language.language,
                title: name,
                value: language
            }))
        );

        flux_button_group_element.addEventListener(FLUX_BUTTON_GROUP_INPUT_EVENT, async e => {
            await this.#setLanguageSetting(
                e.detail.value
            );

            this.setDefaultLanguage(
                e.detail.value
            );

            if (after_select_language !== null) {
                after_select_language();
            }
        });

        return flux_button_group_element;
    }

    /**
     * @returns {Promise<void>}
     */
    async selectDefaultLanguage() {
        let language = await this.#getLanguageSetting();

        if (language === "") {
            ({
                language
            } = await this.getLanguage());
            await this.#setLanguageSetting(
                language
            );
        }

        this.setDefaultLanguage(
            language
        );
    }

    /**
     * @param {string | null} default_language
     * @returns {void}
     */
    setDefaultLanguage(default_language = null) {
        this.#default_language = default_language;
    }

    /**
     * @param {string | null} default_module
     * @returns {void}
     */
    setDefaultModule(default_module = null) {
        this.#default_module = default_module;
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
        let _text = (await this.#getLocalization(
            module,
            language
        )).localization?.[text] ?? "";

        if (_text === "") {
            _text = default_text ?? text;
        }

        return _text.replaceAll(/{([\w-]+)}/g, (match, placeholder) => placeholders?.[placeholder] ?? match);
    }

    /**
     * @param {Localization} localization
     * @param {string | null} module
     * @param {string | null} language
     * @returns {Promise<void>}
     */
    async #addLocalization(localization, module = null, language = null) {
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
     * @param {string} language
     * @returns {Promise<string>}
     */
    async #getDirection(language) {
        return new Intl.Locale(language)?.textInfo?.direction ?? "ltr";
    }

    /**
     * @param {string} language
     * @returns {Promise<string>}
     */
    async #getLanguageName(language) {
        return new Intl.DisplayNames(language, {
            languageDisplay: "standard",
            type: "language"
        }).of(language);
    }

    /**
     * @returns {Promise<string>}
     */
    async #getLanguageSetting() {
        if (this.#flux_settings_api === null) {
            throw new Error("Missing FluxSettingsApi");
        }

        return this.#flux_settings_api.get(
            LANGUAGE_SETTINGS_KEY,
            ""
        );
    }

    /**
     * @param {string | null} module
     * @param {string | null} language
     * @returns {Promise<Localization>}
     */
    async #getLocalization(module = null, language = null) {
        const _language = language ?? this.#default_language;

        const _localization = this.#localizations.get(`${module ?? this.#default_module ?? ""}_${_language ?? ""}`) ?? null;

        if (_localization !== null) {
            return _localization;
        }

        const {
            localization_folder
        } = await this.#getModule(
            module
        );

        const available_languages = await this.#importAvailableLanguagesJson(
            localization_folder
        );

        let localization = {
            language: null,
            localization: null
        };

        for (const __language of _language !== null ? [
            _language
        ] : "navigator" in globalThis ? navigator.languages : []) {
            let ___language;
            if (available_languages !== null) {
                const available_language = available_languages.find(_available_language => _available_language.language === __language || _available_language.fallback_for_languages.includes(__language)) ?? null;

                if (available_language === null) {
                    continue;
                }

                ___language = available_language.language;
            } else {
                ___language = __language;
            }

            const __localization = await this.#importLocalizationJson(
                localization_folder,
                ___language
            );

            if (__localization === null) {
                if (available_languages !== null) {
                    break;
                } else {
                    continue;
                }
            }

            localization = {
                language: ___language,
                localization: __localization
            };
            break;
        }

        await this.#addLocalization(
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
    async #getModule(module = null) {
        const _module = this.#modules.get(module ?? this.#default_module ?? "") ?? null;

        if (_module === null) {
            throw new Error(`Missing module ${module ?? this.#default_module ?? ""}`);
        }

        return _module;
    }

    /**
     * @param {string} localization_folder
     * @returns {Promise<AvailableLanguage[] | null>}
     */
    async #importAvailableLanguagesJson(localization_folder) {
        const available_languages_json_file = `${localization_folder}/_available_languages.json`;

        try {
            return await this.#importJson(
                available_languages_json_file
            );
        } catch (error) {
            console.error(`Load available languages for ${localization_folder} failed (`, error, ")");

            return null;
        }
    }

    /**
     * @param {string} json_file
     * @returns {Promise<*>}
     */
    async #importJson(json_file) {
        let json = null;

        if (this.#import_jsons.has(json_file)) {
            json = structuredClone(this.#import_jsons.get(json_file) ?? null);
        } else {
            try {
                if (typeof process !== "undefined") {
                    json = JSON.parse(await (await import("node:fs/promises")).readFile(json_file, "utf8"));
                } else {
                    if (this.#flux_http_api === null) {
                        throw new Error("Missing FluxHttpApi");
                    }

                    json = await (await this.#flux_http_api.request(
                        (await import("../../flux-http-api/src/Client/HttpClientRequest.mjs")).HttpClientRequest.new(
                            new URL(json_file),
                            null,
                            null,
                            null,
                            true
                        ))).body.json();
                }
            } finally {
                this.#import_jsons.set(json_file, json);
            }
        }

        return json;
    }

    /**
     * @param {string} localization_folder
     * @param {string} language
     * @returns {Promise<{[key: string]: string} | null>}
     */
    async #importLocalizationJson(localization_folder, language) {
        const language_json_file = `${localization_folder}/${language}.json`;

        try {
            return await this.#importJson(
                language_json_file
            );
        } catch (error) {
            console.error(`Load language ${language} for ${localization_folder} failed (`, error, ")");

            return null;
        }
    }

    /**
     * @param {string} language
     * @returns {Promise<void>}
     */
    async #setLanguageSetting(language) {
        if (this.#flux_settings_api === null) {
            throw new Error("Missing FluxSettingsApi");
        }

        await this.#flux_settings_api.store(
            LANGUAGE_SETTINGS_KEY,
            language
        );
    }
}
