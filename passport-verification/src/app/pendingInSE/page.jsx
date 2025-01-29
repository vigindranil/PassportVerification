import React from 'react'
import Navbar from '@/components/navbar';
import Sidebar from '@/components/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DataTable from '@/components/pendingApplication';

export default function allFiles() {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6">
          <CardContent>
            <Card>
              <DataTable heading='Pending In SP DIB' status ={50} />
            </Card>
          </CardContent>
        </main>
      </div>
    </div>
  )
}
