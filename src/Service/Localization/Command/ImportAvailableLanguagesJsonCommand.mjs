/** @typedef {import("../../../Adapter/Language/AvailableLanguage.mjs").AvailableLanguage} AvailableLanguage */
/** @typedef {import("../../../../../flux-http-api/src/Adapter/Api/HttpApi.mjs").HttpApi} HttpApi */

export class ImportAvailableLanguagesJsonCommand {
    /**
     * @type {HttpApi | null}
     */
    #http_api;

    /**
     * @param {HttpApi | null} http_api
     * @returns {ImportAvailableLanguagesJsonCommand}
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
     * @returns {Promise<AvailableLanguage[] | null>}
     */
    async importAvailableLanguagesJson(localization_folder) {
        const available_languages_json_file = `${localization_folder}/_available_languages.json`;

        let available_languages = null;
        try {
            if (typeof process !== "undefined") {
                available_languages = JSON.parse(await (await import("node:fs/promises")).readFile(available_languages_json_file, "utf8"));
            } else {
                if (this.#http_api === null) {
                    throw new Error("Missing HttpApi");
                }

                available_languages = await (await this.#http_api.request(
                    (await import("../../../../../flux-http-api/src/Adapter/Client/HttpClientRequest.mjs")).HttpClientRequest.new(
                        new URL(available_languages_json_file),
                        null,
                        null,
                        {
                            [(await import("../../../../../flux-http-api/src/Adapter/Header/HEADER.mjs")).HEADER_ACCEPT]: (await import("../../../../../flux-http-api/src/Adapter/ContentType/CONTENT_TYPE.mjs")).CONTENT_TYPE_JSON
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
