/** @typedef {import("../../../../../flux-json-api/src/Adapter/Api/JsonApi.mjs").JsonApi} JsonApi */

export class ImportLocalizationJsonCommand {
    /**
     * @type {JsonApi}
     */
    #json_api;

    /**
     * @param {JsonApi} json_api
     * @returns {ImportLocalizationJsonCommand}
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
     * @param {string} language
     * @returns {Promise<{[key: string]: string} | null>}
     */
    async importLocalizationJson(localization_folder, language) {
        let localization = null;

        try {
            localization = await this.#json_api.importJson(
                `${localization_folder}/${language}.json`
            );
        } catch (error) {
            console.error(`Load language ${language} for ${localization_folder} failed (`, error, ")");
        }

        return localization;
    }
}
