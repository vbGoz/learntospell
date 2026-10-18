#!/bin/bash
# Play recordings so you can listen for mispronunciations.
#   ./audition-audio.sh            plays the words most likely to be mispronounced
#   ./audition-audio.sh word ...   plays just the words you name
# A bad word can be re-recorded with generate-audio-macos.sh + convert-to-m4a.sh.

cd "$(dirname "$0")" || exit 1

if [ $# -gt 0 ]; then
    words=("$@")
else
    words=("Aeolus" "Krio" "Bildungsroman" "spes phthisica" "Cappadocia" "Addis Ababa"
           "trichobothria" "vibrissae" "solenodon" "stomatopods" "sensilla" "ampulla"
           "mysticetes" "thermotaxis" "romerillo" "duende" "Amharic" "yakuza"
           "bogong moth" "salicylic acid" "sharpei" "ototoxic" "Eritrea" "lactobacillus")
fi

missing=0
for word in "${words[@]}"; do
    # Same filename rule as generate-audio-macos.sh
    file=$(printf '%s' "$word" | tr '[:upper:]' '[:lower:]' | sed 's/[àáâãäå]/a/g; s/[èéêë]/e/g; s/[ìíîï]/i/g; s/[òóôõö]/o/g; s/[ùúûü]/u/g; s/[ñ]/n/g; s/[ç]/c/g; s/[ß]/ss/g; s/ /_/g; s/[^a-z0-9_]//g')
    if [ -f "audio/$file.m4a" ]; then
        echo "▶ $word"
        afplay "audio/$file.m4a"
        sleep 0.4
    else
        echo "✗ no recording for: $word"
        missing=$((missing + 1))
    fi
done

[ $missing -eq 0 ] || exit 1
