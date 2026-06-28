import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { JobSource, JobStatus } from "@/types"
import { useSettings, type TranslationKey } from "@/lib/i18n"
import { Search } from "lucide-react"

type SearchBarProps = {
  search: string
  onSearchChange: (value: string) => void
  sourceFilter: JobSource | "All"
  onSourceFilterChange: (value: JobSource | "All") => void
  statusFilter: JobStatus | "All"
  onStatusFilterChange: (value: JobStatus | "All") => void
  pidFilter: string
  onPidFilterChange: (value: string) => void
}

const sourceOptions: Array<{ value: JobSource | "All"; label: TranslationKey }> = [
  { value: "All", label: "allSources" },
  { value: "UserAgent", label: "user" },
  { value: "SystemAgent", label: "systemAgent" },
  { value: "SystemDaemon", label: "daemon" },
]

const statusOptions: Array<{ value: JobStatus | "All"; label: TranslationKey }> = [
  { value: "All", label: "allStatuses" },
  { value: "Running", label: "running" },
  { value: "Loaded", label: "loaded" },
  { value: "Unloaded", label: "unloaded" },
  { value: "Unknown", label: "unknown" },
]

export function SearchBar({
  search,
  onSearchChange,
  sourceFilter,
  onSourceFilterChange,
  statusFilter,
  onStatusFilterChange,
  pidFilter,
  onPidFilterChange,
}: SearchBarProps) {
  const { t } = useSettings()

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative min-w-56 flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t("filterLabel")}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>
      <Select value={sourceFilter} onValueChange={onSourceFilterChange}>
        <SelectTrigger className="w-36" size="sm" aria-label={t("filterSource")}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {sourceOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {t(option.label)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={statusFilter} onValueChange={onStatusFilterChange}>
        <SelectTrigger className="w-36" size="sm" aria-label={t("filterStatus")}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {statusOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {t(option.label)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        inputMode="numeric"
        placeholder={t("filterPid")}
        value={pidFilter}
        onChange={(e) => onPidFilterChange(e.target.value)}
        className="w-32"
        aria-label={t("filterPid")}
      />
    </div>
  )
}
