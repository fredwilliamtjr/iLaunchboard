import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { SearchBar } from "@/components/SearchBar"
import { JobList } from "@/components/JobList"
import { JobDetail } from "@/components/JobDetail"
import { JobForm } from "@/components/JobForm"
import { SettingsDialog } from "@/components/SettingsDialog"
import { useJobs } from "@/hooks/useJobs"
import { useSettings } from "@/lib/i18n"
import {
  startJob,
  stopJob,
  restartJob,
  kickstartJob,
  deleteJob,
  saveJob,
  createJob,
  revealInFinder,
} from "@/lib/invoke"
import type { JobListEntry, LaunchdJob, PlistConfig } from "@/types"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Plus, RefreshCw, Settings } from "lucide-react"

function App() {
  const { t } = useSettings()
  const {
    filteredJobs,
    loading,
    error,
    search,
    setSearch,
    sourceFilter,
    setSourceFilter,
    statusFilter,
    setStatusFilter,
    pidFilter,
    setPidFilter,
    refresh,
  } = useJobs()

  const [selectedPlistPath, setSelectedPlistPath] = useState<string | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [formOpen, setFormOpen] = useState(false)
  const [formKey, setFormKey] = useState(0)
  const [editingJob, setEditingJob] = useState<LaunchdJob | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<JobListEntry | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [settingsOpen, setSettingsOpen] = useState(false)

  const handleAction = useCallback(
    async (action: () => Promise<void>) => {
      setActionError(null)
      try {
        await action()
        await refresh()
      } catch (e) {
        setActionError(String(e))
      }
    },
    [refresh]
  )

  const handleSelect = useCallback((job: JobListEntry) => {
    setSelectedPlistPath(job.plist_path)
    setDetailOpen(true)
  }, [])

  const handleEdit = useCallback((job: LaunchdJob) => {
    setEditingJob(job)
    setFormKey((k) => k + 1)
    setFormOpen(true)
    setDetailOpen(false)
  }, [])

  const handleSave = useCallback(
    async (config: PlistConfig, plistPath?: string) => {
      if (plistPath) {
        await saveJob(plistPath, config)
      } else {
        await createJob(config.label, config)
      }
      await refresh()
    },
    [refresh]
  )

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return
    await handleAction(() =>
      deleteJob(deleteTarget.plist_path, deleteTarget.label)
    )
    setDeleteTarget(null)
  }, [deleteTarget, handleAction])

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold">iLaunchboard</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={refresh}>
              <RefreshCw className="h-4 w-4 mr-1" />
              {t("refresh")}
            </Button>
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => setSettingsOpen(true)}
              aria-label={t("settings")}
              title={t("settings")}
            >
              <Settings className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setEditingJob(null)
                setFormKey((k) => k + 1)
                setFormOpen(true)
              }}
            >
              <Plus className="h-4 w-4 mr-1" />
              {t("newAgent")}
            </Button>
          </div>
        </div>
      </header>

      <main className="px-4 py-3 space-y-3">
        <SearchBar
          search={search}
          onSearchChange={setSearch}
          sourceFilter={sourceFilter}
          onSourceFilterChange={setSourceFilter}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          pidFilter={pidFilter}
          onPidFilterChange={setPidFilter}
        />

        {error && (
          <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {actionError && (
          <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
            {actionError}
          </div>
        )}

        <div className="rounded-md border">
          <JobList
            jobs={filteredJobs}
            loading={loading}
            onStart={(job) => handleAction(() => startJob(job.plist_path))}
            onStop={(job) => handleAction(() => stopJob(job.plist_path))}
            onRestart={(job) => handleAction(() => restartJob(job.plist_path))}
            onKickstart={(job) => handleAction(() => kickstartJob(job.label, job.plist_path))}
            onDelete={(job) => setDeleteTarget(job)}
            onSelect={handleSelect}
            onRevealInFinder={(job) => revealInFinder(job.plist_path)}
          />
        </div>
      </main>

      <JobDetail
        plistPath={selectedPlistPath}
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        onEdit={handleEdit}
      />

      <JobForm
        key={formKey}
        open={formOpen}
        onClose={() => {
          setFormOpen(false)
          setEditingJob(null)
        }}
        onSave={handleSave}
        editingJob={editingJob}
      />

      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />

      <Dialog
        open={!!deleteTarget}
        onOpenChange={(isOpen) => !isOpen && setDeleteTarget(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("deleteAgent")}</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            {t("deleteAgentConfirm")}{" "}
            <span className="font-mono font-medium text-foreground">
              {deleteTarget?.label}
            </span>
            {t("deleteAgentSuffix")}
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              {t("cancel")}
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              {t("delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default App
