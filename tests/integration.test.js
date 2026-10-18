// Word Club Spelling App - Integration Tests
// Tests complete user flows, state management, and localStorage integration
// Run with: node tests/integration.test.js

// ========== SETUP ==========

const WORDS = require('../words.js').WORDS;

// Mock localStorage
class LocalStorageMock {
    constructor() {
        this.store = {};
    }
    clear() {
        this.store = {};
    }
    getItem(key) {
        return this.store[key] || null;
    }
    setItem(key, value) {
        this.store[key] = String(value);
    }
    removeItem(key) {
        delete this.store[key];
    }
}

const localStorage = new LocalStorageMock();

// Import functions from app (duplicated for testing)
const STORAGE_KEY = 'wordClubData';

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

function loadUserData() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const data = JSON.parse(saved);
            return { ...getDefaultUserData(), ...data };
        }
    } catch (error) {
        console.error('Failed to load user data:', error);
    }
    return getDefaultUserData();
}

function saveUserData(userData) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    } catch (error) {
        console.error('Failed to save user data:', error);
    }
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

function checkSpelling(userInput, correctWord) {
    return userInput.toLowerCase().trim() === correctWord.toLowerCase();
}

// Test framework
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

function assertGreaterThan(actual, expected, message) {
    if (actual <= expected) {
        throw new Error(message || `Expected ${actual} > ${expected}`);
    }
}

// ========== INTEGRATION TESTS ==========

console.log('\n🧪 Running Word Club Integration Tests\n');

// ========== COMPLETE USER FLOWS ==========

// Test 1: Complete Listen & Spell session flow
test('Integration: Complete Listen & Spell session', () => {
    localStorage.clear();
    let userData = loadUserData();

    // Start session
    const testWords = ['shell', 'truck', 'apple', 'yellow', 'mossy'];
    let score = 0;
    let streak = 0;
    let wordsAttempted = 0;

    // Play through 5 words
    testWords.forEach((word, i) => {
        const userInput = i < 3 ? word : 'wrong'; // Get first 3 correct
        const correct = checkSpelling(userInput, word);

        wordsAttempted++;
        userData.stats.totalWordsAttempted++;

        if (correct) {
            score++;
            streak++;
            userData.stats.totalCorrect++;
            if (streak > userData.stats.bestStreak) {
                userData.stats.bestStreak = streak;
            }
        } else {
            streak = 0;
        }

        userData.wordHistory = updateWordHistory(userData, word, correct);
    });

    saveUserData(userData);

    // Verify session state
    assertEqual(wordsAttempted, 5);
    assertEqual(score, 3);
    assertEqual(userData.stats.totalWordsAttempted, 5);
    assertEqual(userData.stats.totalCorrect, 3);
    assertEqual(userData.stats.bestStreak, 3);

    // Verify word history
    assertEqual(userData.wordHistory['shell'].attempts, 1);
    assertEqual(userData.wordHistory['shell'].correct, 1);
    assertEqual(userData.wordHistory['yellow'].attempts, 1);
    assertEqual(userData.wordHistory['yellow'].correct, 0);
});

// Test 2: localStorage persistence across sessions
test('Integration: Data persists across sessions', () => {
    // Session 1
    localStorage.clear();
    let userData = loadUserData();

    userData.wordHistory = updateWordHistory(userData, 'shell', true);
    userData.stats.totalWordsAttempted = 1;
    userData.stats.totalCorrect = 1;
    userData.stats.bestStreak = 1;
    saveUserData(userData);

    // Simulate app restart (reload from localStorage)
    const newSession = loadUserData();

    // Verify data persisted
    assertEqual(newSession.stats.totalWordsAttempted, 1);
    assertEqual(newSession.stats.totalCorrect, 1);
    assertEqual(newSession.wordHistory['shell'].attempts, 1);
    assertEqual(newSession.wordHistory['shell'].correct, 1);

    // Session 2: Continue practicing
    newSession.wordHistory = updateWordHistory(newSession, 'shell', true);
    newSession.stats.totalWordsAttempted = 2;
    newSession.stats.totalCorrect = 2;
    saveUserData(newSession);

    // Verify cumulative data
    const afterSession2 = loadUserData();
    assertEqual(afterSession2.wordHistory['shell'].attempts, 2);
    assertEqual(afterSession2.wordHistory['shell'].correct, 2);
});

// Test 3: Missed words workflow
test('Integration: Missed words detection and practice workflow', () => {
    localStorage.clear();
    let userData = loadUserData();

    // Practice 10 words with mixed results
    const practiceSession = [
        { word: 'shell', correct: false },
        { word: 'truck', correct: false },
        { word: 'apple', correct: true },
        { word: 'yellow', correct: true },
        { word: 'mossy', correct: false },
        { word: 'shell', correct: false },    // shell now 0/2
        { word: 'truck', correct: true },     // truck now 1/2
        { word: 'apple', correct: true },     // apple now 2/2
    ];

    practiceSession.forEach(({ word, correct }) => {
        userData.wordHistory = updateWordHistory(userData, word, correct);
        userData.stats.totalWordsAttempted++;
        if (correct) userData.stats.totalCorrect++;
    });

    saveUserData(userData);

    // Get missed words
    const missed = getMissedWords(userData, WORDS);

    // Verify missed words list
    assertTrue(missed.includes('shell'), 'shell should be in missed words (0/2 = 0%)');
    assertTrue(missed.includes('mossy'), 'mossy should be in missed words (0/1 = 0%)');
    assertTrue(!missed.includes('truck'), 'truck should NOT be in missed words (1/2 = 50%)');
    assertTrue(!missed.includes('apple'), 'apple should NOT be in missed words (2/2 = 100%)');

    // Practice missed words until improved
    missed.forEach(word => {
        for (let i = 0; i < 3; i++) {
            userData.wordHistory = updateWordHistory(userData, word, true);
        }
    });

    // Verify improvement
    const missedAfter = getMissedWords(userData, WORDS);
    assertTrue(missedAfter.length < missed.length, 'Missed words count should decrease');
});

// Test 4: Mastery progression
test('Integration: Path from beginner to mastery', () => {
    localStorage.clear();
    let userData = loadUserData();

    const word = 'shell';

    // Stage 1: First attempt (incorrect)
    userData.wordHistory = updateWordHistory(userData, word, false);
    let stats = getMasteryStats(userData, WORDS);
    assertEqual(stats.mastered, 0, 'Should not be mastered after 1 incorrect');
    assertEqual(stats.needsPractice, 1, 'Should need practice after incorrect');

    // Stage 2: Practice with 50% accuracy
    userData.wordHistory = updateWordHistory(userData, word, true);
    stats = getMasteryStats(userData, WORDS);
    assertEqual(stats.mastered, 0, 'Should not be mastered at 50%');
    assertEqual(stats.needsPractice, 0, '50% does not need practice');

    // Stage 3: Improve to 66% accuracy (2/3)
    userData.wordHistory = updateWordHistory(userData, word, true);
    stats = getMasteryStats(userData, WORDS);
    assertEqual(stats.mastered, 0, 'Should not be mastered at 66%');

    // Stage 4: Reach 75% accuracy (3/4)
    userData.wordHistory = updateWordHistory(userData, word, true);
    stats = getMasteryStats(userData, WORDS);
    assertEqual(stats.mastered, 0, 'Should not be mastered at 75%');

    // Stage 5: Reach mastery (4/5 = 80%, 4 correct)
    userData.wordHistory = updateWordHistory(userData, word, true);
    stats = getMasteryStats(userData, WORDS);
    assertEqual(stats.mastered, 1, 'Should be mastered at 80% with 4 correct');
    assertEqual(stats.practiced, 1);
    assertEqual(stats.needsPractice, 0);
});

// Test 5: Streak tracking
test('Integration: Streak tracking across multiple words', () => {
    localStorage.clear();
    let userData = loadUserData();
    let streak = 0;

    const attempts = [
        { word: 'shell', correct: true },   // streak = 1
        { word: 'truck', correct: true },   // streak = 2
        { word: 'apple', correct: true },   // streak = 3
        { word: 'yellow', correct: false }, // streak = 0
        { word: 'mossy', correct: true },  // streak = 1
        { word: 'seal', correct: true },     // streak = 2
    ];

    attempts.forEach(({ word, correct }) => {
        userData.wordHistory = updateWordHistory(userData, word, correct);

        if (correct) {
            streak++;
            if (streak > userData.stats.bestStreak) {
                userData.stats.bestStreak = streak;
            }
        } else {
            streak = 0;
        }
    });

    assertEqual(userData.stats.bestStreak, 3, 'Best streak should be 3');
    assertEqual(streak, 2, 'Current streak should be 2');
});

// Test 6: Difficulty preference persistence
test('Integration: Difficulty preference persists across sessions', () => {
    localStorage.clear();
    let userData = loadUserData();

    // Set difficulty to 'one-bee'
    userData.settings.difficulty = 'one-bee';
    saveUserData(userData);

    // Simulate app restart
    const newSession = loadUserData();
    assertEqual(newSession.settings.difficulty, 'one-bee');

    // Change difficulty
    newSession.settings.difficulty = 'three-bee';
    saveUserData(newSession);

    // Verify change persisted
    const afterChange = loadUserData();
    assertEqual(afterChange.settings.difficulty, 'three-bee');
});

// Test 7: Complete Unscramble mode flow
test('Integration: Complete Unscramble mode session', () => {
    localStorage.clear();
    let userData = loadUserData();

    const testWords = ['shell', 'truck', 'apple'];
    const scrambledResults = [
        ['s', 'h', 'e', 'l', 'l'], // correct
        ['t', 'r', 'u', 'c'], // incorrect (missing 'k')
        ['a', 'p', 'p', 'l', 'e'], // correct
    ];

    testWords.forEach((word, i) => {
        const userWord = scrambledResults[i].join('');
        const correct = userWord.toLowerCase() === word.toLowerCase();

        userData.wordHistory = updateWordHistory(userData, word, correct);
        userData.stats.totalWordsAttempted++;
        if (correct) userData.stats.totalCorrect++;
    });

    assertEqual(userData.stats.totalWordsAttempted, 3);
    assertEqual(userData.stats.totalCorrect, 2);
    assertEqual(userData.wordHistory['truck'].correct, 0);
});

// Test 8: Multiple practice sessions cumulative stats
test('Integration: Cumulative stats across multiple sessions', () => {
    localStorage.clear();
    let userData = loadUserData();

    // Session 1: Morning practice
    ['shell', 'truck', 'apple'].forEach(word => {
        userData.wordHistory = updateWordHistory(userData, word, true);
        userData.stats.totalWordsAttempted++;
        userData.stats.totalCorrect++;
    });
    saveUserData(userData);

    // Session 2: Afternoon practice (reload from storage)
    userData = loadUserData();
    ['yellow', 'mossy', 'seal'].forEach(word => {
        userData.wordHistory = updateWordHistory(userData, word, true);
        userData.stats.totalWordsAttempted++;
        userData.stats.totalCorrect++;
    });
    saveUserData(userData);

    // Session 3: Evening practice (reload from storage)
    userData = loadUserData();
    ['shell', 'truck'].forEach(word => { // Practice same words again
        userData.wordHistory = updateWordHistory(userData, word, true);
        userData.stats.totalWordsAttempted++;
        userData.stats.totalCorrect++;
    });
    saveUserData(userData);

    // Verify cumulative stats
    const final = loadUserData();
    assertEqual(final.stats.totalWordsAttempted, 8);
    assertEqual(final.stats.totalCorrect, 8);
    assertEqual(final.wordHistory['shell'].attempts, 2);
    assertEqual(final.wordHistory['mossy'].attempts, 1);
});

// Test 9: Recovery from corrupted localStorage
test('Integration: Graceful handling of corrupted localStorage', () => {
    localStorage.clear();

    // Corrupt the data
    localStorage.setItem(STORAGE_KEY, 'invalid json{{{');

    // Should return defaults without crashing
    const userData = loadUserData();
    assertEqual(userData.stats.totalWordsAttempted, 0);
    assertTrue(userData.wordHistory !== undefined);
});

// Test 10: Large practice session (stress test)
test('Integration: Large practice session (50 words)', () => {
    localStorage.clear();
    let userData = loadUserData();

    const wordsToTest = WORDS.slice(0, 50);
    let correct = 0;

    wordsToTest.forEach((word, i) => {
        const isCorrect = i % 2 === 0; // 50% accuracy
        if (isCorrect) correct++;

        userData.wordHistory = updateWordHistory(userData, word, isCorrect);
        userData.stats.totalWordsAttempted++;
        if (isCorrect) userData.stats.totalCorrect++;
    });

    saveUserData(userData);

    // Verify all words tracked
    assertEqual(userData.stats.totalWordsAttempted, 50);
    assertEqual(userData.stats.totalCorrect, 25);

    const stats = getMasteryStats(userData, WORDS);
    assertEqual(stats.practiced, 50);
    assertEqual(stats.notPracticed, WORDS.length - 50);
});

// Test 11: Mastery stats with diverse progress
test('Integration: Mastery stats with diverse word progress', () => {
    localStorage.clear();
    let userData = loadUserData();

    // Create diverse progress scenarios
    // Mastered words (80%+ accuracy, 3+ correct)
    ['shell', 'truck', 'apple'].forEach(word => {
        for (let i = 0; i < 5; i++) {
            userData.wordHistory = updateWordHistory(userData, word, true);
        }
    });

    // Words needing practice (<50% accuracy)
    ['yellow', 'mossy'].forEach(word => {
        userData.wordHistory = updateWordHistory(userData, word, false);
        userData.wordHistory = updateWordHistory(userData, word, false);
        userData.wordHistory = updateWordHistory(userData, word, true);
    });

    // Words in progress (50-79% accuracy)
    ['seal', 'silly'].forEach(word => {
        userData.wordHistory = updateWordHistory(userData, word, true);
        userData.wordHistory = updateWordHistory(userData, word, true);
        userData.wordHistory = updateWordHistory(userData, word, false);
    });

    const stats = getMasteryStats(userData, WORDS);
    assertEqual(stats.mastered, 3, 'Should have 3 mastered words');
    assertEqual(stats.needsPractice, 2, 'Should have 2 words needing practice');
    assertEqual(stats.practiced, 7, 'Should have 7 practiced words total');
    assertEqual(stats.notPracticed, WORDS.length - 7, `Should have ${WORDS.length - 7} not practiced`);
});

// Test 12: Accuracy threshold boundaries
test('Integration: Accuracy threshold boundaries', () => {
    localStorage.clear();
    let userData = loadUserData();

    // Test 49% accuracy (should need practice)
    userData.wordHistory['word1'] = { attempts: 100, correct: 49, lastAttempt: new Date().toISOString() };

    // Test exactly 50% (should NOT need practice)
    userData.wordHistory['word2'] = { attempts: 100, correct: 50, lastAttempt: new Date().toISOString() };

    // Test 79% (should NOT be mastered without 3 correct)
    userData.wordHistory['word3'] = { attempts: 100, correct: 79, lastAttempt: new Date().toISOString() };

    // Test exactly 80% with 3+ correct (should be mastered)
    userData.wordHistory['word4'] = { attempts: 5, correct: 4, lastAttempt: new Date().toISOString() };

    const testWords = ['word1', 'word2', 'word3', 'word4'];
    const missed = getMissedWords(userData, testWords);
    const stats = getMasteryStats(userData, testWords);

    assertEqual(missed.length, 1, 'Only word1 should be missed');
    assertTrue(missed.includes('word1'));
    assertEqual(stats.mastered, 1, 'Only word4 should be mastered');
});

// Test 13: Real-world scenario - Student practice week
test('Integration: Real-world scenario - Student practices all week', () => {
    localStorage.clear();
    let userData = loadUserData();

    // Monday: Learn 10 new words with 70% accuracy
    const mondayWords = WORDS.slice(0, 10);
    mondayWords.forEach((word, i) => {
        const correct = i < 7; // 7/10 correct
        userData.wordHistory = updateWordHistory(userData, word, correct);
        userData.stats.totalWordsAttempted++;
        if (correct) userData.stats.totalCorrect++;
    });

    // Tuesday: Review + 5 new words (80% accuracy on review)
    mondayWords.forEach((word, i) => {
        const correct = i < 8; // 8/10 correct on review
        userData.wordHistory = updateWordHistory(userData, word, correct);
    });
    WORDS.slice(10, 15).forEach((word, i) => {
        const correct = i < 4; // 4/5 correct on new words
        userData.wordHistory = updateWordHistory(userData, word, correct);
    });

    // Get missed words (should include words with <50% accuracy)
    const missed = getMissedWords(userData, WORDS);
    const missedCount = missed.length;

    // Friday: Focus on missed words - practice each one 3 times correctly
    missed.forEach(word => {
        for (let i = 0; i < 3; i++) {
            userData.wordHistory = updateWordHistory(userData, word, true);
        }
    });

    saveUserData(userData);

    const stats = getMasteryStats(userData, WORDS);
    assertTrue(stats.practiced >= 15, 'Should have practiced at least 15 words');

    const missedAfter = getMissedWords(userData, WORDS);
    assertTrue(missedAfter.length < missedCount, `Missed words should decrease after focused practice (before: ${missedCount}, after: ${missedAfter.length})`);
});

// Test 14: Performance - Loading saved data doesn't degrade
test('Integration: Performance - Load/save with large history', () => {
    localStorage.clear();
    let userData = loadUserData();

    // Create history for all words
    WORDS.forEach(word => {
        const attempts = Math.floor(Math.random() * 10) + 1;
        const correct = Math.floor(Math.random() * attempts);
        userData.wordHistory[word] = {
            attempts,
            correct,
            lastAttempt: new Date().toISOString()
        };
    });

    const startSave = Date.now();
    saveUserData(userData);
    const saveDuration = Date.now() - startSave;

    const startLoad = Date.now();
    const loadedData = loadUserData();
    const loadDuration = Date.now() - startLoad;

    assertTrue(saveDuration < 100, 'Save should take less than 100ms');
    assertTrue(loadDuration < 100, 'Load should take less than 100ms');
    assertEqual(Object.keys(loadedData.wordHistory).length, WORDS.length);
});

// Test 15: Edge case - Practice same word many times in one session
test('Integration: Edge case - Practice same word repeatedly', () => {
    localStorage.clear();
    let userData = loadUserData();

    const word = 'shell';
    const results = [false, false, true, true, true, true, true]; // 5/7 = 71%

    results.forEach(correct => {
        userData.wordHistory = updateWordHistory(userData, word, correct);
        userData.stats.totalWordsAttempted++;
        if (correct) userData.stats.totalCorrect++;
    });

    assertEqual(userData.wordHistory[word].attempts, 7);
    assertEqual(userData.wordHistory[word].correct, 5);

    const stats = getMasteryStats(userData, WORDS);
    assertEqual(stats.mastered, 0, '71% accuracy should not be mastered');
});

// ========== RESULTS ==========

console.log(`\n${'='.repeat(50)}`);
console.log(`Integration Test Results: ${passed} passed, ${failed} failed`);
console.log(`${'='.repeat(50)}\n`);

if (failed > 0) {
    console.log('❌ Some integration tests failed!\n');
    process.exit(1);
} else {
    console.log('✅ All integration tests passed!\n');
    process.exit(0);
}
