/** @typedef {import("../../../../../flux-css-api/src/Adapter/Api/CssApi.mjs").CssApi} CssApi */
/** @typedef {import("../../../Adapter/SelectLanguage/ensureBeforeAndAfterSelectLanguage.mjs").ensureBeforeAndAfterSelectLanguage} ensureBeforeAndAfterSelectLanguage */
/** @typedef {import("../Port/LocalizationService.mjs").LocalizationService} LocalizationService */

export class SelectLanguageCommand {
    /**
     * @type {CssApi}
     */
    #css_api;
    /**
     * @type {LocalizationService}
     */
    #localization_service;

    /**
     * @param {CssApi} css_api
     * @param {LocalizationService} localization_service
     * @returns {SelectLanguageCommand}
     */
    static new(css_api, localization_service) {
        return new this(
            css_api,
            localization_service
        );
    }

    /**
     * @param {CssApi} css_api
     * @param {LocalizationService} localization_service
     * @private
     */
    constructor(css_api, localization_service) {
        this.#css_api = css_api;
        this.#localization_service = localization_service;
    }

    /**
     * @param {ensureBeforeAndAfterSelectLanguage | null} ensure_before_and_after_select_language
     * @param {boolean | null} force
     * @returns {Promise<void>}
     */
    async selectLanguage(ensure_before_and_after_select_language = null, force = null) {
        let language = await this.#localization_service.getLanguageSetting();

        if (language === "" || force === true) {
            if (force === false) {
                ({
                    language
                } = await this.#localization_service.getLanguage());
                await this.#localization_service.setLanguageSetting(
                    language
                );
            } else {
                if (language !== "") {
                    await this.#localization_service.setDefaultLanguage(
                        language
                    );
                }

                if (ensure_before_and_after_select_language !== null) {
                    await ensure_before_and_after_select_language();
                }

                const { SelectLanguageElement } = await import("../../../Adapter/SelectLanguage/SelectLanguageElement.mjs");

                language = await new Promise(resolve => {
                    const select_language_element = SelectLanguageElement.new(
                        this.#css_api,
                        language,
                        this.#localization_service,
                        async new_language => {
                            select_language_element.remove();

                            if (new_language !== null) {
                                await this.#localization_service.setLanguageSetting(
                                    new_language
                                );
                                if (language === "") {
                                    location.reload();
                                } else {
                                    resolve(new_language);
                                }
                            }
                        }
                    );

                    document.body.appendChild(select_language_element);
                });
            }
        }

        await this.#localization_service.setDefaultLanguage(
            language
        );

        if (ensure_before_and_after_select_language !== null) {
            await ensure_before_and_after_select_language();
        }
    }
}
