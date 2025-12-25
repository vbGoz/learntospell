#!/bin/bash

# Word Club Audio Generator using macOS 'say' command
# This produces high-quality audio using macOS built-in voices

AUDIO_DIR="./audio"
mkdir -p "$AUDIO_DIR"

# List of all 221 words
words=(
"substantially" "formidable" "marquee" "compunction" "hyperventilated" "onslaught"
"misanthrope" "cravenly" "hypocritical" "traumatic" "solemnly" "contentious"
"ensemble" "lye" "lacrosse" "cajolery" "residuals" "peroxide" "apocalypse"
"barricade" "anonymously" "barrette" "junket" "Erie" "silhouette" "thesaurus"
"chandelier" "concierge" "hibiscus" "maracas" "burpees" "piccolo" "tulle"
"camphor" "paparazzi" "pogrom" "pâtisserie" "sarsaparilla" "cannelloni"
"bronchitis" "diphtheria" "corbels" "Kilimanjaro" "protégé" "maquisards"
"Charolais" "chair" "brass" "ready" "hangdog" "padlock" "scatter" "gobble"
"eel" "sizzle" "Spanish" "hornet" "oval" "plastic" "mason" "slander"
"evergreen" "decompose" "reasons" "dismantle" "glance" "oath" "sneakers"
"duets" "cursive" "pastel" "hype" "nestled" "mustiness" "shrouded"
"moderate" "mouthpiece" "lantern" "author" "wily" "veil" "redress"
"cruiser" "vitally" "burrowed" "pentagon" "diagram" "scrimmage" "vulgar"
"resign" "corrupt" "potency" "quartz" "tournament" "agribusiness"
"clementine" "signature" "influence" "snorkeling" "citadel" "achievements"
"appliances" "invective" "badminton" "gardenia" "emphatically" "absorption"
"prognosticate" "Pacific" "affiliation" "synopsis" "coriander" "purgatory"
"torpor" "covetous" "oppression" "abysmal" "precipice" "purview" "suburbia"
"construe" "fettle" "curriculum" "deuce" "berth" "cyst" "knavery" "synonym"
"purloined" "delectation" "austerity" "nascent" "extremophile" "monolithic"
"coven" "satisfice" "nuptials" "aquacade" "assuage" "ballistics" "efficacy"
"dreidel" "alacrity" "elision" "sanctimonious" "heptathlon" "tempera"
"mitosis" "apologia" "mesomorph" "claustrophobia" "glissade" "antebellum"
"weir" "sortie" "compañero" "pelota" "eloge" "mansard" "ramate"
"paranephric" "tontine" "asyllabia" "velodrome" "dysplasia" "Columbiad"
"terricolous" "soporiferous" "cyclopean" "messianic" "Austronesia"
"maxillary" "Euclidean" "archizoic" "aphagia" "persillade" "capriccio"
"chitin" "maisonette" "maunaloa" "hexastich" "bathypelagic" "syzygy"
"pharisaical" "vicegerent" "pince-nez" "carotid" "salaam" "forzato" "covey"
"apartheid" "kibbutz" "putti" "beignet" "fricassee" "abecedarius"
"collunarium" "scamillus" "buccinator" "Tijuana" "silenus" "marcottage"
"schuss" "bodegon" "cri de coeur" "chaise longue" "tathagata" "phalanstery"
"diapir" "harmattan" "farinha" "shamiana" "chautauqua" "heishi"
"mostaccioli" "baetyl" "gardai" "gelinotte" "zamacueca" "geländesprung"
"sittringee"
)

# Voice options (uncomment your preferred voice):
# VOICE="Samantha"     # Default female
# VOICE="Alex"         # Default male
VOICE="Allison"      # Clear female (RECOMMENDED)
# VOICE="Ava"          # Premium female voice
# VOICE="Tom"          # Clear male

# Speech rate (words per minute) - 170 is slower, clearer
RATE=170

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
    if [ -f "$filepath" ]; then
        echo "⏭️  [$((i+1))/$total] Skipping \"$word\" (already exists)"
        ((success++))
        continue
    fi

    # Generate audio using 'say'
    if say -v "$VOICE" -r "$RATE" -o "$filepath" "$word" 2>/dev/null; then
        echo "✅ [$((i+1))/$total] Generated \"$word\" -> ${filename}.aiff"
        ((success++))
    else
        echo "❌ [$((i+1))/$total] Failed \"$word\""
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
