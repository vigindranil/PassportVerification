import React from 'react'
import Navbar from '@/components/navbar';
import Sidebar from '@/components/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DataTable from '@/components/pendingApplication';

export default function allFiles() {
  return (
    <div className="flex h-full bg-gray-100">
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 p-6">
          <CardContent>
            <Card>
              <DataTable status={5} heading="Total Verification Pending (EO)"/>
            </Card>
          </CardContent>
        </main>
      </div>
    </div>
  )
}
