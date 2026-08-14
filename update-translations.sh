#!/usr/bin/env bash

DOMAIN="desktop-in-switcher@teskilatsiz"

xgettext \
    --from-code=UTF-8 \
    --language=JavaScript \
    --keyword=_ \
    --output="po/$DOMAIN.pot" \
    extension.js

cat > "po/LINGUAS" <<'EOF'
de
es
fr
it
pt
ru
tr
EOF

echo "Translation template updated:"
echo "po/$DOMAIN.pot"
echo "Locale list updated:"
echo "po/LINGUAS"
