/**
 * Accessibility Controls - Text-to-Speech and Font Size
 * Subtle integration with existing design using Font Awesome
 */
class AccessibilityControls {
  constructor() {
    this.fontScaleMin = 0.8;
    this.fontScaleMax = 1.4;
    this.fontScaleStep = 0.1;
    this.currentFontScale = 1.0;
    
    this.isTTSActive = false;
    this.speechSynthesis = window.speechSynthesis;
    this.currentUtterance = null;
    
    this.readableSelectors = [
      '.intro-code',
      '.project-post h3',
      '.project-post p',
      '.footer-code',
      '.footer-code h2',
      '.footer-code p',
      '.copyright',
      'main h1'
    ];
    
    this.init();
  }

  init() {
    this.loadFontScale();
    this.setupEventListeners();
    this.setupTTSClickHandlers();
    this.setupKeyboardShortcuts();
    this.setupMobileMenus();
  }

  /**
   * Font Size Controls
   */
  loadFontScale() {
    const savedScale = localStorage.getItem('fontScale');
    if (savedScale) {
      this.currentFontScale = parseFloat(savedScale);
      this.applyFontScale(this.currentFontScale);
    }
  }

  applyFontScale(scale) {
    document.documentElement.style.setProperty('--font-scale', scale);
    this.updateFontButtons();
  }

  updateFontButtons() {
    const increaseBtn = document.getElementById('font-increase');
    const decreaseBtn = document.getElementById('font-decrease');
    
    if (increaseBtn) {
      increaseBtn.disabled = this.currentFontScale >= this.fontScaleMax;
      increaseBtn.classList.toggle('disabled', this.currentFontScale >= this.fontScaleMax);
    }
    
    if (decreaseBtn) {
      decreaseBtn.disabled = this.currentFontScale <= this.fontScaleMin;
      decreaseBtn.classList.toggle('disabled', this.currentFontScale <= this.fontScaleMin);
    }
  }

  increaseFontSize() {
    if (this.currentFontScale < this.fontScaleMax) {
      this.currentFontScale = Math.min(this.fontScaleMax, this.currentFontScale + this.fontScaleStep);
      this.applyFontScale(this.currentFontScale);
      localStorage.setItem('fontScale', this.currentFontScale.toString());
      this.announceChange(`Font size increased to ${Math.round(this.currentFontScale * 100)}%`);
    }
  }

  decreaseFontSize() {
    if (this.currentFontScale > this.fontScaleMin) {
      this.currentFontScale = Math.max(this.fontScaleMin, this.currentFontScale - this.fontScaleStep);
      this.applyFontScale(this.currentFontScale);
      localStorage.setItem('fontScale', this.currentFontScale.toString());
      this.announceChange(`Font size decreased to ${Math.round(this.currentFontScale * 100)}%`);
    }
  }

  resetFontSize() {
    this.currentFontScale = 1.0;
    this.applyFontScale(this.currentFontScale);
    localStorage.setItem('fontScale', this.currentFontScale.toString());
    this.announceChange('Font size reset to default');
  }

  /**
   * Text-to-Speech Controls
   */
  toggleTTS() {
    this.isTTSActive = !this.isTTSActive;
    const ttsBtn = document.getElementById('tts-toggle');
    
    if (this.isTTSActive) {
      ttsBtn.classList.remove('active');
      ttsBtn.setAttribute('aria-label', 'Disable Text-to-Speech');
      ttsBtn.title = 'Disable TTS (Click on text elements to hear them)';
      ttsBtn.querySelector('i').className = 'fas fa-volume-mute';
      this.announceChange('Text-to-Speech activated. Click on text elements to hear them.');
      this.highlightReadableElements();
    } else {
      ttsBtn.classList.remove('active');
      ttsBtn.setAttribute('aria-label', 'Enable Text-to-Speech');
      ttsBtn.title = 'Enable Text-to-Speech';
      ttsBtn.querySelector('i').className = 'fas fa-volume-up';
      this.stopSpeech();
      this.removeHighlights();
      this.announceChange('Text-to-Speech disabled');
    }
  }

  highlightReadableElements() {
    this.readableSelectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        element.classList.add('tts-enabled');
        element.style.cursor = 'pointer';
        element.setAttribute('data-tts-original-title', element.title || '');
        element.title = 'Click to hear this text';
      });
    });
  }

  removeHighlights() {
    const elements = document.querySelectorAll('.tts-enabled');
    elements.forEach(element => {
      element.classList.remove('tts-enabled', 'tts-highlight');
      element.style.cursor = '';
      const originalTitle = element.getAttribute('data-tts-original-title');
      element.title = originalTitle || '';
      element.removeAttribute('data-tts-original-title');
    });
  }

  setupTTSClickHandlers() {
    document.addEventListener('click', (event) => {
      if (!this.isTTSActive) return;
      
      const clickedElement = event.target.closest(this.readableSelectors.join(', '));
      if (clickedElement) {
        event.preventDefault();
        this.readText(clickedElement);
      }
    });
  }

  readText(element) {
    this.stopSpeech();
    
    let textToRead = this.extractTextContent(element);
    if (!textToRead.trim()) return;

    // Limpar texto para melhor pronuncia
    textToRead = this.cleanTextForSpeech(textToRead);
    
    this.currentUtterance = new SpeechSynthesisUtterance(textToRead);
    this.currentUtterance.lang = 'en-US';
    this.currentUtterance.rate = 0.9;
    this.currentUtterance.pitch = 1;
    this.currentUtterance.volume = 0.8;

    // Destacar elemento sendo lido
    element.classList.add('tts-highlight');
    
    // Remover highlight automaticamente após 3 segundos ou quando terminar
    const removeHighlight = () => {
      element.classList.remove('tts-highlight');
    };

    this.currentUtterance.onend = removeHighlight;
    this.currentUtterance.onerror = (event) => {
      console.warn('TTS Error:', event.error);
      removeHighlight();
    };

    // Backup: remover highlight após 10 segundos no máximo
    setTimeout(removeHighlight, 10000);

    try {
      this.speechSynthesis.speak(this.currentUtterance);
    } catch (error) {
      console.warn('TTS não suportado:', error);
      this.announceChange('Text-to-Speech not available in this browser');
    }
  }

  extractTextContent(element) {
    // Clone o elemento para não afetar o original
    const clone = element.cloneNode(true);
    
    // Remove elementos que não devem ser lidos
    const elementsToRemove = clone.querySelectorAll('i, .fa, .fab, .fas, script, style');
    elementsToRemove.forEach(el => el.remove());
    
    return clone.textContent || clone.innerText || '';
  }

  cleanTextForSpeech(text) {
    return text
      .replace(/\s+/g, ' ')
      .replace(/([.!?])\s*([A-Z])/g, '$1 $2')
      .trim();
  }

  stopSpeech() {
    if (this.speechSynthesis) {
      this.speechSynthesis.cancel();
    }
    
    // Remove highlights de todos os elementos
    const highlighted = document.querySelectorAll('.tts-highlight');
    highlighted.forEach(el => el.classList.remove('tts-highlight'));
  }

  /**
   * Event Listeners
   */
  setupEventListeners() {
    // Font size controls
    document.getElementById('font-increase')?.addEventListener('click', () => this.increaseFontSize());
    document.getElementById('font-decrease')?.addEventListener('click', () => this.decreaseFontSize());
    document.getElementById('font-reset')?.addEventListener('click', () => this.resetFontSize());
    
    // TTS toggle
    document.getElementById('tts-toggle')?.addEventListener('click', () => this.toggleTTS());
    
    // Stop TTS when navigating away
    window.addEventListener('beforeunload', () => this.stopSpeech());
    
    // Pause TTS quando a página perde foco
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.stopSpeech();
      }
    });
  }

  /**
   * Keyboard Shortcuts
   */
  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (event) => {
      // Alt + T: Toggle TTS
      if (event.altKey && event.key === 't') {
        event.preventDefault();
        this.toggleTTS();
      }
      
      // Alt + Plus: Increase font
      if (event.altKey && (event.key === '+' || event.key === '=')) {
        event.preventDefault();
        this.increaseFontSize();
      }
      
      // Alt + Minus: Decrease font
      if (event.altKey && event.key === '-') {
        event.preventDefault();
        this.decreaseFontSize();
      }
      
      // Alt + 0: Reset font
      if (event.altKey && event.key === '0') {
        event.preventDefault();
        this.resetFontSize();
      }
      
      // Escape: Stop TTS
      if (event.key === 'Escape' && this.isTTSActive) {
        this.stopSpeech();
      }
    });
  }

  /**
   * Mobile Menus Setup
   */
  setupMobileMenus() {
    // Accessibility mobile menu
    const accessibilityToggle = document.querySelector('.accessibility-toggle');
    const accessibilityMenu = document.querySelector('.accessibility-menu');
    let accessibilityExpanded = false;

    if (accessibilityToggle && accessibilityMenu) {
      accessibilityToggle.addEventListener('click', () => {
        accessibilityExpanded = !accessibilityExpanded;
        accessibilityMenu.classList.toggle('expanded', accessibilityExpanded);
        accessibilityToggle.classList.toggle('menu-active', accessibilityExpanded);
        accessibilityToggle.setAttribute('aria-expanded', accessibilityExpanded);
        
        // Close social menu if open
        const socialMenu = document.querySelector('.social-menu');
        const socialToggle = document.querySelector('.social-toggle');
        if (socialMenu && socialMenu.classList.contains('expanded')) {
          socialMenu.classList.remove('expanded');
          socialToggle?.classList.remove('menu-active');
          socialToggle?.setAttribute('aria-expanded', false);
        }
      });

      // Mobile accessibility controls
      document.getElementById('tts-toggle-mobile')?.addEventListener('click', () => {
        this.toggleTTS();
        this.updateMobileButtons();
        accessibilityMenu.classList.remove('expanded');
        accessibilityToggle.setAttribute('aria-expanded', false);
      });

      document.getElementById('font-increase-mobile')?.addEventListener('click', () => {
        this.increaseFontSize();
        accessibilityMenu.classList.remove('expanded');
        accessibilityToggle.setAttribute('aria-expanded', false);
      });

      document.getElementById('font-decrease-mobile')?.addEventListener('click', () => {
        this.decreaseFontSize();
        accessibilityMenu.classList.remove('expanded');
        accessibilityToggle.setAttribute('aria-expanded', false);
      });

      document.getElementById('font-reset-mobile')?.addEventListener('click', () => {
        this.resetFontSize();
        accessibilityMenu.classList.remove('expanded');
        accessibilityToggle.setAttribute('aria-expanded', false);
      });
    }

    // Social mobile menu
    const socialToggle = document.querySelector('.social-toggle');
    const socialMenu = document.querySelector('.social-menu');
    let socialExpanded = false;

    if (socialToggle && socialMenu) {
      socialToggle.addEventListener('click', () => {
        socialExpanded = !socialExpanded;
        socialMenu.classList.toggle('expanded', socialExpanded);
        socialToggle.classList.toggle('menu-active', socialExpanded);
        socialToggle.setAttribute('aria-expanded', socialExpanded);
        
        // Close accessibility menu if open
        if (accessibilityMenu && accessibilityMenu.classList.contains('expanded')) {
          accessibilityMenu.classList.remove('expanded');
          accessibilityToggle?.classList.remove('menu-active');
          accessibilityToggle?.setAttribute('aria-expanded', false);
        }
      });
    }

    // Close menus when clicking outside
    document.addEventListener('click', (event) => {
      const isAccessibilityClick = event.target.closest('.accessibility-mobile');
      const isSocialClick = event.target.closest('.social-mobile');

      if (!isAccessibilityClick && accessibilityMenu?.classList.contains('expanded')) {
        accessibilityMenu.classList.remove('expanded');
        accessibilityToggle?.classList.remove('menu-active');
        accessibilityToggle?.setAttribute('aria-expanded', false);
      }

      if (!isSocialClick && socialMenu?.classList.contains('expanded')) {
        socialMenu.classList.remove('expanded');
        socialToggle?.classList.remove('menu-active');
        socialToggle?.setAttribute('aria-expanded', false);
      }
    });
  }

  updateMobileButtons() {
    const mobileTTSButton = document.getElementById('tts-toggle-mobile');
    if (mobileTTSButton) {
      const icon = mobileTTSButton.querySelector('i');
      if (this.isTTSActive) {
        icon.className = 'fas fa-volume-mute';
        mobileTTSButton.classList.add('active');
      } else {
        icon.className = 'fas fa-volume-up';
        mobileTTSButton.classList.remove('active');
      }
    }
  }

  /**
   * Screen Reader Announcements
   */
  announceChange(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }
}

/**
 * Screen Reader Only class
 */
const style = document.createElement('style');
style.textContent = `
  .sr-only {
    position: absolute !important;
    width: 1px !important;
    height: 1px !important;
    padding: 0 !important;
    margin: -1px !important;
    overflow: hidden !important;
    clip: rect(0, 0, 0, 0) !important;
    white-space: nowrap !important;
    border: 0 !important;
  }
  
  .accessibility-btn.disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .tts-enabled {
    transition: all 0.2s ease;
  }
  
  .tts-enabled:hover {
    background-color: rgba(234, 130, 41, 0.1);
    border-radius: 4px;
  }
`;
document.head.appendChild(style);

/**
 * Initialize when DOM is ready
 */
document.addEventListener('DOMContentLoaded', () => {
  new AccessibilityControls();
  
  console.log('🔊 Controles de Acessibilidade carregados');
  console.log('⌨️  Atalhos: Alt+T (TTS), Alt+/- (Fonte), Alt+0 (Reset), Esc (Parar TTS)');
});