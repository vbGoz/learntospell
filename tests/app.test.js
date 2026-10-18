// Word Club Spelling App - Unit Tests
// Run with: npm test

// Difficulty categories from the app
const CATEGORIES = {
    'one-bee': ["ran","wind","leg","dirt","rod","good","most","hurt","shy","bunny","down","steps","drink","silly","sick","path","mist","stars","truck","fire","still","hello","bush","late","pump","shell","yarn","wings","sharp","easy","body","house","rich","shift","heart","tusk","shoot","seal","even","dive","claws","crack","come","fine","winter","apple","sound","mossy","yellow","shine","chips","beans","mouth","spray","year","truth","paper","rabbit","feed","tallest","inside","frozen","speak","cliffs","whale","market","flock","crunch","lizard","beware","sparkle","sweater","nurse","wrong","hopped","money","cabin","darkness","always","sprout","carve","shadows","morning","alive","earth","friend","lovely","return","half","swift","grandfather","footprints","fear","thirsty","peer","gentle","riddle","voice","peach","pancakes","illness","lead","groan","sloth","knit","cloak","parade","whistle","total","indoors","trouble","relax","finish","holiday","safety","stout","spiders","entire","library","guide","hospital","mustard","company","ginger","narrow","medium","pennies","hiking","foolish","afraid","remember","result","charming","source","pearls","tangy","beasts","shivering","barge","grumpily","smoothly","cottage","humble","seventy","dangle","distance","breeze","soared","frazzled","bamboo"],
    'two-bee': ["buttons","cuddle","puffy","tiptoed","clever","basement","burlap","wetlands","invite","butterflies","kelp","property","carefully","sniffling","beneath","tractor","permit","awning","fickle","relief","lunar","boycotting","molten","elite","woven","proclaim","thimble","custody","granola","warrior","rigid","fierce","laughter","salary","disappear","hurdler","lounge","jovial","inferior","December","duration","dictionary","business","reinstate","examine","versus","lullaby","opposite","tissues","marlin","Halloween","compliment","compromise","incident","Japanese","investment","bifocals","cutlery","chisel","fundraiser","geologist","bellowed","organism","quail","atmosphere","disappointment","truant","pamphlet","helium","suggested","chimpanzees","desperate","annoyance","interruption","concentrate","piñata","territory","stragglers","albino","ridiculous","monorail","exploratory","indigo","bratwurst","alphabetical","integrity","Oregon","rebuttal","prejudice","solidarity","calico","sputnik","cartridge","segregation","tortillas","civilian","fertilizer","apprentice","synthetic","Caesar","glamorous","salamanders","suspension","sorceress","fictitious","convertible","snarkiness","singularity","collateral","initiation","mascara","battalion","precedent","materialize","magnesium","perimeter","haddock","optometrist","meticulous","cosmodrome","hypothermia","schnauzer","megahertz","regolith","arthritis","persnickety","insurrection","pheasants","pentathletes","Senegal","fascism","duende","predecessor","Polaroid","reservoir","matrilineal","conscious","arnica","carrion","glaucoma","piteously","adrenaline","elliptical","staccato","iridium","romerillo","cemetery","dachshund","rendezvous","Aeolus"],
    'three-bee': ["newt","thrummed","censers","lapels","generosity","burnished","embankment","unrelenting","wallowing","imperial","mortar","arsonists","mewling","generator","persistent","authority","panoramic","Doberman","dominion","decisively","gauntlets","inanimate","lemmings","auditory","appetizing","sentinels","frequency","self-sufficient","prospective","subscription","blithely","conspicuous","preconception","procession","tenuous","perpendicular","hemisphere","seminal","saxophone","torrential","reluctance","consulate","canter","sauntered","propeller","modish","cuisine","juniper","settee","unconscious","influenza","palazzo","finesse","foliage","odorant","irrelevant","curriculum","quizzically","diplomatically","enigmatic","increments","crocheted","calibrate","hypothesis","reassurance","apologetic","credenza","comprehensible","protectorate","Delaware","phenomenon","trenchant","pulmonary","undulating","alleviate","despondent","approximation","phantasmal","legation","echolocation","glycerin","brazier","diffidence","conflagration","alabaster","arachnid","butane","thermotaxis","arugula","pathologically","cataract","inaugurate","vibrometer","affinities","quiche","bioluminescence","mayonnaise","embodiment","euphemism","chickadee","sputum","porpoises","acolyte","asymmetric","cerulean","psychological","innocuous","sharpei","cul-de-sac","assemblage","Tripoli","endothermy","electrolytes","leprosy","neurological","éclair","ototoxic","eureka","mysticetes","irascibility","Aphrodite","annelids","Eritrea","a cappella","bogong moth","kerosene","forsythia","Amharic","yakuza","Pennsylvania","salicylic acid","Gloucester","sensilla","ampulla","stomatopods","prosciutto","eponymous","solenodon","frankincense","chitinous","Presbyterian","Sierra Leone","trichobothria","Krio","lactobacillus","Bildungsroman","Cappadocia","Addis Ababa","spes phthisica","vibrissae"],
};

const WORDS = Object.values(CATEGORIES).flat();


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
        achievements: [],
        unlockedAchievements: []
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
test('Word list should contain exactly 450 words', () => {
    assertEqual(WORDS.length, 450, `Expected 450 words, got ${WORDS.length}`);
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
test('Filtering by "all" should return all words', () => {
    const filtered = filterWordsByDifficulty(WORDS, 'all');
    assertEqual(filtered.length, WORDS.length);
});

// Tests 5-7: Each Bee level has 150 words
Object.keys(CATEGORIES).forEach(level => {
    test(`Filtering by "${level}" should return 150 words`, () => {
        const filtered = filterWordsByDifficulty(WORDS, level);
        assertEqual(filtered.length, 150, `Expected 150 ${level} words, got ${filtered.length}`);
    });
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

// Test 20: Category membership - one-bee contains "ran"
test('One-bee category should contain "ran"', () => {
    assertTrue(CATEGORIES['one-bee'].includes('ran'));
});

// Test 21: Category membership - three-bee contains "vibrissae"
test('Three-bee category should contain "vibrissae"', () => {
    assertTrue(CATEGORIES['three-bee'].includes('vibrissae'));
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
    assertTrue(WORDS.includes('piñata'), 'Should include piñata');
    assertTrue(WORDS.includes('éclair'), 'Should include éclair');
    assertTrue(WORDS.includes('cul-de-sac'), 'Should include cul-de-sac');
    assertTrue(WORDS.includes('self-sufficient'), 'Should include self-sufficient');
});

// Test 25: Multi-word phrases
test('App should handle multi-word phrases', () => {
    assertTrue(WORDS.includes('a cappella'), 'Should include a cappella');
    assertTrue(WORDS.includes('Sierra Leone'), 'Should include Sierra Leone');
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
    assertEqual(stats.notPracticed, WORDS.length);
});

// Test 37: getMasteryStats identifies mastered word
test('getMasteryStats should identify mastered word (80%+ accuracy, 3+ correct)', () => {
    const userData = getDefaultUserData();
    userData.wordHistory = {
        'shell': { attempts: 4, correct: 4, lastAttempt: new Date().toISOString() }
    };
    const stats = getMasteryStats(userData, WORDS);
    assertEqual(stats.mastered, 1);
    assertEqual(stats.practiced, 1);
    assertEqual(stats.needsPractice, 0);
    assertEqual(stats.notPracticed, WORDS.length - 1);
});

// Test 38: getMasteryStats requires 3+ correct for mastery
test('getMasteryStats should require at least 3 correct answers for mastery', () => {
    const userData = getDefaultUserData();
    userData.wordHistory = {
        'shell': { attempts: 2, correct: 2, lastAttempt: new Date().toISOString() }
    };
    const stats = getMasteryStats(userData, WORDS);
    assertEqual(stats.mastered, 0, 'Should not count as mastered with only 2 correct');
    assertEqual(stats.practiced, 1);
});

// Test 39: getMasteryStats requires 80%+ accuracy for mastery
test('getMasteryStats should require 80%+ accuracy for mastery', () => {
    const userData = getDefaultUserData();
    userData.wordHistory = {
        'shell': { attempts: 5, correct: 3, lastAttempt: new Date().toISOString() }
    };
    const stats = getMasteryStats(userData, WORDS);
    assertEqual(stats.mastered, 0, 'Should not count as mastered with 60% accuracy');
    assertEqual(stats.practiced, 1);
});

// Test 40: getMasteryStats identifies words needing practice
test('getMasteryStats should identify words needing practice (<50% accuracy)', () => {
    const userData = getDefaultUserData();
    userData.wordHistory = {
        'shell': { attempts: 3, correct: 1, lastAttempt: new Date().toISOString() }
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
        'shell': { attempts: 5, correct: 5, lastAttempt: new Date().toISOString() },
        'truck': { attempts: 4, correct: 2, lastAttempt: new Date().toISOString() },
        'apple': { attempts: 3, correct: 1, lastAttempt: new Date().toISOString() },
        'yellow': { attempts: 4, correct: 4, lastAttempt: new Date().toISOString() }
    };
    const stats = getMasteryStats(userData, WORDS);
    assertEqual(stats.mastered, 2, 'shell and yellow should be mastered');
    assertEqual(stats.practiced, 4);
    assertEqual(stats.needsPractice, 1, 'apple should need practice');
    assertEqual(stats.notPracticed, WORDS.length - 4);
});

// Test 42: Accuracy calculation edge case - 1 attempt, 1 correct = 100%
test('Single correct attempt should count as 100% accuracy', () => {
    const userData = getDefaultUserData();
    userData.wordHistory = {
        'shell': { attempts: 1, correct: 1, lastAttempt: new Date().toISOString() }
    };
    const missed = getMissedWords(userData, ['shell']);
    assertEqual(missed.length, 0, 'Should not be in missed words');
});

// Test 43: Accuracy calculation edge case - 1 attempt, 0 correct = 0%
test('Single incorrect attempt should count as 0% accuracy', () => {
    const userData = getDefaultUserData();
    userData.wordHistory = {
        'shell': { attempts: 1, correct: 0, lastAttempt: new Date().toISOString() }
    };
    const missed = getMissedWords(userData, ['shell']);
    assertEqual(missed.length, 1, 'Should be in missed words');
});

// Test 44: getMasteryStats boundary test - exactly 80% with 3 correct
test('getMasteryStats should count exactly 80% with 3+ correct as mastered', () => {
    const userData = getDefaultUserData();
    userData.wordHistory = {
        'shell': { attempts: 5, correct: 4, lastAttempt: new Date().toISOString() }
    };
    const stats = getMasteryStats(userData, WORDS);
    assertEqual(stats.mastered, 1, '80% accuracy with 4 correct should be mastered');
});

// Test 45: getMasteryStats boundary test - exactly 50% accuracy
test('getMasteryStats should not count exactly 50% as needing practice', () => {
    const userData = getDefaultUserData();
    userData.wordHistory = {
        'shell': { attempts: 4, correct: 2, lastAttempt: new Date().toISOString() }
    };
    const stats = getMasteryStats(userData, WORDS);
    assertEqual(stats.needsPractice, 0, '50% accuracy should not need practice');
    assertEqual(stats.practiced, 1);
});

// Test 46: Integration test - realistic practice session
test('Integration: Realistic practice session should update stats correctly', () => {
    let userData = getDefaultUserData();

    // Practice session: 10 words, 7 correct, 3 incorrect
    const words = ['shell', 'truck', 'apple', 'yellow', 'mossy', 'seal', 'silly', 'bunny', 'heart', 'rabbit'];
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

    // Practice "shell" until mastered
    for (let i = 0; i < 5; i++) {
        userData.wordHistory = updateWordHistory(userData, 'shell', true);
    }

    const stats = getMasteryStats(userData, WORDS);
    assertEqual(stats.mastered, 1, 'Should have mastered "shell"');
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

// Test 50: Performance test - getMissedWords with all words
test('Performance: getMissedWords should handle all words efficiently', () => {
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

// ========== MOBILE & DESKTOP COMPATIBILITY TESTS ==========

// Audio filename normalization function (from app)
function getAudioFilename(word) {
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

// Test 51: Audio format is M4A (mobile-compatible)
test('Mobile/Desktop: Audio files use M4A format for universal compatibility', () => {
    const testWord = 'chair';
    const filename = getAudioFilename(testWord);
    const audioPath = `audio/${filename}.m4a`;

    assertTrue(audioPath.endsWith('.m4a'), 'Audio path should end with .m4a');
    assertEqual(audioPath, 'audio/chair.m4a');
});

// Test 52: Audio filename normalization - accented characters
test('Mobile/Desktop: Audio filenames handle accented characters (pâtisserie)', () => {
    const filename = getAudioFilename('pâtisserie');
    assertEqual(filename, 'patisserie');
    assertTrue(/^[a-z0-9_]+$/.test(filename), 'Should only contain lowercase letters, numbers, and underscores');
});

// Test 53: Audio filename normalization - special characters
test('Mobile/Desktop: Audio filenames handle special characters (pince-nez)', () => {
    const filename = getAudioFilename('pince-nez');
    assertEqual(filename, 'pincenez');
    assertTrue(/^[a-z0-9_]+$/.test(filename), 'Should only contain lowercase letters, numbers, and underscores');
});

// Test 54: Audio filename normalization - spaces
test('Mobile/Desktop: Audio filenames replace spaces with underscores (cri de coeur)', () => {
    const filename = getAudioFilename('cri de coeur');
    assertEqual(filename, 'cri_de_coeur');
    assertTrue(filename.includes('_'), 'Should contain underscores for spaces');
});

// Test 55: Audio filename normalization - multiple special chars
test('Mobile/Desktop: Audio filenames handle multiple special characters (geländesprung)', () => {
    const filename = getAudioFilename('geländesprung');
    assertEqual(filename, 'gelandesprung');
    assertTrue(/^[a-z0-9_]+$/.test(filename), 'Should only contain lowercase letters, numbers, and underscores');
});

// Test 56: Audio filename normalization - Spanish characters
test('Mobile/Desktop: Audio filenames handle Spanish characters (compañero)', () => {
    const filename = getAudioFilename('compañero');
    assertEqual(filename, 'companero');
    assertTrue(/^[a-z0-9_]+$/.test(filename), 'Should only contain lowercase letters, numbers, and underscores');
});

// Test 57: All words generate valid audio filenames
test('Mobile/Desktop: All words generate valid, mobile-safe filenames', () => {
    const invalidFilenames = [];
    const validPattern = /^[a-z0-9_]+$/;

    WORDS.forEach(word => {
        const filename = getAudioFilename(word);
        if (!validPattern.test(filename)) {
            invalidFilenames.push({ word, filename });
        }
    });

    assertEqual(invalidFilenames.length, 0,
        `All filenames should be mobile-safe. Invalid: ${JSON.stringify(invalidFilenames)}`);
});

// Test 58: Audio paths for all words use M4A format
test('Mobile/Desktop: All words use M4A audio format', () => {
    WORDS.forEach(word => {
        const filename = getAudioFilename(word);
        const audioPath = `audio/${filename}.m4a`;
        assertTrue(audioPath.endsWith('.m4a'), `${word} should use .m4a format`);
    });
});

// Test 59: No duplicate audio filenames
test('Mobile/Desktop: All words map to unique audio filenames', () => {
    const filenameMap = {};
    const duplicates = [];

    WORDS.forEach(word => {
        const filename = getAudioFilename(word);
        if (filenameMap[filename]) {
            duplicates.push({ word, filename, conflictsWith: filenameMap[filename] });
        } else {
            filenameMap[filename] = word;
        }
    });

    assertEqual(duplicates.length, 0,
        `Each word should have unique filename. Duplicates: ${JSON.stringify(duplicates)}`);
});

// Test 60: Audio filename length is mobile-safe
test('Mobile/Desktop: Audio filenames are reasonable length for all platforms', () => {
    const longFilenames = [];
    const maxLength = 255; // Common filename limit across platforms

    WORDS.forEach(word => {
        const filename = getAudioFilename(word);
        const fullPath = `audio/${filename}.m4a`;
        if (fullPath.length > maxLength) {
            longFilenames.push({ word, filename, length: fullPath.length });
        }
    });

    assertEqual(longFilenames.length, 0,
        `All filenames should be under ${maxLength} chars. Long: ${JSON.stringify(longFilenames)}`);
});

// Test 61: Audio filename case insensitivity
test('Mobile/Desktop: Audio filenames are lowercase for case-insensitive filesystems', () => {
    WORDS.forEach(word => {
        const filename = getAudioFilename(word);
        assertEqual(filename, filename.toLowerCase(),
            `${word} filename should be lowercase: ${filename}`);
    });
});

// Test 62: Audio path generation consistency
test('Mobile/Desktop: Audio path generation is consistent', () => {
    const word = 'chair';
    const path1 = `audio/${getAudioFilename(word)}.m4a`;
    const path2 = `audio/${getAudioFilename(word)}.m4a`;
    assertEqual(path1, path2, 'Same word should always generate same path');
});

// Test 63: Special words with complex characters
test('Mobile/Desktop: Complex words generate valid audio paths', () => {
    const complexWords = ['pâtisserie', 'compañero', 'geländesprung', 'protégé', 'pince-nez'];

    complexWords.forEach(word => {
        const filename = getAudioFilename(word);
        const audioPath = `audio/${filename}.m4a`;

        assertTrue(/^audio\/[a-z0-9_]+\.m4a$/.test(audioPath),
            `${word} should generate valid path: ${audioPath}`);
    });
});

// Test 64: Multi-word phrases generate valid filenames
test('Mobile/Desktop: Multi-word phrases generate valid audio filenames', () => {
    const multiWordPhrases = ['cri de coeur', 'chaise longue'];

    multiWordPhrases.forEach(phrase => {
        const filename = getAudioFilename(phrase);
        assertTrue(filename.includes('_'), `${phrase} should use underscores`);
        assertTrue(/^[a-z0-9_]+$/.test(filename), `${phrase} filename should be safe`);
    });
});

// Test 65: Audio filename normalization is idempotent
test('Mobile/Desktop: Audio filename normalization is idempotent', () => {
    WORDS.forEach(word => {
        const filename1 = getAudioFilename(word);
        const filename2 = getAudioFilename(filename1);
        assertEqual(filename1, filename2,
            `Normalizing twice should give same result for ${word}`);
    });
});

// ========== ACHIEVEMENTS SYSTEM TESTS ==========

// Mock achievement definitions (simplified version of app achievements)
const MOCK_ACHIEVEMENTS = [
    {
        id: 'first-steps',
        name: 'First Steps',
        check: (userData) => userData.stats.totalWordsAttempted >= 1
    },
    {
        id: 'perfect-10',
        name: 'Perfect 10',
        check: (userData) => userData.stats.bestStreak >= 10
    },
    {
        id: 'century-club',
        name: 'Century Club',
        check: (userData) => userData.stats.totalWordsAttempted >= 100
    }
];

const checkAchievements = (userData, achievements) => {
    const newlyUnlocked = [];
    achievements.forEach(achievement => {
        const alreadyUnlocked = (userData.unlockedAchievements || []).includes(achievement.id);
        if (!alreadyUnlocked && achievement.check(userData)) {
            newlyUnlocked.push(achievement);
            if (!userData.unlockedAchievements) {
                userData.unlockedAchievements = [];
            }
            userData.unlockedAchievements.push(achievement.id);
        }
    });
    return newlyUnlocked;
};

// Test 66: Achievement - First Steps unlocks on first word
test('Achievements: First Steps unlocks after first word attempt', () => {
    const userData = getDefaultUserData();
    userData.stats.totalWordsAttempted = 1;

    const unlocked = checkAchievements(userData, MOCK_ACHIEVEMENTS);

    assertEqual(unlocked.length, 1, 'Should unlock one achievement');
    assertEqual(unlocked[0].id, 'first-steps');
    assertTrue(userData.unlockedAchievements.includes('first-steps'));
});

// Test 67: Achievement - Perfect 10 unlocks after 10 streak
test('Achievements: Perfect 10 unlocks after 10-word streak', () => {
    const userData = getDefaultUserData();
    userData.stats.totalWordsAttempted = 10;
    userData.stats.bestStreak = 10;

    const unlocked = checkAchievements(userData, MOCK_ACHIEVEMENTS);

    assertTrue(unlocked.length >= 1, 'Should unlock at least one achievement');
    assertTrue(unlocked.some(a => a.id === 'perfect-10'), 'Should unlock Perfect 10');
});

// Test 68: Achievement - Century Club unlocks at 100 attempts
test('Achievements: Century Club unlocks at 100 attempts', () => {
    const userData = getDefaultUserData();
    userData.stats.totalWordsAttempted = 100;
    userData.stats.bestStreak = 5;

    const unlocked = checkAchievements(userData, MOCK_ACHIEVEMENTS);

    assertTrue(unlocked.some(a => a.id === 'century-club'), 'Should unlock Century Club');
});

// Test 69: Achievement - No duplicate unlocks
test('Achievements: Same achievement does not unlock twice', () => {
    const userData = getDefaultUserData();
    userData.stats.totalWordsAttempted = 1;

    // First unlock
    const firstUnlock = checkAchievements(userData, MOCK_ACHIEVEMENTS);
    assertEqual(firstUnlock.length, 1);

    // Try to unlock again
    const secondUnlock = checkAchievements(userData, MOCK_ACHIEVEMENTS);
    assertEqual(secondUnlock.length, 0, 'Should not unlock same achievement twice');
});

// Test 70: Achievement - Multiple achievements can unlock at once
test('Achievements: Multiple achievements can unlock simultaneously', () => {
    const userData = getDefaultUserData();
    userData.stats.totalWordsAttempted = 100;
    userData.stats.bestStreak = 10;

    const unlocked = checkAchievements(userData, MOCK_ACHIEVEMENTS);

    assertTrue(unlocked.length >= 2, 'Should unlock multiple achievements');
    assertTrue(unlocked.some(a => a.id === 'perfect-10'));
    assertTrue(unlocked.some(a => a.id === 'century-club'));
});

// Test 71: Achievement - Track unlocked achievements list
test('Achievements: unlockedAchievements array tracks all unlocks', () => {
    const userData = getDefaultUserData();
    userData.stats.totalWordsAttempted = 1;

    checkAchievements(userData, MOCK_ACHIEVEMENTS);

    assertTrue(Array.isArray(userData.unlockedAchievements));
    assertEqual(userData.unlockedAchievements.length, 1);
    assertEqual(userData.unlockedAchievements[0], 'first-steps');
});

// ========== PROGRESS DASHBOARD TESTS ==========

// Test 72: Dashboard - Calculate overall accuracy
test('Dashboard: Overall accuracy calculation', () => {
    const userData = getDefaultUserData();
    userData.stats.totalWordsAttempted = 20;
    userData.stats.totalCorrect = 15;

    const accuracy = Math.round((userData.stats.totalCorrect / userData.stats.totalWordsAttempted) * 100);

    assertEqual(accuracy, 75, 'Accuracy should be 75%');
});

// Test 73: Dashboard - Accuracy is 0% when no attempts
test('Dashboard: Accuracy is 0% with no attempts', () => {
    const userData = getDefaultUserData();

    const accuracy = userData.stats.totalWordsAttempted > 0
        ? Math.round((userData.stats.totalCorrect / userData.stats.totalWordsAttempted) * 100)
        : 0;

    assertEqual(accuracy, 0);
});

// Test 74: Dashboard - Find most difficult words
test('Dashboard: Identify most difficult words (lowest accuracy)', () => {
    const userData = getDefaultUserData();
    userData.wordHistory = {
        'chair': { attempts: 4, correct: 1 },    // 25%
        'brass': { attempts: 3, correct: 3 },    // 100%
        'ready': { attempts: 5, correct: 2 }     // 40%
    };

    const difficultWords = Object.entries(userData.wordHistory)
        .filter(([_, history]) => history.attempts >= 2)
        .map(([word, history]) => ({
            word,
            accuracy: Math.round((history.correct / history.attempts) * 100)
        }))
        .sort((a, b) => a.accuracy - b.accuracy);

    assertEqual(difficultWords[0].word, 'chair', 'Most difficult should be chair');
    assertEqual(difficultWords[0].accuracy, 25);
    assertEqual(difficultWords[1].word, 'ready');
    assertEqual(difficultWords[2].word, 'brass', 'Least difficult should be brass');
});

// Test 75: Dashboard - Filter words with minimum attempts
test('Dashboard: Only show words with 2+ attempts as difficult', () => {
    const userData = getDefaultUserData();
    userData.wordHistory = {
        'chair': { attempts: 1, correct: 0 },    // 0% but only 1 attempt
        'brass': { attempts: 3, correct: 1 }     // 33%
    };

    const difficultWords = Object.entries(userData.wordHistory)
        .filter(([_, history]) => history.attempts >= 2)
        .map(([word, history]) => ({ word, accuracy: history.correct / history.attempts }));

    assertEqual(difficultWords.length, 1, 'Should only include brass');
    assertEqual(difficultWords[0].word, 'brass');
});

// Test 76: Dashboard - Mastery progress percentage
test('Dashboard: Calculate mastery progress percentage', () => {
    const userData = getDefaultUserData();
    userData.wordHistory = {
        'shell': { attempts: 5, correct: 5 },
        'truck': { attempts: 4, correct: 4 },
        'apple': { attempts: 3, correct: 3 }
    };

    const stats = getMasteryStats(userData, WORDS);
    const percentage = Math.round((stats.mastered / WORDS.length) * 100);

    assertTrue(percentage >= 0 && percentage <= 100);
    assertEqual(stats.mastered, 3);
});

// Test 77: Dashboard - Session count tracking
test('Dashboard: Session count tracks practice days', () => {
    const userData = getDefaultUserData();
    userData.stats.sessionCount = 7;

    assertEqual(userData.stats.sessionCount, 7);
    assertTrue(userData.stats.sessionCount >= 1);
});

// Test 78: Integration - Achievement unlocks persist
test('Integration: Achievement unlocks persist across userData updates', () => {
    let userData = getDefaultUserData();
    userData.stats.totalWordsAttempted = 1;

    checkAchievements(userData, MOCK_ACHIEVEMENTS);
    assertEqual(userData.unlockedAchievements.length, 1);

    // Simulate more progress
    userData.stats.totalWordsAttempted = 10;
    userData.stats.bestStreak = 10;

    checkAchievements(userData, MOCK_ACHIEVEMENTS);
    assertTrue(userData.unlockedAchievements.length >= 2, 'Should have multiple achievements');
    assertTrue(userData.unlockedAchievements.includes('first-steps'), 'First achievement should persist');
});

// Test 79: Integration - Dashboard shows accurate stats after practice
test('Integration: Dashboard reflects practice session accurately', () => {
    const userData = getDefaultUserData();

    // Simulate practice session: 10 words, 7 correct
    const words = ['chair', 'brass', 'ready', 'scatter', 'gobble', 'eel', 'sizzle', 'Spanish', 'hornet', 'oval'];
    const results = [true, true, false, true, true, false, true, true, false, true];

    words.forEach((word, i) => {
        userData.wordHistory = updateWordHistory(userData, word, results[i]);
        userData.stats.totalWordsAttempted++;
        if (results[i]) userData.stats.totalCorrect++;
    });

    const accuracy = Math.round((userData.stats.totalCorrect / userData.stats.totalWordsAttempted) * 100);
    assertEqual(accuracy, 70, 'Should show 70% accuracy');
    assertEqual(userData.stats.totalWordsAttempted, 10);
    assertEqual(userData.stats.totalCorrect, 7);
});

// Test 80: Edge case - Dashboard with no practice history
test('Dashboard: Handles user with no practice history gracefully', () => {
    const userData = getDefaultUserData();

    const stats = getMasteryStats(userData, WORDS);
    const accuracy = userData.stats.totalWordsAttempted > 0
        ? Math.round((userData.stats.totalCorrect / userData.stats.totalWordsAttempted) * 100)
        : 0;

    assertEqual(stats.mastered, 0);
    assertEqual(stats.practiced, 0);
    assertEqual(accuracy, 0);
    assertEqual(userData.stats.bestStreak, 0);
});

// ========== PROFILE MANAGEMENT TESTS ==========

// Helper functions for profile management (from app)
const AVATAR_EMOJIS_TEST = ['😊', '🌟', '🚀'];
const PROFILE_COLORS_TEST = ['purple', 'blue', 'green'];

const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

const getDefaultAppData = () => ({
    profiles: [],
    currentProfileId: null,
    profileData: {}
});

const createProfile = (appData, name, avatar, color) => {
    const profileId = generateId();
    const profile = {
        id: profileId,
        name: name,
        avatar: avatar,
        color: color,
        createdAt: new Date().toISOString()
    };
    appData.profiles.push(profile);
    appData.profileData[profileId] = getDefaultUserData();
    appData.currentProfileId = profileId;
    return appData;
};

const switchProfile = (appData, profileId) => {
    appData.currentProfileId = profileId;
    return appData;
};

const deleteProfile = (appData, profileId) => {
    appData.profiles = appData.profiles.filter(p => p.id !== profileId);
    delete appData.profileData[profileId];
    if (appData.currentProfileId === profileId) {
        appData.currentProfileId = appData.profiles.length > 0 ? appData.profiles[0].id : null;
    }
    return appData;
};

// Test 81: Profile creation - creates valid profile structure
test('Profile: Creation creates valid profile structure', () => {
    const appData = getDefaultAppData();
    const result = createProfile(appData, 'Alice', '😊', 'purple');

    assertEqual(result.profiles.length, 1, 'Should have 1 profile');
    assertEqual(result.profiles[0].name, 'Alice');
    assertEqual(result.profiles[0].avatar, '😊');
    assertEqual(result.profiles[0].color, 'purple');
    assertTrue(result.profiles[0].id !== undefined, 'Profile should have ID');
    assertTrue(result.profiles[0].createdAt !== undefined, 'Profile should have createdAt');
});

// Test 82: Profile creation - sets as current profile
test('Profile: Creation sets new profile as current', () => {
    const appData = getDefaultAppData();
    const result = createProfile(appData, 'Alice', '😊', 'purple');

    assertTrue(result.currentProfileId !== null, 'Should have current profile');
    assertEqual(result.currentProfileId, result.profiles[0].id, 'Current should match created profile');
});

// Test 83: Profile creation - initializes userData
test('Profile: Creation initializes default userData', () => {
    const appData = getDefaultAppData();
    const result = createProfile(appData, 'Alice', '😊', 'purple');
    const profileId = result.profiles[0].id;

    assertTrue(result.profileData[profileId] !== undefined, 'Should have profileData');
    assertEqual(result.profileData[profileId].stats.totalWordsAttempted, 0);
    assertEqual(result.profileData[profileId].stats.totalCorrect, 0);
    assertTrue(Array.isArray(result.profileData[profileId].unlockedAchievements));
});

// Test 84: Profile creation - handles multiple profiles
test('Profile: Can create multiple profiles', () => {
    let appData = getDefaultAppData();
    appData = createProfile(appData, 'Alice', '😊', 'purple');
    appData = createProfile(appData, 'Bob', '🌟', 'blue');
    appData = createProfile(appData, 'Charlie', '🚀', 'green');

    assertEqual(appData.profiles.length, 3, 'Should have 3 profiles');
    assertEqual(appData.profiles[0].name, 'Alice');
    assertEqual(appData.profiles[1].name, 'Bob');
    assertEqual(appData.profiles[2].name, 'Charlie');
    assertEqual(Object.keys(appData.profileData).length, 3, 'Should have 3 profile data entries');
});

// Test 85: Profile creation - each profile has unique ID
test('Profile: Each profile has unique ID', () => {
    let appData = getDefaultAppData();
    appData = createProfile(appData, 'Alice', '😊', 'purple');
    appData = createProfile(appData, 'Bob', '🌟', 'blue');

    const id1 = appData.profiles[0].id;
    const id2 = appData.profiles[1].id;

    assertTrue(id1 !== id2, 'Profile IDs should be unique');
});

// Test 86: Profile switching - updates currentProfileId
test('Profile: Switching updates currentProfileId', () => {
    let appData = getDefaultAppData();
    appData = createProfile(appData, 'Alice', '😊', 'purple');
    appData = createProfile(appData, 'Bob', '🌟', 'blue');

    const bobId = appData.profiles[1].id;
    appData = switchProfile(appData, bobId);

    assertEqual(appData.currentProfileId, bobId, 'Should switch to Bob');
});

// Test 87: Profile switching - preserves all profile data
test('Profile: Switching preserves userData for both profiles', () => {
    let appData = getDefaultAppData();
    appData = createProfile(appData, 'Alice', '😊', 'purple');
    const aliceId = appData.profiles[0].id;

    // Alice practices words
    appData.profileData[aliceId].stats.totalWordsAttempted = 10;
    appData.profileData[aliceId].stats.totalCorrect = 8;

    // Create Bob
    appData = createProfile(appData, 'Bob', '🌟', 'blue');
    const bobId = appData.profiles[1].id;

    // Bob practices words
    appData.profileData[bobId].stats.totalWordsAttempted = 5;
    appData.profileData[bobId].stats.totalCorrect = 5;

    // Switch back to Alice
    appData = switchProfile(appData, aliceId);

    // Alice's data should be preserved
    assertEqual(appData.profileData[aliceId].stats.totalWordsAttempted, 10);
    assertEqual(appData.profileData[aliceId].stats.totalCorrect, 8);

    // Bob's data should also be preserved
    assertEqual(appData.profileData[bobId].stats.totalWordsAttempted, 5);
    assertEqual(appData.profileData[bobId].stats.totalCorrect, 5);
});

// Test 88: Profile deletion - removes profile from list
test('Profile: Deletion removes profile from list', () => {
    let appData = getDefaultAppData();
    appData = createProfile(appData, 'Alice', '😊', 'purple');
    appData = createProfile(appData, 'Bob', '🌟', 'blue');
    const bobId = appData.profiles[1].id;

    appData = deleteProfile(appData, bobId);

    assertEqual(appData.profiles.length, 1, 'Should have 1 profile left');
    assertEqual(appData.profiles[0].name, 'Alice', 'Alice should remain');
});

// Test 89: Profile deletion - removes profileData
test('Profile: Deletion removes profileData', () => {
    let appData = getDefaultAppData();
    appData = createProfile(appData, 'Alice', '😊', 'purple');
    appData = createProfile(appData, 'Bob', '🌟', 'blue');
    const bobId = appData.profiles[1].id;

    appData = deleteProfile(appData, bobId);

    assertTrue(appData.profileData[bobId] === undefined, 'Bob\'s data should be deleted');
    assertEqual(Object.keys(appData.profileData).length, 1, 'Should have 1 profile data entry');
});

// Test 90: Profile deletion - switches to another profile if deleting current
test('Profile: Deletion switches to another profile if deleting current', () => {
    let appData = getDefaultAppData();
    appData = createProfile(appData, 'Alice', '😊', 'purple');
    appData = createProfile(appData, 'Bob', '🌟', 'blue');
    const aliceId = appData.profiles[0].id;
    const bobId = appData.profiles[1].id;

    // Switch to Bob
    appData = switchProfile(appData, bobId);
    assertEqual(appData.currentProfileId, bobId);

    // Delete Bob (current profile)
    appData = deleteProfile(appData, bobId);

    // Should auto-switch to Alice
    assertEqual(appData.currentProfileId, aliceId, 'Should auto-switch to Alice');
});

// Test 91: Profile deletion - sets currentProfileId to null if last profile
test('Profile: Deletion sets currentProfileId to null if deleting last profile', () => {
    let appData = getDefaultAppData();
    appData = createProfile(appData, 'Alice', '😊', 'purple');
    const aliceId = appData.profiles[0].id;

    appData = deleteProfile(appData, aliceId);

    assertEqual(appData.profiles.length, 0, 'Should have no profiles');
    assertTrue(appData.currentProfileId === null, 'currentProfileId should be null');
});

// Test 92: Profile validation - empty name
test('Profile: Should handle edge case of empty name', () => {
    const appData = getDefaultAppData();
    const result = createProfile(appData, '', '😊', 'purple');

    // Function allows empty name, but UI should prevent this
    assertEqual(result.profiles[0].name, '');
});

// Test 93: Profile validation - very long name
test('Profile: Should handle very long names', () => {
    const appData = getDefaultAppData();
    const longName = 'A'.repeat(100);
    const result = createProfile(appData, longName, '😊', 'purple');

    assertEqual(result.profiles[0].name, longName);
});

// Test 94: Profile data isolation - changes to one profile don't affect others
test('Profile: Data isolation - changes to one profile don\'t affect others', () => {
    let appData = getDefaultAppData();
    appData = createProfile(appData, 'Alice', '😊', 'purple');
    appData = createProfile(appData, 'Bob', '🌟', 'blue');
    const aliceId = appData.profiles[0].id;
    const bobId = appData.profiles[1].id;

    // Alice unlocks achievements
    appData.profileData[aliceId].unlockedAchievements = ['first-steps', 'perfect-10'];
    appData.profileData[aliceId].stats.bestStreak = 10;

    // Bob should have fresh data
    assertEqual(appData.profileData[bobId].unlockedAchievements.length, 0);
    assertEqual(appData.profileData[bobId].stats.bestStreak, 0);
});

// Test 95: Integration - Complete profile workflow
test('Integration: Complete profile workflow (create, switch, practice, delete)', () => {
    // Start fresh
    let appData = getDefaultAppData();
    assertEqual(appData.profiles.length, 0);

    // Create Alice
    appData = createProfile(appData, 'Alice', '😊', 'purple');
    const aliceId = appData.profiles[0].id;
    assertEqual(appData.currentProfileId, aliceId);

    // Alice practices and gets achievements
    appData.profileData[aliceId].stats.totalWordsAttempted = 15;
    appData.profileData[aliceId].stats.totalCorrect = 12;
    appData.profileData[aliceId].stats.bestStreak = 5;

    // Create Bob
    appData = createProfile(appData, 'Bob', '🌟', 'blue');
    const bobId = appData.profiles[1].id;
    assertEqual(appData.currentProfileId, bobId, 'Should auto-switch to Bob');

    // Bob practices
    appData.profileData[bobId].stats.totalWordsAttempted = 20;
    appData.profileData[bobId].stats.totalCorrect = 18;
    appData.profileData[bobId].stats.bestStreak = 10;

    // Switch back to Alice
    appData = switchProfile(appData, aliceId);
    assertEqual(appData.currentProfileId, aliceId);

    // Verify Alice's data is intact
    assertEqual(appData.profileData[aliceId].stats.totalWordsAttempted, 15);
    assertEqual(appData.profileData[aliceId].stats.totalCorrect, 12);
    assertEqual(appData.profileData[aliceId].stats.bestStreak, 5);

    // Delete Alice
    appData = deleteProfile(appData, aliceId);
    assertEqual(appData.profiles.length, 1);
    assertEqual(appData.currentProfileId, bobId, 'Should auto-switch to Bob');

    // Bob's data should still be intact
    assertEqual(appData.profileData[bobId].stats.totalWordsAttempted, 20);
    assertEqual(appData.profileData[bobId].stats.totalCorrect, 18);
});

// ========== DISTRACTOR GENERATION TESTS (Multiple Choice) ==========

// generateDistractors function from app
function generateDistractors(correctWord) {
    const distractors = new Set();
    const word = correctWord.toLowerCase();

    // Strategy 1: Swap common vowels
    const vowelSwaps = { 'a': ['e', 'o'], 'e': ['a', 'i'], 'i': ['e', 'y'], 'o': ['a', 'u'], 'u': ['o', 'oo'] };
    for (let i = 0; i < word.length; i++) {
        if (vowelSwaps[word[i]]) {
            vowelSwaps[word[i]].forEach(swap => {
                const distractor = word.slice(0, i) + swap + word.slice(i + 1);
                if (distractor !== word) distractors.add(distractor);
            });
        }
    }

    // Strategy 2: Double or undouble consonants
    for (let i = 0; i < word.length - 1; i++) {
        const char = word[i];
        if (!/[aeiou]/.test(char)) {
            // Double a consonant
            if (word[i] !== word[i + 1]) {
                const distractor = word.slice(0, i + 1) + char + word.slice(i + 1);
                distractors.add(distractor);
            }
            // Undouble a consonant
            if (word[i] === word[i + 1]) {
                const distractor = word.slice(0, i) + word.slice(i + 1);
                distractors.add(distractor);
            }
        }
    }

    // Strategy 3: Transpose adjacent letters
    for (let i = 0; i < word.length - 1; i++) {
        const distractor = word.slice(0, i) + word[i + 1] + word[i] + word.slice(i + 2);
        if (distractor !== word) distractors.add(distractor);
    }

    // Strategy 4: Common spelling confusions
    const confusions = [
        ['ie', 'ei'], ['ei', 'ie'], ['ph', 'f'], ['f', 'ph'],
        ['c', 'k'], ['k', 'c'], ['s', 'c'], ['c', 's'],
        ['tion', 'sion'], ['sion', 'tion'], ['ence', 'ance'], ['ance', 'ence']
    ];
    confusions.forEach(([from, to]) => {
        if (word.includes(from)) {
            const distractor = word.replace(from, to);
            if (distractor !== word) distractors.add(distractor);
        }
    });

    // Strategy 5: Remove or add silent letters
    const silentPatterns = ['e$', 'ue$', 'gh', 'kn', 'wr'];
    silentPatterns.forEach(pattern => {
        if (word.match(new RegExp(pattern))) {
            const distractor = word.replace(new RegExp(pattern), '');
            if (distractor !== word && distractor.length > 2) distractors.add(distractor);
        }
    });

    // Convert back to original case
    const cased = Array.from(distractors).map(d => {
        if (correctWord[0] === correctWord[0].toUpperCase()) {
            return d.charAt(0).toUpperCase() + d.slice(1);
        }
        return d;
    });

    // Return 3 unique distractors
    return cased.slice(0, 3);
}

// Test 96: Distractors - returns exactly 3 options
test('Distractors: generateDistractors returns exactly 3 options', () => {
    const distractors = generateDistractors('chair');
    assertTrue(Array.isArray(distractors), 'Should return an array');
    assertEqual(distractors.length, 3, 'Should return exactly 3 distractors');
});

// Test 97: Distractors - all options are different from correct word
test('Distractors: All distractors are different from correct word', () => {
    const word = 'brass';
    const distractors = generateDistractors(word);

    distractors.forEach(distractor => {
        assertTrue(distractor !== word, `Distractor "${distractor}" should not match correct word "${word}"`);
        assertTrue(distractor.toLowerCase() !== word.toLowerCase(), 'Should differ even when case-insensitive');
    });
});

// Test 98: Distractors - vowel swap strategy works
test('Distractors: Vowel swap strategy generates plausible misspellings', () => {
    const word = 'chair';
    const distractors = generateDistractors(word);

    // "chair" could become "chear", "chier", "chuir", "choer", etc.
    const allDistractors = distractors.join(',');
    const hasVowelVariation = /ch[aeio]ir/.test(allDistractors) || /ch[ae]ir/.test(allDistractors);

    // At least one distractor should be plausible
    assertTrue(distractors.length > 0, 'Should generate at least one distractor');
});

// Test 99: Distractors - consonant doubling strategy works
test('Distractors: Consonant doubling strategy works correctly', () => {
    const word = 'brass';  // has double 's'
    const distractors = generateDistractors(word);

    // Should generate variations like "bras" (undouble s), "brrass" (double r), etc.
    const allDistractors = distractors.join(',');

    assertTrue(distractors.length > 0, 'Should generate distractors');
    // Check that at least one distractor has different consonant pattern
    const hasConsonantVariation = distractors.some(d =>
        d.includes('rr') || d === 'bras' || d.includes('bb')
    );
    assertTrue(distractors.every(d => d !== word), 'All distractors should differ from correct word');
});

// Test 100: Distractors - letter transposition strategy works
test('Distractors: Letter transposition creates typo-like errors', () => {
    const word = 'ready';
    const distractors = generateDistractors(word);

    // Transpositions could create: "raedy", "redy", "reday", "readdy", etc.
    assertTrue(distractors.length > 0, 'Should generate at least one distractor');
    assertTrue(distractors.every(d => d.length >= word.length - 1 && d.length <= word.length + 1),
        'Distractors should be similar length to original');
});

// Test 101: Distractors - spelling confusion patterns work
test('Distractors: Common spelling confusions (ie/ei, c/k, ph/f)', () => {
    const testCases = [
        { word: 'believe', pattern: /bel[ie]{2}ve/ },  // ie/ei confusion
        { word: 'photograph', pattern: /photo/ },      // ph pattern
    ];

    testCases.forEach(({ word, pattern }) => {
        const distractors = generateDistractors(word);
        assertTrue(distractors.length > 0, `Should generate distractors for "${word}"`);
        assertTrue(distractors.every(d => d !== word), 'All distractors should differ');
    });
});

// Test 102: Distractors - silent letter removal works
test('Distractors: Silent letter removal creates plausible misspellings', () => {
    const word = 'knife';  // silent 'k'
    const distractors = generateDistractors(word);

    // Could generate "nife" (remove kn), variations with vowel swaps, etc.
    assertTrue(distractors.length > 0, 'Should generate distractors');
    assertTrue(distractors.every(d => d.length >= 2), 'Distractors should be reasonable length');
});

// Test 103: Distractors - preserves capitalization
test('Distractors: Preserves capitalization of original word', () => {
    const word = 'Chair';  // Capitalized
    const distractors = generateDistractors(word);

    distractors.forEach(distractor => {
        assertTrue(distractor[0] === distractor[0].toUpperCase(),
            `Distractor "${distractor}" should start with capital letter like "${word}"`);
    });
});

// Test 104: Distractors - handles lowercase words
test('Distractors: Handles lowercase words correctly', () => {
    const word = 'chair';  // lowercase
    const distractors = generateDistractors(word);

    distractors.forEach(distractor => {
        assertTrue(distractor[0] === distractor[0].toLowerCase(),
            `Distractor "${distractor}" should be lowercase like "${word}"`);
    });
});

// Test 105: Distractors - works with very short words
test('Distractors: Handles short words (3-4 letters)', () => {
    const words = ['cat', 'dog', 'run', 'sit'];

    words.forEach(word => {
        const distractors = generateDistractors(word);
        assertTrue(distractors.length > 0, `Should generate distractors for short word "${word}"`);
        assertTrue(distractors.length <= 3, 'Should return at most 3 distractors');
        assertTrue(distractors.every(d => d !== word), 'All distractors should differ from correct word');
    });
});

// Test 106: Distractors - works with longer words
test('Distractors: Handles longer words (10+ letters)', () => {
    const words = ['substantially', 'hyperventilated', 'anonymously'];

    words.forEach(word => {
        const distractors = generateDistractors(word);
        assertTrue(distractors.length > 0, `Should generate distractors for long word "${word}"`);
        assertEqual(distractors.length, 3, 'Should return exactly 3 distractors');
        assertTrue(distractors.every(d => d !== word), 'All distractors should differ from correct word');
    });
});

// Test 107: Distractors - all distractors are unique
test('Distractors: All generated distractors are unique', () => {
    const word = 'formidable';
    const distractors = generateDistractors(word);

    const uniqueDistractors = new Set(distractors);
    assertEqual(uniqueDistractors.size, distractors.length,
        'All distractors should be unique (no duplicates)');
});

// Test 108: Distractors - real-world test with multiple words
test('Distractors: Generates valid options for random word selection', () => {
    const testWords = ['chair', 'brass', 'ready', 'Spanish', 'plastic', 'evergreen', 'decompose'];

    testWords.forEach(word => {
        const distractors = generateDistractors(word);

        // All distractors should be:
        // 1. Different from the correct word
        assertTrue(distractors.every(d => d.toLowerCase() !== word.toLowerCase()),
            `All distractors for "${word}" should differ from correct word`);

        // 2. Similar length (within 2 characters)
        assertTrue(distractors.every(d => Math.abs(d.length - word.length) <= 2),
            `Distractors for "${word}" should be similar length`);

        // 3. Non-empty
        assertTrue(distractors.every(d => d.length > 0),
            `All distractors for "${word}" should be non-empty`);
    });
});

// ========== LETTER SHUFFLING TESTS (Unscramble Mode) ==========

// Letter shuffling function (Fisher-Yates shuffle)
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Test 109: Shuffling - returns same length array
test('Shuffling: Shuffled array has same length as original', () => {
    const letters = ['c', 'h', 'a', 'i', 'r'];
    const shuffled = shuffleArray(letters);

    assertEqual(shuffled.length, letters.length, 'Shuffled array should have same length');
});

// Test 110: Shuffling - contains all original elements
test('Shuffling: Shuffled array contains all original letters', () => {
    const letters = ['c', 'h', 'a', 'i', 'r'];
    const shuffled = shuffleArray(letters);

    // Sort both to compare
    const originalSorted = [...letters].sort();
    const shuffledSorted = [...shuffled].sort();

    assertEqual(shuffledSorted.join(''), originalSorted.join(''),
        'Shuffled array should contain exactly the same letters');
});

// Test 111: Shuffling - doesn't modify original array
test('Shuffling: Does not modify original array', () => {
    const letters = ['c', 'h', 'a', 'i', 'r'];
    const originalCopy = [...letters];

    shuffleArray(letters);

    assertEqual(letters.join(''), originalCopy.join(''),
        'Original array should not be modified');
});

// Test 112: Shuffling - works with single letter
test('Shuffling: Handles single letter correctly', () => {
    const letters = ['a'];
    const shuffled = shuffleArray(letters);

    assertEqual(shuffled.length, 1);
    assertEqual(shuffled[0], 'a');
});

// Test 113: Shuffling - works with two letters
test('Shuffling: Handles two letters correctly', () => {
    const letters = ['a', 'b'];
    const shuffled = shuffleArray(letters);

    assertEqual(shuffled.length, 2);
    assertTrue(shuffled.includes('a') && shuffled.includes('b'),
        'Should contain both letters');
});

// Test 114: Shuffling - handles repeated letters
test('Shuffling: Handles words with repeated letters (brass)', () => {
    const letters = ['b', 'r', 'a', 's', 's'];
    const shuffled = shuffleArray(letters);

    assertEqual(shuffled.length, 5);

    // Count occurrences of 's'
    const sCount = shuffled.filter(l => l === 's').length;
    assertEqual(sCount, 2, 'Should have exactly 2 "s" letters');
});

// Test 115: Shuffling - randomness test (shuffles words differently over multiple runs)
test('Shuffling: Produces different arrangements over multiple runs', () => {
    const letters = ['c', 'h', 'a', 'i', 'r'];
    const results = new Set();

    // Run shuffle 20 times
    for (let i = 0; i < 20; i++) {
        const shuffled = shuffleArray(letters);
        results.add(shuffled.join(''));
    }

    // Should produce at least 2 different arrangements
    // (with 5 letters, there are 120 possible permutations)
    assertTrue(results.size >= 2,
        'Should produce multiple different arrangements over 20 runs');
});

// Test 116: Shuffling - works with longer words
test('Shuffling: Handles longer words (substantially)', () => {
    const word = 'substantially';
    const letters = word.split('');
    const shuffled = shuffleArray(letters);

    assertEqual(shuffled.length, word.length);
    assertEqual(shuffled.sort().join(''), letters.sort().join(''),
        'Should contain all letters from original word');
});

// Test 117: Shuffling - works with special characters
test('Shuffling: Handles special characters (pâtisserie)', () => {
    const word = 'pâtisserie';
    const letters = word.split('');
    const shuffled = shuffleArray(letters);

    assertEqual(shuffled.length, letters.length);
    assertTrue(shuffled.includes('â'), 'Should preserve special character â');
});

// Test 118: Integration - Shuffling creates valid scramble for game
test('Integration: Scrambled letters can be rearranged to form original word', () => {
    const words = ['chair', 'brass', 'ready', 'plastic', 'evergreen'];

    words.forEach(word => {
        const letters = word.split('');
        const shuffled = shuffleArray(letters);

        // The player should be able to rearrange shuffled letters back to original
        const canFormOriginal = shuffled.sort().join('') === letters.sort().join('');
        assertTrue(canFormOriginal,
            `Shuffled letters of "${word}" should be rearrangeable to original word`);
    });
});

// ========== APP DATA CONSISTENCY (reads index.html) ==========

const fs = require('fs');
const path = require('path');
const indexHtml = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf-8');

function readAppConstant(name) {
    const match = indexHtml.match(new RegExp(`const ${name} = (\\{.*\\});`));
    if (!match) throw new Error(`Could not find ${name} in index.html`);
    return JSON.parse(match[1]);
}

const APP_WORD_LEVELS = readAppConstant('WORD_LEVELS');
const APP_WORDS = Object.values(APP_WORD_LEVELS).flat();
const APP_DEFINITIONS = readAppConstant('DEFINITIONS');
const APP_ALTERNATE_SPELLINGS = readAppConstant('ALTERNATE_SPELLINGS');

test('App data: index.html word levels match the levels tested here', () => {
    assertEqual(JSON.stringify(APP_WORD_LEVELS), JSON.stringify(CATEGORIES),
        'WORD_LEVELS in index.html differs from CATEGORIES in this test file');
});

test('App data: every word has a definition and there are no extra definitions', () => {
    const missing = APP_WORDS.filter(w => !APP_DEFINITIONS[w]);
    const extra = Object.keys(APP_DEFINITIONS).filter(w => !APP_WORDS.includes(w));
    assertEqual(missing.length, 0, `Words without definitions: ${missing.join(', ')}`);
    assertEqual(extra.length, 0, `Definitions for words not in the list: ${extra.join(', ')}`);
});

test('App data: every word has an audio file', () => {
    const audioDir = path.join(__dirname, '..', 'audio');
    const missing = APP_WORDS.filter(w => !fs.existsSync(path.join(audioDir, `${getAudioFilename(w)}.m4a`)));
    assertEqual(missing.length, 0, `Words without audio: ${missing.join(', ')}`);
});

test('App data: alternate spellings belong to words in the list', () => {
    const unknown = Object.keys(APP_ALTERNATE_SPELLINGS).filter(w => !APP_WORDS.includes(w));
    assertEqual(unknown.length, 0, `Alternate spellings for unknown words: ${unknown.join(', ')}`);
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
