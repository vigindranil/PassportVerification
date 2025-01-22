'use client';

import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from '@/components/navbar';
import Sidebar from '@/components/sidebar';
import DataTable from '@/components/uploadDataTable'

export default function ExcelUploader() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [parsedData, setParsedData] = useState([]);
  const [message, setMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const rowsPerPage = 5; // Number of rows per page

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
      setMessage('');
    }
  };

  const handleUpload = () => {
    if (!file) {
      setMessage('Please select a file first.');
      return;
    }

    setUploading(true);
    setMessage('');// Read the file as a binary buffer
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6">
          {/* Upload Section */}
          <Card className="w-full max-w-3xl mx-auto mb-8">
            <CardHeader>
              <CardTitle>Upload Excel File</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Input
                  type="file"
                  accept=".xlsx, .xls, .pdf"
                  onChange={handleFileChange}
                  disabled={uploading}
                />
                <Button
                  onClick={handleUpload}
                  disabled={!file || uploading}
                >
                  {uploading ? 'Uploading...' : 'Parse and Display'}
                </Button>
                {message && <p className="text-sm text-center">{message}</p>}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <DataTable />
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
