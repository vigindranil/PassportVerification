import React from 'react'
import Navbar from '@/components/navbar';
import Sidebar from '@/components/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DataTable from '@/components/allFielsdataTable-SE';
import Image from 'next/image';
import BackgroundImg from '@/assets/passport-bg.jpg';

export default function allFiles() {
  return (
    <div className="flex h-full min-h-screen bg-gray-100 relative">
      <Image
        src={BackgroundImg}
        alt="Background Image"
        objectFit="cover"
        className="absolute opacity-10 inset-0 -z-2"
      />
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <main className="flex-1 overflow-y-auto p-6">
          <CardContent>
            <Card>
              <DataTable status={90} />
            </Card>
          </CardContent>
        </main>
      </div>
    </div>
  )
}
