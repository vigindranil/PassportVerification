'use client'

import React from 'react'
import OcIcSidebar from '@/app/oc-ic/components/oc-ic-sidebar'
import Navbar from '@/components/navbar'
import OcIcDashboardCards from '@/app/oc-ic/components/oc-ic-dashboard'

export default function Dashboard() {
    return (
        <div className="flex h-screen bg-gray-100">
            <OcIcSidebar/>
            <div className="flex-1 flex flex-col overflow-hidden">
                <Navbar />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
                    <div className="container mx-auto px-6 py-8">
                        <div className="mt-8">
                            <OcIcDashboardCards />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}

