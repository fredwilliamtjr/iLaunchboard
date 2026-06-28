import { describe, it, expect, vi } from "vitest"
import type { ComponentProps } from "react"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { JobList } from "./JobList"
import type { JobListEntry } from "@/types"
import { SettingsProvider } from "@/lib/i18n"

const mockJobs: JobListEntry[] = [
  {
    label: "com.example.running",
    pid: 1234,
    last_exit_code: 0,
    plist_path: "/Users/test/Library/LaunchAgents/com.example.running.plist",
    source: "UserAgent",
    status: "Running",
    last_run_at: String(Date.now()),
  },
  {
    label: "com.example.stopped",
    pid: null,
    last_exit_code: 78,
    plist_path: "/Users/test/Library/LaunchAgents/com.example.stopped.plist",
    source: "UserAgent",
    status: "Unloaded",
    last_run_at: null,
  },
]

const noop = vi.fn()

function renderJobList(props: Partial<ComponentProps<typeof JobList>> = {}) {
  return render(
    <SettingsProvider>
      <JobList
        jobs={[]}
        loading={false}
        onStart={noop}
        onStop={noop}
        onRestart={noop}
        onKickstart={noop}
        onDelete={noop}
        onSelect={noop}
        onRevealInFinder={noop}
        {...props}
      />
    </SettingsProvider>
  )
}

describe("JobList", () => {
  it("renders loading state", () => {
    renderJobList({ loading: true })
    expect(screen.getByText("Loading agents...")).toBeInTheDocument()
  })

  it("renders empty state", () => {
    renderJobList()
    expect(screen.getByText("No agents found")).toBeInTheDocument()
  })

  it("renders job list with labels", () => {
    renderJobList({ jobs: mockJobs })
    expect(screen.getByText("com.example.running")).toBeInTheDocument()
    expect(screen.getByText("com.example.stopped")).toBeInTheDocument()
  })

  it("renders status badges", () => {
    renderJobList({ jobs: mockJobs })
    expect(screen.getByText("Running")).toBeInTheDocument()
    expect(screen.getByText("Unloaded")).toBeInTheDocument()
  })

  it("renders PID for running job", () => {
    renderJobList({ jobs: mockJobs })
    expect(screen.getByText("1234")).toBeInTheDocument()
  })

  it("sorts by label when clicking the label header", async () => {
    const user = userEvent.setup()

    renderJobList({ jobs: mockJobs })

    await user.click(screen.getByRole("button", { name: /label/i }))

    const stopped = screen.getByText("com.example.stopped")
    const running = screen.getByText("com.example.running")
    expect(
      stopped.compareDocumentPosition(running) &
        Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy()
  })
})
