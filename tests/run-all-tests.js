#!/usr/bin/env node

// Word Club Test Suite Runner
// Runs all tests: unit tests + React anti-pattern checks

const { execSync } = require('child_process');

console.log('🎯 Word Club - Running Full Test Suite\n');

let allPassed = true;

// Run unit tests
try {
    console.log('📦 Running Unit Tests...\n');
    execSync('node tests/app.test.js', { stdio: 'inherit' });
} catch (error) {
    allPassed = false;
}

// Run React lint tests
try {
    console.log('\n🔍 Running React Anti-Pattern Checks...\n');
    execSync('node tests/react-lint.test.js', { stdio: 'inherit' });
} catch (error) {
    allPassed = false;
}

// Summary
console.log('\n' + '='.repeat(60));
if (allPassed) {
    console.log('✅ ALL TEST SUITES PASSED!');
    console.log('='.repeat(60) + '\n');
    process.exit(0);
} else {
    console.log('❌ SOME TESTS FAILED!');
    console.log('='.repeat(60) + '\n');
    process.exit(1);
}
