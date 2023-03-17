/** @typedef {import("../../../../flux-http-api/src/FluxHttpApi.mjs").FluxHttpApi} FluxHttpApi */

export class ImportLocalizationJsonCommand {
    /**
     * @type {FluxHttpApi | null}
     */
    #flux_http_api;

    /**
     * @param {FluxHttpApi | null} flux_http_api
     * @returns {ImportLocalizationJsonCommand}
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
     * @param {string} language
     * @returns {Promise<{[key: string]: string} | null>}
     */
    async importLocalizationJson(localization_folder, language) {
        const language_json = `${localization_folder}/${language}.json`;

        let localization = null;
        try {
            if (typeof process !== "undefined") {
                localization = JSON.parse(await (await import("node:fs/promises")).readFile(language_json, "utf8"));
            } else {
                if (this.#flux_http_api === null) {
                    throw new Error("Missing FluxHttpApi");
                }

                localization = await (await this.#flux_http_api.request(
                    (await import("../../../../flux-http-api/src/Client/HttpClientRequest.mjs")).HttpClientRequest.new(
                        new URL(language_json),
                        null,
                        null,
                        {
                            [(await import("../../../../flux-http-api/src/Header/HEADER.mjs")).HEADER_ACCEPT]: (await import("../../../../flux-http-api/src/ContentType/CONTENT_TYPE.mjs")).CONTENT_TYPE_JSON
                        },
                        true
                    ))).body.json();
            }
        } catch (error) {
            console.error(`Load language ${language} for ${localization_folder} failed (`, error, ")");
        }

        return localization;
    }
}
