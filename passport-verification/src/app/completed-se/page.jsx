import React from 'react'
import Navbar from '@/components/navbar';
import Sidebar from '@/components/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PendingApplicationDatatable from '@/components/pendingApplication';
import Image from 'next/image';
const BackgroundImg = '/images/background.jpg'

export default function allFiles() {
  return (
    <div className="flex h-full min-h-screen bg-gray-100 relative">
      <Image
        src={BackgroundImg}
        alt="Background Image"
        objectFit="cover"
        className="absolute opacity-20 inset-0 -z-2"
      />
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <main className="flex-1 overflow-y-auto p-6">
          <CardContent>
            <Card>
              <PendingApplicationDatatable heading='Completed Verification SE' status={100} />
            </Card>
          </CardContent>
        </main>
      </div>
    </div>
  )
}
