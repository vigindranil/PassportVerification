import React from 'react'
import Navbar from '@/components/navbar';
import AdminSidebar from '@/app/admin-dysp/components/adminsidebar';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import adminDyspDashboard from '@/app/admin-dysp/components/admin-dysp-dashboard'

export default function allFiles() {
  return (
    <div className="flex h-screen bg-gray-100">
    <AdminSidebar />
    <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
            <div className="container mx-auto px-6 py-8">
                <div className="mt-8">
                    <adminDyspDashboard />
                </div>
            </div>
        </main>
    </div>
</div>
  )
}
