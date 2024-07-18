import { LANGUAGE_SYSTEM } from "./SYSTEM_LOCALIZATION.mjs";
import { SETTINGS_STORAGE_KEY_LANGUAGE } from "./SettingsStorage/SETTINGS_STORAGE_KEY.mjs";

/** @typedef {import("./Language.mjs").Language} Language */
/** @typedef {import("./LocalizationObject.mjs").LocalizationObject} LocalizationObject */
/** @typedef {import("./Placeholders.mjs").Placeholders} Placeholders */
/** @typedef {import("./SettingsStorage/SettingsStorage.mjs").SettingsStorage} SettingsStorage */
/** @typedef {import("./Texts.mjs").Texts} Texts */

export const LOCALIZATION_EVENT_CHANGE = "localization-change";

export class Localization extends EventTarget {
    /**
     * @type {string | null}
     */
    #language;
    /**
     * @type {LocalizationObject[]}
     */
    #localizations = [];
    /**
     * @type {SettingsStorage | null}
     */
    #settings_storage;
    /**
     * @type {AbortController | null}
     */
    #system_detector_abort_controller = null;
    /**
     * @type {{[key: string]: {[key: string]: Promise<Texts>}}}
     */
    #texts = {};

    /**
     * @param {SettingsStorage | null} settings_storage
     * @returns {Promise<Localization>}
     */
    static async new(settings_storage = null) {
        const localization = new this(
            settings_storage
        );

        localization.#language = await localization.#getLanguage();

        return localization;
    }

    /**
     * @param {SettingsStorage | null} settings_storage
     * @private
     */
    constructor(settings_storage) {
        super();

        this.#settings_storage = settings_storage;
    }

    /**
     * @param {LocalizationObject} localization
     * @returns {Promise<void>}
     */
    async addLocalization(localization) {
        if (this.#localizations.some(_localization => _localization.language === localization.language)) {
            throw new Error(`Localization with language ${localization.language} already exists!`);
        }

        this.#localizations.push(localization);

        if (!(this.#language !== null ? this.#language === localization.language : localization.default ?? false)) {
            return;
        }

        await this.#render();
    }

    /**
     * @param {string | null} language
     * @returns {Promise<Language>}
     */
    async getLanguage(language = null) {
        const {
            localization,
            system
        } = await this.#getLocalization(
            language
        );

        return {
            direction: localization.direction ?? "ltr",
            label: await this.#getLabel(
                localization
            ),
            language: localization.language,
            system
        };
    }

    /**
     * @param {boolean | null} exclude_system
     * @returns {Promise<{[key: string]: string}>}
     */
    async getLanguages(exclude_system = null) {
        const _exclude_system = exclude_system ?? false;

        const system_label = !_exclude_system ? (await this.getLanguage(
            LANGUAGE_SYSTEM
        )).label : null;

        const languages = {};

        for (const localization of this.#localizations) {
            if (_exclude_system && localization.language === LANGUAGE_SYSTEM) {
                continue;
            }

            languages[localization.language] = await this.#getLabel(
                localization,
                system_label
            );
        }

        return Object.fromEntries(Object.entries(languages).sort(([
            language_1,
            label_1
        ], [
            language_2,
            label_2
        ]) => {
            const system_1 = language_1 === LANGUAGE_SYSTEM ? 0 : 1;
            const system_2 = language_2 === LANGUAGE_SYSTEM ? 0 : 1;

            if (system_1 > system_2) {
                return 1;
            }

            if (system_1 < system_2) {
                return -1;
            }

            const _label_1 = label_1.toLowerCase();
            const _label_2 = label_2.toLowerCase();

            if (_label_1 > _label_2) {
                return 1;
            }

            if (_label_1 < _label_2) {
                return -1;
            }

            return 0;
        }));
    }

    /**
     * @param {string | null} language
     * @returns {Promise<void>}
     */
    async setLanguage(language = null) {
        this.#language = language;

        await this.#settings_storage?.store(
            SETTINGS_STORAGE_KEY_LANGUAGE,
            this.#language
        );

        await this.#render();
    }

    /**
     * @param {string} module
     * @param {string} key
     * @param {Placeholders | null} placeholders
     * @param {string | null} language
     * @param {string | null} default_text
     * @returns {Promise<string>}
     */
    async translate(module, key, placeholders = null, language = null, default_text = null) {
        const {
            localization
        } = await this.#getLocalization(
            language
        );

        let text = (await this.#getTexts(
            localization,
            module
        ))[key] ?? "";

        if (text === "") {
            text = default_text ?? "";
        }

        if (text === "") {
            console.warn(`Missing text ${key} for module ${module} and language ${localization.language}!`);

            text = `MISSING ${key}!`;

            if (localization.default ?? false) {
                return text;
            }

            const default_localization = this.#getDefaultLocalization(
                false
            );

            if (default_localization === null || default_localization.language === localization.language) {
                return text;
            }

            return this.translate(
                module,
                key,
                placeholders,
                default_localization.language,
                text
            );
        }

        return this.#replacePlaceholders(
            text,
            placeholders
        );
    }

    /**
     * @param {Texts} texts
     * @param {Placeholders | null} placeholders
     * @param {string | null} language
     * @param {string | null} default_text
     * @returns {Promise<string>}
     */
    async translateStatic(texts, placeholders = null, language = null, default_text = null) {
        const {
            localization
        } = await this.#getLocalization(
            language
        );

        let text = texts[localization.language] ?? "";

        if (text === "") {
            text = default_text ?? "";
        }

        if (text === "") {
            console.warn(`Missing text for language ${localization.language}!`);

            text = `MISSING ${localization.language}!`;

            if (localization.default ?? false) {
                return text;
            }

            const default_localization = this.#getDefaultLocalization(
                false
            );

            if (default_localization === null || default_localization.language === localization.language) {
                return text;
            }

            return this.translateStatic(
                texts,
                placeholders,
                default_localization.language,
                text
            );
        }

        return this.#replacePlaceholders(
            text,
            placeholders
        );
    }

    /**
     * @param {boolean} system
     * @returns {LocalizationObject | null}
     */
    #getDefaultLocalization(system) {
        return this.#localizations.find(localization => (localization.default ?? false) && (localization.language === LANGUAGE_SYSTEM) === system) ?? null;
    }

    /**
     * @param {LocalizationObject} localization
     * @param {string | null} system_label
     * @returns {Promise<string>}
     */
    async #getLabel(localization, system_label = null) {
        return (typeof localization.label === "function" ? await localization.label(
            this,
            system_label
        ) : localization.label) ?? localization.language;
    }

    /**
     * @returns {Promise<string | null>}
     */
    async #getLanguage() {
        return await this.#settings_storage?.get(
            SETTINGS_STORAGE_KEY_LANGUAGE
        ) ?? null;
    }

    /**
     * @param {string | null} language
     * @returns {Promise<{localization: LocalizationObject, system: boolean}>}
     */
    async #getLocalization(language = null) {
        const languages = Array.from(new Set([
            language,
            this.#language,
            this.#getDefaultLocalization(
                true
            )?.language ?? null,
            this.#getDefaultLocalization(
                false
            )?.language ?? null
        ].filter(_language => _language !== null)));

        let localization = languages.reduce((_localization, _language) => _localization ?? this.#getLocalizationByLanguage(
            _language
        ), null);

        if (localization === null) {
            throw new Error(`No localization${languages.length > 0 ? `s for language${languages.length > 1 ? "s" : ""} ${languages.join(", ")}` : ""}!`);
        }

        const system = localization.language === LANGUAGE_SYSTEM;

        if (system) {
            const _languages = Array.from(new Set(navigator.languages));

            localization = _languages.reduce((_localization, _language) => _localization ?? this.#getLocalizationByLanguage(
                _language
            ) ?? this.#localizations.find(__localization => (__localization["additional-system-languages"] ?? []).includes(_language)) ?? null, null);

            if (localization === null) {
                localization = this.#getDefaultLocalization(
                    false
                );

                if (localization === null) {
                    throw new Error(`No localizations for system language${_languages.length > 0 ? `${_languages.length > 1 ? "s" : ""} ${_languages.join(", ")}` : ""}!`);
                }
            }
        }

        return {
            localization,
            system
        };
    }

    /**
     * @param {string} language
     * @returns {LocalizationObject | null}
     */
    #getLocalizationByLanguage(language) {
        return this.#localizations.find(localization => localization.language === language) ?? null;
    }

    /**
     * @param {LocalizationObject} localization
     * @param {string} module
     * @returns {Promise<Texts>}
     */
    async #getTexts(localization, module) {
        this.#texts[localization.language] ??= {};

        this.#texts[localization.language][module] ??= (async () => (typeof localization.texts === "function" ? await localization.texts(
            module
        ) : localization.texts?.[module]) ?? {})();

        return this.#texts[localization.language][module];
    }

    /**
     * @param {Language} language
     * @returns {void}
     */
    #initSystemDetector(language) {
        if (!("addEventListener" in globalThis)) {
            return;
        }

        if (language.system) {
            if (this.#system_detector_abort_controller !== null) {
                return;
            }

            this.#system_detector_abort_controller = new AbortController();

            addEventListener("languagechange", async () => {
                await this.#render();
            }, {
                signal: this.#system_detector_abort_controller.signal
            });
        } else {
            if (this.#system_detector_abort_controller === null) {
                return;
            }

            this.#system_detector_abort_controller.abort();

            this.#system_detector_abort_controller = null;
        }
    }

    /**
     * @returns {Promise<void>}
     */
    async #render() {
        const language = await this.getLanguage();

        this.#initSystemDetector(
            language
        );

        this.dispatchEvent(new CustomEvent(LOCALIZATION_EVENT_CHANGE, {
            detail: {
                language
            }
        }));
    }

    /**
     * @param {string} text
     * @param {Placeholders | null} placeholders
     * @returns {string}
     */
    #replacePlaceholders(text, placeholders = null) {
        return text.replaceAll(/{([\w-]+)}/g, (match, placeholder) => placeholders?.[placeholder] ?? match);
    }
}
