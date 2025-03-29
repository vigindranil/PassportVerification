import React from 'react'
import Navbar from '@/components/navbar';
import Sidebar from '@/components/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ResetPassword from '@/components/reset-password';
import Image from 'next/image';
import BackgroundImg from '@/assets/passport-bg.jpg';

export default function allFiles() {
  return (
    <div className="flex w-full h-full min-h-[100vh] bg-gray-100 relative">
      <Image
        src={BackgroundImg}
        alt="Background Image"
        objectFit="cover"
        className="absolute opacity-15 inset-0 -z-2"
      />
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <main className="flex-1 p-6 w-[50%] mx-auto">
          <CardContent>
            <Card>
              <ResetPassword />
            </Card>
          </CardContent>
        </main>
      </div>
    </div>
  )
}
