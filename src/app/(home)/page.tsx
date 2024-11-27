'use client'
import { Suspense, useState } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import Playarea from '@/components/Playarea'

export default function DashboardPage() {
  const [sidebarExpanded, setSidebarExpanded] = useState(false)

  return (
    <div className="min-h-screen flex flex-col">
      <Suspense fallback={<DashboardSkeleton />}>
        <div className="flex-1 flex overflow-hidden">
          <Sidebar
            expanded={sidebarExpanded}
            setExpanded={setSidebarExpanded}
          />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
            <div className="h-full w-full">
              <Header />
              <Playarea />
            </div>
          </main>
        </div>
      </Suspense>
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="p-4 space-y-4">
      <Skeleton className="h-8 w-full max-w-sm" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
      <Skeleton className="h-[300px]" />
      <Skeleton className="h-[300px]" />
    </div>
  )
}
