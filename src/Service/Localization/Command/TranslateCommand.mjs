/** @typedef {import("../../../Adapter/SelectLanguage/Localization.mjs").Localization} Localization */

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
     * @param {Localization | null} localization
     * @param {{[key: string]: string} | null} placeholders
     * @returns {string}
     */
    translate(text, localization = null, placeholders = null) {
        let _text = localization?.localization?.[text] ?? "";
        if (_text === "") {
            _text = text;
        }
        return _text.replaceAll(/{([A-Za-z0-9_-]+)}/g, (match, placeholder) => placeholders?.[placeholder] ?? match);
    }
}
