/** @typedef {import("../../../Adapter/Language/AvailableLanguage.mjs").AvailableLanguage} AvailableLanguage */
/** @typedef {import("../../../../../flux-http-api/src/FluxHttpApi.mjs").FluxHttpApi} FluxHttpApi */

export class ImportAvailableLanguagesJsonCommand {
    /**
     * @type {FluxHttpApi | null}
     */
    #flux_http_api;

    /**
     * @param {FluxHttpApi | null} flux_http_api
     * @returns {ImportAvailableLanguagesJsonCommand}
     */
    static new(flux_http_api = null) {
        return new this(
            flux_http_api
        );
    }

    /**
     * @param {FluxHttpApi | null} flux_http_api
     * @private
     */
    constructor(flux_http_api) {
        this.#flux_http_api = flux_http_api;
    }

    /**
     * @param {string} localization_folder
     * @returns {Promise<AvailableLanguage[] | null>}
     */
    async importAvailableLanguagesJson(localization_folder) {
        const available_languages_json_file = `${localization_folder}/_available_languages.json`;

        let available_languages = null;
        try {
            if (typeof process !== "undefined") {
                available_languages = JSON.parse(await (await import("node:fs/promises")).readFile(available_languages_json_file, "utf8"));
            } else {
                if (this.#flux_http_api === null) {
                    throw new Error("Missing FluxHttpApi");
                }

                available_languages = await (await this.#flux_http_api.request(
                    (await import("../../../../../flux-http-api/src/Client/HttpClientRequest.mjs")).HttpClientRequest.new(
                        new URL(available_languages_json_file),
                        null,
                        null,
                        {
                            [(await import("../../../../../flux-http-api/src/Header/HEADER.mjs")).HEADER_ACCEPT]: (await import("../../../../../flux-http-api/src/ContentType/CONTENT_TYPE.mjs")).CONTENT_TYPE_JSON
                        },
                        true
                    ))).body.json();
            }
        } catch (error) {
            console.error(`Load available languages for ${localization_folder} failed (`, error, ")");
        }

        return available_languages;
    }
}
