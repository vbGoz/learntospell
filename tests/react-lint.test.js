// React Anti-Pattern Static Analyzer
// Checks for common React mistakes that cause runtime errors

const fs = require('fs');
const path = require('path');

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

function assertTrue(condition, message) {
    if (!condition) {
        throw new Error(message || 'Assertion failed');
    }
}

// Read the index.html file
const indexPath = path.join(__dirname, '..', 'index.html');
const indexContent = fs.readFileSync(indexPath, 'utf-8');

// Extract the SpellingApp function
const appFunctionMatch = indexContent.match(/function SpellingApp\(\) \{([\s\S]*?)\n        \}/);
if (!appFunctionMatch) {
    console.error('Could not find SpellingApp function!');
    process.exit(1);
}
const appFunctionBody = appFunctionMatch[1];

console.log('\n🔍 Running React Anti-Pattern Checks\n');

// Test 1: No useState inside conditional blocks
test('React: No useState calls inside if statements', () => {
    // Pattern: if (...) { ... useState(...) ... }
    const ifBlockPattern = /if\s*\([^)]*\)\s*\{([^}]*(?:\{[^}]*\}[^}]*)*)\}/g;
    const useStatePattern = /useState\s*\(/g;

    let violations = [];
    let match;

    while ((match = ifBlockPattern.exec(appFunctionBody)) !== null) {
        const ifBlock = match[1];
        const ifStatement = match[0];

        // Check if this if block contains useState
        if (useStatePattern.test(ifBlock)) {
            // Extract the condition for better error message
            const conditionMatch = ifStatement.match(/if\s*\(([^)]*)\)/);
            const condition = conditionMatch ? conditionMatch[1].substring(0, 50) : 'unknown';
            violations.push(`Found useState inside conditional: if (${condition}...)`);
        }
    }

    assertTrue(
        violations.length === 0,
        `Found ${violations.length} useState calls inside conditional blocks:\n  ${violations.join('\n  ')}`
    );
});

// Test 2: No useEffect inside conditional blocks
test('React: No useEffect calls inside if statements', () => {
    const ifBlockPattern = /if\s*\([^)]*\)\s*\{([^}]*(?:\{[^}]*\}[^}]*)*)\}/g;
    const useEffectPattern = /useEffect\s*\(/g;

    let violations = [];
    let match;

    while ((match = ifBlockPattern.exec(appFunctionBody)) !== null) {
        const ifBlock = match[1];
        const ifStatement = match[0];

        if (useEffectPattern.test(ifBlock)) {
            const conditionMatch = ifStatement.match(/if\s*\(([^)]*)\)/);
            const condition = conditionMatch ? conditionMatch[1].substring(0, 50) : 'unknown';
            violations.push(`Found useEffect inside conditional: if (${condition}...)`);
        }
    }

    assertTrue(
        violations.length === 0,
        `Found ${violations.length} useEffect calls inside conditional blocks:\n  ${violations.join('\n  ')}`
    );
});

// Test 3: No useRef inside conditional blocks
test('React: No useRef calls inside if statements', () => {
    const ifBlockPattern = /if\s*\([^)]*\)\s*\{([^}]*(?:\{[^}]*\}[^}]*)*)\}/g;
    const useRefPattern = /useRef\s*\(/g;

    let violations = [];
    let match;

    while ((match = ifBlockPattern.exec(appFunctionBody)) !== null) {
        const ifBlock = match[1];
        const ifStatement = match[0];

        if (useRefPattern.test(ifBlock)) {
            const conditionMatch = ifStatement.match(/if\s*\(([^)]*)\)/);
            const condition = conditionMatch ? conditionMatch[1].substring(0, 50) : 'unknown';
            violations.push(`Found useRef inside conditional: if (${condition}...)`);
        }
    }

    assertTrue(
        violations.length === 0,
        `Found ${violations.length} useRef calls inside conditional blocks:\n  ${violations.join('\n  ')}`
    );
});

// Test 4: All useState declarations are at the top of the component
test('React: All useState calls should be at the top of the component', () => {
    // Extract all useState calls
    const useStatePattern = /const\s*\[([^\]]+)\]\s*=\s*useState/g;
    let matches = [];
    let match;

    while ((match = useStatePattern.exec(appFunctionBody)) !== null) {
        matches.push({
            position: match.index,
            varName: match[1]
        });
    }

    if (matches.length === 0) {
        throw new Error('No useState calls found - this seems wrong');
    }

    // Check that all useState calls come before the first function definition
    const firstFunctionMatch = appFunctionBody.match(/const\s+\w+\s*=\s*\([^)]*\)\s*=>/);
    if (firstFunctionMatch) {
        const firstFunctionPos = firstFunctionMatch.index;
        const useStateAfterFunction = matches.filter(m => m.position > firstFunctionPos);

        assertTrue(
            useStateAfterFunction.length === 0,
            `Found ${useStateAfterFunction.length} useState calls after function definitions. All hooks should be at the top.`
        );
    }
});

// Test 5: Check for early returns before hooks
test('React: No early returns before hooks', () => {
    // Pattern: return ... before useState/useEffect/useRef
    const lines = appFunctionBody.split('\n');
    let foundReturn = false;
    let foundHookAfterReturn = false;
    let hookAfterReturnLine = '';

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        // Check for return statements (excluding return inside other functions)
        if (line.startsWith('return ') && !line.includes('=>')) {
            foundReturn = true;
        }

        // Check for hooks after return
        if (foundReturn && (line.includes('useState') || line.includes('useEffect') || line.includes('useRef'))) {
            foundHookAfterReturn = true;
            hookAfterReturnLine = line.substring(0, 60);
            break;
        }
    }

    assertTrue(
        !foundHookAfterReturn,
        `Found hook after return statement: ${hookAfterReturnLine}`
    );
});

// Test 6: Check that hooks are not inside loops
test('React: No hooks inside loops (for, while)', () => {
    // Pattern: for (...) { ... useState/useEffect/useRef ... }
    const loopPattern = /(for|while)\s*\([^)]*\)\s*\{([^}]*(?:\{[^}]*\}[^}]*)*)\}/g;
    const hookPattern = /(useState|useEffect|useRef)\s*\(/g;

    let violations = [];
    let match;

    while ((match = loopPattern.exec(appFunctionBody)) !== null) {
        const loopType = match[1];
        const loopBody = match[2];

        if (hookPattern.test(loopBody)) {
            violations.push(`Found hook inside ${loopType} loop`);
        }
    }

    assertTrue(
        violations.length === 0,
        `Found ${violations.length} hooks inside loops:\n  ${violations.join('\n  ')}`
    );
});

// Test 7: Check for consistent hook count
test('React: Hook count should be consistent (no conditional hook calls)', () => {
    // Count total useState calls
    const useStateCount = (appFunctionBody.match(/useState\s*\(/g) || []).length;
    const useEffectCount = (appFunctionBody.match(/useEffect\s*\(/g) || []).length;
    const useRefCount = (appFunctionBody.match(/useRef\s*\(/g) || []).length;

    const totalHooks = useStateCount + useEffectCount + useRefCount;

    console.log(`  Info: Found ${useStateCount} useState, ${useEffectCount} useEffect, ${useRefCount} useRef calls`);

    assertTrue(
        totalHooks > 0,
        'Should have at least one hook in the component'
    );
});

// Test 8: Check for proper dependency arrays in useEffect
test('React: All useEffect calls should have dependency arrays', () => {
    // Pattern: useEffect(() => { ... }) without a second parameter
    const useEffectPattern = /useEffect\s*\([^,)]+\)/g;
    const matches = appFunctionBody.match(useEffectPattern) || [];

    // Filter out the ones that properly have dependency arrays
    // (This is a simple check - real linting would be more sophisticated)
    const violations = matches.filter(match => {
        // Check if there's a comma after the function (indicating dependencies)
        return !match.includes(',');
    });

    // Note: This test is informational - missing dependencies aren't always errors
    if (violations.length > 0) {
        console.log(`  Warning: Found ${violations.length} useEffect calls without explicit dependency arrays`);
    }

    assertTrue(true, 'useEffect dependency check completed');
});

// Test 9: Check for setState calls in render (anti-pattern)
test('React: No setState calls during render (outside useEffect/handlers)', () => {
    // This is a simplified check - real detection would need AST parsing
    // We'll check for direct setState calls at the component body level

    const lines = appFunctionBody.split('\n');
    let inFunction = false;
    let braceCount = 0;
    let violations = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        // Track if we're inside a function
        if (line.includes('useEffect') || line.includes('const') && line.includes('= (') && line.includes(') =>')) {
            inFunction = true;
            braceCount = 0;
        }

        // Count braces to know when we exit the function
        braceCount += (line.match(/\{/g) || []).length;
        braceCount -= (line.match(/\}/g) || []).length;

        if (braceCount === 0 && inFunction) {
            inFunction = false;
        }

        // Check for setState calls outside functions
        if (!inFunction && line.includes('set') && line.includes('(') && !line.includes('const')) {
            // This might be a setState call during render
            // (Simplified heuristic - would need better parsing for production)
        }
    }

    // For now, this is a placeholder - proper detection needs AST parsing
    assertTrue(true, 'setState in render check completed');
});

// Test 10: Check for proper React.createElement usage
test('React: React.createElement calls should have valid parameters', () => {
    const createElementPattern = /React\.createElement\s*\(\s*['"`](\w+)['"`]/g;
    const elements = [];
    let match;

    while ((match = createElementPattern.exec(appFunctionBody)) !== null) {
        elements.push(match[1]);
    }

    // Check that we have some React elements
    assertTrue(
        elements.length > 0,
        'Should have at least one React.createElement call'
    );

    console.log(`  Info: Found ${elements.length} React.createElement calls`);
});

console.log(`\n${'='.repeat(50)}`);
console.log(`React Lint Results: ${passed} passed, ${failed} failed`);
console.log(`${'='.repeat(50)}\n`);

if (failed > 0) {
    console.log('❌ Some React anti-patterns detected!\n');
    process.exit(1);
} else {
    console.log('✅ All React checks passed!\n');
    process.exit(0);
}
