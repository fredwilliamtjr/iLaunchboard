import { useMemo, useState, type ReactNode } from "react"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { JobRow } from "@/components/JobRow"
import type { JobListEntry } from "@/types"
import { useSettings } from "@/lib/i18n"
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react"

type SortKey = "label" | "source" | "status" | "pid" | "last_run_at"
type SortDirection = "asc" | "desc"

const sourceRank: Record<JobListEntry["source"], number> = {
  UserAgent: 0,
  SystemAgent: 1,
  SystemDaemon: 2,
}

const statusRank: Record<JobListEntry["status"], number> = {
  Running: 0,
  Loaded: 1,
  Unloaded: 2,
  Unknown: 3,
}

function compareNullableNumber(a: number | null, b: number | null) {
  if (a === null && b === null) return 0
  if (a === null) return 1
  if (b === null) return -1
  return a - b
}

function compareJobs(a: JobListEntry, b: JobListEntry, key: SortKey) {
  switch (key) {
    case "label":
      return a.label.localeCompare(b.label)
    case "source":
      return sourceRank[a.source] - sourceRank[b.source]
    case "status":
      return statusRank[a.status] - statusRank[b.status]
    case "pid":
      return compareNullableNumber(a.pid, b.pid)
    case "last_run_at":
      return compareNullableNumber(
        a.last_run_at ? Number(a.last_run_at) : null,
        b.last_run_at ? Number(b.last_run_at) : null
      )
  }
}

function isEmptySortValue(job: JobListEntry, key: SortKey) {
  if (key === "pid") return job.pid === null
  if (key === "last_run_at") return job.last_run_at === null
  return false
}

function SortableHead({
  sortKey,
  activeSortKey,
  direction,
  className,
  children,
  onSort,
}: {
  sortKey: SortKey
  activeSortKey: SortKey
  direction: SortDirection
  className?: string
  children: ReactNode
  onSort: (key: SortKey) => void
}) {
  const isActive = activeSortKey === sortKey
  const Icon = isActive ? direction === "asc" ? ArrowUp : ArrowDown : ArrowUpDown

  return (
    <TableHead
      className={className}
      aria-sort={
        isActive ? (direction === "asc" ? "ascending" : "descending") : "none"
      }
    >
      <Button
        variant="ghost"
        size="sm"
        className="-ml-2 h-8 px-2 font-medium"
        onClick={() => onSort(sortKey)}
      >
        {children}
        <Icon className="h-3.5 w-3.5" />
      </Button>
    </TableHead>
  )
}

type JobListProps = {
  jobs: JobListEntry[]
  loading: boolean
  onStart: (job: JobListEntry) => void
  onStop: (job: JobListEntry) => void
  onRestart: (job: JobListEntry) => void
  onKickstart: (job: JobListEntry) => void
  onDelete: (job: JobListEntry) => void
  onSelect: (job: JobListEntry) => void
  onRevealInFinder: (job: JobListEntry) => void
}

export function JobList({
  jobs,
  loading,
  onStart,
  onStop,
  onRestart,
  onKickstart,
  onDelete,
  onSelect,
  onRevealInFinder,
}: JobListProps) {
  const { t } = useSettings()
  const [sortKey, setSortKey] = useState<SortKey>("label")
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")

  const sortedJobs = useMemo(() => {
    return [...jobs].sort((a, b) => {
      const isAEmpty = isEmptySortValue(a, sortKey)
      const isBEmpty = isEmptySortValue(b, sortKey)
      if (isAEmpty && isBEmpty) return a.label.localeCompare(b.label)
      if (isAEmpty) return 1
      if (isBEmpty) return -1

      const result = compareJobs(a, b, sortKey)
      if (result === 0) return a.label.localeCompare(b.label)
      return sortDirection === "asc" ? result : -result
    })
  }, [jobs, sortDirection, sortKey])

  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDirection((current) => (current === "asc" ? "desc" : "asc"))
      return
    }
    setSortKey(key)
    setSortDirection("asc")
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
        {t("loadingAgents")}
      </div>
    )
  }

  if (jobs.length === 0) {
    return (
      <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
        {t("noAgentsFound")}
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <SortableHead
            sortKey="label"
            activeSortKey={sortKey}
            direction={sortDirection}
            onSort={handleSort}
          >
            {t("label")}
          </SortableHead>
          <SortableHead
            sortKey="source"
            activeSortKey={sortKey}
            direction={sortDirection}
            className="w-24"
            onSort={handleSort}
          >
            {t("source")}
          </SortableHead>
          <SortableHead
            sortKey="status"
            activeSortKey={sortKey}
            direction={sortDirection}
            className="w-24"
            onSort={handleSort}
          >
            {t("status")}
          </SortableHead>
          <SortableHead
            sortKey="pid"
            activeSortKey={sortKey}
            direction={sortDirection}
            className="w-16"
            onSort={handleSort}
          >
            {t("pid")}
          </SortableHead>
          <SortableHead
            sortKey="last_run_at"
            activeSortKey={sortKey}
            direction={sortDirection}
            className="w-24"
            onSort={handleSort}
          >
            {t("lastRun")}
          </SortableHead>
          <TableHead className="w-28">{t("actions")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedJobs.map((job) => (
          <JobRow
            key={job.plist_path}
            job={job}
            onStart={onStart}
            onStop={onStop}
            onRestart={onRestart}
            onKickstart={onKickstart}
            onDelete={onDelete}
            onSelect={onSelect}
            onRevealInFinder={onRevealInFinder}
          />
        ))}
      </TableBody>
    </Table>
  )
}
