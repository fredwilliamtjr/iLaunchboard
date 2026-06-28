import { useState, useEffect, useCallback } from "react"
import type { JobListEntry, JobSource, JobStatus } from "@/types"
import { listJobs } from "@/lib/invoke"

type UseJobsReturn = {
  jobs: JobListEntry[]
  filteredJobs: JobListEntry[]
  loading: boolean
  error: string | null
  search: string
  setSearch: (value: string) => void
  sourceFilter: JobSource | "All"
  setSourceFilter: (value: JobSource | "All") => void
  statusFilter: JobStatus | "All"
  setStatusFilter: (value: JobStatus | "All") => void
  pidFilter: string
  setPidFilter: (value: string) => void
  refresh: () => Promise<void>
}

export function useJobs(): UseJobsReturn {
  const [jobs, setJobs] = useState<JobListEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [sourceFilter, setSourceFilter] = useState<JobSource | "All">("All")
  const [statusFilter, setStatusFilter] = useState<JobStatus | "All">("All")
  const [pidFilter, setPidFilter] = useState("")

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await listJobs()
      setJobs(result)
    } catch (e) {
      setError(String(e))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const filteredJobs = jobs.filter((job) => {
    const normalizedSearch = search.trim().toLowerCase()
    const normalizedPid = pidFilter.trim()
    const matchesSearch =
      normalizedSearch === "" ||
      job.label.toLowerCase().includes(normalizedSearch)
    const matchesSource =
      sourceFilter === "All" || job.source === sourceFilter
    const matchesStatus =
      statusFilter === "All" || job.status === statusFilter
    const matchesPid =
      normalizedPid === "" ||
      (job.pid !== null && String(job.pid).includes(normalizedPid))
    return matchesSearch && matchesSource && matchesStatus && matchesPid
  })

  return {
    jobs,
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
  }
}
