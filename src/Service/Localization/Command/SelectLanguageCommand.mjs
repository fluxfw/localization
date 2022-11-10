import { LANGUAGE_SETTINGS_KEY } from "../../../Adapter/Settings/LANGUAGE_SETTINGS_KEY.mjs";

/** @typedef {import("../../../../../flux-css-api/src/Adapter/Api/CssApi.mjs").CssApi} CssApi */
/** @typedef {import("../../../Adapter/SelectLanguage/ensureBeforeAndAfterSelectLanguage.mjs").ensureBeforeAndAfterSelectLanguage} ensureBeforeAndAfterSelectLanguage */
/** @typedef {import("../Port/LocalizationService.mjs").LocalizationService} LocalizationService */
/** @typedef {import("../../../../../flux-settings-api/src/Adapter/Api/SettingsApi.mjs").SettingsApi} SettingsApi */

export class SelectLanguageCommand {
    /**
     * @type {CssApi}
     */
    #css_api;
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
     * @param {LocalizationService} localization_service
     * @param {SettingsApi} settings_api
     * @returns {SelectLanguageCommand}
     */
    static new(css_api, localization_service, settings_api) {
        return new this(
            css_api,
            localization_service,
            settings_api
        );
    }

    /**
     * @param {CssApi} css_api
     * @param {LocalizationService} localization_service
     * @param {SettingsApi} settings_api
     * @private
     */
    constructor(css_api, localization_service, settings_api) {
        this.#css_api = css_api;
        this.#localization_service = localization_service;
        this.#settings_api = settings_api;
    }

    /**
     * @param {ensureBeforeAndAfterSelectLanguage | null} ensure_before_and_after_select_language
     * @param {boolean | null} force
     * @returns {Promise<void>}
     */
    async selectLanguage(ensure_before_and_after_select_language = null, force = null) {
        let language = await this.#getLanguage();

        if (language === "" || force === true) {
            if (force === false) {
                ({
                    language
                } = await this.#localization_service.getLanguage());
                this.#setLanguage(
                    language
                );
            } else {
                if (language !== "") {
                    await this.#localization_service.setDefaultLanguage(
                        language
                    );
                }

                if (ensure_before_and_after_select_language !== null) {
                    await ensure_before_and_after_select_language();
                }

                const { SelectLanguageElement } = await import("../../../Adapter/SelectLanguage/SelectLanguageElement.mjs");

                language = await new Promise(resolve => {
                    const select_language_element = SelectLanguageElement.new(
                        this.#css_api,
                        language,
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
                        }
                    );

                    document.body.appendChild(select_language_element);
                });
            }
        }

        await this.#localization_service.setDefaultLanguage(
            language
        );

        if (ensure_before_and_after_select_language !== null) {
            await ensure_before_and_after_select_language();
        }
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
