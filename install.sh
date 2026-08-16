#!/usr/bin/env bash

set -euo pipefail

UUID="desktop-in-switcher@teskilatsiz"
DOMAIN="$UUID"

SOURCE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEST="$HOME/.local/share/gnome-shell/extensions/$UUID"

if ! command -v gnome-shell >/dev/null 2>&1; then
    echo "GNOME Shell was not found."
    exit 1
fi

SHELL_VERSION="$(gnome-shell --version 2>/dev/null | awk '{print $3}')"
SHELL_MAJOR="${SHELL_VERSION%%.*}"

echo
echo "GNOME Shell version: $SHELL_VERSION"

case "$SHELL_MAJOR" in
    45|46|47|48|49|50)
        ;;
    *)
        echo
        echo "Unsupported GNOME Shell version: $SHELL_VERSION"
        echo "Supported versions: 45, 46, 47, 48, 49 and 50."
        exit 1
        ;;
esac

echo
echo "Installing Desktop in Switcher..."

echo
if ! command -v msgfmt >/dev/null 2>&1; then
    echo "gettext is required."
    echo
    echo "Install it with:"
    echo "sudo dnf install gettext"
    exit 1
fi

mkdir -p "$DEST"

cp "$SOURCE_DIR/extension.js" "$DEST/extension.js"
cp "$SOURCE_DIR/metadata.json" "$DEST/metadata.json"

for PO_FILE in "$SOURCE_DIR"/po/*.po; do
    [ -f "$PO_FILE" ] || continue

    LANGUAGE="$(basename "$PO_FILE" .po)"
    LOCALE_DIR="$DEST/locale/$LANGUAGE/LC_MESSAGES"

    mkdir -p "$LOCALE_DIR"

    msgfmt \
        "$PO_FILE" \
        -o "$LOCALE_DIR/$DOMAIN.mo"
done

echo
echo "Desktop in Switcher installed."
echo "Location: $DEST"
echo
echo "Log out and log back in if required."
echo
echo "Then enable it with:"
echo "gnome-extensions enable $UUID"
echo
