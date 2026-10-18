#!/bin/bash

# Word Club Audio Generator using macOS 'say' command
# This produces high-quality audio using macOS built-in voices

AUDIO_DIR="./audio"
mkdir -p "$AUDIO_DIR"

# All words come from words.js (the single source of truth)
if ! command -v node >/dev/null; then
    echo "❌ node is required to read words.js."
    exit 1
fi
word_list=$(node -e "console.log(require('./words.js').WORDS.join('\\n'))") || { echo "❌ Could not read words from words.js."; exit 1; }
words=()
while IFS= read -r word; do
    [ -n "$word" ] && words+=("$word")
done <<< "$word_list"
if [ ${#words[@]} -eq 0 ]; then
    echo "❌ words.js contained no words."
    exit 1
fi

# Voice options (uncomment your preferred voice):
# VOICE="Samantha"     # Default female
# VOICE="Samantha (Enhanced)"  # High-quality female
# VOICE="Alex"         # Default male
VOICE="Allison (Enhanced)"   # Clear female (RECOMMENDED)
# VOICE="Ava"          # Premium female voice
# VOICE="Tom"          # Clear male

# Speech rate (words per minute) - 170 is slower, clearer
RATE=170

if ! say -v '?' | grep -q "^$VOICE "; then
    echo "❌ Voice \"$VOICE\" is not installed."
    echo "   Install it in System Settings → Accessibility → Spoken Content → System Voice → Manage Voices."
    exit 1
fi

echo "🎙️  Generating audio for ${#words[@]} words..."
echo "Voice: $VOICE"
echo "Rate: $RATE wpm"
echo ""

success=0
failed=0
total=${#words[@]}

for i in "${!words[@]}"; do
    word="${words[$i]}"

    # Create safe filename
    filename=$(echo "$word" | tr '[:upper:]' '[:lower:]' | sed 's/[àáâãäå]/a/g; s/[èéêë]/e/g; s/[ìíîï]/i/g; s/[òóôõö]/o/g; s/[ùúûü]/u/g; s/[ñ]/n/g; s/[ç]/c/g; s/[ä]/a/g; s/[ö]/o/g; s/[ü]/u/g; s/[ß]/ss/g; s/ /_/g; s/[^a-z0-9_]//g')

    filepath="$AUDIO_DIR/${filename}.aiff"

    # Skip if already exists
    if [ -s "$filepath" ]; then
        echo "⏭️  [$((i+1))/$total] Skipping \"$word\" (already exists)"
        ((success++))
        continue
    fi

    # Generate audio using 'say'
    if say -v "$VOICE" -r "$RATE" -o "$filepath" "$word"; then
        echo "✅ [$((i+1))/$total] Generated \"$word\" -> ${filename}.aiff"
        ((success++))
    else
        echo "❌ [$((i+1))/$total] Failed \"$word\""
        rm -f "$filepath"
        ((failed++))
    fi
done

echo ""
echo "=================================================="
echo "✅ Success: $success"
echo "❌ Failed: $failed"
echo "📁 Audio files saved to: $AUDIO_DIR"
echo "=================================================="
echo ""

if [ $success -gt 0 ]; then
    echo "Next steps:"
    echo "1. Audio files are in AIFF format (high quality, works in browsers)"
    echo "2. Total size: $(du -sh $AUDIO_DIR | cut -f1)"
    echo "3. Your app is ready to use these files!"
fi

[ $failed -eq 0 ] || exit 1
