"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { convertExcelToJson, uploadExcel } from "./api"
import { useToast } from "@/hooks/use-toast"
import { ToastAction } from "@/components/ui/toast"
import DataTable from "@/components/excelParsedDatatable"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { AlertCircle, CheckCircle2, Download, FileImage, Loader2 } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Label } from "@/components/ui/label"


const ExcelUploader = () => {
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [importing, setImporting] = useState(false)
  const [parsedData, setParsedData] = useState([])
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [progress, setProgress] = useState(0)
  const [isImported, setIsImported] = useState(false)
  const { toast } = useToast()
  const fileInputRef = useRef(null)

  const handleDownload = async (e) => {
    e.preventDefault()
    const response = await fetch("/assets/sample_excel_format.xls");
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sample_excel_format.xls";
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

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
    setProgress(1)
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
      console.log(e)
      setError(e.message || "Failed to upload file. Please try again.")
      toast({
        variant: "destructive",
        title: "Failed to upload!",
        description: e.message || "Something went wrong, Please try again",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      })
    } finally {
      setUploading(false)
      setProgress(0)
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
  }

  useEffect(() => {
    if (progress) {
      const timer = setInterval(() => {
        if (progress > 0 && progress < 99) {
          setProgress(progress + 1);
        } else {
          clearInterval(timer);
        }
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [progress])


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
                     
                      <div className="grid w-full items-center gap-1.5">
                        <div className="flex items-center gap-2 border-[2px] border-indigo-400 border-dashed rounded-md ps-3 cursor-pointer">
                          <FileImage className="w-8 h-8 text-gray-400" />
                          <Input
                            className="flex-1 rounded-none border-none cursor-pointer bg-indigo-50"
                            type="file"
                            accept=".xlsx, .xls, .csv"
                            onChange={handleFileChange}
                            disabled={importing || isImported}
                            ref={fileInputRef}
                          />
                        </div>
                      </div>
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
                        className={`${importing ? 'cursor-wait' : 'cursor-pointer'}`}
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
                        className={`${importing ? 'cursor-wait' : 'cursor-pointer'} mx-2`}
                        onClick={handleUpload}
                        disabled={uploading || !isImported}
                      >
                        {uploading ? <div className="flex justify-center items-center">Uploading <Loader2 className="animate-spin mx-1" /></div> : "Upload Excel"}
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
                {progress != 0 &&
                  <div>
                    <Progress value={progress} />
                    <p className="text-sm text-center">Progress: {progress}%</p>
                    <p className="text-sm text-center font-bold">Note: This process might take some time, please do not refresh or close this page</p>
                  </div>
                }
                <hr />
                <p className="text-sm font-medium text-zinc-600 flex gap-1 items-center p-1 rounded-md my-0">
                  <AlertCircle className="h-6 w-6 text-indigo-600" /> <b>Instruction:</b> The format of the Excel file must match exactly that of the sample Excel file given below.
                </p>
                <Button onClick={(e) => handleDownload(e)} variant="ghost" className="text-sm text-zinc-700 underline underline-offset-2 hover:text-indigo-500 font-medium flex gap-1 items-center p-1 rounded-md my-0">
                  <Download className="h-6 w-6 text-indigo-600" /> <b>Download Sample Excel File</b>
                </Button>
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

