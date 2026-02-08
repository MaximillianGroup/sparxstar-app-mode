Here is the complete **WordPress Plugin Package**.

This wraps your **Golden Master v1.2** engine into a standard, installable WordPress plugin. It handles asset loading, cache busting, and ensures the script is placed correctly in the footer.

### 1. Folder Structure
Create a folder named `sparxstar-app-mode` on your computer. Inside it, create these files:

```text
sparxstar-app-mode/
├── sparxstar-app-mode.php   (The plugin loader)
├── assets/
│   ├── css/
│   │   └── sparxstar.css    (Paste Golden Master CSS here)
│   └── js/
│       └── sparxstar.js     (Paste Golden Master JS here)
```

---

### 2. The Plugin File (`sparxstar-app-mode.php`)

Create this file in the root of the folder. It automatically versions your assets based on the file modification time (smart cache busting).

```php
<?php
/**
 * Plugin Name: Sparxstar App Mode Engine
 * Description: A zero-dependency engine that transforms specific divs into native-feeling mobile app experiences.
 * Version: 1.2.0
 * Author: Sparxstar
 * Text Domain: sparxstar-app
 */

defined( 'ABSPATH' ) || exit;

class Sparxstar_App_Mode {

    public function __construct() {
        // Load assets on the frontend only
        add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_assets' ) );
        
        // Optional: Shortcode for easy usage in editors
        add_shortcode( 'starmus_app', array( $this, 'render_shortcode' ) );
    }

    /**
     * Enqueue JS and CSS with cache busting
     */
    public function enqueue_assets() {
        // Paths
        $css_path = plugin_dir_url( __FILE__ ) . 'assets/css/sparxstar.css';
        $js_path  = plugin_dir_url( __FILE__ ) . 'assets/js/sparxstar.js';
        
        // Versioning based on file modification time (auto-cache busting)
        $css_ver  = filemtime( plugin_dir_path( __FILE__ ) . 'assets/css/sparxstar.css' );
        $js_ver   = filemtime( plugin_dir_path( __FILE__ ) . 'assets/js/sparxstar.js' );

        // 1. Enqueue CSS
        wp_enqueue_style( 
            'sparxstar-app-mode', 
            $css_path, 
            array(), 
            $css_ver 
        );

        // 2. Enqueue JS (In Footer = true)
        wp_enqueue_script( 
            'sparxstar-app-mode', 
            $js_path, 
            array(), // No jQuery dependency
            $js_ver, 
            true // Load in footer
        );
    }

    /**
     * Optional Shortcode: [sparxstar_app]Content[/sparxstar_app]
     */
    public function render_shortcode( $atts, $content = null ) {
        // Allow shortcode attributes if you want to pass extra classes later
        $atts = shortcode_atts( array(
            'class' => '',
        ), $atts );

        // Clean content (standard WP fix for shortcodes)
        $content = do_shortcode( shortcode_unautop( $content ) );

        return '<div class="sparxstar-app-mode ' . esc_attr( $atts['class'] ) . '" aria-hidden="false">' . $content . '</div>';
    }
}

// Initialize
new Sparxstar_App_Mode();
```

The code provided uses the native WordPress function `do_shortcode()`, which tells WordPress to **parse and execute any shortcodes found inside the content**.

### How it works technically
In the PHP file I provided, this specific line ensures nested shortcodes (and their attributes) work perfectly:

```php
// logic from the render_shortcode function
$content = do_shortcode( shortcode_unautop( $content ) );
```

1.  **`do_shortcode($content)`**: This scans the content *inside* your `[starmus_app]` tags. If it finds another shortcode (like `[contact-form-7 id="99"]`), it executes that shortcode logic, **preserving all ID, class, and logic attributes** defined on it.
2.  **`shortcode_unautop`**: This cleans up stray `<p>` tags that the WordPress visual editor likes to accidentally wrap around shortcodes, ensuring your layout doesn't break.

### Example Usage
You can nest complex shortcodes with attributes like this, and they will render fully functional inside the App Mode:

```text
[starmus_app class="custom-wrapper"]
    
    <h3>Starmus Entry</h3>
    
    <!-- Nested Shortcode with attributes -->
    [contact-form-7 id="1234" title="Submission Form" html_class="my-form"]

[/starmus_app]
```

### The Output
WordPress will render:
1.  The outer `div` with class `.starmus-app-mode`.
2.  The `h3`.
3.  The **fully rendered HTML** of the Contact Form 7 (inputs, buttons, scripts), respecting the `id="1234"` and `html_class="my-form"` attributes.

It is safe to use with Gravity Forms, WPForms, Sliders, or any other shortcode-based plugin.

---

### 3. The Assets

1.  **`assets/css/sparxstar-app-mode.css`**: Paste the **Golden Master CSS** code here.
2.  **`assets/js/sparxstar-app-mode.js`**: Paste the **Golden Master JS** code here.

---

### 4. How to Install

1.  **Zip it:** Compress the `sparxstar-app-mode` folder into a `.zip` file.
2.  **Upload:** Go to your WordPress Dashboard → **Plugins** → **Add New** → **Upload Plugin**.
3.  **Activate:** Click Activate.

### 5. How to Use in WordPress

You have two ways to use it now:

**Option A: HTML Class (Standard)**
In the Block Editor (HTML Block) or Elementor:
```html
<div class="starmus-app-mode">
   <!-- Your form here -->
</div>
```

**Option B: Shortcode (Easier for Editors)**
I added a helper shortcode for you.
```text
[starmus_app]
   <h3>My Form</h3>
   [contact-form-7 id="123" ...]
[/starmus_app]
```

### 6. Integration Note (For Form Plugins)

If you are using Gravity Forms, WPForms, or CF7, you need to add the **Starmus Submission Contract** event to their specific success hooks.

**Example for Gravity Forms** (Add to your theme's `functions.php` or a separate JS file):

```javascript
// Gravity Forms JS Hook
jQuery(document).on('gform_confirmation_loaded', function(event, formId) {
    // Fire the Sparxstar Engine signal
    window.dispatchEvent(new Event("starmus:submissionAccepted"));
});
```

**Example for Contact Form 7:**

```javascript
document.addEventListener('wpcf7mailsent', function(event) {
    window.dispatchEvent(new Event("starmus:submissionAccepted"));
}, false);
```



