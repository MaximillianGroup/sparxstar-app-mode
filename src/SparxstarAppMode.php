<?php
/**
 * SPARXSTAR App Mode
 *
 * @file        sparxstar-app-mode.php
 * @author      Starisian Technologies (Max Barrett) <support@starisian.com>
 * @license     MIT License
 * @copyright   Copyright (c) 2026 Starisian Technologies
 * 
 * Plugin Name: SPARXSTAR App Mode
 * Description: A zero-dependency engine that transforms specific divs into native-feeling mobile app experiences.
 * Version:     1.2.1
 * Author:      Starisian Technologies (Max Barrett) <support@starisian.com>
 * Text Domain: sparxstar-app-mpde
 */
namespace Starisian\Sparxstar\AppMode;

// exit if not WP
defined( 'ABSPATH' ) || exit;


final class SparxstarAppMode {

    public function __construct() {
        // register hooks
        $this->sparxstarRegisterHooks();
        // register shortcodes
        $this->sparxstarRegisterShortcodes();
    }

    private function sparxstarRegisterHooks(): void {
        // Load assets on the frontend only
        add_action( 'wp_enqueue_scripts', array( $this, 'sparxstarEnqueueAssets' ) );
    }

    private function sparxstarRegisterShortcodes(): void {
        // Optional: Shortcode for easy usage in editors.
        add_shortcode( 'sparxstar_app_mode', array( $this, 'sparxstarRenderShortcode' ) );
    }

    private function sparxstarGetCSSPath(): string {
      // Paths
        $css_path = plugin_dir_url( __FILE__ ) . 'assets/css/sparxstar-app-mode.css';
        $css_min_path = plugin_dir_url(__FILE__) . 'src/css/sparxstar-app-mode.min.css';

      // check if minified css exists, return un-minified css if not
        if( file_exists( $css_min_path ) {
           return $css_min_path;
        } else if ( file_exists( $css_path ) {
            return $css_path;
        } else {
            // return blank string if no file found.
            return '';
        }
    }

    private function sparxstarGetCSSPath(): string {
      // Paths
        $js_path = plugin_dir_url( __FILE__ ) . 'assets/js/sparxstar-app-mode.js';
        $js_min_path = plugin_dir_url(__FILE__) . 'src/js/sparxstar-wp-app-mode.min.js';
      
      // check if minified js exists, return un-minified js if not
        if( file_exists( $js_min_path ) {
           return $js_min_path;
        } else if ( file_exists( $js_path ) {
            return $js_path;
        } else {
            // return blank string if no file found.
            return '';
        }
    }

    /**
     * Enqueue JS and CSS with cache busting
     */
    public function sparxstarEnqueueAssets(): void {
        // Paths
        $css_path = $this->sparxstarGetCSSPath();
        $js_path  = $this->sparxstarGetJSPath();
        
        // Versioning based on file modification time (auto-cache busting)
        $css_ver  = filemtime( plugin_dir_path( __FILE__ ) . 'assets/css/sparxstar-app-mode.min.css' );
        $js_ver   = filemtime( plugin_dir_path( __FILE__ ) . 'assets/js/sparxstar-wp-app-mode..min.js' );

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
    public function sparxstarRenderShortcode( array $atts = [], string $content = null ): string {
        // Allow shortcode attributes if you want to pass extra classes later
        $atts = shortcode_atts( array(
            'class' => '',
        ), $atts );

        // Clean content (standard WP fix for shortcodes)
        $content = do_shortcode( shortcode_unautop( esc_html( $content ) );

        return '<div class="sparxstar-app-mode ' . esc_attr( $atts['class'] ) . '" aria-hidden="false">' . $content . '</div>';
    }
}

// Initialize
// new Sparxstar_App_Mode();
