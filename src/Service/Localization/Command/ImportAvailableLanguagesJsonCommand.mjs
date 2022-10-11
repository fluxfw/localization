/** @typedef {import("../../../../../flux-json-api/src/Adapter/Api/JsonApi.mjs").JsonApi} JsonApi */

export class ImportAvailableLanguagesJsonCommand {
    /**
     * @type {JsonApi}
     */
    #json_api;

    /**
     * @param {JsonApi} json_api
     * @returns {ImportAvailableLanguagesJsonCommand}
     */
    static new(json_api) {
        return new this(
            json_api
        );
    }

    /**
     * @param {JsonApi} json_api
     * @private
     */
    constructor(json_api) {
        this.#json_api = json_api;
    }

    /**
     * @param {string} localization_folder
     * @returns {Promise<string[] | null>}
     */
    async importAvailableLanguagesJson(localization_folder) {
        let available_languages = null;

        try {
            available_languages = await this.#json_api.importJson(
                `${localization_folder}/_available_languages.json`
            );
        } catch (error) {
            console.error(`Load available languages for ${localization_folder} failed (`, error, ")");
        }

        return available_languages;
    }
}
