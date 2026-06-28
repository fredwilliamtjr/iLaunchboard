import { describe, it, expect, beforeEach } from "vitest"
import { renderHook, waitFor, act } from "@testing-library/react"
import { useJobs } from "./useJobs"
import { resetFakeHandlers, setFakeHandler } from "@/test-utils/tauri-mock"

beforeEach(() => {
  resetFakeHandlers()
})

describe("useJobs", () => {
  it("loads jobs on mount", async () => {
    const { result } = renderHook(() => useJobs())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.jobs.length).toBe(3)
    expect(result.current.error).toBeNull()
  })

  it("filters by search term", async () => {
    const { result } = renderHook(() => useJobs())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    act(() => {
      result.current.setSearch("running")
    })

    await waitFor(() => {
      expect(result.current.filteredJobs.length).toBe(1)
      expect(result.current.filteredJobs[0].label).toBe(
        "com.example.running-agent"
      )
    })
  })

  it("filters by source", async () => {
    const { result } = renderHook(() => useJobs())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    act(() => {
      result.current.setSourceFilter("SystemAgent")
    })

    await waitFor(() => {
      expect(result.current.filteredJobs.length).toBe(1)
      expect(result.current.filteredJobs[0].source).toBe("SystemAgent")
    })
  })

  it("filters by status", async () => {
    const { result } = renderHook(() => useJobs())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    act(() => {
      result.current.setStatusFilter("Running")
    })

    await waitFor(() => {
      expect(result.current.filteredJobs.length).toBeGreaterThan(0)
      expect(
        result.current.filteredJobs.every((job) => job.status === "Running")
      ).toBe(true)
    })
  })

  it("filters by PID", async () => {
    const { result } = renderHook(() => useJobs())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    act(() => {
      result.current.setPidFilter("123")
    })

    await waitFor(() => {
      expect(result.current.filteredJobs.length).toBe(1)
      expect(result.current.filteredJobs[0].pid).toBe(1234)
    })
  })

  it("handles error", async () => {
    setFakeHandler("list_jobs", () => {
      throw new Error("Connection failed")
    })

    const { result } = renderHook(() => useJobs())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.error).toContain("Connection failed")
    expect(result.current.jobs.length).toBe(0)
  })
})
