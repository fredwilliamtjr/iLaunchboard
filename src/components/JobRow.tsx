import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { TableCell, TableRow } from "@/components/ui/table"
import type { JobListEntry } from "@/types"
import { useSettings } from "@/lib/i18n"
import {
  Play,
  Square,
  RotateCw,
  MoreHorizontal,
  Trash2,
  FileText,
  FolderOpen,
  Zap,
} from "lucide-react"

function formatRelativeTime(
  epochMillis: string,
  t: ReturnType<typeof useSettings>["t"]
): string {
  const ms = Number(epochMillis)
  if (isNaN(ms)) return "—"
  const diff = Date.now() - ms
  const seconds = Math.floor(diff / 1000)
  if (seconds < 60) return t("justNow")
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}${t("minuteAgo")}`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}${t("hourAgo")}`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}${t("dayAgo")}`
  const date = new Date(ms)
  return `${date.getMonth() + 1}/${date.getDate()}`
}

type JobRowProps = {
  job: JobListEntry
  onStart: (job: JobListEntry) => void
  onStop: (job: JobListEntry) => void
  onRestart: (job: JobListEntry) => void
  onKickstart: (job: JobListEntry) => void
  onDelete: (job: JobListEntry) => void
  onSelect: (job: JobListEntry) => void
  onRevealInFinder: (job: JobListEntry) => void
}

function StatusBadge({ status }: { status: JobListEntry["status"] }) {
  const { statusLabel } = useSettings()

  switch (status) {
    case "Running":
      return (
        <Badge variant="default" className="bg-emerald-500 hover:bg-emerald-600">
          {statusLabel(status)}
        </Badge>
      )
    case "Loaded":
      return (
        <Badge variant="default" className="bg-blue-500 hover:bg-blue-600">
          {statusLabel(status)}
        </Badge>
      )
    case "Unloaded":
      return <Badge variant="secondary">{statusLabel(status)}</Badge>
    default:
      return <Badge variant="outline">{statusLabel(status)}</Badge>
  }
}

function SourceBadge({ source }: { source: JobListEntry["source"] }) {
  const { sourceLabel } = useSettings()

  switch (source) {
    case "UserAgent":
      return <Badge variant="outline">{sourceLabel(source)}</Badge>
    case "SystemAgent":
      return (
        <Badge variant="outline" className="border-blue-300 text-blue-700">
          {sourceLabel(source)}
        </Badge>
      )
    case "SystemDaemon":
      return (
        <Badge variant="outline" className="border-purple-300 text-purple-700">
          {sourceLabel(source)}
        </Badge>
      )
  }
}

export function JobRow({
  job,
  onStart,
  onStop,
  onRestart,
  onKickstart,
  onDelete,
  onSelect,
  onRevealInFinder,
}: JobRowProps) {
  const { t } = useSettings()
  const isUserAgent = job.source === "UserAgent"

  return (
    <TableRow
      className="cursor-pointer hover:bg-muted/50"
      onClick={() => onSelect(job)}
    >
      <TableCell className="font-medium truncate max-w-0">{job.label}</TableCell>
      <TableCell>
        <SourceBadge source={job.source} />
      </TableCell>
      <TableCell>
        <StatusBadge status={job.status} />
      </TableCell>
      <TableCell className="text-muted-foreground tabular-nums">
        {job.pid ?? "—"}
      </TableCell>
      <TableCell className="text-muted-foreground text-xs tabular-nums">
        {job.last_run_at ? formatRelativeTime(job.last_run_at, t) : "—"}
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          {job.status === "Running" ? (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onStop(job)}
              disabled={!isUserAgent}
              title={isUserAgent ? t("stop") : t("cannotStopSystemAgents")}
            >
              <Square className="h-4 w-4" />
            </Button>
          ) : job.status === "Loaded" ? (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onStop(job)}
              disabled={!isUserAgent}
              title={isUserAgent ? t("unload") : t("cannotUnloadSystemAgents")}
            >
              <Square className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onStart(job)}
              disabled={!isUserAgent}
              title={isUserAgent ? t("load") : t("cannotLoadSystemAgents")}
            >
              <Play className="h-4 w-4" />
            </Button>
          )}
          {job.status !== "Unloaded" && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onRestart(job)}
              disabled={!isUserAgent}
              title={isUserAgent ? t("restart") : t("cannotRestartSystemAgents")}
            >
              <RotateCw className="h-4 w-4" />
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onKickstart(job)}>
                <Zap className="mr-2 h-4 w-4" />
                {t("testRun")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onSelect(job)}>
                <FileText className="mr-2 h-4 w-4" />
                {t("details")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onRevealInFinder(job)}>
                <FolderOpen className="mr-2 h-4 w-4" />
                {t("revealInFinder")}
              </DropdownMenuItem>
              {isUserAgent && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() => onDelete(job)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    {t("delete")}
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </TableCell>
    </TableRow>
  )
}
