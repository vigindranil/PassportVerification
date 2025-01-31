"use client"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Eye, MapPin, Search } from "lucide-react"
import Image from "next/image"
import { VisuallyHidden } from "@/components/ui/visually-hidden"
import { getWBSEDCLDetails } from "@/app/applicationDetails/[FileNumber]/api"

const DocumentTable = ({ documents, docPath }) => {
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [isLocationDetailsModalOpen, setIsLocationDetailsModalOpen] = useState(false)
  const [selectedDoc, setSelectedDoc] = useState("")
  const [selectedLocationDetails, setSelectedLocationDetails] = useState("")
  const [verifiedResponse, setVerifiedResponse] = useState("")
  const [verifyLoading, setVerifyLoading] = useState(false)

  const [type, setType] = useState("")

  const verifyDocument = async () => {
    try{

      const response = await getWBSEDCLDetails();
      setVerifiedResponse(response);
      setVerifyLoading(true);
    } catch(error){
      console.error(error);
    } finally{
      setVerifyLoading(false);
    }
  }

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
                        // setSelectedLocationDetails(doc?.UserAgent)
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
                    {type == "jpg" ? (
                      <Image
                        className="w-full h-full"
                        src={selectedDoc || "/placeholder.svg"}
                        // layout="fill"
                        // objectFit="contain"
                        width='100'
                        height='100'
                        alt="Document preview"
                      />
                    ) : type === "pdf" ? (
                      <embed src={selectedDoc} type="application/pdf" width="100%" height="100%" />
                    ) : (
                      "No file selected"
                    )}
                  </div>
                  <div className="w-1/2 h-full">
                    <div className="px-5">
                      <h1 className="text-center font-bold text-lg my-3">Verify Document</h1>
                      <p className="text-center">
                        Please verify the uploaded document by clicking the "Verify" button.
                      </p>
                      <button
                        className="flex bg-blue-300 justify-center items-center p-1 m-1 px-3 rounded-md hover:bg-blue-400 mx-auto"
                        onClick={() => verifyDocument()}
                      >
                        {!verifyLoading ? <><Search className="h-4 w-4 mx-1"/> <span>Verify</span></> : 'Verifying...'}
                      </button>
                      {verifiedResponse && <div className="w-full h-[300px]">
                        <hr className="my-3"/>
                        <h1 className="text-center">Fetched Data</h1>
                        <p>
                          <span className="font-bold">Consumer Name:</span> {verifiedResponse?.data?.consumerName}
                        </p>
                        <p>
                          <span className="font-bold">Consumer Address:</span> {verifiedResponse?.data?.consumerAddress}
                        </p>
                      </div>}
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
          {isLocationDetailsModalOpen && (
            <Dialog open={isLocationDetailsModalOpen} onOpenChange={setIsLocationDetailsModalOpen}>
              <DialogContent className="w-full">
              <VisuallyHidden>
                  <DialogTitle>Locational Details</DialogTitle>
                </VisuallyHidden>
                <div className="space-y-2 h-full w-full">
                  {selectedLocationDetails &&
                    <div>
                      <p>
                        <span className='font-bold'>IP Address:</span> {selectedLocationDetails?.ip}
                      </p>
                      <p>
                        <span className='font-bold'>City:</span> {selectedLocationDetails?.city}
                      </p>
                      <p>
                        <span className='font-bold'>Region:</span> {selectedLocationDetails?.region}
                      </p>
                      <p>
                        <span className='font-bold'>Country:</span> {selectedLocationDetails?.country}
                      </p>
                      <p>
                        <span className='font-bold'>Postal:</span> {selectedLocationDetails?.postal}
                      </p>
                      <p>
                        <span className='font-bold'>Timezone:</span> {selectedLocationDetails?.timezone}
                      </p>
                      <div><span className='font-bold'>Lat-Long:</span> {selectedLocationDetails?.loc}</div>
                      <div><span className='font-bold'>Map:</span> <a className='text-blue-500 underline' href={`https://www.google.co.in/maps/@${selectedLocationDetails?.loc}`}>view in map</a></div>
                    </div>
                  }
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default DocumentTable

