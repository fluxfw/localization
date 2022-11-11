import { LANGUAGE_SETTINGS_KEY } from "../../../Adapter/Settings/LANGUAGE_SETTINGS_KEY.mjs";

/** @typedef {import("../../../../../flux-settings-api/src/Adapter/Api/SettingsApi.mjs").SettingsApi} SettingsApi */

export class SetLanguageSettingCommand {
    /**
     * @type {SettingsApi}
     */
    #settings_api;

    /**
     * @param {SettingsApi} settings_api
     * @returns {SetLanguageSettingCommand}
     */
    static new(settings_api) {
        return new this(
            settings_api
        );
    }

    /**
     * @param {SettingsApi} settings_api
     * @private
     */
    constructor(settings_api) {
        this.#settings_api = settings_api;
    }

    /**
     * @param {string} language
     * @returns {Promise<void>}
     */
    async setLanguageSetting(language) {
        await this.#settings_api.store(
            LANGUAGE_SETTINGS_KEY,
            language
        );
    }
}
