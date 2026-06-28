import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import App from "./App.tsx"
import { SettingsProvider } from "@/lib/i18n"
import { applyInitialThemePreference } from "@/lib/settings"

applyInitialThemePreference()

const rootElement = document.getElementById("root")
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <SettingsProvider>
        <App />
      </SettingsProvider>
    </StrictMode>
  )
}
