import React from 'react'
import Navbar from '@/components/navbar';
import Sidebar from '@/components/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DataTable from '@/components/allFielsdataTable-OC';

export default function allFiles() {
  return (
    <div className="flex h-full min-h-screen bg-gray-100">
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6">
          <CardContent>
            <Card>
              <DataTable status={50}/>
            </Card>
          </CardContent>
        </main>
      </div>
    </div>
  )
}
