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

![app-mode](https://github.com/user-attachments/assets/36889919-62b4-437e-a05b-752c4bed6f2b)

SPARXSTAR App Mode

**A zero-dependency, framework-agnostic UI engine that transforms standard HTML elements into native-feeling, full-screen mobile experiences.**

Overview
--------

The **Sparxstar App Mode Engine** intercepts user interactions on specific container elements to create a focused, "app-like" state. It manages:

-   **Browser History:** Maps the open state to the history stack (Back button closes the modal).

    -   **Touch Gestures:** Physics-based "Swipe Down" to dismiss (with momentum detection).

    -   **Scroll Locking:** Hardened iOS/Android body scroll freezing.

    -   **Accessibility:** WAI-ARIA compliance, focus trapping, and screen reader management.

    -   **Viewport Scaling:** Smart logic to fit content to the screen without squashing scrollable forms.

* * * * *

1\. Installation
----------------

### CSS

Include the stylesheet in your <head>.\
(See sparxstar-app.css for the Golden Master styles).

code Html

downloadcontent_copy

expand_less

```
<link rel="stylesheet" href="path/to/sparxstar-app.css">
```

### JavaScript

Include the engine at the end of your <body>.\
(See sparxstar-app.js for the Golden Master logic).

code Html

downloadcontent_copy

expand_less

```
<script src="path/to/sparxstar-app.js" defer></script>
```

* * * * *

2\. Usage (HTML)
----------------

To activate App Mode, simply add the trigger class to any container. No inline JavaScript is required.

**Supported Classes:**  .sparxstar-app-mode or .starmus-app-mode

code Html

play_circledownloadcontent_copy

expand_less

```
<!-- The Trigger Container -->
<div class="starmus-app-mode">

    <!-- Optional: A visible close button is recommended for UX -->
    <button type="button" onclick="window.history.back()" class="close-btn">
        &times; Close
    </button>

    <!-- Content -->
    <div class="app-content">
        <h2>Mobile Form</h2>
        <form>
            <!-- Inputs... -->
        </form>
    </div>

</div>
```

**Note:** The engine only activates if the screen width is **≤ 1024px** (Tablets/Mobile). On desktop, these classes do nothing by default.

* * * * *

3\. The SPARXSTAR Submission Contract (Integration)
-------------------------------------------------

This is the **strict requirement** for closing the App Mode programmatically (e.g., after a successful form submission).

### The Rule

The UI must **ONLY** close when data is durably committed (Server 200 OK or IndexedDB success). Do not close on validation errors or loading states.

### The Code

Dispatch the specific event starmus:submissionAccepted on the window object.

code JavaScript

downloadcontent_copy

expand_less

```
// Example AJAX Submission Handler
function handleSubmit(formData) {

    api.post('/submit', formData)
        .then(response => {
            // 1. Success! Data is saved.
            showSuccessToast();

            // 2. FIRE THE SIGNAL to close App Mode
            window.dispatchEvent(new Event("starmus:submissionAccepted"));
        })
        .catch(error => {
            // Do NOT fire the event. User remains in App Mode to fix errors.
            showError(error);
        });
}
```

* * * * *

5\. Design Constraints (Integration)
-------------------------------------------------
If you put a form inside this engine that is hard-coded to width: 800px, the engine **will** work, but it will scale that form down to fit a mobile screen (e.g., 375px wide). That results in a **0.46x scale**, meaning text becomes microscopic and buttons become too small to tap.

The Engine guarantees it **fits**, but only **you** can guarantee it is **legible**.

### The "Responsive Safety Net" CSS (Opt-In)

To ensure forms (e.g. WordPress, Gravity Forms, CF7, WPForms) play nice inside App Mode, a safety net is in place to ensure text is legible and elemets and functionally finger-sized. the form safety net is opt-in (via a utility class) and is not enforced until activated. Activaton of the safety net prevents the accidental breaking of a custom-designed form that might rely on a specific layout, while still providing a "one-click fix" for broken Gravity/Contact Forms or native forms. This is **smart engineering**.

The CSS logic itself:
1.  **Selector Strategy:** `.sparxstar-active.sparxstar-form-safe` correctly targets the specific open modal that has the safety class.
2.  **Input Sizing:** `16px` font size effectively kills the annoying iOS zoom-on-focus behavior.
3.  **Touch Targets:** `44px` height meets Apple's Human Interface Guidelines.
4.  **Checkbox Fix:** Explicitly sizing checkboxes to `20px` is a great detail, as standard browser checkboxes are often too hard to tap on mobile.

### How to use this in your workflow

Since this is Opt-In, you need to tell the HTML or Shortcode to include that specific class.

**Option A: HTML**
```html
<!-- Add 'sparxstar-form-safe' to your wrapper -->
<div class="starmus-app-mode sparxstar-form-safe">
    [contact-form-7 id="123"]
</div>
```

**Option B: Shortcode**
If you use the shortcode provided in the WORDPRESS.md file, you can pass it via the `class` attribute:
```text
[starmus_app class="sparxstar-form-safe"]
    [gravityform id="1"]
[/starmus_app]
```

5\. Key Features & Behavior
---------------------------

### 📱 Native Gestures

-   **Swipe to Close:** Users can drag the UI down from the top to close it.

    -   **Momentum:** A fast flick will close the app even if the drag distance is short.

    -   **Safety:** Gestures are disabled if the user is interacting with input, select, textarea, or range elements to prevent accidental closes while typing.

### 🛡️ iOS Hardening

-   **Scroll Locking:** Uses position: fixed + top offset to prevent the background page from jumping on iOS Safari.

    -   **Keyboard Jitter:** Detects virtual keyboard resizing and prevents the UI from recalculating scale/layout unnecessarily.

### ♿ Accessibility (A11y)

-   **Focus Trap:** Keyboard navigation (Tab/Shift+Tab) is constrained within the modal while open.

    -   **ARIA:** Applies role="dialog" and aria-modal="true".

    -   **Reduced Motion:** Respects user system settings to disable animations while keeping functionality intact.

### 🔄 State Management

-   **History API:** Opening the app pushes a state to the browser history.

    -   **Back Button:** Pressing "Back" cleanly closes the app mode and restores the previous scroll position.

    -   **Refresh Safety:** If the page is refreshed while in App Mode, the engine cleans up the history state to prevent "ghost" entries.

* * * * *

5\. Technical Constraints
-------------------------

-   **Threshold:** The engine initializes only if window.innerWidth <= 1024.

    -   **One Instance:** Only one App Mode element can be active at a time.

    -   **Scaling:**

    -   If content fits the screen, it scales to fill the viewport (max scale 1.0).

        -   If content is tall (requires scrolling), scaling is disabled vertically to allow native scrolling.

* * * * *

6\. QA Checklist
----------------

Before deploying, verify:

**Open:** Tapping the div opens full screen.

**Scroll:** Background body does not scroll while App Mode is open.

**Input:** Tapping an input field opens the keyboard without breaking the layout.

**Swipe:** Dragging down closes the app (unless scrolled down).

**Back Button:** Browser Back button closes the app.

**Submission:** Successful form submit fires sparxstar:submissionAccepted and closes the view.
