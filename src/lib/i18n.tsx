import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import type { JobSource, JobStatus } from "@/types"
import {
  LANGUAGE_STORAGE_KEY,
  THEME_STORAGE_KEY,
  applyThemePreference,
  getStoredLanguage,
  getStoredThemePreference,
  type Language,
  type ThemePreference,
} from "@/lib/settings"

const translations = {
  en: {
    settings: "Settings",
    preferences: "Preferences",
    theme: "Theme",
    language: "Language",
    system: "System",
    light: "Light",
    dark: "Dark",
    english: "English",
    portuguese: "Português",
    refresh: "Refresh",
    newAgent: "New Agent",
    deleteAgent: "Delete Agent",
    deleteAgentConfirm: "Are you sure you want to delete",
    deleteAgentSuffix: "? This will stop the agent and remove its plist file.",
    cancel: "Cancel",
    delete: "Delete",
    label: "Label",
    source: "Source",
    status: "Status",
    pid: "PID",
    lastRun: "Last Run",
    actions: "Actions",
    loadingAgents: "Loading agents...",
    noAgentsFound: "No agents found",
    filterLabel: "Filter label...",
    filterSource: "Filter source",
    filterStatus: "Filter status",
    filterPid: "Filter PID...",
    allSources: "All sources",
    user: "User",
    systemAgent: "System",
    daemon: "Daemon",
    allStatuses: "All statuses",
    running: "Running",
    loaded: "Loaded",
    unloaded: "Unloaded",
    unknown: "Unknown",
    justNow: "just now",
    minuteAgo: "m ago",
    hourAgo: "h ago",
    dayAgo: "d ago",
    stop: "Stop",
    unload: "Unload",
    load: "Load",
    restart: "Restart",
    cannotStopSystemAgents: "Cannot stop system agents",
    cannotUnloadSystemAgents: "Cannot unload system agents",
    cannotLoadSystemAgents: "Cannot load system agents",
    cannotRestartSystemAgents: "Cannot restart system agents",
    testRun: "Test Run",
    details: "Details",
    revealInFinder: "Reveal in Finder",
    loading: "Loading...",
    exit: "Exit",
    lastRunLabel: "Last run",
    edit: "Edit",
    reveal: "Reveal",
    configuration: "Configuration",
    logs: "Logs",
    commands: "Commands",
    program: "Program",
    arguments: "Arguments",
    runAtLoad: "Run at Load",
    keepAlive: "Keep Alive",
    interval: "Interval",
    workingDir: "Working Dir",
    stdout: "Stdout",
    stderr: "Stderr",
    wakeSystem: "Wake System",
    disabled: "Disabled",
    environmentVariables: "Environment Variables",
    schedule: "Schedule",
    standardOutput: "Standard Output",
    standardError: "Standard Error",
    noLogPaths: "No log paths configured for this agent",
    noLogPath: "No log path configured",
    clear: "Clear",
    openInEditor: "Open in Editor",
    empty: "(empty)",
    start: "Start",
    kickstart: "Kickstart",
    enable: "Enable",
    disable: "Disable",
    remove: "Remove",
    copyCommand: "Copy {label} command",
    editAgent: "Edit Agent",
    labelRequired: "Label is required",
    hourRangeInvalid: "Hour range 'from' must be less than or equal to 'to'",
    programArguments: "Program Arguments",
    uniqueIdentifierHelp:
      "Unique identifier for this agent. Use reverse domain notation (e.g. com.yourname.task).",
    programArgumentsHelp:
      'The command to execute, followed by its arguments. Space-separated. Use quotes for arguments containing spaces (e.g. /usr/bin/cmd "arg with spaces").',
    yes: "Yes",
    no: "No",
    runAtLoadHelp: "Start automatically when loaded by launchd.",
    keepAliveHelp: "Restart automatically if the process exits.",
    optional: "optional",
    noSchedule: "No schedule",
    runEverySeconds: "Run every N seconds",
    runAtSpecificTime: "Run at specific time",
    scheduleHelp: 'How to trigger this agent. "No schedule" means manual start only.',
    intervalSeconds: "Interval (seconds)",
    intervalHelp: "e.g. 300 = every 5 minutes, 3600 = every hour.",
    nextRuns: "Next runs",
    hour: "Hour",
    specificHour: "Specific hour",
    everyHour: "Every hour",
    hourRange: "Hour range",
    to: "to",
    hourRangeHelp:
      "Runs every hour within this range (e.g. 7 to 23 = runs at 7:00, 8:00, ... 23:00).",
    minute: "Minute",
    weekday: "Weekday",
    everyDay: "Every day",
    dayOfMonth: "Day of month",
    dayPlaceholder: "Leave empty for every day",
    wakeSystemHelp: "Wake the system from sleep to run this agent at the scheduled time.",
    noUpcomingRuns: "No upcoming runs found",
    workingDirectory: "Working Directory",
    workingDirectoryHelp:
      "Directory to use as the current working directory when running the command.",
    standardOutputPath: "Standard Output Path",
    standardOutputPathHelp:
      "File path to write the command's standard output. Useful for checking execution results.",
    standardErrorPath: "Standard Error Path",
    standardErrorPathHelp:
      "File path to write the command's error output. Useful for debugging failures.",
    saving: "Saving...",
    save: "Save",
    create: "Create",
    sunday: "Sunday",
    monday: "Monday",
    tuesday: "Tuesday",
    wednesday: "Wednesday",
    thursday: "Thursday",
    friday: "Friday",
    saturday: "Saturday",
  },
  pt: {
    settings: "Ajustes",
    preferences: "Preferências",
    theme: "Tema",
    language: "Idioma",
    system: "Sistema",
    light: "Claro",
    dark: "Escuro",
    english: "English",
    portuguese: "Português",
    refresh: "Atualizar",
    newAgent: "Novo agente",
    deleteAgent: "Excluir agente",
    deleteAgentConfirm: "Tem certeza que quer excluir",
    deleteAgentSuffix: "? Isso vai parar o agente e remover o arquivo plist.",
    cancel: "Cancelar",
    delete: "Excluir",
    label: "Label",
    source: "Origem",
    status: "Status",
    pid: "PID",
    lastRun: "Última execução",
    actions: "Ações",
    loadingAgents: "Carregando agentes...",
    noAgentsFound: "Nenhum agente encontrado",
    filterLabel: "Filtrar label...",
    filterSource: "Filtrar origem",
    filterStatus: "Filtrar status",
    filterPid: "Filtrar PID...",
    allSources: "Todas origens",
    user: "Usuário",
    systemAgent: "Sistema",
    daemon: "Daemon",
    allStatuses: "Todos status",
    running: "Rodando",
    loaded: "Carregado",
    unloaded: "Descarregado",
    unknown: "Desconhecido",
    justNow: "agora",
    minuteAgo: "min atrás",
    hourAgo: "h atrás",
    dayAgo: "d atrás",
    stop: "Parar",
    unload: "Descarregar",
    load: "Carregar",
    restart: "Reiniciar",
    cannotStopSystemAgents: "Não é possível parar agentes do sistema",
    cannotUnloadSystemAgents: "Não é possível descarregar agentes do sistema",
    cannotLoadSystemAgents: "Não é possível carregar agentes do sistema",
    cannotRestartSystemAgents: "Não é possível reiniciar agentes do sistema",
    testRun: "Testar execução",
    details: "Detalhes",
    revealInFinder: "Mostrar no Finder",
    loading: "Carregando...",
    exit: "Saída",
    lastRunLabel: "Última execução",
    edit: "Editar",
    reveal: "Mostrar",
    configuration: "Configuração",
    logs: "Logs",
    commands: "Comandos",
    program: "Programa",
    arguments: "Argumentos",
    runAtLoad: "Executar ao carregar",
    keepAlive: "Manter ativo",
    interval: "Intervalo",
    workingDir: "Diretório",
    stdout: "Stdout",
    stderr: "Stderr",
    wakeSystem: "Acordar sistema",
    disabled: "Desativado",
    environmentVariables: "Variáveis de ambiente",
    schedule: "Agendamento",
    standardOutput: "Saída padrão",
    standardError: "Erro padrão",
    noLogPaths: "Nenhum caminho de log configurado para este agente",
    noLogPath: "Nenhum caminho de log configurado",
    clear: "Limpar",
    openInEditor: "Abrir no editor",
    empty: "(vazio)",
    start: "Iniciar",
    kickstart: "Executar agora",
    enable: "Ativar",
    disable: "Desativar",
    remove: "Remover",
    copyCommand: "Copiar comando {label}",
    editAgent: "Editar agente",
    labelRequired: "Label é obrigatório",
    hourRangeInvalid: "O horário inicial deve ser menor ou igual ao final",
    programArguments: "Argumentos do programa",
    uniqueIdentifierHelp:
      "Identificador único deste agente. Use notação de domínio reverso (ex.: com.seunome.tarefa).",
    programArgumentsHelp:
      'O comando a executar, seguido dos argumentos. Separe por espaços. Use aspas para argumentos com espaços (ex.: /usr/bin/cmd "arg com espaços").',
    yes: "Sim",
    no: "Não",
    runAtLoadHelp: "Inicia automaticamente quando carregado pelo launchd.",
    keepAliveHelp: "Reinicia automaticamente se o processo sair.",
    optional: "opcional",
    noSchedule: "Sem agendamento",
    runEverySeconds: "Executar a cada N segundos",
    runAtSpecificTime: "Executar em horário específico",
    scheduleHelp: '"Sem agendamento" significa somente início manual.',
    intervalSeconds: "Intervalo (segundos)",
    intervalHelp: "ex.: 300 = a cada 5 minutos, 3600 = a cada hora.",
    nextRuns: "Próximas execuções",
    hour: "Hora",
    specificHour: "Hora específica",
    everyHour: "Toda hora",
    hourRange: "Faixa de horas",
    to: "até",
    hourRangeHelp:
      "Executa a cada hora dentro da faixa (ex.: 7 até 23 = executa às 7:00, 8:00, ... 23:00).",
    minute: "Minuto",
    weekday: "Dia da semana",
    everyDay: "Todos os dias",
    dayOfMonth: "Dia do mês",
    dayPlaceholder: "Deixe vazio para todos os dias",
    wakeSystemHelp: "Acorda o sistema do repouso para executar no horário agendado.",
    noUpcomingRuns: "Nenhuma execução futura encontrada",
    workingDirectory: "Diretório de trabalho",
    workingDirectoryHelp:
      "Diretório usado como diretório atual ao executar o comando.",
    standardOutputPath: "Caminho da saída padrão",
    standardOutputPathHelp:
      "Arquivo onde a saída padrão do comando será escrita. Útil para checar resultados.",
    standardErrorPath: "Caminho do erro padrão",
    standardErrorPathHelp:
      "Arquivo onde os erros do comando serão escritos. Útil para depurar falhas.",
    saving: "Salvando...",
    save: "Salvar",
    create: "Criar",
    sunday: "Domingo",
    monday: "Segunda",
    tuesday: "Terça",
    wednesday: "Quarta",
    thursday: "Quinta",
    friday: "Sexta",
    saturday: "Sábado",
  },
} as const

export type TranslationKey = keyof typeof translations.en

type SettingsContextValue = {
  language: Language
  setLanguage: (language: Language) => void
  themePreference: ThemePreference
  setThemePreference: (theme: ThemePreference) => void
  t: (key: TranslationKey, replacements?: Record<string, string>) => string
  statusLabel: (status: JobStatus) => string
  sourceLabel: (source: JobSource) => string
}

const SettingsContext = createContext<SettingsContextValue | null>(null)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(getStoredLanguage)
  const [themePreference, setThemePreferenceState] =
    useState<ThemePreference>(getStoredThemePreference)

  useEffect(() => {
    applyThemePreference(themePreference)
    localStorage.setItem(THEME_STORAGE_KEY, themePreference)

    if (themePreference !== "system") return
    const query = window.matchMedia?.("(prefers-color-scheme: dark)")
    if (!query) return
    const handleChange = () => applyThemePreference("system")
    query.addEventListener("change", handleChange)
    return () => query.removeEventListener("change", handleChange)
  }, [themePreference])

  useEffect(() => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language)
    document.documentElement.lang = language === "pt" ? "pt-BR" : "en"
  }, [language])

  const value = useMemo<SettingsContextValue>(() => {
    const t = (
      key: TranslationKey,
      replacements: Record<string, string> = {}
    ) => {
      let value: string = translations[language][key] ?? translations.en[key]
      for (const [name, replacement] of Object.entries(replacements)) {
        value = value.replace(`{${name}}`, replacement)
      }
      return value
    }

    return {
      language,
      setLanguage: setLanguageState,
      themePreference,
      setThemePreference: setThemePreferenceState,
      t,
      statusLabel: (status) => {
        const key = status.toLowerCase() as
          | "running"
          | "loaded"
          | "unloaded"
          | "unknown"
        return t(key)
      },
      sourceLabel: (source) => {
        if (source === "UserAgent") return t("user")
        if (source === "SystemAgent") return t("systemAgent")
        return t("daemon")
      },
    }
  }, [language, themePreference])

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (!context) {
    throw new Error("useSettings must be used inside SettingsProvider")
  }
  return context
}
