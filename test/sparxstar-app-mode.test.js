/**
 * Tests for SparxStar App Mode
 */

const SparxStarAppMode = require('../src/sparxstar-app-mode');

describe('SparxStarAppMode', () => {
  let appMode;
  let container;

  beforeEach(() => {
    // Set up DOM
    document.body.innerHTML = `
      <div id="main-content">
        <form id="test-form">
          <input type="text" name="email" />
          <button type="submit">Submit</button>
        </form>
      </div>
    `;
    container = document.getElementById('test-form');
  });

  afterEach(() => {
    if (appMode && appMode.isActive) {
      appMode.exit();
    }
    document.body.innerHTML = '';
  });

  describe('constructor', () => {
    it('should create instance with default options', () => {
      appMode = new SparxStarAppMode({ container });
      expect(appMode.options.container).toBe(container);
      expect(appMode.options.preventScroll).toBe(true);
      expect(appMode.options.overlayColor).toBe('rgba(0, 0, 0, 0.9)');
      expect(appMode.options.zIndex).toBe(9999);
      expect(appMode.isActive).toBe(false);
    });

    it('should create instance with custom options', () => {
      const customOptions = {
        container,
        preventScroll: false,
        overlayColor: 'rgba(255, 255, 255, 0.95)',
        zIndex: 5000,
      };
      appMode = new SparxStarAppMode(customOptions);
      expect(appMode.options.preventScroll).toBe(false);
      expect(appMode.options.overlayColor).toBe('rgba(255, 255, 255, 0.95)');
      expect(appMode.options.zIndex).toBe(5000);
    });

    it('should accept callback functions', () => {
      const onEnter = jest.fn();
      const onExit = jest.fn();
      appMode = new SparxStarAppMode({ container, onEnter, onExit });
      expect(appMode.options.onEnter).toBe(onEnter);
      expect(appMode.options.onExit).toBe(onExit);
    });
  });

  describe('enter()', () => {
    beforeEach(() => {
      appMode = new SparxStarAppMode({ container });
    });

    it('should throw error if no container provided', () => {
      appMode = new SparxStarAppMode({});
      expect(() => appMode.enter()).toThrow('Container element is required');
    });

    it('should create app mode overlay', () => {
      appMode.enter();
      const overlay = document.querySelector('.sparxstar-app-mode');
      expect(overlay).toBeTruthy();
      expect(overlay.style.position).toBe('fixed');
      expect(overlay.style.top).toBe('0px');
      expect(overlay.style.left).toBe('0px');
      expect(overlay.style.width).toBe('100%');
      expect(overlay.style.height).toBe('100%');
    });

    it('should set isActive to true', () => {
      expect(appMode.isActive).toBe(false);
      appMode.enter();
      expect(appMode.isActive).toBe(true);
    });

    it('should prevent body scroll by default', () => {
      appMode.enter();
      expect(document.body.style.overflow).toBe('hidden');
    });

    it('should not prevent body scroll if disabled', () => {
      appMode = new SparxStarAppMode({ container, preventScroll: false });
      appMode.enter();
      expect(document.body.style.overflow).not.toBe('hidden');
    });

    it('should move container into app mode', () => {
      const originalParent = container.parentNode;
      appMode.enter();
      expect(container.parentNode.className).toBe('sparxstar-app-mode');
      expect(container.parentNode).not.toBe(originalParent);
    });

    it('should call onEnter callback', () => {
      const onEnter = jest.fn();
      appMode = new SparxStarAppMode({ container, onEnter });
      appMode.enter();
      expect(onEnter).toHaveBeenCalledTimes(1);
    });

    it('should do nothing if already active', () => {
      const onEnter = jest.fn();
      appMode = new SparxStarAppMode({ container, onEnter });
      appMode.enter();
      appMode.enter();
      expect(onEnter).toHaveBeenCalledTimes(1);
    });

    it('should save original styles', () => {
      container.style.position = 'relative';
      container.style.zIndex = '100';
      appMode.enter();
      expect(appMode.originalStyles.position).toBe('relative');
      expect(appMode.originalStyles.zIndex).toBe('100');
    });
  });

  describe('exit()', () => {
    beforeEach(() => {
      appMode = new SparxStarAppMode({ container });
    });

    it('should do nothing if not active', () => {
      const onExit = jest.fn();
      appMode = new SparxStarAppMode({ container, onExit });
      appMode.exit();
      expect(onExit).not.toHaveBeenCalled();
    });

    it('should restore container to original position', () => {
      const originalParent = container.parentNode;
      appMode.enter();
      appMode.exit();
      expect(container.parentNode).toBe(originalParent);
    });

    it('should remove app mode overlay', () => {
      appMode.enter();
      expect(document.querySelector('.sparxstar-app-mode')).toBeTruthy();
      appMode.exit();
      expect(document.querySelector('.sparxstar-app-mode')).toBeFalsy();
    });

    it('should restore body scroll', () => {
      appMode.enter();
      expect(document.body.style.overflow).toBe('hidden');
      appMode.exit();
      expect(document.body.style.overflow).toBe('');
    });

    it('should set isActive to false', () => {
      appMode.enter();
      expect(appMode.isActive).toBe(true);
      appMode.exit();
      expect(appMode.isActive).toBe(false);
    });

    it('should call onExit callback', () => {
      const onExit = jest.fn();
      appMode = new SparxStarAppMode({ container, onExit });
      appMode.enter();
      appMode.exit();
      expect(onExit).toHaveBeenCalledTimes(1);
    });

    it('should restore original styles', () => {
      container.style.position = 'relative';
      container.style.zIndex = '100';
      appMode.enter();
      appMode.exit();
      expect(container.style.position).toBe('relative');
      expect(container.style.zIndex).toBe('100');
    });

    it('should clear internal state', () => {
      appMode.enter();
      appMode.exit();
      expect(appMode.appModeContainer).toBeNull();
      expect(appMode.originalStyles).toBeNull();
    });
  });

  describe('toggle()', () => {
    beforeEach(() => {
      appMode = new SparxStarAppMode({ container });
    });

    it('should enter app mode when not active', () => {
      expect(appMode.isActive).toBe(false);
      appMode.toggle();
      expect(appMode.isActive).toBe(true);
    });

    it('should exit app mode when active', () => {
      appMode.enter();
      expect(appMode.isActive).toBe(true);
      appMode.toggle();
      expect(appMode.isActive).toBe(false);
    });

    it('should toggle multiple times', () => {
      appMode.toggle();
      expect(appMode.isActive).toBe(true);
      appMode.toggle();
      expect(appMode.isActive).toBe(false);
      appMode.toggle();
      expect(appMode.isActive).toBe(true);
    });
  });

  describe('getIsActive()', () => {
    beforeEach(() => {
      appMode = new SparxStarAppMode({ container });
    });

    it('should return false initially', () => {
      expect(appMode.getIsActive()).toBe(false);
    });

    it('should return true when active', () => {
      appMode.enter();
      expect(appMode.getIsActive()).toBe(true);
    });

    it('should return false after exit', () => {
      appMode.enter();
      appMode.exit();
      expect(appMode.getIsActive()).toBe(false);
    });
  });

  describe('custom styling', () => {
    it('should use custom overlay color', () => {
      appMode = new SparxStarAppMode({
        container,
        overlayColor: 'rgba(255, 0, 0, 0.8)',
      });
      appMode.enter();
      const overlay = document.querySelector('.sparxstar-app-mode');
      expect(overlay.style.background).toContain('rgba(255, 0, 0, 0.8)');
    });

    it('should use custom z-index', () => {
      appMode = new SparxStarAppMode({ container, zIndex: 12345 });
      appMode.enter();
      const overlay = document.querySelector('.sparxstar-app-mode');
      expect(overlay.style.zIndex).toBe('12345');
    });
  });
});
