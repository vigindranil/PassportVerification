'use client'

import React from 'react'
import EoSidebar from '@/app/eo/components/eosidebar'
import Navbar from '@/components/navbar'
import EoDashboardCards from '@/app/eo/components/eodashboard'

export default function Dashboard() {
    return (
        <div className="flex h-screen bg-gray-100">
            <EoSidebar/>
            <div className="flex-1 flex flex-col overflow-hidden">
                <Navbar />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
                    <div className="container mx-auto px-6 py-8">
                        <div className="mt-8">
                            <EoDashboardCards />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}

