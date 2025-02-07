"use client"
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DataTable from '@/components/allFielsdataTable'


export default function allFiles() {
  return (
    <div className="flex h-full min-h-screen bg-gray-100">
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6">
          <CardContent>
            <Card>
              <DataTable status={0} />
            </Card>
          </CardContent>
        </main>
      </div>
    </div>
  )
}
