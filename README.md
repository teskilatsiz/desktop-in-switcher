# Desktop in Switcher

GNOME Alt-Tab extension for switching to the desktop.

Desktop in Switcher adds a desktop entry to the GNOME Shell Alt-Tab window switcher, making it quick to show the desktop without leaving the keyboard.

![Desktop in Switcher](assets/desktop-in-switcher.gif)

## Features

- Adds a desktop entry to the Alt+Tab switcher
- Uses GNOME gettext so labels follow the system language
- Keeps translations in locale files instead of hardcoding UI text
- Includes translations for German, Spanish, French, Italian, Portuguese, Russian, and Turkish

## Requirements

- GNOME Shell 50
- gettext, for compiling translation files during installation

## Install

```bash
sudo dnf install -y gettext
cd desktop-in-switcher
./install.sh
```

If this is the first install, log out and log back in:

```bash
gnome-session-quit --logout
```

Then enable the extension:

```bash
gnome-extensions enable desktop-in-switcher@teskilatsiz
```

## Project Structure

```text
extension.js              Extension source
metadata.json             GNOME Shell extension metadata
install.sh                Local per-user installer
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
