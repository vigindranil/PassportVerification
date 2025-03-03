"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "./ui/input"
import { FileImage } from "lucide-react"
import { getRequiredDocuments } from "@/app/allFiles/api"

export function FileAcceptModal({ isOpen, onClose, fileData, onAccept }) {
  const [isLoading, setIsLoading] = useState(false)
  const [citizenType, setCitizenType] = useState("")
  const [requiredDocuments, setRequiredDocuments] = useState([]);
  const [onChangeLoading, setOnChangeLoading] = useState(false);
  const dob = fileData?.DateOfBirth?.split("T")[0];

  const handleAccept = async () => {
    if (citizenType) {
      try {
        setIsLoading(true)
        await onAccept(fileData.FileNumber, citizenType, fileData.DateOfBirth, fileData.PhoneNo);
        onClose()
      } catch (e) {
        console.log(e)

      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleCitizenOnChange = async (value) => {
    try {
      setOnChangeLoading(true);
      // handle citizen type change
      setCitizenType(value)
      const response = await getRequiredDocuments(value, dob);
      setRequiredDocuments(response?.data || []);
    } catch (e) {
      console.log(e)
    } finally {
      setOnChangeLoading(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:min-w-[550px]">
        <DialogHeader>
          <DialogTitle>Application Acceptance Process</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4 rounded-md bg-blue-100 p-4">
            <div>
              <Label className="font-bold">Name</Label>
              <div className="mt-1">{fileData?.ApplicantName}</div>
            </div>
            <div>
              <Label className="font-bold">File no</Label>
              <div className="mt-1">{fileData?.FileNumber}</div>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Citizen Type<span className="text-red-500">*</span></Label>
            <Select value={citizenType} onValueChange={(value) => handleCitizenOnChange(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Citizen Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Select Citizen Type</SelectItem>
                <SelectItem value="1">Citizen by Birth</SelectItem>
                <SelectItem value="2">Nationalization</SelectItem>
                <SelectItem value="3">Registration</SelectItem>
                <SelectItem value="4">Decent</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
{/* 
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="picture">Upload PP File (pdf)<span className="text-red-500">*</span></Label>
              <div className="flex items-center gap-2 border-[1px] rounded-md py-0 ps-3 cursor-pointer">
                <FileImage className="w-6 h-6 text-gray-500" />
                <Input
                  id="picture"
                  accept=".pdf"
                  type="file"
                  className="flex-1 rounded-none border-none cursor-pointer bg-slate-100"
                  onChange={(e) => setFile(e.target.files[0] || null)}
                />
              </div>
            </div> */}

            {
              onChangeLoading ?
                <div className="text-center py-4">Loading...</div>
                :
                requiredDocuments?.length > 0 ?
                  <div>
                    <ul className="list list-disc list-inside">
                      <Label className="font-bold text-zinc-500">Required documents need for verification</Label>
                      {requiredDocuments?.map((doc, i) => (
                        <li className="leading-tight" key={i}>{doc?.name}</li>
                      ))}
                    </ul>
                  </div>
                  : null}

          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={handleAccept} className="bg-green-600 hover:bg-green-700" disabled={!citizenType || isLoading}>
            {isLoading ? 'Loading...' : 'Accept Application'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

