<?php

/**
 * SPARXSTAR App Mode
 *
 * @file        sparxstar-app-mode.php
 *
 * @author      Starisian Technologies (Max Barrett) <support@starisian.com>
 * @license     MIT License
 * @copyright   Copyright (c) 2026 Starisian Technologies
 *
 * Version:     1.2.1
 * Author:      Starisian Technologies (Max Barrett) <support@starisian.com>
 * Text Domain: sparxstar-app-mode
 */
namespace Starisian\Sparxstar\Starmus\integrations\appmode;

// exit if not WP
\defined( 'ABSPATH' ) || exit;

final class SparxstarAppMode
{
    public function __construct()
    {
        // register hooks
        $this->sparxstarRegisterHooks();
        // register shortcodes
        $this->sparxstarRegisterShortcodes();
    }

    private function sparxstarRegisterHooks(): void
    {
        // Load assets on the frontend only
        add_action( 'wp_enqueue_scripts', [$this, 'sparxstarEnqueueAssets'] );
    }

    private function sparxstarRegisterShortcodes(): void
    {
        // Optional: Shortcode for easy usage in editors.
        add_shortcode( 'sparxstar_app_mode', [$this, 'sparxstarRenderShortcode'] );
    }

    /**
     * Helper to resolve asset paths and URLs, preferring minified versions.
     *
     * @param string $relative_dir Relative directory from this file (e.g., '../../css/').
     * @param string $filename Base filename (e.g., 'style.css').
     * @param string $min_filename Optional minified filename.
     *
     * @return array{url: string, version: string|false}
     */
    private function sparxstarGetAsset(string $relative_dir, string $filename, string $min_filename = ''): array
    {
        $base_dir_path = plugin_dir_path( __FILE__ ) . $relative_dir;
        $base_dir_url = plugin_dir_url( __FILE__ ) . $relative_dir;

        // 1. Check Minified
        if ( ! empty( $min_filename ) && file_exists( $base_dir_path . $min_filename ) ) {
            return [
                'url' => $base_dir_url . $min_filename,
                'version' => (string) filemtime( $base_dir_path . $min_filename ),
            ];
        }

        // 2. Check Standard
        if ( file_exists( $base_dir_path . $filename ) ) {
            return [
                'url' => $base_dir_url . $filename,
                'version' => (string) filemtime( $base_dir_path . $filename ),
            ];
        }

        // 3. Fallback
        return [
            'url' => '',
            'version' => false,
        ];
    }

    /**
     * Enqueue JS and CSS with cache busting
     */
    public function sparxstarEnqueueAssets(): void
    {
        // Resolve CSS
        $css_asset = $this->sparxstarGetAsset(
            '../../css/',
            'sparxstar-app-mode.css',
            'sparxstar-app-mode.min.css'
        );

        // Resolve JS
        $js_asset = $this->sparxstarGetAsset(
            '../../js/app-mode/',
            'sparxstar-app-mode.js',
            'sparxstar-wp-app-mode.min.js'
        );

        // 1. Enqueue CSS
        if ( ! empty( $css_asset['url'] ) ) {
            wp_enqueue_style(
                'sparxstar-app-mode',
                $css_asset['url'],
                [],
                $css_asset['version'] ?: '1.2.1'
            );
        }

        // 2. Enqueue JS (In Footer = true)
        if ( ! empty( $js_asset['url'] ) ) {
            wp_enqueue_script(
                'sparxstar-app-mode',
                $js_asset['url'],
                [], // No jQuery dependency
                $js_asset['version'] ?: '1.2.1',
                true // Load in footer
            );
        }
    }

    /**
     * Optional Shortcode: [sparxstar_app]Content[/sparxstar_app]
     */
    public function sparxstarRenderShortcode(array $atts = [], string $content = null): string
    {
        $atts = shortcode_atts( [
            'class' => '',
        ], $atts );

        $content = do_shortcode( shortcode_unautop( $content ) );

        return '<div class="sparxstar-app-mode ' . esc_attr( $atts['class'] ) . '" aria-hidden="false">' . $content . '</div>';
    }
}
