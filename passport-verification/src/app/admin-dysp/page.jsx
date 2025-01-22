import React from 'react'
import Navbar from '@/components/navbar';
import AdminSidebar from '@/app/admin-dysp/components/adminsidebar';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CreateUserForm from '@/app/admin-dysp/components/adminCreateUserForm';

export default function allFiles() {
  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
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
