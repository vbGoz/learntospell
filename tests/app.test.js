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

// localStorage utility functions (from app)
function getDefaultUserData() {
    return {
        settings: {
            difficulty: 'all'
        },
        stats: {
            totalWordsAttempted: 0,
            totalCorrect: 0,
            bestStreak: 0,
            sessionCount: 1,
            lastPlayed: new Date().toISOString()
        },
        wordHistory: {},
        achievements: []
    };
}

function updateWordHistory(userData, word, isCorrect) {
    const wordHistory = { ...userData.wordHistory };
    if (!wordHistory[word]) {
        wordHistory[word] = { attempts: 0, correct: 0, lastAttempt: null };
    }
    wordHistory[word].attempts += 1;
    if (isCorrect) {
        wordHistory[word].correct += 1;
    }
    wordHistory[word].lastAttempt = new Date().toISOString();
    return wordHistory;
}

function getMissedWords(userData, allWords) {
    return allWords.filter(word => {
        const history = userData.wordHistory[word];
        if (!history || history.attempts === 0) return false;
        const accuracy = history.correct / history.attempts;
        return accuracy < 0.5;
    });
}

function getMasteryStats(userData, allWords) {
    let mastered = 0;
    let practiced = 0;
    let needsPractice = 0;

    allWords.forEach(word => {
        const history = userData.wordHistory[word];
        if (!history || history.attempts === 0) return;

        practiced++;
        const accuracy = history.correct / history.attempts;

        if (accuracy >= 0.8 && history.correct >= 3) {
            mastered++;
        } else if (accuracy < 0.5) {
            needsPractice++;
        }
    });

    return {
        mastered,
        practiced,
        needsPractice,
        notPracticed: allWords.length - practiced
    };
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

// ========== localStorage & PERSISTENCE TESTS ==========

// Test 26: getDefaultUserData returns correct structure
test('getDefaultUserData should return valid default structure', () => {
    const data = getDefaultUserData();
    assertTrue(data.settings !== undefined, 'Should have settings');
    assertTrue(data.stats !== undefined, 'Should have stats');
    assertTrue(data.wordHistory !== undefined, 'Should have wordHistory');
    assertTrue(data.achievements !== undefined, 'Should have achievements');
    assertEqual(data.settings.difficulty, 'all');
    assertEqual(data.stats.totalWordsAttempted, 0);
    assertEqual(data.stats.totalCorrect, 0);
    assertEqual(data.stats.bestStreak, 0);
});

// Test 27: updateWordHistory creates new entry for first attempt
test('updateWordHistory should create new word entry on first attempt', () => {
    const userData = getDefaultUserData();
    const newHistory = updateWordHistory(userData, 'chair', true);

    assertTrue(newHistory['chair'] !== undefined, 'Should create chair entry');
    assertEqual(newHistory['chair'].attempts, 1);
    assertEqual(newHistory['chair'].correct, 1);
    assertTrue(newHistory['chair'].lastAttempt !== null);
});

// Test 28: updateWordHistory increments attempts
test('updateWordHistory should increment attempts correctly', () => {
    const userData = getDefaultUserData();
    let newHistory = updateWordHistory(userData, 'chair', true);
    userData.wordHistory = newHistory;
    newHistory = updateWordHistory(userData, 'chair', false);

    assertEqual(newHistory['chair'].attempts, 2);
    assertEqual(newHistory['chair'].correct, 1);
});

// Test 29: updateWordHistory tracks correct answers
test('updateWordHistory should track correct answers', () => {
    const userData = getDefaultUserData();
    let newHistory = updateWordHistory(userData, 'chair', true);
    userData.wordHistory = newHistory;
    newHistory = updateWordHistory(userData, 'chair', true);
    userData.wordHistory = newHistory;
    newHistory = updateWordHistory(userData, 'chair', true);

    assertEqual(newHistory['chair'].attempts, 3);
    assertEqual(newHistory['chair'].correct, 3);
});

// Test 30: getMissedWords returns empty array for new user
test('getMissedWords should return empty array for new user', () => {
    const userData = getDefaultUserData();
    const missed = getMissedWords(userData, WORDS);
    assertEqual(missed.length, 0);
});

// Test 31: getMissedWords identifies word with 0% accuracy
test('getMissedWords should identify word with 0% accuracy', () => {
    const userData = getDefaultUserData();
    userData.wordHistory = {
        'chair': { attempts: 2, correct: 0, lastAttempt: new Date().toISOString() }
    };
    const missed = getMissedWords(userData, ['chair', 'brass']);
    assertEqual(missed.length, 1);
    assertEqual(missed[0], 'chair');
});

// Test 32: getMissedWords identifies word with <50% accuracy
test('getMissedWords should identify word with <50% accuracy', () => {
    const userData = getDefaultUserData();
    userData.wordHistory = {
        'chair': { attempts: 3, correct: 1, lastAttempt: new Date().toISOString() }
    };
    const missed = getMissedWords(userData, ['chair', 'brass']);
    assertEqual(missed.length, 1);
    assertTrue(missed.includes('chair'));
});

// Test 33: getMissedWords excludes word with 50% accuracy
test('getMissedWords should exclude word with 50% accuracy', () => {
    const userData = getDefaultUserData();
    userData.wordHistory = {
        'chair': { attempts: 2, correct: 1, lastAttempt: new Date().toISOString() }
    };
    const missed = getMissedWords(userData, ['chair', 'brass']);
    assertEqual(missed.length, 0);
});

// Test 34: getMissedWords excludes word with 100% accuracy
test('getMissedWords should exclude word with 100% accuracy', () => {
    const userData = getDefaultUserData();
    userData.wordHistory = {
        'chair': { attempts: 3, correct: 3, lastAttempt: new Date().toISOString() }
    };
    const missed = getMissedWords(userData, ['chair', 'brass']);
    assertEqual(missed.length, 0);
});

// Test 35: getMissedWords handles multiple words
test('getMissedWords should handle multiple words correctly', () => {
    const userData = getDefaultUserData();
    userData.wordHistory = {
        'chair': { attempts: 3, correct: 1, lastAttempt: new Date().toISOString() },
        'brass': { attempts: 2, correct: 0, lastAttempt: new Date().toISOString() },
        'ready': { attempts: 4, correct: 4, lastAttempt: new Date().toISOString() }
    };
    const missed = getMissedWords(userData, ['chair', 'brass', 'ready']);
    assertEqual(missed.length, 2);
    assertTrue(missed.includes('chair'));
    assertTrue(missed.includes('brass'));
    assertTrue(!missed.includes('ready'));
});

// Test 36: getMasteryStats returns zeros for new user
test('getMasteryStats should return all zeros for new user', () => {
    const userData = getDefaultUserData();
    const stats = getMasteryStats(userData, WORDS);
    assertEqual(stats.mastered, 0);
    assertEqual(stats.practiced, 0);
    assertEqual(stats.needsPractice, 0);
    assertEqual(stats.notPracticed, 221);
});

// Test 37: getMasteryStats identifies mastered word
test('getMasteryStats should identify mastered word (80%+ accuracy, 3+ correct)', () => {
    const userData = getDefaultUserData();
    userData.wordHistory = {
        'chair': { attempts: 4, correct: 4, lastAttempt: new Date().toISOString() }
    };
    const stats = getMasteryStats(userData, WORDS);
    assertEqual(stats.mastered, 1);
    assertEqual(stats.practiced, 1);
    assertEqual(stats.needsPractice, 0);
    assertEqual(stats.notPracticed, 220);
});

// Test 38: getMasteryStats requires 3+ correct for mastery
test('getMasteryStats should require at least 3 correct answers for mastery', () => {
    const userData = getDefaultUserData();
    userData.wordHistory = {
        'chair': { attempts: 2, correct: 2, lastAttempt: new Date().toISOString() }
    };
    const stats = getMasteryStats(userData, WORDS);
    assertEqual(stats.mastered, 0, 'Should not count as mastered with only 2 correct');
    assertEqual(stats.practiced, 1);
});

// Test 39: getMasteryStats requires 80%+ accuracy for mastery
test('getMasteryStats should require 80%+ accuracy for mastery', () => {
    const userData = getDefaultUserData();
    userData.wordHistory = {
        'chair': { attempts: 5, correct: 3, lastAttempt: new Date().toISOString() }
    };
    const stats = getMasteryStats(userData, WORDS);
    assertEqual(stats.mastered, 0, 'Should not count as mastered with 60% accuracy');
    assertEqual(stats.practiced, 1);
});

// Test 40: getMasteryStats identifies words needing practice
test('getMasteryStats should identify words needing practice (<50% accuracy)', () => {
    const userData = getDefaultUserData();
    userData.wordHistory = {
        'chair': { attempts: 3, correct: 1, lastAttempt: new Date().toISOString() }
    };
    const stats = getMasteryStats(userData, WORDS);
    assertEqual(stats.needsPractice, 1);
    assertEqual(stats.mastered, 0);
    assertEqual(stats.practiced, 1);
});

// Test 41: getMasteryStats handles mixed progress
test('getMasteryStats should handle mixed progress correctly', () => {
    const userData = getDefaultUserData();
    userData.wordHistory = {
        'chair': { attempts: 5, correct: 5, lastAttempt: new Date().toISOString() },
        'brass': { attempts: 4, correct: 2, lastAttempt: new Date().toISOString() },
        'ready': { attempts: 3, correct: 1, lastAttempt: new Date().toISOString() },
        'scatter': { attempts: 4, correct: 4, lastAttempt: new Date().toISOString() }
    };
    const stats = getMasteryStats(userData, WORDS);
    assertEqual(stats.mastered, 2, 'chair and scatter should be mastered');
    assertEqual(stats.practiced, 4);
    assertEqual(stats.needsPractice, 1, 'ready should need practice');
    assertEqual(stats.notPracticed, 217);
});

// Test 42: Accuracy calculation edge case - 1 attempt, 1 correct = 100%
test('Single correct attempt should count as 100% accuracy', () => {
    const userData = getDefaultUserData();
    userData.wordHistory = {
        'chair': { attempts: 1, correct: 1, lastAttempt: new Date().toISOString() }
    };
    const missed = getMissedWords(userData, ['chair']);
    assertEqual(missed.length, 0, 'Should not be in missed words');
});

// Test 43: Accuracy calculation edge case - 1 attempt, 0 correct = 0%
test('Single incorrect attempt should count as 0% accuracy', () => {
    const userData = getDefaultUserData();
    userData.wordHistory = {
        'chair': { attempts: 1, correct: 0, lastAttempt: new Date().toISOString() }
    };
    const missed = getMissedWords(userData, ['chair']);
    assertEqual(missed.length, 1, 'Should be in missed words');
});

// Test 44: getMasteryStats boundary test - exactly 80% with 3 correct
test('getMasteryStats should count exactly 80% with 3+ correct as mastered', () => {
    const userData = getDefaultUserData();
    userData.wordHistory = {
        'chair': { attempts: 5, correct: 4, lastAttempt: new Date().toISOString() }
    };
    const stats = getMasteryStats(userData, WORDS);
    assertEqual(stats.mastered, 1, '80% accuracy with 4 correct should be mastered');
});

// Test 45: getMasteryStats boundary test - exactly 50% accuracy
test('getMasteryStats should not count exactly 50% as needing practice', () => {
    const userData = getDefaultUserData();
    userData.wordHistory = {
        'chair': { attempts: 4, correct: 2, lastAttempt: new Date().toISOString() }
    };
    const stats = getMasteryStats(userData, WORDS);
    assertEqual(stats.needsPractice, 0, '50% accuracy should not need practice');
    assertEqual(stats.practiced, 1);
});

// Test 46: Integration test - realistic practice session
test('Integration: Realistic practice session should update stats correctly', () => {
    let userData = getDefaultUserData();

    // Practice session: 10 words, 7 correct, 3 incorrect
    const words = ['chair', 'brass', 'ready', 'scatter', 'gobble', 'eel', 'sizzle', 'Spanish', 'hornet', 'oval'];
    const results = [true, true, false, true, true, false, true, true, false, true];

    words.forEach((word, i) => {
        userData.wordHistory = updateWordHistory(userData, word, results[i]);
        userData.stats.totalWordsAttempted++;
        if (results[i]) userData.stats.totalCorrect++;
    });

    assertEqual(userData.stats.totalWordsAttempted, 10);
    assertEqual(userData.stats.totalCorrect, 7);

    const stats = getMasteryStats(userData, WORDS);
    assertEqual(stats.practiced, 10);
    assertEqual(stats.mastered, 0, 'No words mastered with only 1 attempt each');

    const missed = getMissedWords(userData, WORDS);
    assertEqual(missed.length, 3, 'Should have 3 missed words (0% accuracy)');
});

// Test 47: Integration test - path to mastery
test('Integration: Path to mastery should work correctly', () => {
    let userData = getDefaultUserData();

    // Practice "chair" until mastered
    for (let i = 0; i < 5; i++) {
        userData.wordHistory = updateWordHistory(userData, 'chair', true);
    }

    const stats = getMasteryStats(userData, WORDS);
    assertEqual(stats.mastered, 1, 'Should have mastered "chair"');
    assertEqual(stats.practiced, 1);

    const missed = getMissedWords(userData, WORDS);
    assertEqual(missed.length, 0, 'Should have no missed words');
});

// Test 48: Edge case - word not in history should not appear in missed words
test('Words not attempted should not appear in missed words', () => {
    const userData = getDefaultUserData();
    userData.wordHistory = {
        'chair': { attempts: 0, correct: 0, lastAttempt: null }
    };
    const missed = getMissedWords(userData, WORDS);
    assertEqual(missed.length, 0);
});

// Test 49: Data structure validation
test('userData structure should match schema', () => {
    const userData = getDefaultUserData();

    // Check settings
    assertTrue(typeof userData.settings === 'object');
    assertTrue(typeof userData.settings.difficulty === 'string');

    // Check stats
    assertTrue(typeof userData.stats === 'object');
    assertTrue(typeof userData.stats.totalWordsAttempted === 'number');
    assertTrue(typeof userData.stats.totalCorrect === 'number');
    assertTrue(typeof userData.stats.bestStreak === 'number');
    assertTrue(typeof userData.stats.sessionCount === 'number');
    assertTrue(typeof userData.stats.lastPlayed === 'string');

    // Check collections
    assertTrue(typeof userData.wordHistory === 'object');
    assertTrue(Array.isArray(userData.achievements));
});

// Test 50: Performance test - getMissedWords with all 221 words
test('Performance: getMissedWords should handle all 221 words efficiently', () => {
    const userData = getDefaultUserData();

    // Create history for all words with varying accuracy
    WORDS.forEach((word, i) => {
        const accuracy = i % 3; // 0, 1, or 2
        userData.wordHistory[word] = {
            attempts: 3,
            correct: accuracy,
            lastAttempt: new Date().toISOString()
        };
    });

    const startTime = Date.now();
    const missed = getMissedWords(userData, WORDS);
    const endTime = Date.now();

    assertTrue(endTime - startTime < 100, 'Should complete in less than 100ms');
    assertTrue(missed.length > 0, 'Should find some missed words');
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
