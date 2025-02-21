"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

function UploadDocumentsModal({ isOpen, onClose, fileData }) {
  const [aadhaarNumber, setAadhaarNumber] = useState("")
  const [otp, setOtp] = useState("")
  const [isOtpSent, setIsOtpSent] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState({
    photo: null,
    signature: null,
    document1: null,
    document2: null,
    address1: null,
    address2: null,
    other: null
  })

  const handleFileChange = (key, file) => {
    setSelectedFiles(prev => ({ ...prev, [key]: file }))
  }

  const handleSendOTP = () => {
    setIsOtpSent(true)
  }

  const handleSubmitOTP = () => {
    // Implement OTP verification logic here
  }

  const handleUpload = () => {
    // Implement file upload logic here
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Upload Documents</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="flex gap-4">
            <div className="bg-blue-500 text-white px-4 py-2 rounded">
              Name: {fileData?.name}
            </div>
            <div className="bg-orange-500 text-white px-4 py-2 rounded">
              File no: {fileData?.fileNumber}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-blue-600">Aadhaar Details</h3>
            <div className="flex gap-4">
              <Input
                placeholder="Enter 12 digit Aadhaar Number"
                value={aadhaarNumber}
                onChange={(e) => setAadhaarNumber(e.target.value)}
              />
              <Button onClick={handleSendOTP}>Send OTP</Button>
              <Input
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <Button onClick={handleSubmitOTP}>Submit OTP</Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Candidate Photo</Label>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => document.getElementById("photo-upload")?.click()}
                >
                  Choose File
                </Button>
                <span className="text-sm text-gray-500">
                  {selectedFiles.photo?.name || "No file chosen"}
                </span>
                <input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileChange("photo", e.target.files?.[0] || null)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Candidate Signature</Label>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => document.getElementById("signature-upload")?.click()}
                >
                  Choose File
                </Button>
                <span className="text-sm text-gray-500">
                  {selectedFiles.signature?.name || "No file chosen"}
                </span>
                <input
                  id="signature-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileChange("signature", e.target.files?.[0] || null)}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-blue-600">File Type & Documents</h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="type1">Document Type 1</SelectItem>
                    <SelectItem value="type2">Document Type 2</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById("doc1-upload")?.click()}
                  >
                    Choose File
                  </Button>
                  <span className="text-sm text-gray-500">
                    {selectedFiles.document1?.name || "No file chosen"}
                  </span>
                  <input
                    id="doc1-upload"
                    type="file"
                    className="hidden"
                    onChange={(e) => handleFileChange("document1", e.target.files?.[0] || null)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="type1">Document Type 1</SelectItem>
                    <SelectItem value="type2">Document Type 2</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById("doc2-upload")?.click()}
                  >
                    Choose File
                  </Button>
                  <span className="text-sm text-gray-500">
                    {selectedFiles.document2?.name || "No file chosen"}
                  </span>
                  <input
                    id="doc2-upload"
                    type="file"
                    className="hidden"
                    onChange={(e) => handleFileChange("document2", e.target.files?.[0] || null)}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-blue-600">Documents for Address</h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="address1">Address Proof 1</SelectItem>
                    <SelectItem value="address2">Address Proof 2</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById("address1-upload")?.click()}
                  >
                    Choose File
                  </Button>
                  <span className="text-sm text-gray-500">
                    {selectedFiles.address1?.name || "No file chosen"}
                  </span>
                  <input
                    id="address1-upload"
                    type="file"
                    className="hidden"
                    onChange={(e) => handleFileChange("address1", e.target.files?.[0] || null)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="address1">Address Proof 1</SelectItem>
                    <SelectItem value="address2">Address Proof 2</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById("address2-upload")?.click()}
                  >
                    Choose File
                  </Button>
                  <span className="text-sm text-gray-500">
                    {selectedFiles.address2?.name || "No file chosen"}
                  </span>
                  <input
                    id="address2-upload"
                    type="file"
                    className="hidden"
                    onChange={(e) => handleFileChange("address2", e.target.files?.[0] || null)}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-blue-600">Other Documents</h3>
            <div className="space-y-2">
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="other1">Other Document 1</SelectItem>
                  <SelectItem value="other2">Other Document 2</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => document.getElementById("other-upload")?.click()}
                >
                  Choose File
                </Button>
                <span className="text-sm text-gray-500">
                  {selectedFiles.other?.name || "No file chosen"}
                </span>
                <input
                  id="other-upload"
                  type="file"
                  className="hidden"
                  onChange={(e) => handleFileChange("other", e.target.files?.[0] || null)}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <Button onClick={handleUpload} className="bg-green-600 hover:bg-green-700">
              Upload
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default UploadDocumentsModal;
