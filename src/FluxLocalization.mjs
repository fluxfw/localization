import { LANGUAGE_SYSTEM } from "./Localization/SYSTEM_LOCALIZATION.mjs";
import { LOCALIZATION_KEY_LANGUAGE } from "./Localization/LOCALIZATION_KEY.mjs";
import { LOCALIZATION_MODULE } from "./Localization/LOCALIZATION_MODULE.mjs";
import { LOCALIZATIONS } from "./Localization/LOCALIZATIONS.mjs";
import { SETTINGS_STORAGE_KEY_LANGUAGE } from "./SettingsStorage/SETTINGS_STORAGE_KEY.mjs";

/** @typedef {import("flux-button-group/src/FluxButtonGroupElement.mjs").FluxButtonGroupElement} FluxButtonGroupElement */
/** @typedef {import("flux-form/src/FluxInputElement.mjs").FluxInputElement} FluxInputElement */
/** @typedef {import("./Localization/Language.mjs").Language} Language */
/** @typedef {import("./Localization/Localization.mjs").Localization} Localization */
/** @typedef {import("./SettingsStorage/SettingsStorage.mjs").SettingsStorage} SettingsStorage */
/** @typedef {import("./StyleSheetManager/StyleSheetManager.mjs").StyleSheetManager} StyleSheetManager */

export class FluxLocalization {
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
     * @param {SettingsStorage | null} settings_storage
     * @param {StyleSheetManager | null} style_sheet_manager
     * @returns {Promise<FluxLocalization>}
     */
    static async new(settings_storage = null, style_sheet_manager = null) {
        const flux_localization = new this(
            settings_storage,
            style_sheet_manager
        );

        await flux_localization.addModule(
            LOCALIZATION_MODULE,
            LOCALIZATIONS
        );

        flux_localization.#language = await flux_localization.#getLanguageSetting();

        flux_localization.#system_language = flux_localization.#language === LANGUAGE_SYSTEM;

        return flux_localization;
    }

    /**
     * @param {SettingsStorage | null} settings_storage
     * @param {StyleSheetManager | null} style_sheet_manager
     * @private
     */
    constructor(settings_storage, style_sheet_manager) {
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
        ] = await this.#getLocalization(
            module,
            language
        );

        return {
            direction: localization.direction ?? "ltr",
            label: await this.#getLocalizationLabel(
                localization
            ),
            language: localization.language,
            system: this.#system_language
        };
    }

    /**
     * @param {string} module
     * @param {boolean | null} exclude_system
     * @returns {Promise<{[key: string]: string}>}
     */
    async getLanguages(module, exclude_system = null) {
        const localizations = await this.#getLocalizations(
            module
        );

        const languages = {};

        const _exclude_system = exclude_system ?? false;

        const system_localization_label = !_exclude_system ? await this.#getLocalizationLabel(
            (await this.#getLocalization(
                module,
                LANGUAGE_SYSTEM
            ))[0]
        ) : null;

        for (const localization of localizations) {
            if (_exclude_system && localization.language === LANGUAGE_SYSTEM) {
                continue;
            }

            languages[localization.language] = await this.#getLocalizationLabel(
                localization,
                system_localization_label
            );
        }

        return languages;
    }

    /**
     * @param {string} module
     * @param {(() => Promise<void>) | null} after_select_language
     * @returns {Promise<FluxButtonGroupElement>}
     */
    async getSelectLanguageButtonGroupElement(module, after_select_language = null) {
        const languages = await this.getLanguages(
            module
        );

        const language = await this.getLanguage(
            module
        );

        const show_system_language = Object.hasOwn(languages, LANGUAGE_SYSTEM);

        const {
            FLUX_BUTTON_GROUP_ELEMENT_EVENT_INPUT,
            FluxButtonGroupElement
        } = await import("flux-button-group/src/FluxButtonGroupElement.mjs");

        const flux_button_group_element = await FluxButtonGroupElement.new(
            Object.entries(languages).map(([
                _language,
                label
            ]) => ({
                label,
                selected: _language === LANGUAGE_SYSTEM ? language.system : (show_system_language ? !language.system : true) && _language === language.language,
                title: label,
                value: _language
            })),
            this.#style_sheet_manager
        );

        flux_button_group_element.addEventListener(FLUX_BUTTON_GROUP_ELEMENT_EVENT_INPUT, async e => {
            await this.setLanguage(
                e.detail.value
            );

            if (after_select_language === null) {
                return;
            }

            await after_select_language();
        });

        return flux_button_group_element;
    }

    /**
     * @param {string} module
     * @param {(() => Promise<void>) | null} after_select_language
     * @param {boolean | null} no_language_label
     * @returns {Promise<FluxInputElement>}
     */
    async getSelectLanguageInputElement(module, after_select_language = null, no_language_label = null) {
        const languages = await this.getLanguages(
            module
        );

        const language = await this.getLanguage(
            module
        );

        const {
            FLUX_INPUT_ELEMENT_EVENT_INPUT,
            FluxInputElement
        } = await import("flux-form/src/FluxInputElement.mjs");
        const {
            INPUT_TYPE_SELECT
        } = await import("flux-form/src/INPUT_TYPE.mjs");

        const flux_input_element = await FluxInputElement.new(
            {
                label: !(no_language_label ?? false) ? await this.translate(
                    LOCALIZATION_MODULE,
                    LOCALIZATION_KEY_LANGUAGE
                ) : null,
                name: SETTINGS_STORAGE_KEY_LANGUAGE,
                options: Object.entries(languages).map(([
                    _language,
                    label
                ]) => ({
                    label,
                    title: label,
                    value: _language
                })),
                options_no_empty_value: true,
                required: true,
                type: INPUT_TYPE_SELECT,
                value: Object.hasOwn(languages, LANGUAGE_SYSTEM) && language.system ? LANGUAGE_SYSTEM : language.language
            },
            this.#style_sheet_manager
        );

        flux_input_element.addEventListener(FLUX_INPUT_ELEMENT_EVENT_INPUT, async e => {
            await this.setLanguage(
                e.detail.value
            );

            if (after_select_language !== null) {
                await after_select_language();
            }
        });

        return flux_input_element;
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
        const [
            localization,
            texts
        ] = await this.#getLocalization(
            module,
            language
        );

        let text = texts[key] ?? "";

        if (text === "") {
            text = default_text ?? "";
        }

        if (text === "") {
            console.warn(`Missing text ${key} for module ${module} and language ${localization.language}!`);

            text = `MISSING ${key}`;

            const _localization = localization["fallback-default"] ?? false ? localization : (await this.#getLocalizations(
                module
            )).find(__localization => __localization["fallback-default"] ?? false) ?? localization;

            if (_localization.language !== localization.language) {
                return this.translate(
                    module,
                    key,
                    placeholders,
                    _localization.language,
                    text
                );
            }
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
     * @param {string | null} language
     * @returns {Promise<[Localization, {[key: string]: string}]>}
     */
    async #getLocalization(module, language = null) {
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
            throw new Error(`Missing localization for module ${module}${_language !== LANGUAGE_SYSTEM ? ` and language ${_language}` : ""}!`);
        }

        if (this.#language === LANGUAGE_SYSTEM) {
            this.#language = localization.language;
        }

        const texts = this.#texts.get(`${module}_${localization.language}`) ?? null;

        if (texts !== null) {
            return texts;
        }

        const _texts = [
            localization,
            await (localization.getTexts ?? (async () => ({})))()
        ];

        for (const __language of [
            localization.language,
            ...localization["fallback-languages"] ?? []
        ]) {
            this.#texts.set(`${module}_${__language}`, _texts);
        }

        return _texts;
    }

    /**
     * @param {Localization} localization
     * @param {string | null} system_localization_label
     * @returns {Promise<string>}
     */
    async #getLocalizationLabel(localization, system_localization_label = null) {
        return (localization.getLabel ?? (async () => localization.language))(
            this,
            system_localization_label
        );
    }

    /**
     * @param {string} module
     * @returns {Promise<Localization[]>}
     */
    async #getLocalizations(module) {
        const localizations = this.#localizations.get(module) ?? null;

        if (localizations === null) {
            throw new Error(`Missing localizations for module ${module}!`);
        }

        return localizations;
    }

    /**
     * @param {string} language
     * @returns {Promise<void>}
     */
    async #setLanguageSetting(language) {
        if (this.#settings_storage === null) {
            throw new Error("Missing SettingsStorage!");
        }

        await this.#settings_storage.store(
            SETTINGS_STORAGE_KEY_LANGUAGE,
            language
        );
    }
}
