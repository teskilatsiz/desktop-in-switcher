#!/usr/bin/env bash

UUID="desktop-in-switcher@teskilatsiz"
DEST="$HOME/.local/share/gnome-shell/extensions/$UUID"

gnome-extensions disable "$UUID" 2>/dev/null || true
rm -rf "$DEST"

echo "Desktop in Switcher removed."
