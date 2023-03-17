/** @typedef {import("../../Language/Localization.mjs").Localization} Localization */

export class GetDirectionCommand {
    /**
     * @returns {GetDirectionCommand}
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
     * @param {string} language
     * @returns {Promise<string>}
     */
    async getDirection(language) {
        return new Intl.Locale(language)?.textInfo?.direction ?? "ltr";
    }
}
