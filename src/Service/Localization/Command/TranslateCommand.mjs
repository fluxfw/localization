/** @typedef {import("../../../Adapter/Language/Localization.mjs").Localization} Localization */
/** @typedef {import("../../../Adapter/Language/Placeholders.mjs").Placeholders} Placeholders */

export class TranslateCommand {
    /**
     * @returns {TranslateCommand}
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
     * @param {string} text
     * @param {Localization} localization
     * @param {Placeholders | null} placeholders
     * @param {string | null} default_text
     * @returns {Promise<string>}
     */
    async translate(text, localization, placeholders = null, default_text = null) {
        let _text = localization.localization?.[text] ?? "";
        if (_text === "") {
            _text = default_text ?? text;
        }
        return _text.replaceAll(/{([A-Za-z0-9_-]+)}/g, (match, placeholder) => placeholders?.[placeholder] ?? match);
    }
}
