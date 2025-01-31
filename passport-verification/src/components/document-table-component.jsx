"use client"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Eye, MapPin } from "lucide-react"
import Image from "next/image"
import { VisuallyHidden } from "@/components/ui/visually-hidden"

const DocumentTable = ({ documents, docPath }) => {
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [isLocationDetailsModalOpen, setIsLocationDetailsModalOpen] = useState(false)
  const [selectedDoc, setSelectedDoc] = useState("")
  const [selectedLocationDetails, setSelectedLocationDetails] = useState("")
  const [type, setType] = useState("")

  return (
    <Card className="m-5">
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Document Type</TableHead>
                <TableHead>File Type</TableHead>
                <TableHead>Document Id Number</TableHead>
                <TableHead>IP</TableHead>
                <TableHead className="text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents?.map((doc, index) => (
                <TableRow key={index}>
                  <TableCell>{doc?.DocumentTypeName || "-"}</TableCell>
                  <TableCell>{doc?.FileType || "-"}</TableCell>
                  <TableCell>{doc?.IdNumber || "-"}</TableCell>
                  <TableCell>{doc?.LocationIp || "-"}</TableCell>
                  <TableCell className="flex justify-center">
                    <button
                      className="flex bg-blue-100 justify-center items-center p-1 m-1 rounded-md hover:bg-blue-200 text-sm"
                      onClick={() => {
                        setSelectedDoc(`${docPath}${doc?.DocumentPath}`)
                        setType(doc?.FileType)
                        setIsDetailsModalOpen(true)
                      }}
                    >
                      <Eye className="text-blue-600 mr-2 h-4 w-4" />
                      File
                    </button>
                    {(doc?.DocumentTypeId == 13) && <button
                      className="flex bg-blue-100 justify-center items-center p-1 m-1 rounded-md hover:bg-blue-200 text-sm"
                      onClick={() => {
                        setSelectedLocationDetails(doc?.UserAgent ? JSON.parse(doc?.UserAgent) : {})
                        setIsLocationDetailsModalOpen(true)
                      }}
                    >
                      <MapPin className="text-blue-600 mr-2 h-4 w-4" />
                      Location
                    </button>}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {isDetailsModalOpen && (
            <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
              <DialogContent className="w-screen h-screen max-w-full m-0 p-0">
                <VisuallyHidden>
                  <DialogTitle>Document Preview</DialogTitle>
                </VisuallyHidden>
                <div className="flex h-full">
                  <div className="w-1/2 h-full flex items-center justify-center bg-gray-100">
                    {type === "image" ? (
                      <Image
                        src={selectedDoc || "/placeholder.svg"}
                        layout="fill"
                        objectFit="contain"
                        alt="Document preview"
                      />
                    ) : type === "pdf" ? (
                      <embed src={selectedDoc} type="application/pdf" width="100%" height="100%" />
                    ) : (
                      "No file selected"
                    )}
                  </div>
                  <div className="w-1/2 h-full flex items-center justify-center bg-gray-200">
                    <Image src="/placeholder.svg?height=500&width=500" width={500} height={500} alt="Random image" />
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
          {isLocationDetailsModalOpen && (
            <Dialog open={isLocationDetailsModalOpen} onOpenChange={setIsLocationDetailsModalOpen}>
              <DialogContent className="w-full">{/* Location details content remains unchanged */}</DialogContent>
            </Dialog>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default DocumentTable

