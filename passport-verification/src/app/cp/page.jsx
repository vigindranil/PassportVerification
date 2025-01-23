'use client'

import React from 'react'
import CpSidebar from '@/app/cp/components/cpsidebar'
import Navbar from '@/components/navbar'
import CpDashboardCards from '@/app/cp/components/cpdashboard'

export default function Dashboard() {
    return (
        <div className="flex h-screen bg-gray-100">
            <CpSidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Navbar />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
                    <div className="container mx-auto px-6 py-8">
                        <div className="mt-8">
                            <CpDashboardCards />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}

