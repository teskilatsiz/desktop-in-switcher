#!/usr/bin/env bash

UUID="desktop-in-switcher@teskilatsiz"
DOMAIN="$UUID"

SOURCE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEST="$HOME/.local/share/gnome-shell/extensions/$UUID"

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

echo "Installed:"
echo "$DEST"
echo
echo "Translations:"
find "$DEST/locale" -type f 2>/dev/null
echo
echo "Log out and log back in if this is the first installation."
echo
echo "Then enable it with:"
echo "gnome-extensions enable $UUID"
echo
