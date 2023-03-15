/** @typedef {import("../../../../../flux-http-api/src/Adapter/Api/HttpApi.mjs").HttpApi} HttpApi */

export class ImportLocalizationJsonCommand {
    /**
     * @type {HttpApi | null}
     */
    #http_api;

    /**
     * @param {HttpApi | null} http_api
     * @returns {ImportLocalizationJsonCommand}
     */
    static new(http_api = null) {
        return new this(
            http_api
        );
    }

    /**
     * @param {HttpApi | null} http_api
     * @private
     */
    constructor(http_api) {
        this.#http_api = http_api;
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
                if (this.#http_api === null) {
                    throw new Error("Missing HttpApi");
                }

                localization = await (await this.#http_api.request(
                    (await import("../../../../../flux-http-api/src/Adapter/Client/HttpClientRequest.mjs")).HttpClientRequest.new(
                        new URL(language_json),
                        null,
                        null,
                        {
                            [(await import("../../../../../flux-http-api/src/Adapter/Header/HEADER.mjs")).HEADER_ACCEPT]: (await import("../../../../../flux-http-api/src/Adapter/ContentType/CONTENT_TYPE.mjs")).CONTENT_TYPE_JSON
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
