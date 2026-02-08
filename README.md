# sparxstar-app-mode

This is a mobile-first completion environment that temporarily places a form or workflow into a focused, distraction-free frame so users can finish what they started without layout breaks, scrolling friction, or device instability.

## Features

- 🎯 **Focused Experience**: Creates a fullscreen overlay to eliminate distractions
- 📱 **Mobile-First**: Optimized for mobile devices with touch-friendly scrolling
- 🔄 **Easy Toggle**: Simple API to enter and exit app mode
- 🎨 **Customizable**: Configure overlay colors, z-index, and behaviors
- ⚡ **Lightweight**: No dependencies, pure JavaScript
- ✅ **Well-Tested**: Comprehensive test coverage

## Installation

```bash
npm install sparxstar-app-mode
```

## Usage

```javascript
const SparxStarAppMode = require('sparxstar-app-mode');

// Get your form or content element
const formElement = document.getElementById('my-form');

// Initialize app mode
const appMode = new SparxStarAppMode({
  container: formElement,
  onEnter: () => console.log('Entered app mode'),
  onExit: () => console.log('Exited app mode'),
});

// Enter app mode
appMode.enter();

// Exit app mode
appMode.exit();

// Toggle app mode
appMode.toggle();

// Check if active
if (appMode.getIsActive()) {
  console.log('App mode is active');
}
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `container` | HTMLElement | `null` | The element to place in app mode (required) |
| `onEnter` | Function | `() => {}` | Callback fired when entering app mode |
| `onExit` | Function | `() => {}` | Callback fired when exiting app mode |
| `preventScroll` | Boolean | `true` | Prevent body scrolling when in app mode |
| `overlayColor` | String | `'rgba(0, 0, 0, 0.9)'` | Background color of the overlay |
| `zIndex` | Number | `9999` | Z-index of the app mode overlay |

## API

### `enter()`
Enters app mode, creating a fullscreen overlay with your content.

### `exit()`
Exits app mode, restoring the original layout.

### `toggle()`
Toggles between app mode and normal mode.

### `getIsActive()`
Returns `true` if app mode is currently active, `false` otherwise.

## Development

### Prerequisites

- Node.js (v14 or higher)
- npm

### Setup

```bash
# Install dependencies
npm install

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Check formatting
npm run format:check
```

### Project Structure

```
sparxstar-app-mode/
├── src/
│   └── sparxstar-app-mode.js    # Main library file
├── test/
│   └── sparxstar-app-mode.test.js  # Test suite
├── .eslintrc.json                # ESLint configuration
├── .prettierrc.json              # Prettier configuration
├── jest.config.js                # Jest configuration
├── package.json                  # Package configuration
└── README.md                     # Documentation
```

### Running Tests

The project uses Jest for testing with jsdom for DOM manipulation:

```bash
npm test
```

All tests should pass before submitting changes.

### Code Quality

The project uses:
- **ESLint** for code linting
- **Prettier** for code formatting
- **Jest** for testing

Make sure to run linting and formatting before committing:

```bash
npm run lint
npm run format
```

## License

ISC
