"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Navbar from "@/components/navbar"
import Sidebar from "@/components/sidebar"
import { convertExcelToJson, uploadExcel } from "./api"
import { useToast } from "@/hooks/use-toast"
import { ToastAction } from "@/components/ui/toast"
import DataTable from "@/components/excelParsedDatatable"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { CheckCircle2 } from "lucide-react"

const ExcelUploader = () => {
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [importing, setImporting] = useState(false)
  const [parsedData, setParsedData] = useState([])
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [isImported, setIsImported] = useState(false)
  const { toast } = useToast()
  const fileInputRef = useRef(null)

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFile(e.target.files[0])
      setMessage("")
      setIsImported(false)
      setError("")
    }
  }

  const handleExcelParse = async (e) => {
    e.preventDefault()
    setImporting(true)
    setError("")
    try {
      if (!file) {
        toast({
          variant: "destructive",
          title: "No file selected",
          description: "Please select a file before importing",
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        })
        return
      }
      const response = await convertExcelToJson(file)
      if (response.status === 0 && response.data.length > 0) {
        setParsedData(response.data)
        setIsImported(true)
        toast({
          title: (
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <span>Successfull!</span>
            </div>
          ),
          description: response?.message || "File was successfully converted",
          action: <ToastAction altText="close">Close</ToastAction>,
        })
      } else {
        throw new Error(response.message || "No data found in the Excel file")
      }
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Failed to Convert!",
        description: e.message || "Something went wrong, Please try again",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      })
      setError(e.message || "Failed to import file. Please try again.")
    } finally {
      setImporting(false)
    }
  }

  const handleUpload = async (e) => {
    e.preventDefault()
    setUploading(true)
    setError("")
    try {
      if (!parsedData || parsedData.length === 0) {
        toast({
          variant: "destructive",
          title: "Failed to upload!",
          description: "Please import excel file before uploading",
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        })
        return
      }
      const response = await uploadExcel(parsedData)
      if (response?.status === 0) {
        toast({
          title: (
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <span>Successfull!</span>
            </div>
          ),
          description: response?.message || "File was successfully uploaded",
          action: <ToastAction altText="close">Close</ToastAction>,
        })
        setMessage(response?.data)
        setIsImported(false)
        setParsedData([])
        setFile(null)
      } else {
        throw new Error(response?.message)
      }
    } catch (e) {
      console.error(e)
      setError(e.message || "Failed to upload file. Please try again.")
      toast({
        variant: "destructive",
        title: "Failed to upload!",
        description: e.message || "Something went wrong, Please try again",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      })
    } finally {
      setUploading(false)
    }
  }

  const handleReset = () => {
    setFile(null)
    setParsedData([])
    setMessage("")
    setError("")
    setIsImported(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    fileInputRef.current?.click()
  }

  return (
    <div className="flex h-full bg-gray-100">
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 p-6">
          <Card className="w-full max-w-3xl mx-auto mb-8">
            <CardHeader>
              <CardTitle>Upload Excel File</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Input
                        type="file"
                        accept=".xlsx, .xls, .csv"
                        onChange={handleFileChange}
                        disabled={importing || isImported}
                        ref={fileInputRef}
                        className="cursor-pointer"
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Select an Excel file to import</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={handleExcelParse}
                        disabled={importing || isImported || !file}
                        className="cursor-pointer"
                      >
                        {importing ? "Converting..." : "Import Excel"}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Import data from Excel file</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        className="mx-2 cursor-pointer"
                        onClick={handleUpload}
                        disabled={uploading || !isImported}
                      >
                        {uploading ? "Uploading..." : "Upload Excel"}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Upload imported data</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button onClick={handleReset} disabled={!isImported && !message} className="cursor-pointer">
                        Reset
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Reset form and clear data</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                {isImported && (
                  <p className="text-sm font-medium text-blue-600">
                    Check all file details and press the upload button to proceed.
                  </p>
                )}
                {message && (
                  <p className="text-sm font-bold text-green-600">
                    {message.added?.length} file(s) added, {message.duplicate?.length} duplicate file(s), and{" "}
                    {message.failed?.length} file(s) failed to upload.
                  </p>
                )}
                {message?.duplicate?.length > 0 && (
                  <p className="text-sm">
                    Duplicate file(s): <span className="text-yellow-600">{message.duplicate.join(", ")}</span>
                  </p>
                )}
                {message?.failed?.length > 0 && (
                  <p className="text-sm">
                    Failed file(s): <span className="text-red-500">{message.failed.join(", ")}</span>
                  </p>
                )}
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
  )
}

export default ExcelUploader

