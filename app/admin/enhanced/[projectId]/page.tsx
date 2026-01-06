import EnhancedDashboard from '@/components/admin/enhanced-dashboard'

interface Props {
  params: Promise<{ projectId: string }>
}

export default async function EnhancedProjectPage({ params }: Props) {
  const { projectId } = await params
  return <EnhancedDashboard projectId={projectId} />
}