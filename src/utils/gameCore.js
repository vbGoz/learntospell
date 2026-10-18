/**
 * Word Club - Core Game Logic
 * Business logic extracted for testing
 */

// Export all core functions for testing
// 2026-2027 Scripps School Spelling Bee study list, grouped by Bee level
export const WORD_LEVELS = {
    'one-bee': ["ran","wind","leg","dirt","rod","good","most","hurt","shy","bunny","down","steps","drink","silly","sick","path","mist","stars","truck","fire","still","hello","bush","late","pump","shell","yarn","wings","sharp","easy","body","house","rich","shift","heart","tusk","shoot","seal","even","dive","claws","crack","come","fine","winter","apple","sound","mossy","yellow","shine","chips","beans","mouth","spray","year","truth","paper","rabbit","feed","tallest","inside","frozen","speak","cliffs","whale","market","flock","crunch","lizard","beware","sparkle","sweater","nurse","wrong","hopped","money","cabin","darkness","always","sprout","carve","shadows","morning","alive","earth","friend","lovely","return","half","swift","grandfather","footprints","fear","thirsty","peer","gentle","riddle","voice","peach","pancakes","illness","lead","groan","sloth","knit","cloak","parade","whistle","total","indoors","trouble","relax","finish","holiday","safety","stout","spiders","entire","library","guide","hospital","mustard","company","ginger","narrow","medium","pennies","hiking","foolish","afraid","remember","result","charming","source","pearls","tangy","beasts","shivering","barge","grumpily","smoothly","cottage","humble","seventy","dangle","distance","breeze","soared","frazzled","bamboo"],
    'two-bee': ["buttons","cuddle","puffy","tiptoed","clever","basement","burlap","wetlands","invite","butterflies","kelp","property","carefully","sniffling","beneath","tractor","permit","awning","fickle","relief","lunar","boycotting","molten","elite","woven","proclaim","thimble","custody","granola","warrior","rigid","fierce","laughter","salary","disappear","hurdler","lounge","jovial","inferior","December","duration","dictionary","business","reinstate","examine","versus","lullaby","opposite","tissues","marlin","Halloween","compliment","compromise","incident","Japanese","investment","bifocals","cutlery","chisel","fundraiser","geologist","bellowed","organism","quail","atmosphere","disappointment","truant","pamphlet","helium","suggested","chimpanzees","desperate","annoyance","interruption","concentrate","piñata","territory","stragglers","albino","ridiculous","monorail","exploratory","indigo","bratwurst","alphabetical","integrity","Oregon","rebuttal","prejudice","solidarity","calico","sputnik","cartridge","segregation","tortillas","civilian","fertilizer","apprentice","synthetic","Caesar","glamorous","salamanders","suspension","sorceress","fictitious","convertible","snarkiness","singularity","collateral","initiation","mascara","battalion","precedent","materialize","magnesium","perimeter","haddock","optometrist","meticulous","cosmodrome","hypothermia","schnauzer","megahertz","regolith","arthritis","persnickety","insurrection","pheasants","pentathletes","Senegal","fascism","duende","predecessor","Polaroid","reservoir","matrilineal","conscious","arnica","carrion","glaucoma","piteously","adrenaline","elliptical","staccato","iridium","romerillo","cemetery","dachshund","rendezvous","Aeolus"],
    'three-bee': ["newt","thrummed","censers","lapels","generosity","burnished","embankment","unrelenting","wallowing","imperial","mortar","arsonists","mewling","generator","persistent","authority","panoramic","Doberman","dominion","decisively","gauntlets","inanimate","lemmings","auditory","appetizing","sentinels","frequency","self-sufficient","prospective","subscription","blithely","conspicuous","preconception","procession","tenuous","perpendicular","hemisphere","seminal","saxophone","torrential","reluctance","consulate","canter","sauntered","propeller","modish","cuisine","juniper","settee","unconscious","influenza","palazzo","finesse","foliage","odorant","irrelevant","curriculum","quizzically","diplomatically","enigmatic","increments","crocheted","calibrate","hypothesis","reassurance","apologetic","credenza","comprehensible","protectorate","Delaware","phenomenon","trenchant","pulmonary","undulating","alleviate","despondent","approximation","phantasmal","legation","echolocation","glycerin","brazier","diffidence","conflagration","alabaster","arachnid","butane","thermotaxis","arugula","pathologically","cataract","inaugurate","vibrometer","affinities","quiche","bioluminescence","mayonnaise","embodiment","euphemism","chickadee","sputum","porpoises","acolyte","asymmetric","cerulean","psychological","innocuous","sharpei","cul-de-sac","assemblage","Tripoli","endothermy","electrolytes","leprosy","neurological","éclair","ototoxic","eureka","mysticetes","irascibility","Aphrodite","annelids","Eritrea","a cappella","bogong moth","kerosene","forsythia","Amharic","yakuza","Pennsylvania","salicylic acid","Gloucester","sensilla","ampulla","stomatopods","prosciutto","eponymous","solenodon","frankincense","chitinous","Presbyterian","Sierra Leone","trichobothria","Krio","lactobacillus","Bildungsroman","Cappadocia","Addis Ababa","spes phthisica","vibrissae"],
};

export const WORDS = Object.values(WORD_LEVELS).flat();

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
