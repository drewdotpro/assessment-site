// tts-player.ts - Dead simple TTS implementation

type PlayerState = 'idle' | 'playing' | 'paused';

export class TTSPlayer {
  private synthesis: SpeechSynthesis;
  private utterance: SpeechSynthesisUtterance | null = null;
  private state: PlayerState = 'idle';
  private voicesLoaded: boolean = false;

  // Getter that queries DOM fresh each time (Astro navigation can replace elements)
  private get playerElement(): HTMLElement {
    const el = document.getElementById('tts-player');
    if (!el) {
      throw new Error('TTS player element not found');
    }
    return el;
  }

  constructor() {
    // Check browser support
    if (!('speechSynthesis' in window)) {
      alert('Text-to-speech not supported in your browser.');
      throw new Error('SpeechSynthesis not supported');
    }

    this.synthesis = window.speechSynthesis;

    // CRITICAL: Cancel any existing speech from previous session
    this.synthesis.cancel();

    // Load voices (they may not be available immediately)
    // Set up voiceschanged event listener for browsers that load voices async
    this.synthesis.addEventListener('voiceschanged', () => {
      this.voicesLoaded = true;
    });

    // Try to load voices immediately (works in Firefox, fails in Chrome)
    const voices = this.synthesis.getVoices();
    if (voices.length > 0) {
      this.voicesLoaded = true;
    }

    // Verify player element exists (but don't cache it)
    // This will throw if not found
    void this.playerElement;

    // Set up event listeners
    this.setupUI();

    // Store globally for Astro navigation
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).ttsPlayer = this;
  }

  public async start(): Promise<void> {
    // If already playing, don't restart
    if (this.state === 'playing') {
      return;
    }

    // Wait for voices to load if they haven't yet (Chrome race condition fix)
    if (!this.voicesLoaded) {
      await this.waitForVoices();
    }

    // Extract content
    const content = this.extractContent();

    if (!content || content.trim().length === 0) {
      alert('No content found to read aloud.');
      return;
    }

    // Create new utterance
    this.utterance = new SpeechSynthesisUtterance(content);
    this.utterance.rate = 1.0;

    // Select preferred British English voice
    const selectedVoice = this.selectPreferredVoice();
    if (selectedVoice) {
      this.utterance.voice = selectedVoice;
    }

    // Set up event handlers
    this.utterance.onstart = () => {
      this.onStart();
    };
    this.utterance.onend = () => {
      this.onEnd();
    };
    this.utterance.onpause = () => {
      this.onPause();
    };
    this.utterance.onresume = () => {
      this.onResume();
    };
    this.utterance.onerror = (e) => {
      this.onError(e);
    };

    // Start speaking
    this.synthesis.speak(this.utterance);
    this.state = 'playing';

    // Show player
    this.openPlayer();
  }

  public pause(): void {
    if (this.state === 'playing') {
      this.synthesis.pause();
      this.state = 'paused';
      this.updateUI();
    }
  }

  public resume(): void {
    if (this.state === 'paused') {
      this.synthesis.resume();
      this.state = 'playing';
      this.updateUI();
    }
  }

  public stop(): void {
    this.synthesis.cancel();
    this.state = 'idle';
    this.utterance = null;
    this.updateUI();
  }

  public close(): void {
    this.stop();
    this.closePlayer();
  }

  public togglePlayPause(): void {
    if (this.state === 'playing') {
      this.pause();
    } else if (this.state === 'paused') {
      this.resume();
    } else if (this.state === 'idle') {
      this.start();
    }
  }

  public isPlaying(): boolean {
    return this.state === 'playing';
  }

  public updateContent(): void {
    // Called after navigation - stop current playback and close player
    if (this.state !== 'idle') {
      this.stop();
      this.closePlayer();
    }
  }

  // PRIVATE METHODS

  private waitForVoices(): Promise<void> {
    return new Promise((resolve) => {
      // If voices are already loaded, resolve immediately
      if (this.voicesLoaded) {
        resolve();
        return;
      }

      // Wait for voiceschanged event (max 2 seconds timeout)
      const timeout = setTimeout(() => {
        resolve();
      }, 2000);

      const handler = () => {
        clearTimeout(timeout);
        this.voicesLoaded = true;
        resolve();
      };

      this.synthesis.addEventListener('voiceschanged', handler, { once: true });
    });
  }

  private selectPreferredVoice(): SpeechSynthesisVoice | null {
    // Get voices - they should be loaded by now, but check again
    const voices = this.synthesis.getVoices();

    // If voices still not loaded, this is a race condition
    // In some browsers (Chrome), voices load asynchronously
    if (voices.length === 0) {
      return null;
    }

    // Priority 1: British English (en-GB) voices matching specific criteria
    const gb = voices.filter((v) => v.lang.toLowerCase().startsWith('en-gb'));
    if (gb.length > 0) {
      // Check for voices with 'female' in the name first
      const withFemaleTag = gb.find((v) => v.name.toLowerCase().includes('female'));
      if (withFemaleTag) {
        return withFemaleTag;
      }

      // Look for specific preferred voice names
      const preferredNames = ['serena', 'kate', 'susan', 'fiona', 'stephanie'];
      for (const name of preferredNames) {
        const voice = gb.find((v) => v.name.toLowerCase().includes(name));
        if (voice) {
          return voice;
        }
      }

      // Return first British English voice as fallback
      return gb[0];
    }

    // Priority 2: Any English language voice with similar criteria
    const en = voices.filter((v) => v.lang.toLowerCase().startsWith('en'));
    if (en.length > 0) {
      // Check for voices with 'female' in the name
      const withFemaleTag = en.find((v) => v.name.toLowerCase().includes('female'));
      if (withFemaleTag) {
        return withFemaleTag;
      }

      return en[0];
    }

    // Fallback: Use first available voice
    return voices[0];
  }

  private extractContent(): string {
    const main =
      document.querySelector('main') || document.querySelector('[role="main"]') || document.querySelector('article');

    if (!main) {
      console.warn('No main content found');
      return '';
    }

    // Clone the main element so we can modify it without affecting the page
    const clone = main.cloneNode(true) as HTMLElement;

    // Remove UI chrome elements (blacklist approach)
    const skipSelector =
      'nav, header, footer, aside, .tts-player, [aria-hidden="true"], [hidden], button, form, input, select, textarea, .toggle-menu, .accessibility-toggle';
    const elementsToRemove = clone.querySelectorAll(skipSelector);
    elementsToRemove.forEach((el) => el.remove());

    // Use TreeWalker to traverse all text nodes and their parent elements
    // This captures ALL text while respecting block boundaries for natural pauses
    const texts: string[] = [];
    const processedElements = new Set<Element>();

    // Walk the DOM tree to find all elements with direct text content
    const walker = document.createTreeWalker(clone, NodeFilter.SHOW_TEXT, {
      acceptNode: (node) => {
        const text = node.textContent?.trim();
        return text && text.length > 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      },
    });

    let node: Node | null;
    while ((node = walker.nextNode())) {
      const parent = node.parentElement;
      if (!parent || processedElements.has(parent)) continue;

      // Get the parent element's direct text (not nested children)
      const text = parent.textContent?.trim();
      if (!text || text.length === 0) continue;

      processedElements.add(parent);

      // Add period if the text doesn't end with punctuation
      if (!/[.!?,;:]$/.test(text)) {
        texts.push(text + '.');
      } else {
        texts.push(text);
      }
    }

    // Deduplicate identical text strings (in case of odd HTML structures)
    const uniqueTexts = Array.from(new Set(texts));

    return uniqueTexts.join(' ');
  }

  private setupUI(): void {
    // Play/Pause
    const playPauseBtn = this.playerElement.querySelector('.tts-play-pause');
    if (playPauseBtn) {
      playPauseBtn.addEventListener('click', () => {
        this.togglePlayPause();
      });
    }

    // Stop
    const stopBtn = this.playerElement.querySelector('.tts-stop');
    if (stopBtn) {
      stopBtn.addEventListener('click', () => {
        this.stop();
      });
    }

    // Close
    const closeBtn = this.playerElement.querySelector('.tts-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        this.close();
      });
    }

    // Escape key to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.playerElement.getAttribute('aria-hidden') === 'false') {
        this.close();
      }
    });
  }

  private openPlayer(): void {
    this.playerElement.setAttribute('aria-hidden', 'false');
    // Start collapsed to minimize obstruction
    this.playerElement.setAttribute('data-collapsed', 'true');
    // Update UI immediately when opening
    this.updateUI();
  }

  private closePlayer(): void {
    this.playerElement.setAttribute('aria-hidden', 'true');
  }

  private updateUI(): void {
    // Update play/pause button
    const playPauseBtn = this.playerElement.querySelector('.tts-play-pause');

    if (playPauseBtn) {
      if (this.state === 'playing') {
        playPauseBtn.setAttribute('aria-label', 'Pause');
        playPauseBtn.setAttribute('aria-pressed', 'true');
        // Update screen reader text
        const srText = playPauseBtn.querySelector('.sr-only');
        if (srText) srText.textContent = 'Pause';
      } else {
        playPauseBtn.setAttribute('aria-label', 'Play');
        playPauseBtn.setAttribute('aria-pressed', 'false');
        // Update screen reader text
        const srText = playPauseBtn.querySelector('.sr-only');
        if (srText) srText.textContent = 'Play';
      }
    }

    // Update status text in both full player and tab
    const statusEl = this.playerElement.querySelector('#tts-status');
    const tabStatusEl = this.playerElement.querySelector('#tts-tab-status');

    let statusText = 'Stopped';
    if (this.state === 'playing') {
      statusText = 'Listening to Page';
    } else if (this.state === 'paused') {
      statusText = 'Paused';
    }

    if (statusEl) {
      statusEl.textContent = statusText;
    }

    // Update tab with shorter text
    if (tabStatusEl) {
      if (this.state === 'playing') {
        tabStatusEl.textContent = 'Listening';
      } else if (this.state === 'paused') {
        tabStatusEl.textContent = 'Paused';
      } else {
        tabStatusEl.textContent = 'Stopped';
      }
    }
  }

  private onStart(): void {
    this.state = 'playing';
    this.updateUI();
    this.announce('Playing');
  }

  private onEnd(): void {
    this.state = 'idle';
    this.updateUI();
    this.announce('Finished reading');
  }

  private onPause(): void {
    this.state = 'paused';
    this.updateUI();
    this.announce('Paused');
  }

  private onResume(): void {
    this.state = 'playing';
    this.updateUI();
    this.announce('Playing');
  }

  private onError(event: SpeechSynthesisErrorEvent): void {
    console.error('TTS Error:', event.error);
    this.announce(`Error: ${event.error}`);
    this.state = 'idle';
    this.updateUI();
  }

  private announce(message: string): void {
    const statusRegion = this.playerElement.querySelector('[role="status"]');
    if (statusRegion) {
      statusRegion.textContent = message;

      setTimeout(() => {
        statusRegion.textContent = '';
      }, 1000);
    }
  }
}
