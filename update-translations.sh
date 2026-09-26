#!/usr/bin/env bash

set -euo pipefail

DOMAIN="desktop-in-switcher@teskilatsiz"
POT_FILE="po/$DOMAIN.pot"
LINGUAS=(
    de
    es
    fr
    it
    pt
    ru
    tr
)

xgettext \
    --from-code=UTF-8 \
    --language=JavaScript \
    --keyword=_ \
    --package-name="desktop-in-switcher" \
    --copyright-holder="Teşkilatsız" \
    --msgid-bugs-address="https://github.com/teskilatsiz/desktop-in-switcher/issues" \
    --output="$POT_FILE" \
    extension.js

printf '%s\n' "${LINGUAS[@]}" > po/LINGUAS

for LANGUAGE in "${LINGUAS[@]}"; do
    PO_FILE="po/$LANGUAGE.po"

    if [ -f "$PO_FILE" ]; then
        msgmerge --backup=none --update "$PO_FILE" "$POT_FILE"
    fi
done

echo "Translation template updated:"
echo "$POT_FILE"
echo "Locale list updated:"
echo "po/LINGUAS"
