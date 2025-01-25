'use client'

import React from 'react'
import Sidebar from '@/components/sidebar'
import Navbar from '@/components/navbar'
import DashboardCards from '@/components/dashboardCard'
import { DashboardCard } from '@/components/dashboard-card'
import { RefreshCw } from 'lucide-react'

export default function Dashboard() {
    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Navbar />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
                    <div className="container mx-auto px-6 py-8">
                        <div className="mt-8">
                            <DashboardCards />
                            {/* <DashboardCard
                                title="Returned Applications"
                                value={0}
                                icon={RefreshCw}
                                percentageChange={-5}
                                variant="yellow"
                            /> */}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}

