import { LANGUAGE_SETTINGS_KEY } from "../../Settings/LANGUAGE_SETTINGS_KEY.mjs";

/** @typedef {import("../../../../flux-settings-api/src/FluxSettingsApi.mjs").FluxSettingsApi} FluxSettingsApi */

export class GetLanguageSettingCommand {
    /**
     * @type {FluxSettingsApi}
     */
    #flux_settings_api;

    /**
     * @param {FluxSettingsApi} flux_settings_api
     * @returns {GetLanguageSettingCommand}
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
     * @returns {Promise<string>}
     */
    async getLanguageSetting() {
        return this.#flux_settings_api.get(
            LANGUAGE_SETTINGS_KEY,
            ""
        );
    }
}
