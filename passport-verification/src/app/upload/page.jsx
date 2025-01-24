'use client';

import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from '@/components/navbar';
import Sidebar from '@/components/sidebar';
import DataTable from '@/components/uploadDataTable'
import { uploadExcel } from './api';

export default function ExcelUploader() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [parsedData, setParsedData] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const rowsPerPage = 5; // Number of rows per page

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
      setMessage('');
    }
  };

  const handleUpload = async (e) => {
    try {
      e.preventDefault();
      setUploading(true);
      if (!file) {
        
        return;
      } else {
        const response = await uploadExcel(file);
        console.log('response', response);
        if (response.status == 0){
          setMessage(response.data);
          setError('');
        }else {
          setError(response.message);
          setMessage('');
        }
      }
    } catch (e) {
      console.error(e);
      setError('Failed to upload file. Please try again.');
      setMessage('');
    }finally {
      setUploading(false);
    }
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
              <form className="space-y-4">
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
                  {uploading ? 'Uploading...' : 'Upload Excel'}
                </Button>
                {message && <p className="text-sm font-bold text-green-600">{message.added.length} file(s) added, {message.duplicate.length} duplicate file(s), and {message.failed.length} file(s) failed to upload.</p>}
                {message && <p className="text-sm ">File(s) uploaded: {message.added.length ? message.added.join(", ") : message.added.length}</p>}
                {message && <p className="text-sm ">Duplicate file(s): {message.duplicate.length ? message.duplicate.join(", ") : message.duplicate.length}</p>}
                {message && <p className="text-sm ">Failed file(s): {message.failed.length ? message.failed.join(", ") : message.failed.length}</p>}
                {error && <p className="text-sm text-center text-red-500">{error}</p>}
              </form>
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
