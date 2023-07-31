import { LOCALIZATION_KEY_SYSTEM_BASED } from "./Localization/LOCALIZATION_KEY.mjs";
import { LOCALIZATION_MODULE } from "./Localization/LOCALIZATION_MODULE.mjs";
import { LOCALIZATIONS } from "./Localization/LOCALIZATIONS.mjs";
import { SETTINGS_STORAGE_KEY_LANGUAGE } from "./SettingsStorage/SETTINGS_STORAGE_KEY.mjs";

/** @typedef {import("../../flux-button-group/src/FluxButtonGroupElement.mjs").FluxButtonGroupElement} FluxButtonGroupElement */
/** @typedef {import("./Localization/Language.mjs").Language} Language */
/** @typedef {import("./Localization/Languages.mjs").Languages} Languages */
/** @typedef {import("./Localization/Localization.mjs").Localization} Localization */
/** @typedef {import("./SettingsStorage/SettingsStorage.mjs").SettingsStorage} SettingsStorage */
/** @typedef {import("./StyleSheetManager/StyleSheetManager.mjs").StyleSheetManager} StyleSheetManager */

export const LANGUAGE_SYSTEM = "system";

export class FluxLocalizationApi {
    /**
     * @type {string}
     */
    #language;
    /**
     * @type {Map<string, Localization[]>}
     */
    #localizations;
    /**
     * @type {SettingsStorage | null}
     */
    #settings_storage;
    /**
     * @type {boolean}
     */
    #show_system_language;
    /**
     * @type {StyleSheetManager | null}
     */
    #style_sheet_manager;
    /**
     * @type {boolean}
     */
    #system_language;
    /**
     * @type {Map<string, [Localization, {[key: string]: string}]>}
     */
    #texts;

    /**
     * @param {boolean | null} show_system_language
     * @param {SettingsStorage | null} settings_storage
     * @param {StyleSheetManager | null} style_sheet_manager
     * @returns {Promise<FluxLocalizationApi>}
     */
    static async new(show_system_language = null, settings_storage = null, style_sheet_manager = null) {
        const flux_localization_api = new this(
            show_system_language ?? false,
            settings_storage,
            style_sheet_manager
        );

        await flux_localization_api.addModule(
            LOCALIZATION_MODULE,
            LOCALIZATIONS
        );

        flux_localization_api.#language = await flux_localization_api.#getLanguageSetting();

        flux_localization_api.#system_language = flux_localization_api.#language === LANGUAGE_SYSTEM;

        return flux_localization_api;
    }

    /**
     * @param {boolean} show_system_language
     * @param {SettingsStorage | null} settings_storage
     * @param {StyleSheetManager | null} style_sheet_manager
     * @private
     */
    constructor(show_system_language, settings_storage, style_sheet_manager) {
        this.#show_system_language = show_system_language;
        this.#settings_storage = settings_storage;
        this.#style_sheet_manager = style_sheet_manager;
        this.#localizations = new Map();
        this.#texts = new Map();
    }

    /**
     * @param {string} module
     * @param {Localization[]} localizations
     * @returns {Promise<void>}
     */
    async addModule(module, localizations) {
        if (this.#localizations.get(module) === localizations) {
            return;
        }

        this.#localizations.set(module, localizations);

        Array.from(this.#texts.keys()).filter(key => key.startsWith(`${module}_`)).forEach(key => {
            this.#texts.delete(key);
        });
    }

    /**
     * @param {string} module
     * @param {string | null} language
     * @returns {Promise<Language>}
     */
    async getLanguage(module, language = null) {
        const [
            localization
        ] = await this.#getTexts(
            module,
            language
        );

        return {
            direction: localization.direction ?? "ltr",
            label: localization.label,
            language: localization.language,
            system: this.#system_language
        };
    }

    /**
     * @param {string} module
     * @returns {Promise<Languages>}
     */
    async getLanguages(module) {
        const localizations = await this.#getLocalizations(
            module
        );

        const preferred = {};
        const other = {};

        if ("navigator" in globalThis) {
            for (const language of navigator.languages) {
                const localization = localizations.find(_localization => _localization.language === language || (_localization["fallback-languages"] ?? []).includes(language)) ?? null;

                if (localization === null) {
                    continue;
                }

                preferred[localization.language] = localization.label;
            }
        }

        for (const localization of localizations) {
            if (Object.hasOwn(preferred, localization.language)) {
                continue;
            }

            other[localization.language] = localization.label;
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
     * @param {string} module
     * @param {(() => Promise<void>) | null} after_select_language
     * @returns {Promise<FluxButtonGroupElement>}
     */
    async getSelectLanguageElement(module, after_select_language = null) {
        const language = await this.getLanguage(
            module
        );

        const {
            FLUX_BUTTON_GROUP_ELEMENT_EVENT_INPUT,
            FluxButtonGroupElement
        } = await import("../../flux-button-group/src/FluxButtonGroupElement.mjs");

        const flux_button_group_element = await FluxButtonGroupElement.new(
            [
                ...this.#show_system_language ? [
                    {
                        label: await this.translate(
                            LOCALIZATION_MODULE,
                            LOCALIZATION_KEY_SYSTEM_BASED
                        ),
                        selected: language.system,
                        title: await this.translate(
                            LOCALIZATION_MODULE,
                            LOCALIZATION_KEY_SYSTEM_BASED
                        ),
                        value: LANGUAGE_SYSTEM
                    }
                ] : [],
                ...Object.entries((await this.getLanguages(
                    module
                )).all).map(([
                    _language,
                    label
                ]) => ({
                    label,
                    selected: (this.#show_system_language ? !language.system : true) && _language === language.language,
                    title: label,
                    value: _language
                }))
            ],
            this.#style_sheet_manager
        );

        flux_button_group_element.addEventListener(FLUX_BUTTON_GROUP_ELEMENT_EVENT_INPUT, async e => {
            await this.setLanguage(
                e.detail.value
            );

            if (after_select_language !== null) {
                await after_select_language();
            }
        });

        return flux_button_group_element;
    }

    /**
     * @param {string} language
     * @returns {Promise<void>}
     */
    async setLanguage(language) {
        this.#language = language;

        this.#system_language = this.#language === LANGUAGE_SYSTEM;

        await this.#setLanguageSetting(
            this.#language
        );
    }

    /**
     * @param {string} module
     * @param {string} key
     * @param {{[key: string]: string} | null} placeholders
     * @param {string | null} language
     * @param {string | null} default_text
     * @returns {Promise<string>}
     */
    async translate(module, key, placeholders = null, language = null, default_text = null) {
        let text = (await this.#getTexts(
            module,
            language
        ))[1][key] ?? "";

        if (text === "") {
            text = default_text ?? "";
        }

        if (text === "") {
            text = `MISSING ${key}`;
        }

        return text.replaceAll(/{([\w-]+)}/g, (match, placeholder) => placeholders?.[placeholder] ?? match);
    }

    /**
     * @returns {Promise<string>}
     */
    async #getLanguageSetting() {
        return await this.#settings_storage?.get(
            SETTINGS_STORAGE_KEY_LANGUAGE
        ) ?? LANGUAGE_SYSTEM;
    }

    /**
     * @param {string} module
     * @returns {Promise<Localization[]>}
     */
    async #getLocalizations(module) {
        const localizations = this.#localizations.get(module) ?? null;

        if (localizations === null) {
            throw new Error(`Missing localizations for module ${module}`);
        }

        return localizations;
    }

    /**
     * @param {string} module
     * @param {string | null} language
     * @returns {Promise<[Localization, {[key: string]: string}]>}
     */
    async #getTexts(module, language = null) {
        const _language = language ?? this.#language;

        if (_language !== LANGUAGE_SYSTEM) {
            const texts = this.#texts.get(`${module}_${_language}`) ?? null;

            if (texts !== null) {
                return texts;
            }
        }

        const localizations = await this.#getLocalizations(
            module
        );

        let localization = null;

        for (const __language of _language !== LANGUAGE_SYSTEM ? [
            _language
        ] : "navigator" in globalThis ? navigator.languages : []) {
            localization = localizations.find(_localization => _localization.language === __language || (_localization["fallback-languages"] ?? []).includes(__language)) ?? null;

            if (localization !== null) {
                break;
            }
        }

        if (localization === null) {
            localization = localizations.find(_localization => _localization["fallback-default"] ?? false) ?? null;
        }

        if (localization === null) {
            throw new Error(`Missing texts for module ${module}${_language !== LANGUAGE_SYSTEM ? ` and language ${_language}` : ""}`);
        }

        if (this.#language === LANGUAGE_SYSTEM) {
            this.#language = localization.language;
        }

        const texts = [
            localization,
            await localization.getTexts()
        ];

        for (const __language of [
            localization.language,
            ...localization["fallback-languages"] ?? []
        ]) {
            this.#texts.set(`${module}_${__language}`, texts);
        }

        return texts;
    }

    /**
     * @param {string} language
     * @returns {Promise<void>}
     */
    async #setLanguageSetting(language) {
        if (this.#settings_storage === null) {
            throw new Error("Missing SettingsStorage");
        }

        await this.#settings_storage.store(
            SETTINGS_STORAGE_KEY_LANGUAGE,
            language
        );
    }
}
