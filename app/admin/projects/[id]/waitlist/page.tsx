"use client"

import { useState, useEffect, use } from "react"
import { AdminHeader } from "@/components/admin/admin-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Download, Mail, Search } from "lucide-react"
import Link from "next/link"

interface WaitlistUser {
  _id: string
  name: string
  email: string
  phone?: string
  role?: string
  message?: string
  isNotified: boolean
  position: number
  createdAt: string
}

interface Analytics {
  totalSignups: number
  signupsByRole: Array<{ role: string; count: number }>
  dailySignups: Array<{ date: string; count: number }>
  totalReferrals: number
  notifiedCount: number
}

export default function WaitlistPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [users, setUsers] = useState<WaitlistUser[]>([])
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [showNotifyModal, setShowNotifyModal] = useState(false)

  useEffect(() => {
    fetchData()
  }, [id, search])

  const fetchData = async () => {
    try {
      const [usersRes, analyticsRes] = await Promise.all([
        fetch(`/api/projects/${id}/waitlist?search=${search}`),
        fetch(`/api/projects/${id}/analytics`),
      ])

      if (usersRes.ok) {
        const data = await usersRes.json()
        setUsers(data.users)
      }

      if (analyticsRes.ok) {
        const data = await analyticsRes.json()
        setAnalytics(data)
      }
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleExport = async () => {
    try {
      const response = await fetch(`/api/projects/${id}/waitlist/export`)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `waitlist-${new Date().toISOString().split("T")[0]}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error("Export error:", error)
      alert("Failed to export waitlist")
    }
  }

  const handleMarkNotified = async () => {
    if (selectedUsers.length === 0) return

    try {
      const response = await fetch(`/api/projects/${id}/waitlist/notify`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userIds: selectedUsers }),
      })

      if (response.ok) {
        alert("Marked as notified")
        setSelectedUsers([])
        fetchData()
      }
    } catch (error) {
      console.error("Mark notified error:", error)
      alert("Failed to mark as notified")
    }
  }

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers((prev) => (prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]))
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      <main className="mx-auto max-w-7xl p-6">
        <div className="mb-6">
          <Button asChild variant="ghost" size="sm" className="mb-4">
            <Link href="/admin">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
          <h2 className="text-3xl font-bold">Waitlist Management</h2>
          <p className="mt-1 text-muted-foreground">View and manage your waitlist signups</p>
        </div>

        {/* Analytics Cards */}
        {analytics && (
          <div className="mb-6 grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Total Signups</CardDescription>
                <CardTitle className="text-3xl">{analytics.totalSignups}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Notified</CardDescription>
                <CardTitle className="text-3xl">{analytics.notifiedCount}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Referrals</CardDescription>
                <CardTitle className="text-3xl">{analytics.totalReferrals}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Conversion</CardDescription>
                <CardTitle className="text-3xl">
                  {analytics.totalSignups > 0
                    ? Math.round((analytics.notifiedCount / analytics.totalSignups) * 100)
                    : 0}
                  %
                </CardTitle>
              </CardHeader>
            </Card>
          </div>
        )}

        {/* Actions Bar */}
        <div className="mb-6 flex flex-wrap items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button onClick={handleMarkNotified} disabled={selectedUsers.length === 0}>
            <Mail className="mr-2 h-4 w-4" />
            Mark as Notified ({selectedUsers.length})
          </Button>
        </div>

        {/* Waitlist Table */}
        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-8 text-center text-muted-foreground">Loading waitlist...</div>
            ) : users.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">No signups yet</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b bg-muted/50">
                    <tr>
                      <th className="p-4 text-left">
                        <input
                          type="checkbox"
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedUsers(users.map((u) => u._id))
                            } else {
                              setSelectedUsers([])
                            }
                          }}
                          checked={selectedUsers.length === users.length && users.length > 0}
                        />
                      </th>
                      <th className="p-4 text-left text-sm font-medium">#</th>
                      <th className="p-4 text-left text-sm font-medium">Name</th>
                      <th className="p-4 text-left text-sm font-medium">Email</th>
                      <th className="p-4 text-left text-sm font-medium">Phone</th>
                      <th className="p-4 text-left text-sm font-medium">Role</th>
                      <th className="p-4 text-left text-sm font-medium">Status</th>
                      <th className="p-4 text-left text-sm font-medium">Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user._id} className="border-b hover:bg-muted/50">
                        <td className="p-4">
                          <input
                            type="checkbox"
                            checked={selectedUsers.includes(user._id)}
                            onChange={() => toggleUserSelection(user._id)}
                          />
                        </td>
                        <td className="p-4 text-sm">{user.position}</td>
                        <td className="p-4 text-sm font-medium">{user.name}</td>
                        <td className="p-4 text-sm">{user.email}</td>
                        <td className="p-4 text-sm text-muted-foreground">{user.phone || "-"}</td>
                        <td className="p-4 text-sm">{user.role || "-"}</td>
                        <td className="p-4 text-sm">
                          {user.isNotified ? (
                            <span className="rounded-full bg-primary/10 px-2 py-1 text-xs text-primary">Notified</span>
                          ) : (
                            <span className="rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground">
                              Pending
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-sm text-muted-foreground">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
