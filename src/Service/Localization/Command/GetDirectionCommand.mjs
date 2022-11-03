/** @typedef {import("../../../Adapter/SelectLanguage/Localization.mjs").Localization} Localization */

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
     * @param {Localization | null} localization
     * @returns {Promise<string>}
     */
    async getDirection(localization = null) {
        return ((localization?.language ?? null) !== null ? new Intl.Locale(localization.language)?.textInfo?.direction : null) ?? "ltr";
    }
}
