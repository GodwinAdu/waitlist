import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Sparkles, Plus } from 'lucide-react'

export default function ProjectsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Projects</h1>
        <Link href="/admin/projects/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Projects will be loaded here */}
        <Card>
          <CardHeader>
            <CardTitle>Sample Project</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex gap-2">
              <Link href="/admin/projects/sample-id">
                <Button variant="outline" size="sm">
                  Manage
                </Button>
              </Link>
              <Link href="/admin/enhanced/sample-id">
                <Button size="sm" className="bg-gradient-to-r from-purple-600 to-pink-600">
                  <Sparkles className="mr-1 h-3 w-3" />
                  Enhanced
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}