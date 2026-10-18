// Audio Generation Script for Word Club
// Uses Google Translate TTS (free, no auth required)

const fs = require('fs');
const https = require('https');
const path = require('path');

const WORDS = `ran
wind
leg
dirt
rod
good
most
hurt
shy
bunny
down
steps
drink
silly
sick
path
mist
stars
truck
fire
still
hello
bush
late
pump
shell
yarn
wings
sharp
easy
body
house
rich
shift
heart
tusk
shoot
seal
even
dive
claws
crack
come
fine
winter
apple
sound
mossy
yellow
shine
chips
beans
mouth
spray
year
truth
paper
rabbit
feed
tallest
inside
frozen
speak
cliffs
whale
market
flock
crunch
lizard
beware
sparkle
sweater
nurse
wrong
hopped
money
cabin
darkness
always
sprout
carve
shadows
morning
alive
earth
friend
lovely
return
half
swift
grandfather
footprints
fear
thirsty
peer
gentle
riddle
voice
peach
pancakes
illness
lead
groan
sloth
knit
cloak
parade
whistle
total
indoors
trouble
relax
finish
holiday
safety
stout
spiders
entire
library
guide
hospital
mustard
company
ginger
narrow
medium
pennies
hiking
foolish
afraid
remember
result
charming
source
pearls
tangy
beasts
shivering
barge
grumpily
smoothly
cottage
humble
seventy
dangle
distance
breeze
soared
frazzled
bamboo
buttons
cuddle
puffy
tiptoed
clever
basement
burlap
wetlands
invite
butterflies
kelp
property
carefully
sniffling
beneath
tractor
permit
awning
fickle
relief
lunar
boycotting
molten
elite
woven
proclaim
thimble
custody
granola
warrior
rigid
fierce
laughter
salary
disappear
hurdler
lounge
jovial
inferior
December
duration
dictionary
business
reinstate
examine
versus
lullaby
opposite
tissues
marlin
Halloween
compliment
compromise
incident
Japanese
investment
bifocals
cutlery
chisel
fundraiser
geologist
bellowed
organism
quail
atmosphere
disappointment
truant
pamphlet
helium
suggested
chimpanzees
desperate
annoyance
interruption
concentrate
piñata
territory
stragglers
albino
ridiculous
monorail
exploratory
indigo
bratwurst
alphabetical
integrity
Oregon
rebuttal
prejudice
solidarity
calico
sputnik
cartridge
segregation
tortillas
civilian
fertilizer
apprentice
synthetic
Caesar
glamorous
salamanders
suspension
sorceress
fictitious
convertible
snarkiness
singularity
collateral
initiation
mascara
battalion
precedent
materialize
magnesium
perimeter
haddock
optometrist
meticulous
cosmodrome
hypothermia
schnauzer
megahertz
regolith
arthritis
persnickety
insurrection
pheasants
pentathletes
Senegal
fascism
duende
predecessor
Polaroid
reservoir
matrilineal
conscious
arnica
carrion
glaucoma
piteously
adrenaline
elliptical
staccato
iridium
romerillo
cemetery
dachshund
rendezvous
Aeolus
newt
thrummed
censers
lapels
generosity
burnished
embankment
unrelenting
wallowing
imperial
mortar
arsonists
mewling
generator
persistent
authority
panoramic
Doberman
dominion
decisively
gauntlets
inanimate
lemmings
auditory
appetizing
sentinels
frequency
self-sufficient
prospective
subscription
blithely
conspicuous
preconception
procession
tenuous
perpendicular
hemisphere
seminal
saxophone
torrential
reluctance
consulate
canter
sauntered
propeller
modish
cuisine
juniper
settee
unconscious
influenza
palazzo
finesse
foliage
odorant
irrelevant
curriculum
quizzically
diplomatically
enigmatic
increments
crocheted
calibrate
hypothesis
reassurance
apologetic
credenza
comprehensible
protectorate
Delaware
phenomenon
trenchant
pulmonary
undulating
alleviate
despondent
approximation
phantasmal
legation
echolocation
glycerin
brazier
diffidence
conflagration
alabaster
arachnid
butane
thermotaxis
arugula
pathologically
cataract
inaugurate
vibrometer
affinities
quiche
bioluminescence
mayonnaise
embodiment
euphemism
chickadee
sputum
porpoises
acolyte
asymmetric
cerulean
psychological
innocuous
sharpei
cul-de-sac
assemblage
Tripoli
endothermy
electrolytes
leprosy
neurological
éclair
ototoxic
eureka
mysticetes
irascibility
Aphrodite
annelids
Eritrea
a cappella
bogong moth
kerosene
forsythia
Amharic
yakuza
Pennsylvania
salicylic acid
Gloucester
sensilla
ampulla
stomatopods
prosciutto
eponymous
solenodon
frankincense
chitinous
Presbyterian
Sierra Leone
trichobothria
Krio
lactobacillus
Bildungsroman
Cappadocia
Addis Ababa
spes phthisica
vibrissae`.split('\n').map(w => w.trim()).filter(w => w);

// Google Translate TTS endpoint
function getGoogleTTSUrl(text, lang = 'en') {
    const encodedText = encodeURIComponent(text);
    return `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&q=${encodedText}&tl=${lang}&total=1&idx=0&textlen=${text.length}`;
}

// Download audio file
function downloadAudio(url, filename) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(filename);
        https.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
            }
        }, (response) => {
            if (response.statusCode !== 200) {
                reject(new Error(`Failed to download: ${response.statusCode}`));
                return;
            }
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                resolve();
            });
        }).on('error', (err) => {
            fs.unlink(filename, () => {});
            reject(err);
        });
    });
}

// Generate filename from word
function getFilename(word) {
    // Replace special characters and spaces with underscores
    return word.toLowerCase()
        .replace(/[àáâãäå]/g, 'a')
        .replace(/[èéêë]/g, 'e')
        .replace(/[ìíîï]/g, 'i')
        .replace(/[òóôõö]/g, 'o')
        .replace(/[ùúûü]/g, 'u')
        .replace(/[ñ]/g, 'n')
        .replace(/[ç]/g, 'c')
        .replace(/[ä]/g, 'a')
        .replace(/[ö]/g, 'o')
        .replace(/[ü]/g, 'u')
        .replace(/[ß]/g, 'ss')
        .replace(/\s+/g, '_')
        .replace(/[^a-z0-9_]/g, '');
}

// Main generation function
async function generateAllAudio() {
    const audioDir = path.join(__dirname, 'audio');

    if (!fs.existsSync(audioDir)) {
        fs.mkdirSync(audioDir, { recursive: true });
    }

    console.log(`\n🎙️  Generating audio for ${WORDS.length} words...\n`);

    let success = 0;
    let failed = 0;

    for (let i = 0; i < WORDS.length; i++) {
        const word = WORDS[i];
        const filename = getFilename(word);
        const filepath = path.join(audioDir, `${filename}.mp3`);

        // Skip if file already exists
        if (fs.existsSync(filepath)) {
            console.log(`⏭️  [${i + 1}/${WORDS.length}] Skipping "${word}" (already exists)`);
            success++;
            continue;
        }

        try {
            const url = getGoogleTTSUrl(word);
            await downloadAudio(url, filepath);
            console.log(`✅ [${i + 1}/${WORDS.length}] Generated "${word}" -> ${filename}.mp3`);
            success++;

            // Add small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 200));
        } catch (error) {
            console.error(`❌ [${i + 1}/${WORDS.length}] Failed "${word}": ${error.message}`);
            failed++;
        }
    }

    console.log(`\n${'='.repeat(50)}`);
    console.log(`✅ Success: ${success}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`📁 Audio files saved to: ${audioDir}`);
    console.log(`${'='.repeat(50)}\n`);
}

// Run the script
generateAllAudio().catch(console.error);
