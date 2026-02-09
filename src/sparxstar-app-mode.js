/**
 * SparxStar App Mode
 * A mobile-first completion environment that temporarily places a form or workflow
 * into a focused, distraction-free frame so users can finish what they started
 * without layout breaks, scrolling friction, or device instability.
 */

class SparxStarAppMode {
  constructor(options = {}) {
    this.options = {
      container: options.container || null,
      onEnter: options.onEnter || (() => {}),
      onExit: options.onExit || (() => {}),
      preventScroll: options.preventScroll !== false,
      overlayColor: options.overlayColor || 'rgba(0, 0, 0, 0.9)',
      zIndex: options.zIndex || 9999,
    };
    this.isActive = false;
    this.originalStyles = null;
    this.appModeContainer = null;
  }

  /**
   * Enter app mode - creates a fullscreen overlay with the content
   */
  enter() {
    if (this.isActive) {
      return;
    }

    const container = this.options.container;
    if (!container) {
      throw new Error('Container element is required');
    }

    // Create app mode overlay
    this.appModeContainer = document.createElement('div');
    this.appModeContainer.className = 'sparxstar-app-mode';
    this.appModeContainer.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: ${this.options.overlayColor};
      z-index: ${this.options.zIndex};
      overflow: auto;
      -webkit-overflow-scrolling: touch;
    `;

    // Save original styles and position
    this.originalStyles = {
      position: container.style.position,
      top: container.style.top,
      left: container.style.left,
      width: container.style.width,
      height: container.style.height,
      zIndex: container.style.zIndex,
      parent: container.parentNode,
      nextSibling: container.nextSibling,
    };

    // Move container into app mode
    this.appModeContainer.appendChild(container);
    document.body.appendChild(this.appModeContainer);

    // Prevent body scroll if enabled
    if (this.options.preventScroll) {
      document.body.style.overflow = 'hidden';
    }

    this.isActive = true;
    this.options.onEnter();
  }

  /**
   * Exit app mode - restores original layout
   */
  exit() {
    if (!this.isActive) {
      return;
    }

    const container = this.options.container;

    // Restore container to original position
    if (this.originalStyles.parent) {
      if (this.originalStyles.nextSibling) {
        this.originalStyles.parent.insertBefore(
          container,
          this.originalStyles.nextSibling
        );
      } else {
        this.originalStyles.parent.appendChild(container);
      }
    }

    // Restore original styles
    container.style.position = this.originalStyles.position;
    container.style.top = this.originalStyles.top;
    container.style.left = this.originalStyles.left;
    container.style.width = this.originalStyles.width;
    container.style.height = this.originalStyles.height;
    container.style.zIndex = this.originalStyles.zIndex;

    // Remove app mode container
    if (this.appModeContainer && this.appModeContainer.parentNode) {
      this.appModeContainer.parentNode.removeChild(this.appModeContainer);
    }

    // Restore body scroll
    if (this.options.preventScroll) {
      document.body.style.overflow = '';
    }

    this.isActive = false;
    this.appModeContainer = null;
    this.originalStyles = null;
    this.options.onExit();
  }

  /**
   * Toggle app mode on/off
   */
  toggle() {
    if (this.isActive) {
      this.exit();
    } else {
      this.enter();
    }
  }

  /**
   * Check if app mode is currently active
   */
  getIsActive() {
    return this.isActive;
  }
}

// Export for different module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SparxStarAppMode;
}

if (typeof window !== 'undefined') {
  window.SparxStarAppMode = SparxStarAppMode;
}
