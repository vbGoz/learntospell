// Word Club Spelling App - Unit Tests
// Run with: npm test

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

// Difficulty categories from the app
const CATEGORIES = {
    'very-easy': ['chair', 'brass', 'ready', 'scatter', 'gobble', 'eel', 'sizzle', 'Spanish', 'hornet', 'oval', 'plastic', 'mason', 'slander', 'evergreen', 'decompose', 'reasons', 'dismantle', 'glance', 'oath', 'sneakers', 'duets', 'cursive', 'pastel', 'hype', 'nestled', 'moderate', 'lantern', 'author', 'wily', 'veil', 'redress', 'cruiser', 'vitally', 'burrowed', 'pentagon', 'diagram', 'scrimmage', 'vulgar', 'resign', 'corrupt'],
    'easy': ['padlock', 'hangdog', 'mustiness', 'shrouded', 'mouthpiece', 'potency', 'quartz', 'tournament', 'clementine', 'signature', 'influence', 'snorkeling', 'citadel', 'achievements', 'appliances', 'badminton', 'gardenia', 'absorption', 'Pacific', 'affiliation', 'synopsis', 'coriander', 'purgatory', 'torpor', 'covetous', 'oppression', 'abysmal', 'precipice', 'purview', 'suburbia', 'construe', 'fettle', 'curriculum', 'deuce', 'berth', 'cyst', 'knavery', 'synonym', 'purloined'],
    'medium': ['marquee', 'traumatic', 'solemnly', 'ensemble', 'lye', 'lacrosse', 'cajolery', 'residuals', 'peroxide', 'apocalypse', 'barricade', 'anonymously', 'barrette', 'junket', 'Erie', 'silhouette', 'thesaurus', 'chandelier', 'concierge', 'hibiscus', 'maracas', 'burpees', 'piccolo', 'tulle', 'camphor', 'paparazzi', 'pogrom', 'sarsaparilla', 'cannelloni', 'bronchitis', 'diphtheria', 'corbels', 'Kilimanjaro', 'delectation', 'austerity', 'nascent', 'extremophile', 'monolithic', 'coven'],
    'medium-hard': ['substantially', 'formidable', 'compunction', 'hyperventilated', 'onslaught', 'misanthrope', 'cravenly', 'hypocritical', 'contentious', 'agribusiness', 'invective', 'emphatically', 'prognosticate', 'satisfice', 'nuptials', 'aquacade', 'assuage', 'ballistics', 'efficacy', 'dreidel', 'alacrity', 'elision', 'sanctimonious', 'heptathlon', 'tempera', 'mitosis', 'apologia', 'mesomorph', 'claustrophobia', 'glissade', 'antebellum', 'weir', 'sortie', 'protégé', 'maquisards', 'Charolais'],
    'hard': ['pâtisserie', 'compañero', 'pelota', 'eloge', 'mansard', 'ramate', 'paranephric', 'tontine', 'asyllabia', 'velodrome', 'dysplasia', 'Columbiad', 'terricolous', 'soporiferous', 'cyclopean', 'messianic', 'Austronesia', 'maxillary', 'Euclidean', 'archizoic', 'aphagia', 'persillade', 'capriccio', 'chitin', 'maisonette', 'maunaloa', 'hexastich', 'bathypelagic', 'syzygy', 'pharisaical', 'vicegerent', 'pince-nez', 'carotid', 'salaam', 'forzato'],
    'very-hard': ['covey', 'apartheid', 'kibbutz', 'putti', 'beignet', 'fricassee', 'abecedarius', 'collunarium', 'scamillus', 'buccinator', 'Tijuana', 'silenus', 'marcottage', 'schuss', 'bodegon', 'cri de coeur', 'chaise longue', 'tathagata', 'phalanstery', 'diapir', 'harmattan', 'farinha', 'shamiana', 'chautauqua', 'heishi', 'mostaccioli', 'baetyl', 'gardai', 'gelinotte', 'zamacueca', 'geländesprung', 'sittringee']
};

// Test helper functions
function filterWordsByDifficulty(words, difficulty) {
    if (difficulty === 'all') return words;
    return words.filter(w => (CATEGORIES[difficulty] || []).includes(w));
}

function checkSpelling(userInput, correctWord) {
    return userInput.toLowerCase().trim() === correctWord.toLowerCase();
}

function checkUnscramble(selectedLetters, correctWord) {
    const userWord = selectedLetters.join('');
    return userWord.toLowerCase() === correctWord.toLowerCase();
}

// Simple test framework
let passed = 0;
let failed = 0;

function test(description, fn) {
    try {
        fn();
        console.log(`✓ ${description}`);
        passed++;
    } catch (error) {
        console.log(`✗ ${description}`);
        console.log(`  ${error.message}`);
        failed++;
    }
}

function assertEqual(actual, expected, message) {
    if (actual !== expected) {
        throw new Error(message || `Expected ${expected}, got ${actual}`);
    }
}

function assertTrue(condition, message) {
    if (!condition) {
        throw new Error(message || 'Assertion failed');
    }
}

// ========== TESTS ==========

console.log('\n🧪 Running Word Club Spelling App Tests\n');

// Test 1: Word list parsing
test('Word list should contain exactly 221 words', () => {
    assertEqual(WORDS.length, 221, `Expected 221 words, got ${WORDS.length}`);
});

// Test 2: No duplicate words
test('Word list should have no duplicates', () => {
    const uniqueWords = new Set(WORDS);
    assertEqual(WORDS.length, uniqueWords.size, 'Found duplicate words in list');
});

// Test 3: No empty words
test('Word list should have no empty strings', () => {
    const emptyWords = WORDS.filter(w => !w || w.trim() === '');
    assertEqual(emptyWords.length, 0, `Found ${emptyWords.length} empty words`);
});

// Test 4: Filter by "all" returns all words
test('Filtering by "all" should return all 221 words', () => {
    const filtered = filterWordsByDifficulty(WORDS, 'all');
    assertEqual(filtered.length, 221);
});

// Test 5: Filter by very-easy
test('Filtering by "very-easy" should return 40 words', () => {
    const filtered = filterWordsByDifficulty(WORDS, 'very-easy');
    assertEqual(filtered.length, 40, `Expected 40 very-easy words, got ${filtered.length}`);
});

// Test 6: Filter by easy
test('Filtering by "easy" should return 39 words', () => {
    const filtered = filterWordsByDifficulty(WORDS, 'easy');
    assertEqual(filtered.length, 39, `Expected 39 easy words, got ${filtered.length}`);
});

// Test 7: Filter by medium
test('Filtering by "medium" should return 39 words', () => {
    const filtered = filterWordsByDifficulty(WORDS, 'medium');
    assertEqual(filtered.length, 39, `Expected 39 medium words, got ${filtered.length}`);
});

// Test 8: Filter by medium-hard
test('Filtering by "medium-hard" should return 36 words', () => {
    const filtered = filterWordsByDifficulty(WORDS, 'medium-hard');
    assertEqual(filtered.length, 36, `Expected 36 medium-hard words, got ${filtered.length}`);
});

// Test 9: Filter by hard
test('Filtering by "hard" should return 35 words', () => {
    const filtered = filterWordsByDifficulty(WORDS, 'hard');
    assertEqual(filtered.length, 35, `Expected 35 hard words, got ${filtered.length}`);
});

// Test 10: Filter by very-hard
test('Filtering by "very-hard" should return 32 words', () => {
    const filtered = filterWordsByDifficulty(WORDS, 'very-hard');
    assertEqual(filtered.length, 32, `Expected 32 very-hard words, got ${filtered.length}`);
});

// Test 11: All difficulty categories sum to 221
test('All difficulty categories should sum to 221 words', () => {
    const total = Object.values(CATEGORIES).reduce((sum, arr) => sum + arr.length, 0);
    assertEqual(total, 221, `Expected 221 total words across categories, got ${total}`);
});

// Test 12: Spelling check - correct (exact match)
test('Spelling check should pass for exact match', () => {
    assertTrue(checkSpelling('chair', 'chair'));
});

// Test 13: Spelling check - correct (case insensitive)
test('Spelling check should pass for case-insensitive match', () => {
    assertTrue(checkSpelling('CHAIR', 'chair'));
    assertTrue(checkSpelling('Chair', 'chair'));
    assertTrue(checkSpelling('chair', 'CHAIR'));
});

// Test 14: Spelling check - correct (with whitespace)
test('Spelling check should pass with extra whitespace', () => {
    assertTrue(checkSpelling('  chair  ', 'chair'));
    assertTrue(checkSpelling('chair   ', 'chair'));
    assertTrue(checkSpelling('   chair', 'chair'));
});

// Test 15: Spelling check - incorrect
test('Spelling check should fail for incorrect spelling', () => {
    assertTrue(!checkSpelling('chiar', 'chair'));
    assertTrue(!checkSpelling('char', 'chair'));
    assertTrue(!checkSpelling('share', 'chair'));
});

// Test 16: Spelling check - empty input
test('Spelling check should fail for empty input', () => {
    assertTrue(!checkSpelling('', 'chair'));
    assertTrue(!checkSpelling('   ', 'chair'));
});

// Test 17: Unscramble check - correct
test('Unscramble check should pass for correct word', () => {
    assertTrue(checkUnscramble(['c', 'h', 'a', 'i', 'r'], 'chair'));
});

// Test 18: Unscramble check - incorrect
test('Unscramble check should fail for incorrect word', () => {
    assertTrue(!checkUnscramble(['c', 'h', 'a', 'r', 'i'], 'chair'));
    assertTrue(!checkUnscramble(['c', 'h', 'a', 'i'], 'chair'));
});

// Test 19: Unscramble check - case insensitive
test('Unscramble check should be case insensitive', () => {
    assertTrue(checkUnscramble(['C', 'H', 'A', 'I', 'R'], 'chair'));
    assertTrue(checkUnscramble(['c', 'h', 'a', 'i', 'r'], 'CHAIR'));
});

// Test 20: Category membership - very-easy contains "chair"
test('Very-easy category should contain "chair"', () => {
    assertTrue(CATEGORIES['very-easy'].includes('chair'));
});

// Test 21: Category membership - very-hard contains "geländesprung"
test('Very-hard category should contain "geländesprung"', () => {
    assertTrue(CATEGORIES['very-hard'].includes('geländesprung'));
});

// Test 22: All category words exist in main word list
test('All words in categories should exist in main word list', () => {
    for (const [difficulty, words] of Object.entries(CATEGORIES)) {
        for (const word of words) {
            assertTrue(
                WORDS.includes(word),
                `Word "${word}" in ${difficulty} category not found in main word list`
            );
        }
    }
});

// Test 23: No word appears in multiple categories
test('No word should appear in multiple difficulty categories', () => {
    const allCategoryWords = {};
    for (const [difficulty, words] of Object.entries(CATEGORIES)) {
        for (const word of words) {
            if (allCategoryWords[word]) {
                throw new Error(`Word "${word}" appears in both ${allCategoryWords[word]} and ${difficulty}`);
            }
            allCategoryWords[word] = difficulty;
        }
    }
});

// Test 24: Special characters in words
test('App should handle words with special characters', () => {
    assertTrue(WORDS.includes('pâtisserie'), 'Should include pâtisserie');
    assertTrue(WORDS.includes('compañero'), 'Should include compañero');
    assertTrue(WORDS.includes('geländesprung'), 'Should include geländesprung');
    assertTrue(WORDS.includes('protégé'), 'Should include protégé');
});

// Test 25: Multi-word phrases
test('App should handle multi-word phrases', () => {
    assertTrue(WORDS.includes('cri de coeur'), 'Should include cri de coeur');
    assertTrue(WORDS.includes('chaise longue'), 'Should include chaise longue');
});

// ========== RESULTS ==========

console.log(`\n${'='.repeat(50)}`);
console.log(`Test Results: ${passed} passed, ${failed} failed`);
console.log(`${'='.repeat(50)}\n`);

if (failed > 0) {
    console.log('❌ Some tests failed!\n');
    process.exit(1);
} else {
    console.log('✅ All tests passed!\n');
    process.exit(0);
}
