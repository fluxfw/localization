export class GetLanguageNameCommand {
    /**
     * @returns {GetLanguageNameCommand}
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
     * @returns {string}
     */
    getLanguageName(language) {
        return new Intl.DisplayNames(language, { languageDisplay: "standard", type: "language" }).of(language);
    }
}
