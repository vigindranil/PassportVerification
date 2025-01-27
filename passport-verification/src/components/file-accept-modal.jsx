"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

export function FileAcceptModal({ isOpen, onClose, fileData, onAccept }) {
  const [file, setFile] = useState(null)
  const [citizenType, setCitizenType] = useState("")

  const handleAccept = () => {
    if (file && citizenType) {
      onAccept(fileData.fileNumber, citizenType, file);
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>File Accept</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Name</Label>
              <div className="mt-1">{fileData.applicantName}</div>
            </div>
            <div>
              <Label>File no</Label>
              <div className="mt-1">{fileData.fileNumber}</div>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Citizen Type*</Label>
            <Select value={citizenType} onValueChange={setCitizenType}>
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="resident">Resident</SelectItem>
                <SelectItem value="non-resident">Non-Resident</SelectItem>
                <SelectItem value="foreign">Foreign National</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Upload PP File (pdf)*</Label>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => document.getElementById("file-upload").click()}>
                Choose File
              </Button>
              <span className="text-sm text-gray-500">{file ? file.name : "No file chosen"}</span>
              <input
                id="file-upload"
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={(e) => setFile(e.target.files[0] || null)}
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={handleAccept} className="bg-green-600 hover:bg-green-700" disabled={!file || !citizenType}>
            Accept
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

