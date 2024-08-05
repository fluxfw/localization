# Changelog

## latest

Changes:

\-

## v2024-08-05-2

Changes:

- Fix

## v2024-08-05-1

Changes:

- Rename `change` event, remove constant, only if changed, bypassable or forceable on `addLocalization`|`render`|`setLanguage`, add `addEventListener`/ `removeEventListener` JSDoc
- `render` public, bypassable or forceable on `addLocalization`|`setLanguage`
- Remove settings storage
- Clone and inmutable objects

## v2024-07-26-2

Changes:

- Rename `LOCALIZATION` variables

## v2024-07-26-1

Changes:

- `Logger`

## v2024-07-18-2

Changes:

- Remove static property values from constructor to property definition

## v2024-07-18-1

Changes:

- Load texts per module

## v2024-07-08-1

Changes:

- `library` folder
- Use NodeJS `exports` in `package.json` for clean imports from subfolder

## v2024-05-13-1

Changes:

- Multiple default localizations can be set
  - If system, this is used as default selected language and an other non-system is used as fallback
  - If non-system only, this is used for both as default selected language and as fallback
  - Remove default set to system
- Only render after add localization (Need to add system localization as last)
- Improved get localization
- Sort languages by label
- Optional SettingsStorage
- Remove select ui

## v2024-05-08-1

Changes:

- Deflux
- `translateStatic`
- Fix may double load texts if pa­r­al­lel call
- Rename `system-languages` to `additional-system-languages`

## v2024-05-03-2

Changes:

- Remove init change event

## v2024-05-03-1

Changes:

- Replace `after_language_select` with `change` event
- Detect system language change

## v2024-04-29-3

Changes:

- Fix `reduce`

## v2024-04-29-2

Changes:

- Respect system languages order
- Get system language in NodeJS

## v2024-04-29-1

Changes:

- Seperate system language checks
- Rename `fallback` properties

## v2024-04-22-2

Changes:

- Fix

## v2024-04-22-1

Changes:

- Do not load texts anymore for label only

## v2024-04-16-1

Changes:

- Move module to texts

## v2024-04-15-1

Changes:

- Remove direct used bundled localizations
- Rename `getLabel` to `label` and `getTexts` to `texts`

## v2024-04-03-1

Changes:

- Add `!` to error logs

## v2024-01-15-1

Changes:

- Load libraries using NodeJS's module resolver

## v2024-01-09-1

Changes:

- Early return if non `after_select_language`

## v2023-11-21-3

Changes:

- Language label

## v2023-11-21-2

Changes:

- Add console warn if missing text

## v2023-11-21-1

Changes:

- Show current system language in selector
- Input element selector variant

## v2023-11-20-2

Changes:

- Fix

## v2023-11-20-1

Changes:

- Use text from fallback default localization if missing
- Renamed to `flux-localization`

## v2023-09-25-1

Changes:

- `flux-button-group`

## v2023-08-07-2

Changes:

- System language

## v2023-08-07-1

Changes:

- System language

## v2023-07-31-2

Changes:

- Fix

## v2023-07-31-1

Changes:

- System language

## v2023-07-27-1

Changes:

- Style sheet manager

## v2023-07-21-1

Changes:

- General localizations

## v2023-07-17-1

Changes:

- General `SettingsStorage`

## v2023-05-04-1

Changes:

- `flux-button-group`

## v2023-04-11-1

Changes:

- preferred languages

## v2023-03-24-1

Changes:

- `flux-button-group`

## v2023-03-23-1

Changes:

- Css variables

## v2023-03-22-1

Changes:

- `flux-css-api`

## v2023-03-21-3

Changes:

- Fix

## v2023-03-21-2

Changes:

- `flux-css-api`

## v2023-03-21-1

Changes:

- Restore cache

## v2023-03-20-2

Changes:

- Fix

## v2023-03-20-1

Changes:

- Simplify

## v2023-03-17-3

Changes:

- Fix

## v2023-03-17-2

Changes:

- Fix

## v2023-03-17-1

Changes:

- Simplify

## v2023-03-16-1

Changes:

- `flux-http-api`

## v2023-03-15-1

Changes:

- Remove `flux-json-api` / Use `flux-http-api` (Browser)

## v2023-02-09-1

Changes:

- build / publish

## v2023-01-03-1

Changes:

- Fix fallback languages

## v2022-12-20-1

Changes:

- fallback languages

## v2022-12-12-1

Changes:

- Rename language select
- Remove old language select

## v2022-12-08-1

Changes:

- `metadata.json`

## v2022-12-07-1

Changes:

- button

## v2022-12-06-2

Changes:

- button

## v2022-12-06-1

Changes:

- popup

## v2022-12-05-1

Changes:

- button

## v2022-11-21-1

Changes:

- `Array.from`

## v2022-11-16-1

Changes:

- `optionalDependencies`

## v2022-11-11-1

Changes:

- `SelectLanguageButtonsElement`

## v2022-11-10-2

Changes:

- Fix font size

## v2022-11-10-1

Changes:

- Fix select language `force=false`

## v2022-11-09-1

Changes:

- New logic

## v2022-11-07-1

Changes:

- Optional `CssApi`/`SettingsApi` for basic

## v2022-11-03-1

Changes:

- init

## v2022-10-28-1

Changes:

- init

## v2022-10-19-1

Changes:

- Code style

## v2022-10-17-1

Changes:

- Dynamic imports

## v2022-10-13-1

Changes:

- Accent color

## v2022-10-11-1

Changes:

- First release
