import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DataTable from '@/components/pendingApplication';
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
        <main className="flex-1 p-6">
          <CardContent>
            <Card>
              <DataTable heading='Total Applications Accepted by EO' status={2} />
            </Card>
          </CardContent>
        </main>
      </div>
    </div>
  )
}
