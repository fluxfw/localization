import { LANGUAGE_SETTINGS_KEY } from "../../../Adapter/Settings/LANGUAGE_SETTINGS_KEY.mjs";

/** @typedef {import("../../../../../flux-css-api/src/Adapter/Api/CssApi.mjs").CssApi} CssApi */
/** @typedef {import("../../../Adapter/SelectLanguage/getLanguageChangeListeners.mjs").getLanguageChangeListeners} getLanguageChangeListeners */
/** @typedef {import("../../../Adapter/SelectLanguage/loadModule.mjs").loadModule} loadModule */
/** @typedef {import("../../../Adapter/SelectLanguage/Localization.mjs").Localization} Localization */
/** @typedef {import("../Port/LocalizationService.mjs").LocalizationService} LocalizationService */
/** @typedef {import("../../../../../flux-settings-api/src/Adapter/Api/SettingsApi.mjs").SettingsApi} SettingsApi */

export class SelectLanguageCommand {
    /**
     * @type {CssApi}
     */
    #css_api;
    /**
     * @type {getLanguageChangeListeners}
     */
    #get_language_change_listeners;
    /**
     * @type {LocalizationService}
     */
    #localization_service;
    /**
     * @type {SettingsApi}
     */
    #settings_api;

    /**
     * @param {CssApi} css_api
     * @param {getLanguageChangeListeners} get_language_change_listeners
     * @param {LocalizationService} localization_service
     * @param {SettingsApi} settings_api
     * @returns {SelectLanguageCommand}
     */
    static new(css_api, get_language_change_listeners, localization_service, settings_api) {
        return new this(
            css_api,
            get_language_change_listeners,
            localization_service,
            settings_api
        );
    }

    /**
     * @param {CssApi} css_api
     * @param {getLanguageChangeListeners} get_language_change_listeners
     * @param {LocalizationService} localization_service
     * @param {SettingsApi} settings_api
     * @private
     */
    constructor(css_api, get_language_change_listeners, localization_service, settings_api) {
        this.#css_api = css_api;
        this.#get_language_change_listeners = get_language_change_listeners;
        this.#localization_service = localization_service;
        this.#settings_api = settings_api;
    }

    /**
     * @param {string} localization_folder
     * @param {loadModule} load_module
     * @param {boolean | null} force
     * @returns {Promise<string>}
     */
    async selectLanguage(localization_folder, load_module, force = null) {
        let language = await this.#getLanguage();

        if (language === "" || force === true) {
            const {
                localization,
                language: fallback_language
            } = await load_module();

            if (force === false) {
                this.#setLanguage(
                    fallback_language
                );
            } else {
                const { SelectLanguageElement } = await import("../../../Adapter/SelectLanguage/SelectLanguageElement.mjs");

                const languages = await this.#localization_service.getLanguages(
                    localization_folder
                );

                language = await new Promise(resolve => {
                    const select_language_element = SelectLanguageElement.new(
                        this.#css_api,
                        fallback_language,
                        language,
                        languages,
                        this.#localization_service,
                        async new_language => {
                            select_language_element.remove();

                            if (new_language !== null) {
                                await this.#setLanguage(
                                    new_language
                                );
                                if (language === "") {
                                    location.reload();
                                } else {
                                    resolve(new_language);
                                }
                            }
                        },
                        localization
                    );

                    document.body.appendChild(select_language_element);
                });
            }
        }

        for (const get_language_change_listener of this.#get_language_change_listeners()) {
            get_language_change_listener(
                language
            );
        }

        return language;
    }

    /**
     * @returns {Promise<string>}
     */
    async #getLanguage() {
        return this.#settings_api.get(
            LANGUAGE_SETTINGS_KEY,
            ""
        );
    }

    /**
     * @param {string} language
     * @returns {Promise<void>}
     */
    async #setLanguage(language) {
        await this.#settings_api.store(
            LANGUAGE_SETTINGS_KEY,
            language
        );
    }
}
