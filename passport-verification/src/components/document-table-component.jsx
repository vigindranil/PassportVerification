"use client"
import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { CheckCircle2, CheckCircle2Icon, Eye, Loader, MapPin, Search } from "lucide-react"
import Image from "next/image"
import { VisuallyHidden } from "@/components/ui/visually-hidden"
import { getBirthCertificateDetails, getWBSEDCLDetails, verifyApplication } from "@/app/applicationDetails/[FileNumber]/api"
import Cookies from "react-cookies";

const DocumentTable = ({ documents, docPath, fileNo }) => {
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [isLocationDetailsModalOpen, setIsLocationDetailsModalOpen] = useState(false)
  const [selectedDoc, setSelectedDoc] = useState("")
  const [selectedLocationDetails, setSelectedLocationDetails] = useState("")
  const [verifiedResponse, setVerifiedResponse] = useState(null)
  const [verifyElectricityLoading, setVerifyElectricityLoading] = useState(false)
  const [verifyApplicationLoading, setVerifyApplicationLoading] = useState(false)
  const [verified, setVerified] = useState(false)
  const [docType, setDocType] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [userType, setUserType] = useState(null);
  const userTypeCookies = Cookies.load("type");


  const [type, setType] = useState("")

  const verifyElectricityBill = async (
    consumerId,
    installationNum
  ) => {
    try {
      setVerifyElectricityLoading(true);
      setVerifiedResponse(null)
      const response = await getWBSEDCLDetails(
        consumerId,
        installationNum
      );
      toast({
        title: (
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            <span>Success!</span>
          </div>
        ),
        description: "Data has been successfully fetched",
        action: (
          <ToastAction altText="close">Close</ToastAction>
        ),
      })
      setVerifiedResponse(response);
    } catch (error) {
      console.log(error);
      toast({
        variant: "destructive",
        title: "Failure!",
        description: "Something went wrong, Please try again",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      })
    } finally {
      setVerifyElectricityLoading(false);
    }
  }

  const verifyBirthCertificate = async (
    CertificateNo,
    dateofbirth,
  ) => {
    try {
      setVerifyElectricityLoading(true);
      setVerifiedResponse(null)
      const response = await getBirthCertificateDetails(
        CertificateNo,
        dateofbirth,
      );
      toast({
        title: (
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            <span>Success!</span>
          </div>
        ),
        description: "Data has been successfully fetched",
        action: (
          <ToastAction altText="close">Close</ToastAction>
        ),
      })
      setVerifiedResponse(response?.data?.data);
    } catch (error) {
      console.log(error);
      toast({
        variant: "destructive",
        title: "Failure!",
        description: "Something went wrong, Please try again",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      })
    } finally {
      setVerifyElectricityLoading(false);
    }
  }

  const handleVerifyApplication = async (
    APITypeId,
    APIName,
    ApplicationId,
    DocumentID,
    APIRequest,
    APIResponse,
    Remarks = "-"
  ) => {
    try {
      setVerifyApplicationLoading(true);
      const response = await verifyApplication(
        APITypeId,
        APIName,
        ApplicationId,
        DocumentID,
        APIRequest ? JSON.stringify(APIRequest) : null,
        APIResponse ? JSON.stringify(APIResponse) : null,
        Remarks
      );
      console.log(response);
      if (response.status == 0) {
        toast({
          title: (
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <span>Success!</span>
            </div>
          ),
          description: "Data has been successfully fetched",
          action: (
            <ToastAction altText="close">Close</ToastAction>
          ),
        })
        setVerified(true);
      }else {
        toast({
          variant: "destructive",
          title: "Failure!",
          description: "Something went wrong, Please try again",
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        })
      }
    } catch (error) {
      console.log(error);
      toast({
        variant: "destructive",
        title: "Failure!",
        description: "Something went wrong, Please try again",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      })
    } finally {
      setVerifyApplicationLoading(false);
    }
  }

  useEffect(() => {
    setUserType(userTypeCookies);
  }, [userTypeCookies])

  return (
    <Card className="m-5">
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Document Type</TableHead>
                <TableHead>File Type</TableHead>
                <TableHead>Id Number 1</TableHead>
                <TableHead>Id Number 2</TableHead>
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
                  <TableCell>{doc?.IdNumber2 || "-"}</TableCell>
                  <TableCell>{doc?.LocationIp || "-"}</TableCell>
                  <TableCell className="flex">
                    <button
                      className="flex bg-blue-100 justify-center items-center p-1 m-1 rounded-md hover:bg-blue-200 text-sm"
                      onClick={() => {
                        setVerifiedResponse(null)
                        setSelectedDoc(`${docPath}${doc?.DocumentPath}`)
                        setType(doc?.FileType)
                        setIsDetailsModalOpen(true)
                        setDocType(doc?.DocumentTypeId)
                        setSelectedImage(doc)
                        setVerified(doc?.Isverified)
                      }}
                    >
                      <Eye className="text-blue-600 mr-2 h-4 w-4" />
                      View
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
                  <div className={`${(docType == 13) ? 'w-full p-10' : 'w-1/2'} h-full flex items-center justify-center bg-gray-100`}>
                    {type == "jpg" ? (
                      <Image
                        className="w-auto h-[95vh]"
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

                  {/* Electricity Bill */}
                  {/* {(userType == 30 && docType == 1) && <div className={`${(docType == 13) ? 'w-full p-10' : 'w-1/2'} h-full`}> */}
                  {(userType == 30) && <div className={`${(docType == 13) ? 'w-full p-10' : 'w-1/2'} h-full`}>
                    <div className="px-5">
                      <h1 className="text-center font-bold text-2xl my-3 mb-10 underline">Verify Electricity Document</h1>
                      <p className="text-slate-600">
                        Please verify the uploaded document by clicking the "Verify Electricity Bill" button.
                      </p>
                      <div>
                        <p><span className="font-bold">Consumer ID:</span> {selectedImage?.IdNumber}</p>
                        <p><span className="font-bold">Installation Number:</span> {selectedImage?.IdNumber2}</p>
                      </div>

                      {(verifiedResponse || verified) ?
                        <button
                          className={`flex bg-${verified ? 'green' : 'gray'}-500 text-slate-200 justify-center items-center p-1 m-1 px-3 rounded-md hover:bg-${verified ? 'green' : 'gray'}-500 mx-auto`}
                          onClick={() => handleVerifyApplication(1, 'getWBSEDCLDetails', { IdNumber: selectedImage?.IdNumber, IdNumber2: selectedImage?.IdNumber2 }, verifiedResponse)}
                          disabled={verifyApplicationLoading}
                        >
                          {(verifyApplicationLoading) ? <span className="flex items-center gap-2"><Loader size={18} className="animate-spin font-bold" /> Approving</span> : verified ? <><CheckCircle2Icon className="h-4 w-4 mr-1" /> <span>Document Verifed</span></> : <><span>Approve The Document</span></>}
                        </button>
                        :
                        <button
                          className="flex bg-blue-500 text-slate-200 justify-center items-center p-1 m-1 px-3 rounded-md hover:bg-blue-600 mx-auto"
                          onClick={() => verifyElectricityBill(selectedImage?.IdNumber, selectedImage?.IdNumber2)}
                        >
                          {verifyElectricityLoading ? <span className="flex items-center gap-2"><Loader size={18} className="animate-spin font-bold" /> Verifying</span> : <><Search className="h-4 w-4 mx-1" /> <span>Verify Electricity Bill</span></>}
                        </button>
                      }
                      {verifiedResponse && <div className="w-full h-[300px]">
                        <hr className="my-5" />
                        <h1 className="text-center font-bold font-mono underline">Fetched Data</h1>
                        <p>
                          <span className="font-bold">Consumer Name:</span> {verifiedResponse?.data?.consumerName}
                        </p>
                        <p>
                          <span className="font-bold">Consumer Address:</span> {verifiedResponse?.data?.consumerAddress}
                        </p>
                      </div>}
                    </div>
                  </div>}

                  {/* Birth Certificate */}
                  {(userType == 30 && docType == 8) && <div className={`${(docType == 13) ? 'w-full p-10' : 'w-1/2'} h-full`}>
                    {/* {(userType == 30) && <div className={`${(docType == 13) ? 'w-full p-10' : 'w-1/2'} h-full`}> */}
                    <div className="px-5">
                      <h1 className="text-center font-bold text-2xl my-3 mb-10 underline">Verify Birth Certificate</h1>
                      <p className="text-slate-600">
                        Please verify the uploaded document by clicking the "Verify Birth Certificate" button.
                      </p>
                      <div>
                        <p><span className="font-bold">Certificate No:</span> {selectedImage?.IdNumber}</p>
                        <p><span className="font-bold">Date of Birth:</span> {selectedImage?.IdNumber2}</p>
                      </div>
                      {(verifiedResponse || verified) ?
                        <button
                          className={`flex bg-${verified ? 'green' : 'gray'}-500 text-slate-200 justify-center items-center p-1 m-1 px-3 rounded-md hover:bg-${verified ? 'green' : 'gray'}-500 mx-auto`}
                          onClick={() => handleVerifyApplication(1, 'getWBSEDCLDetails', { IdNumber: selectedImage?.IdNumber, IdNumber2: selectedImage?.IdNumber2 }, verifiedResponse)}
                          disabled={verifyApplicationLoading}
                        >
                          {(verifyApplicationLoading) ? <span className="flex items-center gap-2"><Loader size={18} className="animate-spin font-bold" /> Approving</span> : verified ? <><CheckCircle2Icon className="h-4 w-4 mr-1" /> <span>Document Verifed</span></> : <><span>Approve The Document</span></>}
                        </button>
                        :
                        <button
                          className='flex bg-blue-500 text-slate-200 justify-center items-center p-1 m-1 px-3 rounded-md hover:bg-blue-600 mx-auto'
                          onClick={() => verifyBirthCertificate(selectedImage?.IdNumber, selectedImage?.IdNumber2)}
                        >
                          {verifyElectricityLoading ? <span className="flex items-center gap-2"><Loader size={18} className="animate-spin font-bold" /> Verifying</span> : <><Search className="h-4 w-4 mr-1" /> <span>Verify Birth Certificate</span></>}
                        </button>}
                      {verifiedResponse && <div className="w-full h-full">
                        <hr className="my-5" />
                        <h1 className="text-center font-bold font-mono underline">Fetched Data</h1>
                        <div className="w-full h-[300px] overflow-y-auto text-sm">
                          <p><span className="font-bold">Name</span> {verifiedResponse?.ChNamae}</p>
                          <p><span className="font-bold">Gender</span> {verifiedResponse?.ChGender}</p>
                          <p><span className="font-bold">Date of Birth</span> {verifiedResponse?.ChDob}</p>
                          <p><span className="font-bold">Place of Birth</span> {verifiedResponse?.PlaceOfBirth}</p>
                          <p><span className="font-bold">Mother Name</span> {verifiedResponse?.MotherName}</p>
                          <p><span className="font-bold">Monther Identity Proof</span> {verifiedResponse?.MontherIdentityProof}</p>
                          <p><span className="font-bold">Father Name</span> {verifiedResponse?.FatherName}</p>
                          <p><span className="font-bold">Father Identity Proof</span> {verifiedResponse?.FatherIdentityProof}</p>
                          <p><span className="font-bold">Certificate No.</span> {verifiedResponse?.CertificateNO}</p>
                          <p><span className="font-bold">Date of Registration</span> {verifiedResponse?.DateOfRegistration}</p>
                          <p><span className="font-bold">SUhid</span> {verifiedResponse?.SUhid}</p>
                          <p><span className="font-bold">Date of Issue</span> {verifiedResponse?.DateOfIssue}</p>
                          {/* <p><span className="font-bold">UpdatedOn</span> {verifiedResponse?.UpdatedOn}</p> */}
                          <p><span className="font-bold">Issuing Auth</span> {verifiedResponse?.IssuingAuth}</p>
                          <p><span className="font-bold mt-2 flex">Present Address:</span> {verifiedResponse?.PresentAdd}</p>
                          <p><span className="font-bold mt-2 flex">Permanent Address:</span> {verifiedResponse?.PermanentAdd}</p>
                        </div>
                      </div>}
                    </div>
                  </div>}
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

