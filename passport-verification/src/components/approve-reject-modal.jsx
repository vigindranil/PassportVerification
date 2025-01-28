"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

export function FileAcceptModal({ isOpen, onClose, applicationId, onAccept, type }) {

  const [remarks, setRemarks] = useState("")

  const handleAccept = () => {
    onAccept(applicationId, type, remarks);
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-3xl text-center text-slate-600">Are you sure you want to {type} this file?</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 p-4">
          <Label htmlFor="remarks">Remarks:</Label>
          <textarea
            id="remarks"
            placeholder="Enter remarks here"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            rows={3}
            className="border-2 p-4 rounded-lg border-gray-400 focus:border-blue-500 w-full"
          />
        </div>
        <div className="flex justify-center gap-3 pt-5">
          {/* remarks textarea */}
          <Button onClick={handleAccept} className={`bg-${type == 'approve' ? 'blue' : 'red'}-500 hover:bg-${type == 'approve' ? 'blue' : 'red'}-600`}>
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

