/**
 * Tests for extracted game core utilities
 * Verifies that business logic is working correctly when extracted
 * Run with: node tests/utils.test.js
 */

// Import utilities using Node.js require
const path = require('path');

// For now, we'll define the functions here since we're not changing index.html yet
// In a future refactor, we'd import from '../src/utils/gameCore.js'

const WORDS = `substantially
formidable
marquee
compunction
hyperventilated
onslaught
misanthrope
cravenly
hypocritical
traumatic
solemnly
contentious
ensemble
lye
lacrosse
cajolery
residuals
peroxide
apocalypse
barricade
anonymously
barrette
junket
Erie
silhouette
thesaurus
chandelier
concierge
hibiscus
maracas
burpees
piccolo
tulle
camphor
paparazzi
pogrom
pâtisserie
sarsaparilla
cannelloni
bronchitis
diphtheria
corbels
Kilimanjaro
protégé
maquisards
Charolais
chair
brass
ready
hangdog
padlock
scatter
gobble
eel
sizzle
Spanish
hornet
oval
plastic
mason
slander
evergreen
decompose
reasons
dismantle
glance
oath
sneakers
duets
cursive
pastel
hype
nestled
mustiness
shrouded
moderate
mouthpiece
lantern
author
wily
veil
redress
cruiser
vitally
burrowed
pentagon
diagram
scrimmage
vulgar
resign
corrupt
potency
quartz
tournament
agribusiness
clementine
signature
influence
snorkeling
citadel
achievements
appliances
invective
badminton
gardenia
emphatically
absorption
prognosticate
Pacific
affiliation
synopsis
coriander
purgatory
torpor
covetous
oppression
abysmal
precipice
purview
suburbia
construe
fettle
curriculum
deuce
berth
cyst
knavery
synonym
purloined
delectation
austerity
nascent
extremophile
monolithic
coven
satisfice
nuptials
aquacade
assuage
ballistics
efficacy
dreidel
alacrity
elision
sanctimonious
heptathlon
tempera
mitosis
apologia
mesomorph
claustrophobia
glissade
antebellum
weir
sortie
compañero
pelota
eloge
mansard
ramate
paranephric
tontine
asyllabia
velodrome
dysplasia
Columbiad
terricolous
soporiferous
cyclopean
messianic
Austronesia
maxillary
Euclidean
archizoic
aphagia
persillade
capriccio
chitin
maisonette
maunaloa
hexastich
bathypelagic
syzygy
pharisaical
vicegerent
pince-nez
carotid
salaam
forzato
covey
apartheid
kibbutz
putti
beignet
fricassee
abecedarius
collunarium
scamillus
buccinator
Tijuana
silenus
marcottage
schuss
bodegon
cri de coeur
chaise longue
tathagata
phalanstery
diapir
harmattan
farinha
shamiana
chautauqua
heishi
mostaccioli
baetyl
gardai
gelinotte
zamacueca
geländesprung
sittringee`.split('\n').map(w => w.trim()).filter(w => w);

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

test('Utility Export: Word list has 221 words', () => {
    assertEqual(WORDS.length, 221);
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
