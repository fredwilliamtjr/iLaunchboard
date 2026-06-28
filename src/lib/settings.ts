export type ThemePreference = "system" | "light" | "dark"
export type Language = "en" | "pt"

export const THEME_STORAGE_KEY = "ilaunchboard.theme"
export const LANGUAGE_STORAGE_KEY = "ilaunchboard.language"

export function getStoredThemePreference(): ThemePreference {
  const value = localStorage.getItem(THEME_STORAGE_KEY)
  return value === "light" || value === "dark" || value === "system"
    ? value
    : "system"
}

export function getStoredLanguage(): Language {
  return localStorage.getItem(LANGUAGE_STORAGE_KEY) === "pt" ? "pt" : "en"
}

export function resolveThemePreference(
  preference: ThemePreference,
  systemIsDark: boolean
) {
  return preference === "system" ? systemIsDark : preference === "dark"
}

export function applyThemePreference(preference: ThemePreference) {
  const systemIsDark =
    window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false
  const isDark = resolveThemePreference(preference, systemIsDark)
  document.documentElement.classList.toggle("dark", isDark)
  document.documentElement.style.colorScheme = isDark ? "dark" : "light"
}

export function applyInitialThemePreference() {
  applyThemePreference(getStoredThemePreference())
}
