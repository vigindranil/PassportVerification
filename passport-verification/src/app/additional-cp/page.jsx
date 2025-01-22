'use client'

import React from 'react'
import AdCpSidebar from '@/app/additional-cp/components/additional-cp-sidebar'
import Navbar from '@/components/navbar'
import AdCpDashboardCards from '@/components/additional-cp-dashboard'

export default function Dashboard() {
    return (
        <div className="flex h-screen bg-gray-100">
            <AdCpSidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Navbar />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
                    <div className="container mx-auto px-6 py-8">
                        <div className="mt-8">
                            <AdCpDashboardCards />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}

