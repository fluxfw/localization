/** @typedef {import("../../../Adapter/SelectLanguage/Localization.mjs").Localization} Localization */

export class GetLanguageCommand {
    /**
     * @returns {GetLanguageCommand}
     */
    static new() {
        return new this();
    }

    /**
     * @private
     */
    constructor() {

    }

    /**
     * @param {Localization | null} localization
     * @returns {Promise<string>}
     */
    async getLanguage(localization = null) {
        return localization?.language ?? "en";
    }
}
