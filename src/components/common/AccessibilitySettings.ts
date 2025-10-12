export interface AccessibilitySettings {
  font: 'sylexiad' | 'opendyslexic' | 'fast';
  theme: 'light' | 'dark' | 'system';
  textSize: 'xs' | 'sm' | 'base' | 'lg' | 'xl';
  lineHeight: 'compact' | 'normal' | 'relaxed';
  readingRuler: boolean;
}

export const DEFAULT_SETTINGS: AccessibilitySettings = {
  font: 'sylexiad',
  theme: 'system',
  textSize: 'base',
  lineHeight: 'normal',
  readingRuler: false,
};

export function getSettings(): AccessibilitySettings {
  if (typeof localStorage === 'undefined') return DEFAULT_SETTINGS;

  const stored = localStorage.getItem('accessibility-preferences');
  if (!stored) return DEFAULT_SETTINGS;

  try {
    return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: AccessibilitySettings): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem('accessibility-preferences', JSON.stringify(settings));
}

export function resetSettings(): AccessibilitySettings {
  if (typeof localStorage === 'undefined') return DEFAULT_SETTINGS;
  localStorage.removeItem('accessibility-preferences');
  return DEFAULT_SETTINGS;
}
