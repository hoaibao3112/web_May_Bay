import React from 'react'
import Link from 'next/link'

export const metadata = { title: 'Dashboard' }

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside className="w-64 bg-white border-r p-6">
        <h3 className="text-xl font-semibold mb-4">AI Recruitment</h3>
        <nav>
          <ul className="space-y-3">
            <li>
              <Link href="/candidates" className="text-gray-700 hover:text-blue-600">Candidates</Link>
            </li>
            <li>
              <Link href="/jobs" className="text-gray-700 hover:text-blue-600">Jobs</Link>
            </li>
            <li>
              <Link href="/matching" className="text-gray-700 hover:text-blue-600">Matching</Link>
            </li>
            <li>
              <Link href="/dashboard" className="text-gray-700 hover:text-blue-600">Overview</Link>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  )
}
