/**
 * Word Club - Core Game Logic
 * Business logic extracted for testing
 */

import WORD_DATA from '../../words.js';

// Export all core functions for testing
export const WORD_LEVELS = WORD_DATA.WORD_LEVELS;

export const WORDS = WORD_DATA.WORDS;

/**
 * Filter words by difficulty level
 */
export function filterWordsByDifficulty(words, difficulty) {
    return Object.hasOwn(WORD_LEVELS, difficulty) ? WORD_LEVELS[difficulty] : words;
}

/**
 * Generate plausible wrong answers (distractors) for multiple choice
 */
export function generateDistractors(correctWord) {
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

/**
 * Shuffle array using Fisher-Yates algorithm
 */
export function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

/**
 * Convert word to audio filename
 */
export function getAudioFilename(word) {
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

/**
 * Get default user data structure
 */
export function getDefaultUserData() {
    return {
        wordHistory: {},
        achievements: [],
        settings: {
            difficulty: 'all'
        },
        stats: {
            totalWordsAttempted: 0,
            totalCorrect: 0,
            bestStreak: 0,
            sessionCount: 0,
            lastPlayed: new Date().toISOString()
        }
    };
}

/**
 * Update word history after an attempt
 */
export function updateWordHistory(userData, word, wasCorrect) {
    const history = { ...userData.wordHistory };

    if (!history[word]) {
        history[word] = {
            attempts: 0,
            correct: 0,
            lastAttempt: new Date().toISOString()
        };
    }

    history[word].attempts++;
    if (wasCorrect) {
        history[word].correct++;
    }
    history[word].lastAttempt = new Date().toISOString();

    return history;
}

/**
 * Get words that need more practice (<50% accuracy)
 */
export function getMissedWords(userData, allWords) {
    const missed = [];

    for (const word of allWords) {
        const history = userData.wordHistory[word];
        if (!history) continue;

        const accuracy = history.correct / history.attempts;
        if (accuracy < 0.5) {
            missed.push(word);
        }
    }

    return missed;
}

/**
 * Get mastery statistics
 */
export function getMasteryStats(userData, allWords) {
    const stats = {
        mastered: 0,
        practiced: 0,
        needsPractice: 0,
        notPracticed: 0
    };

    for (const word of allWords) {
        const history = userData.wordHistory[word];

        if (!history) {
            stats.notPracticed++;
            continue;
        }

        const accuracy = history.correct / history.attempts;

        if (history.correct >= 3 && accuracy >= 0.8) {
            stats.mastered++;
        } else if (accuracy < 0.5) {
            stats.needsPractice++;
        } else {
            stats.practiced++;
        }
    }

    return stats;
}
