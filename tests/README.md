# Word Club Spelling App - Test Documentation

## Test Suite

This project includes a comprehensive test suite with 25 unit tests covering all core functionality.

## Running Tests

```bash
npm test
```

## Test Coverage

### Word List Tests (4 tests)
- ✓ Verifies exactly 221 words in the list
- ✓ Ensures no duplicate words
- ✓ Checks for no empty strings
- ✓ Validates word list parsing

### Difficulty Filtering Tests (7 tests)
- ✓ "All" filter returns all 221 words
- ✓ "Very Easy" returns 40 words
- ✓ "Easy" returns 39 words
- ✓ "Medium" returns 39 words
- ✓ "Medium-Hard" returns 36 words
- ✓ "Hard" returns 35 words
- ✓ "Very Hard" returns 32 words

### Spelling Check Tests (5 tests)
- ✓ Correct spelling (exact match)
- ✓ Case-insensitive matching
- ✓ Whitespace trimming
- ✓ Incorrect spelling detection
- ✓ Empty input handling

### Unscramble Tests (3 tests)
- ✓ Correct word assembly
- ✓ Incorrect word detection
- ✓ Case-insensitive matching

### Data Integrity Tests (6 tests)
- ✓ Category membership verification
- ✓ Special character handling (pâtisserie, compañero, geländesprung, protégé)
- ✓ Multi-word phrase support (cri de coeur, chaise longue)
- ✓ All category words exist in main list
- ✓ No duplicate words across categories
- ✓ Total words across categories equals 221

## Test Results

```
🧪 25 tests
✅ 25 passed
❌ 0 failed
```

## What's Tested

1. **Word List Integrity**: Ensures the word list has exactly 221 unique, non-empty words
2. **Difficulty Categorization**: Verifies each difficulty level contains the correct number of words
3. **Spelling Logic**: Tests the core spelling check algorithm with various inputs
4. **Unscramble Logic**: Validates the letter unscrambling game mechanics
5. **Special Cases**: Tests handling of accented characters and multi-word phrases

## What's NOT Tested

These require browser/DOM testing (future work):
- React component rendering
- User interactions (button clicks, typing)
- Audio/TTS functionality (Puter.js)
- State management (React hooks)
- Navigation between modes
- Score and streak calculations (requires simulating full game flow)

## Future Improvements

To add full integration tests:
1. Set up Jest + React Testing Library
2. Add DOM testing with jsdom
3. Mock Puter.js for TTS testing
4. Test full user flows (complete game sessions)
5. Add visual regression testing
