'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { UserPlus, Mail, Shield, Eye, Edit, Trash2 } from 'lucide-react'

export default function TeamManagement() {
  const [members, setMembers] = useState<any[]>([])
  const [showInvite, setShowInvite] = useState(false)
  const [inviteData, setInviteData] = useState({
    email: '',
    role: 'viewer',
    permissions: []
  })

  useEffect(() => {
    fetchMembers()
  }, [])

  const fetchMembers = async () => {
    try {
      const response = await fetch('/api/team')
      const data = await response.json()
      setMembers(data.members || [])
    } catch (error) {
      console.error('Failed to fetch team:', error)
    }
  }

  const inviteMember = async () => {
    try {
      const response = await fetch('/api/team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inviteData)
      })
      if (response.ok) {
        fetchMembers()
        setShowInvite(false)
        setInviteData({ email: '', role: 'viewer', permissions: [] })
      }
    } catch (error) {
      console.error('Failed to invite member:', error)
    }
  }

  const roleColors = {
    owner: 'bg-purple-500/20 text-purple-200 border-purple-500/30',
    admin: 'bg-blue-500/20 text-blue-200 border-blue-500/30',
    editor: 'bg-green-500/20 text-green-200 border-green-500/30',
    viewer: 'bg-gray-500/20 text-gray-200 border-gray-500/30'
  }

  const statusColors = {
    pending: 'bg-yellow-500/20 text-yellow-200 border-yellow-500/30',
    active: 'bg-green-500/20 text-green-200 border-green-500/30',
    suspended: 'bg-red-500/20 text-red-200 border-red-500/30'
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Team Management</h2>
        <Button onClick={() => setShowInvite(true)} className="bg-purple-600 hover:bg-purple-700">
          <UserPlus className="mr-2 h-4 w-4" />
          Invite Member
        </Button>
      </div>

      {showInvite && (
        <Card className="border-white/10 bg-black/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Invite Team Member</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-gray-300">Email Address</Label>
              <Input
                type="email"
                value={inviteData.email}
                onChange={(e) => setInviteData({ ...inviteData, email: e.target.value })}
                className="bg-black/20 border-white/10 text-white"
              />
            </div>
            <div>
              <Label className="text-gray-300">Role</Label>
              <select
                value={inviteData.role}
                onChange={(e) => setInviteData({ ...inviteData, role: e.target.value })}
                className="w-full h-9 bg-black/20 border border-white/10 rounded-md px-3 text-white"
              >
                <option value="viewer">Viewer</option>
                <option value="editor">Editor</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="flex gap-2">
              <Button onClick={inviteMember} className="bg-green-600 hover:bg-green-700">
                Send Invite
              </Button>
              <Button onClick={() => setShowInvite(false)} variant="outline">
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {members.map((member) => (
          <Card key={member._id} className="border-white/10 bg-black/20 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">
                      {member.email.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-white font-medium">{member.email}</p>
                    <div className="flex gap-2 mt-1">
                      <Badge className={roleColors[member.role as keyof typeof roleColors]}>
                        <Shield className="mr-1 h-3 w-3" />
                        {member.role}
                      </Badge>
                      <Badge className={statusColors[member.status as keyof typeof statusColors]}>
                        {member.status}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="text-red-400 hover:text-red-300">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}