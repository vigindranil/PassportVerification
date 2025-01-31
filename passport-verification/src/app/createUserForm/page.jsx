import React from 'react'
import Navbar from '@/components/navbar';
import Sidebar from '@/components/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CreateUserForm from '@/components/createUserForm';

export default function allFiles() {
  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6">
          <CardContent>
            <Card>
              <CreateUserForm />
            </Card>
          </CardContent>
        </main>
      </div>
    </div>
  )
}
