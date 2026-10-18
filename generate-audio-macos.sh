#!/bin/bash

# Word Club Audio Generator using macOS 'say' command
# This produces high-quality audio using macOS built-in voices

AUDIO_DIR="./audio"
mkdir -p "$AUDIO_DIR"

# List of all 450 words
words=(
"ran" "wind" "leg" "dirt" "rod" "good" "most" "hurt" "shy" "bunny" "down"
"steps" "drink" "silly" "sick" "path" "mist" "stars" "truck" "fire" "still"
"hello" "bush" "late" "pump" "shell" "yarn" "wings" "sharp" "easy" "body"
"house" "rich" "shift" "heart" "tusk" "shoot" "seal" "even" "dive" "claws"
"crack" "come" "fine" "winter" "apple" "sound" "mossy" "yellow" "shine"
"chips" "beans" "mouth" "spray" "year" "truth" "paper" "rabbit" "feed"
"tallest" "inside" "frozen" "speak" "cliffs" "whale" "market" "flock"
"crunch" "lizard" "beware" "sparkle" "sweater" "nurse" "wrong" "hopped"
"money" "cabin" "darkness" "always" "sprout" "carve" "shadows" "morning"
"alive" "earth" "friend" "lovely" "return" "half" "swift" "grandfather"
"footprints" "fear" "thirsty" "peer" "gentle" "riddle" "voice" "peach"
"pancakes" "illness" "lead" "groan" "sloth" "knit" "cloak" "parade" "whistle"
"total" "indoors" "trouble" "relax" "finish" "holiday" "safety" "stout"
"spiders" "entire" "library" "guide" "hospital" "mustard" "company" "ginger"
"narrow" "medium" "pennies" "hiking" "foolish" "afraid" "remember" "result"
"charming" "source" "pearls" "tangy" "beasts" "shivering" "barge" "grumpily"
"smoothly" "cottage" "humble" "seventy" "dangle" "distance" "breeze" "soared"
"frazzled" "bamboo" "buttons" "cuddle" "puffy" "tiptoed" "clever" "basement"
"burlap" "wetlands" "invite" "butterflies" "kelp" "property" "carefully"
"sniffling" "beneath" "tractor" "permit" "awning" "fickle" "relief" "lunar"
"boycotting" "molten" "elite" "woven" "proclaim" "thimble" "custody"
"granola" "warrior" "rigid" "fierce" "laughter" "salary" "disappear"
"hurdler" "lounge" "jovial" "inferior" "December" "duration" "dictionary"
"business" "reinstate" "examine" "versus" "lullaby" "opposite" "tissues"
"marlin" "Halloween" "compliment" "compromise" "incident" "Japanese"
"investment" "bifocals" "cutlery" "chisel" "fundraiser" "geologist"
"bellowed" "organism" "quail" "atmosphere" "disappointment" "truant"
"pamphlet" "helium" "suggested" "chimpanzees" "desperate" "annoyance"
"interruption" "concentrate" "piñata" "territory" "stragglers" "albino"
"ridiculous" "monorail" "exploratory" "indigo" "bratwurst" "alphabetical"
"integrity" "Oregon" "rebuttal" "prejudice" "solidarity" "calico" "sputnik"
"cartridge" "segregation" "tortillas" "civilian" "fertilizer" "apprentice"
"synthetic" "Caesar" "glamorous" "salamanders" "suspension" "sorceress"
"fictitious" "convertible" "snarkiness" "singularity" "collateral"
"initiation" "mascara" "battalion" "precedent" "materialize" "magnesium"
"perimeter" "haddock" "optometrist" "meticulous" "cosmodrome" "hypothermia"
"schnauzer" "megahertz" "regolith" "arthritis" "persnickety" "insurrection"
"pheasants" "pentathletes" "Senegal" "fascism" "duende" "predecessor"
"Polaroid" "reservoir" "matrilineal" "conscious" "arnica" "carrion"
"glaucoma" "piteously" "adrenaline" "elliptical" "staccato" "iridium"
"romerillo" "cemetery" "dachshund" "rendezvous" "Aeolus" "newt" "thrummed"
"censers" "lapels" "generosity" "burnished" "embankment" "unrelenting"
"wallowing" "imperial" "mortar" "arsonists" "mewling" "generator"
"persistent" "authority" "panoramic" "Doberman" "dominion" "decisively"
"gauntlets" "inanimate" "lemmings" "auditory" "appetizing" "sentinels"
"frequency" "self-sufficient" "prospective" "subscription" "blithely"
"conspicuous" "preconception" "procession" "tenuous" "perpendicular"
"hemisphere" "seminal" "saxophone" "torrential" "reluctance" "consulate"
"canter" "sauntered" "propeller" "modish" "cuisine" "juniper" "settee"
"unconscious" "influenza" "palazzo" "finesse" "foliage" "odorant"
"irrelevant" "curriculum" "quizzically" "diplomatically" "enigmatic"
"increments" "crocheted" "calibrate" "hypothesis" "reassurance" "apologetic"
"credenza" "comprehensible" "protectorate" "Delaware" "phenomenon"
"trenchant" "pulmonary" "undulating" "alleviate" "despondent" "approximation"
"phantasmal" "legation" "echolocation" "glycerin" "brazier" "diffidence"
"conflagration" "alabaster" "arachnid" "butane" "thermotaxis" "arugula"
"pathologically" "cataract" "inaugurate" "vibrometer" "affinities" "quiche"
"bioluminescence" "mayonnaise" "embodiment" "euphemism" "chickadee" "sputum"
"porpoises" "acolyte" "asymmetric" "cerulean" "psychological" "innocuous"
"sharpei" "cul-de-sac" "assemblage" "Tripoli" "endothermy" "electrolytes"
"leprosy" "neurological" "éclair" "ototoxic" "eureka" "mysticetes"
"irascibility" "Aphrodite" "annelids" "Eritrea" "a cappella" "bogong moth"
"kerosene" "forsythia" "Amharic" "yakuza" "Pennsylvania" "salicylic acid"
"Gloucester" "sensilla" "ampulla" "stomatopods" "prosciutto" "eponymous"
"solenodon" "frankincense" "chitinous" "Presbyterian" "Sierra Leone"
"trichobothria" "Krio" "lactobacillus" "Bildungsroman" "Cappadocia"
"Addis Ababa" "spes phthisica" "vibrissae"
)

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
