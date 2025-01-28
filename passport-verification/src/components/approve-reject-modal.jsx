"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

export function FileAcceptModal({ isOpen, onClose, fileData, onAccept, type}) {
  const [file, setFile] = useState(null)
  const [citizenType, setCitizenType] = useState("")

  const handleAccept = () => {
    if (file && citizenType) {
      onAccept(fileData.FileNumber, citizenType, file);
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-3xl text-center text-slate-600">Are you sure you want to {type} this file?</DialogTitle>
        </DialogHeader>
        <div className="flex justify-center gap-3 pt-5">
          <Button onClick={handleAccept} className={`bg-${type == 'approve' ? 'green' : 'red'}-500 hover:bg-${type == 'approve' ? 'green' : 'red'}-600`}>
          {type == 'approve' ? 'Approve' : 'Reject'}
          </Button>
          <Button onClick={onClose} className="bg-gray-500 hover:bg-gray-600">
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

