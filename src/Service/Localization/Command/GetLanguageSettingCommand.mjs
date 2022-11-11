import { LANGUAGE_SETTINGS_KEY } from "../../../Adapter/Settings/LANGUAGE_SETTINGS_KEY.mjs";

/** @typedef {import("../../../../../flux-settings-api/src/Adapter/Api/SettingsApi.mjs").SettingsApi} SettingsApi */

export class GetLanguageSettingCommand {
    /**
     * @type {SettingsApi}
     */
    #settings_api;

    /**
     * @param {SettingsApi} settings_api
     * @returns {GetLanguageSettingCommand}
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
     * @returns {Promise<string>}
     */
    async getLanguageSetting() {
        return this.#settings_api.get(
            LANGUAGE_SETTINGS_KEY,
            ""
        );
    }
}
