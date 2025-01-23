'use client'

import React from 'react'
import SpSidebar from '@/app/sp/components/spsidebar'
import Navbar from '@/components/navbar'
import SpDashboardCards from '@/app/sp/components/spdashboard'

export default function Dashboard() {
    return (
        <div className="flex h-screen bg-gray-100">
            <SpSidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Navbar />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
                    <div className="container mx-auto px-6 py-8">
                        <div className="mt-8">
                            <SpDashboardCards />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}

