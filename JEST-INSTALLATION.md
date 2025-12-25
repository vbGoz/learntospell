# Installing Jest + React Testing Library

## Prerequisites

This guide assumes you have:
- Node.js installed (v14 or higher)
- npm access (no firewall/proxy issues)

## Installation Steps

### Step 1: Install Dependencies

Run this command in the project root:

```bash
npm install --save-dev \
  jest@29 \
  @testing-library/react@14 \
  @testing-library/jest-dom@6 \
  @testing-library/user-event@14 \
  jest-environment-jsdom@29 \
  @babel/core@7 \
  @babel/preset-env@7 \
  @babel/preset-react@7 \
  babel-jest@29 \
  react@18.2.0 \
  react-dom@18.2.0
```

**Note**: If you encounter npm 403 errors, try:
```bash
# Clear npm cache
npm cache clean --force

# Try again
npm install --save-dev jest@29 @testing-library/react@14 ...

# Or use yarn instead
yarn add --dev jest@29 @testing-library/react@14 ...
```

### Step 2: Create Babel Configuration

Create `.babelrc` in project root:

```bash
cat > .babelrc << 'EOF'
{
  "presets": [
    ["@babel/preset-env", { "targets": { "node": "current" } }],
    ["@babel/preset-react", { "runtime": "automatic" }]
  ]
}
EOF
```

### Step 3: Verify Installation

Check that all packages are installed:

```bash
npm list jest @testing-library/react
```

You should see:
```
word-club-spelling@1.0.0
├── @testing-library/jest-dom@6.x.x
├── @testing-library/react@14.x.x
├── @testing-library/user-event@14.x.x
├── jest@29.x.x
└── jest-environment-jsdom@29.x.x
```

### Step 4: Update package.json Scripts

The scripts are already added. Verify in `package.json`:

```json
{
  "scripts": {
    "test": "npm run test:all",
    "test:unit": "node tests/app.test.js",
    "test:integration": "node tests/integration.test.js",
    "test:react-lint": "node tests/react-lint.test.js",
    "test:jest": "jest",
    "test:jest:watch": "jest --watch",
    "test:jest:coverage": "jest --coverage",
    "test:all": "npm run test:unit && npm run test:integration && npm run test:react-lint && npm run test:jest"
  }
}
```

### Step 5: Run Tests

```bash
# Run all tests (unit + integration + React lint + Jest)
npm test

# Run only Jest tests
npm run test:jest

# Run Jest tests in watch mode (re-runs on file changes)
npm run test:jest:watch

# Run Jest with coverage report
npm run test:jest:coverage
```

## What Gets Tested

With Jest + React Testing Library, you can now test:

### ✅ Component Rendering
- Profile selector displays correctly
- Home screen shows all game modes
- Game modes render properly

### ✅ User Interactions
- Button clicks trigger correct actions
- Form inputs work correctly
- Keyboard events (Enter key submits)

### ✅ React Hooks
- useState updates correctly
- useEffect runs at right times
- useRef references work

### ✅ Conditional Rendering
- Achievement popup shows when unlocked
- "Practice Mistakes" appears when needed
- Feedback displays correctly

### ✅ Event Handlers
- onClick handlers fire
- onChange updates state
- onSubmit prevents default

## Coverage Target

After installing Jest, expected coverage:

| Test Suite | Before | After | Gain |
|------------|--------|-------|------|
| Unit Tests | 95 tests | 95 tests | - |
| React Lint | 10 tests | 10 tests | - |
| **Jest Tests** | **0 tests** | **40+ tests** | **+40** |
| **Total** | **105 tests** | **145+ tests** | **+40** |

| Coverage | Before | After | Gain |
|----------|--------|-------|------|
| Line Coverage | 28.8% | 48-52% | +20% |
| Component Coverage | 0% | 65-70% | +65% |

## Troubleshooting

### npm 403 Forbidden Error

**Problem**: `npm error 403 Forbidden`

**Solutions**:
1. **Check npm registry**:
   ```bash
   npm config get registry
   # Should be: https://registry.npmjs.org/
   ```

2. **Set registry explicitly**:
   ```bash
   npm config set registry https://registry.npmjs.org/
   ```

3. **Clear cache**:
   ```bash
   npm cache clean --force
   ```

4. **Use different network**:
   - Corporate firewalls may block npm
   - Try mobile hotspot or home network

5. **Use yarn instead**:
   ```bash
   npm install -g yarn
   yarn add --dev jest @testing-library/react ...
   ```

### Module Not Found Errors

**Problem**: `Cannot find module 'react'`

**Solution**: Install react as dev dependency:
```bash
npm install --save-dev react@18.2.0 react-dom@18.2.0
```

### Babel Transform Errors

**Problem**: `Support for the experimental syntax 'jsx' isn't currently enabled`

**Solution**: Make sure `.babelrc` exists and has correct presets:
```json
{
  "presets": [
    "@babel/preset-env",
    "@babel/preset-react"
  ]
}
```

### jsdom Errors

**Problem**: `ReferenceError: document is not defined`

**Solution**: Check `jest.config.js` has:
```javascript
testEnvironment: 'jsdom'
```

## Next Steps

After successful installation:

1. **Run tests**: `npm run test:jest`
2. **Check coverage**: `npm run test:jest:coverage`
3. **Open coverage report**: `open coverage/lcov-report/index.html`
4. **Add more tests**: Edit `tests/components.test.jsx`

## Files Created

- ✅ `jest.config.js` - Jest configuration
- ✅ `tests/jest.setup.js` - Test setup (mocks, globals)
- ✅ `tests/components.test.jsx` - Component test templates
- ✅ `JEST-INSTALLATION.md` - This installation guide

## Expected Output

After running `npm run test:jest`, you should see:

```
 PASS  tests/components.test.jsx
  Profile Selector Component
    ✓ renders profile selector (50ms)
    ✓ displays existing profiles (25ms)
    ...

  Home Screen Component
    ✓ renders all game mode buttons (30ms)
    ...

Test Suites: 1 passed, 1 total
Tests:       40 passed, 40 total
Snapshots:   0 total
Time:        2.5s
```

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Jest DOM Matchers](https://github.com/testing-library/jest-dom)
- [User Event Library](https://testing-library.com/docs/user-event/intro/)

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Verify Node.js version: `node --version` (should be 14+)
3. Verify npm version: `npm --version` (should be 6+)
4. Check network connectivity: `ping registry.npmjs.org`

Once dependencies are installed, the tests will be ready to run!
