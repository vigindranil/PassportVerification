'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from '@/components/navbar';
import Sidebar from '@/components/sidebar';
import { convertExcelToJson, uploadExcel } from './api';
import { useToast } from "@/hooks/use-toast"
import { ToastAction } from "@/components/ui/toast"
import DataTable from '@/components/excelParsedDatatable';

export default function ExcelUploader() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [importing, setImporting] = useState(false);
  const [parsedData, setParsedData] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const rowsPerPage = 5; // Number of rows per page
  const { toast } = useToast()

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
      setMessage('');
    }
  };

  const handleExcelParse = async (e) => {
    try {
      e.preventDefault();
      setImporting(true);
      if (!file) {

        return;
      } else {
        const response = await convertExcelToJson(file);
        console.log('response', response);
        if (response.status == 0) {
          setParsedData(response.data);
          toast({
            title: "Successfull",
            description: response?.message || "File was successfully converted",
            action: (
              <ToastAction altText="close">Close</ToastAction>
            ),
          })
        } else {
          toast({
            variant: "destructive",
            title: "Failed to Convert!",
            description: "Something went wrong, Please try again",
            action: <ToastAction altText="Try again">Try again</ToastAction>,
          })
          setError(response.message);
        }
      }
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Failed to Convert!",
        description: "Something went wrong, Please try again",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      })
      setError('Failed to import file. Please try again.');
    } finally {
      setImporting(false);
    }
  };

  const handleUpload = async (e) => {
    try {
      e.preventDefault();
      setUploading(true);
      if (!parsedData || parsedData?.length == 0) {
        toast({
          variant: "destructive",
          title: "Failed to upload!",
          description: "Please import excel file before uploading",
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        })
        return;
      } else {
        const response = await uploadExcel(parsedData);
        console.log('response', response);
        if (response?.status == 0){
          toast({
            title: "Successfull",
            description: response?.message || "File was successfully uploaded",
            action: (
              <ToastAction altText="close">Close</ToastAction>
            ),
          })
          setMessage(response?.data);
          setError('');
        }else {
          setError(response?.message);
          setMessage('');
        }
      }
    } catch (e) {
      console.log(e);
      setError('Failed to upload file. Please try again.');
      setMessage('');
      toast({
        variant: "destructive",
        title: "Failed to upload!",
        description: "Something went wrong, Please try again",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      })
    } finally {
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
                  accept=".xlsx, .xls, .csv"
                  onChange={handleFileChange}
                  disabled={uploading}
                />
                <Button
                  onClick={handleExcelParse}
                  disabled={importing}
                >
                  {importing ? 'Converting...' : 'Import Excel'}
                </Button>
                <Button
                  className="mx-2"
                  onClick={handleUpload}
                  disabled={uploading}
                >
                  {uploading ? 'Uploading...' : 'Upload Excel'}
                </Button>
                {message && <p className="text-sm font-bold text-green-600">{message.added.length} file(s) added, {message.duplicate.length} duplicate file(s), and {message.failed.length} file(s) failed to upload.</p>}
                {message?.duplicate?.length > 0 && <p className="text-sm ">Duplicate file(s): {message.duplicate.length ? <span className='text-yellow-600'>{message.duplicate.join(", ")}</span> : message.duplicate.length}</p>}
                {message?.failed?.length > 0 && <p className="text-sm ">Failed file(s): {message.failed.length ? <span className='text-red-500'>{message.failed.join(", ")}</span> : message.failed.length}</p>}
                {error && <p className="text-sm text-center text-red-500">{error}</p>}
              </form>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <DataTable data={parsedData} />
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
