import { LANGUAGE_SETTINGS_KEY } from "../../Settings/LANGUAGE_SETTINGS_KEY.mjs";

/** @typedef {import("../../../../flux-settings-api/src/FluxSettingsApi.mjs").FluxSettingsApi} FluxSettingsApi */

export class SetLanguageSettingCommand {
    /**
     * @type {FluxSettingsApi}
     */
    #flux_settings_api;

    /**
     * @param {FluxSettingsApi} flux_settings_api
     * @returns {SetLanguageSettingCommand}
     */
    static new(flux_settings_api) {
        return new this(
            flux_settings_api
        );
    }

    /**
     * @param {FluxSettingsApi} flux_settings_api
     * @private
     */
    constructor(flux_settings_api) {
        this.#flux_settings_api = flux_settings_api;
    }

    /**
     * @param {string} language
     * @returns {Promise<void>}
     */
    async setLanguageSetting(language) {
        await this.#flux_settings_api.store(
            LANGUAGE_SETTINGS_KEY,
            language
        );
    }
}
