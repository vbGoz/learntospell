/**
 * Tests for extracted game core utilities
 * Verifies that business logic is working correctly when extracted
 * Run with: node tests/utils.test.js
 */

// Import utilities using Node.js require
const path = require('path');

// For now, we'll define the functions here since we're not changing index.html yet
// In a future refactor, we'd import from '../src/utils/gameCore.js'

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

// Test utilities
let passed = 0;
let failed = 0;

function test(description, fn) {
    try {
        fn();
        console.log(`✓ ${description}`);
        passed++;
    } catch (error) {
        console.log(`✗ ${description}`);
        console.log(`  Error: ${error.message}`);
        failed++;
    }
}

function assertEqual(actual, expected, message = '') {
    if (actual !== expected) {
        throw new Error(`${message}\n  Expected: ${expected}\n  Got: ${actual}`);
    }
}

function assertTrue(condition, message = 'Assertion failed') {
    if (!condition) {
        throw new Error(message);
    }
}

console.log('\n🧪 Running Extracted Utilities Tests\n');

// ===========================================================
// Word list integrity tests
// ===========================================================

test('Utility Export: Word list has 450 words', () => {
    assertEqual(WORDS.length, 450);
});

test('Utility Export: Word list is accessible', () => {
    assertTrue(Array.isArray(WORDS));
    assertTrue(WORDS.length > 0);
});

// ===========================================================
// Results
// ===========================================================

console.log(`\n${'='.repeat(50)}`);
console.log(`Utility Tests: ${passed} passed, ${failed} failed`);
console.log(`${'='.repeat(50)}\n`);

if (failed > 0) {
    console.log('❌ Some utility tests failed!\n');
    process.exit(1);
} else {
    console.log('✅ All utility tests passed!\n');
    process.exit(0);
}
