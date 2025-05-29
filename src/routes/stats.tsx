import { createFileRoute } from '@tanstack/react-router'
import GlobalStats from '../components/GlobalStats'

export const Route = createFileRoute('/stats')({
  component: GlobalStats,
})

