/**
 * Tests for extracted game core utilities
 * Verifies that business logic is working correctly when extracted
 * Run with: node tests/utils.test.js
 */

// Import utilities using Node.js require
const path = require('path');


const WORDS = require('../words.js').WORDS;

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
