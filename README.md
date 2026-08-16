# Desktop in Switcher

GNOME Alt-Tab extension for switching to the desktop.

Desktop in Switcher adds a desktop entry to the GNOME Shell Alt-Tab window switcher, making it quick to show the desktop without leaving the keyboard.

![Desktop in Switcher](assets/desktop-in-switcher.gif)

## Features

- Adds a desktop entry to the Alt+Tab switcher
- Targets GNOME Shell 45-50 with the modern ESM extension format
- Uses GNOME gettext so labels follow the system language
- Keeps translations in locale files instead of hardcoding UI text
- Includes translations for German, Spanish, French, Italian, Portuguese, Russian, and Turkish

## Supported GNOME Versions

This project targets the modern GNOME Shell ESM line:

- GNOME Shell 45
- GNOME Shell 46
- GNOME Shell 47
- GNOME Shell 48
- GNOME Shell 49
- GNOME Shell 50

GNOME Shell 44 and older are not supported in this branch. GNOME 45 was the ESM migration point, so this branch uses the modern module-based extension format and only declares support for tested stable Shell versions.

## Requirements

- GNOME Shell 45–50
- gettext, for compiling translation files during installation

## Install

```bash
sudo dnf install -y gettext
cd desktop-in-switcher
./install.sh
```

The installer validates the active GNOME Shell version and exits early if the system is not in the supported range.

If this is the first install, log out and log back in:

```bash
gnome-session-quit --logout
```

Then enable the extension:

```bash
gnome-extensions enable desktop-in-switcher@teskilatsiz
```

## Compatibility Notes

This extension uses the modern GNOME extension API for Shell 45+ and supports the stable GNOME Shell releases listed in `metadata.json`.

GNOME Shell 44 and older require the legacy extension format, so they are intentionally not listed. Future Shell versions should be tested before being added to `shell-version`.

## GNOME Extensions Package

Build the review package with:

```bash
gnome-extensions pack . --force --podir=po --gettext-domain=desktop-in-switcher@teskilatsiz
```

The generated package is intentionally minimal for extensions.gnome.org review. It contains:

- `extension.js`
- `metadata.json`
- compiled `locale/*.mo` translation files

Repository-only files such as `assets/`, `po/*.po`, `po/*.pot`, `install.sh`, `uninstall.sh`, and `update-translations.sh` are not included in the review ZIP.

## Project Structure

```text
extension.js              Extension source (GNOME 45–50 ESM compatible)
metadata.json             GNOME Shell extension metadata
install.sh                Local per-user installer with version checks
uninstall.sh              Local uninstaller
po/                       Translation sources
update-translations.sh    Translation refresh helper
```

## Translations

Translation sources are stored in:

```text
po/
```

Included locales:

- de
- es
- fr
- it
- pt
- ru
- tr

To refresh the template:

```bash
./update-translations.sh
```

## Uninstall

```bash
./uninstall.sh
```

## License

[MIT](LICENSE)
