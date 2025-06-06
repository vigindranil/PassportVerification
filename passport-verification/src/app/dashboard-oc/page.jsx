'use client'

import React from 'react'
import Sidebar from '@/components/sidebar'
import Navbar from '@/components/navbar'
import DashboardCards from '@/components/dashboardCard'
import Image from 'next/image'
import BackgroundImg from '@/assets/passport-bg.jpg';

export default function Dashboard() {
    return (
        <div className="flex h-full min-h-screen bg-gray-100">
            <div className="flex-1 flex flex-col overflow-hidden">
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 relative">
                    <Image
                        src={BackgroundImg}
                        alt="Background Image"
                        objectFit="cover"
                        className="absolute opacity-10 inset-0 -z-2"
                    />
                    <div className="container mx-auto px-6 py-8 relative">
                        <div className="mt-8">
                            <DashboardCards />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}

