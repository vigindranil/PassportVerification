"use client"
import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { CheckCircle2, CheckCircle2Icon, Eye, FileCheck2, Loader, MapPin, Search } from "lucide-react"
import Image from "next/image"
import { VisuallyHidden } from "@/components/ui/visually-hidden"
import { getBirthCertificateDetails, getWBSEDCLDetails, verifyApplication } from "@/app/applicationDetails/[FileNumber]/api"
import Cookies from "react-cookies";
import { useToast } from "@/hooks/use-toast"
import { ToastAction } from "@/components/ui/toast"
import { motion } from "framer-motion";
import { Button } from "./ui/button"

const DocumentTable = ({ documents, docPath, fileNo, isLoadingDocumentTable, verificationSuccess }) => {
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
  const [zoom, setZoom] = useState(false);
  const userTypeCookies = Cookies.load("type");
  const { toast } = useToast()
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
        verificationSuccess(prev => !prev);
        setIsDetailsModalOpen(false);
        toast({
          title: (
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <span>Success!</span>
            </div>
          ),
          description: "Application has been approved",
          action: (
            <ToastAction altText="close">Close</ToastAction>
          ),
        })
        setVerified(true);
      } else {
        toast({
          variant: "destructive",
          title: "Failure!",
          description: "Failed to approve, Please try again",
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

  // calling third party apis' if alredy verified
  // useEffect(() => {
  //   if (!selectedImage?.verified && selectedImage?.DocumentTypeId == 1) {
  //     verifyElectricityBill(
  //       selectedImage?.IdNumber,
  //       selectedImage?.IdNumber2
  //     );
  //   } else if (selectedImage?.verified && selectedImage?.DocumentTypeId == 8) {
  //     verifyBirthCertificate(
  //       selectedImage?.IdNumber,
  //       selectedImage?.IdNumber2
  //     );
  //   }
  // }, [selectedImage])

  const SkeletonLoader = () => (
    <>
      {[...Array(3)].map((_, index) => (
        <TableRow key={index}>
          <TableCell><div className="h-4 bg-gray-300 rounded w-24 animate-pulse"></div></TableCell>
          <TableCell><div className="h-4 bg-gray-300 rounded w-32 animate-pulse"></div></TableCell>
          <TableCell><div className="h-4 bg-gray-300 rounded w-40 animate-pulse"></div></TableCell>
          <TableCell><div className="h-4 bg-gray-300 rounded w-28 animate-pulse"></div></TableCell>
          <TableCell><div className="h-4 bg-gray-300 rounded w-40 animate-pulse"></div></TableCell>
          <TableCell><div className="h-4 bg-gray-300 rounded w-28 animate-pulse"></div></TableCell>
        </TableRow>
      ))}
    </>
  )

  return (
    <Card className="m-5">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-100 hover:bg-slate-100">
                <TableHead>Document Type</TableHead>
                <TableHead>File Type</TableHead>
                <TableHead>ID No. 1</TableHead>
                <TableHead>ID No. 2</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoadingDocumentTable ? <SkeletonLoader /> :
                documents?.length > 0 ?
                  documents?.map((doc, index) => (
                    <TableRow key={index}>
                      <TableCell>{doc?.DocumentTypeName || "-"}</TableCell>
                      <TableCell>{doc?.FileType || "-"}</TableCell>
                      <TableCell>{doc?.IdNumber || "-"}</TableCell>
                      <TableCell>{doc?.IdNumber2 || "-"}</TableCell>
                      <TableCell>{doc?.LocationIp || "-"}</TableCell>
                      <TableCell className="flex">
                        <button
                          className="flex bg-blue-100 justify-center items-center p-1 m-1 px-2 rounded-md hover:bg-blue-200 text-sm"
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
                        {(doc?.DocumentTypeId == 13) ? <button
                          className="flex bg-blue-100 justify-center items-center p-1 m-1 px-2 rounded-md hover:bg-blue-200 text-sm"
                          onClick={() => {
                            setSelectedLocationDetails(doc?.UserAgent ? JSON.parse(doc?.UserAgent) : {})
                            setIsLocationDetailsModalOpen(true)
                          }}
                        >
                          <MapPin className="text-blue-600 mr-2 h-4 w-4" />
                          Location
                        </button> :
                          <button
                            className="flex bg-blue-100 justify-center items-center p-1 m-1 px-2 rounded-md hover:bg-blue-200 text-sm"
                            onClick={() => {
                              setSelectedLocationDetails({ ip: doc?.LocationIp, MacAddress: doc?.MacAddress, loc: doc?.Latitude + "," + doc?.Longitude })
                              setIsLocationDetailsModalOpen(true)
                            }}
                          >
                            <MapPin className="text-blue-600 mr-2 h-4 w-4" />
                            Location
                          </button>}
                      </TableCell>
                    </TableRow>
                  )) :
                  <TableRow>
                    <TableCell className="text-center" colSpan={6}>No documents found</TableCell>
                  </TableRow>
              }
            </TableBody>
          </Table>
          {isDetailsModalOpen && (
            <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
              <DialogContent className="w-[95vw] h-[95vh] max-w-full m-0 p-3" onPointerDownOutside={(e) => e.preventDefault()}>
                <VisuallyHidden>
                  <DialogTitle>Document Preview</DialogTitle>
                </VisuallyHidden>
                <div className="flex h-full">
                  <div className={`${(selectedImage?.DocumentTypeId == 1 || selectedImage?.DocumentTypeId == 8) && (userType != 10) ? 'w-1/2' : 'w-full p-5'} max-h-[90vh] flex items-center justify-center bg-gray-100 rounded-md`}>
                    {type == "jpg" ? (
                      <div className="relative w-full h-full overflow-hidden mx-auto" onClick={() => setZoom(!zoom)}>
                        <motion.div className="mx-auto h-full" animate={{ scale: zoom ? 1.7 : 1 }} transition={{ duration: 0.3 }}>
                          <img
                            className="w-auto h-full max-h-[90vh] rounded-md mx-auto cursor-zoom-in"
                            src={selectedDoc || "/placeholder.svg"}
                            alt="Document preview"
                          />
                        </motion.div>
                      </div>
                    ) : type === "pdf" ? (
                      <embed src={selectedDoc} type="application/pdf" width="100%" height="100%" />
                    ) : (
                      "No file selected"
                    )}
                  </div>

                  {/* Electricity Bill */}
                  {((userType != 10) && docType == 1) && <div className={`w-1/2 p-10 h-full`}>
                    {/* {(userType == 30) && <div className={`${(docType == 13) ? 'w-full p-10' : 'w-1/2'} h-full`}> */}
                    <div className="px-2">
                      <h1 className="text-center font-bold text-xl my-3 mb-5 underline">Verify Electricity Document</h1>

                      <div>
                        <p><span className="font-bold">Consumer ID:</span> {selectedImage?.IdNumber}</p>
                        <p><span className="font-bold">Installation Number:</span> {selectedImage?.IdNumber2}</p>
                        {selectedImage?.Isverified ? <p><span className="font-bold">Verified by:</span> {selectedImage?.verifyBy ? selectedImage?.verifyBy : 'N/A'}</p> : null}
                      </div>

                      {/* already verified data */}
                      {(selectedImage?.Isverified == 1) && <div className="w-full h-[150px]">
                        <hr className="my-2" />
                        <h1 className="text-center font-bold font-mono underline my-4">Data fetched from WBSEDCL</h1>
                        <p>
                          <span className="font-bold">Consumer Name:</span> {JSON.parse(selectedImage?.UserAgent)?.data?.consumerName}
                        </p>
                        <p>
                          <span className="font-bold">Consumer Address:</span> {JSON.parse(selectedImage?.UserAgent)?.data?.consumerAddress}
                        </p>
                      </div>}

                      {/* current verification data */}
                      {(!selectedImage?.Isverified && verifiedResponse) && <div className="w-full h-[150px]">
                        <hr className="my-1" />
                        <h1 className="text-center font-bold font-mono underline my-4">Data fetched from WBSEDCL</h1>
                        <p>
                          <span className="font-bold">Consumer Name:</span> {verifiedResponse?.data?.consumerName}
                        </p>
                        <p>
                          <span className="font-bold">Consumer Address:</span> {verifiedResponse?.data?.consumerAddress}
                        </p>
                      </div>}

                      {(selectedImage?.Isverified || verified || verifiedResponse) ?
                        <>
                          <button
                            className={`${verified && 'cursor-not-allowed'} flex ${verified ? 'bg-green-500 hover:bg-green-500 text-slate-200' : 'bg-zinc-100 text-slate-600 border-[1.3px] hover:bg-zinc-200'} justify-center items-center p-1 m-1 px-3 rounded-md mx-auto`}
                            onClick={() => handleVerifyApplication(1, 'getWBSEDCLDetails', fileNo, selectedImage?.DocumentId, { IdNumber: selectedImage?.IdNumber, IdNumber2: selectedImage?.IdNumber2 }, verifiedResponse)}
                            disabled={selectedImage?.Isverified || verifyApplicationLoading}
                          >
                            {(verifyApplicationLoading) ? <span className="flex items-center gap-2"><Loader size={18} className="animate-spin font-bold" /> Approving</span> : verified ? <><CheckCircle2Icon className="h-4 w-4 mr-1" /> <span>Document Verifed</span></> : <><span className="flex gap-1 justify-center items-center"><FileCheck2 size={18} className="font-extrabold text-green-600" />Approve The Document</span></>}
                          </button>

                        </>
                        :
                        <button
                          className="flex bg-blue-500 text-slate-200 justify-center items-center p-1 m-1 mt-5 px-3 rounded-md hover:bg-blue-600 mx-auto"
                          onClick={() => verifyElectricityBill(selectedImage?.IdNumber, selectedImage?.IdNumber2)}
                        >
                          {verifyElectricityLoading ? <span className="flex items-center gap-2"><Loader size={18} className="animate-spin font-bold" /> Fetching</span> : <><span>Fetch Data</span></>}
                        </button>
                      }

                    </div>
                  </div>}

                  {/* Birth Certificate */}
                  {((userType != 10) && docType == 8) && <div className={`w-1/2 p-10 h-full`}>
                    {/* {(userType == 30) && <div className={`${(docType == 13) ? 'w-full p-10' : 'w-1/2'} h-full`}> */}
                    <div className="px-2">
                      <h1 className="text-center font-bold text-xl my-3 mb-5 underline">Verify Birth Certificate Document</h1>

                      <div>
                        <p><span className="font-bold">Certificate No:</span> {selectedImage?.IdNumber}</p>
                        <p><span className="font-bold">Date of Birth:</span> {selectedImage?.IdNumber2}</p>
                        {selectedImage?.Isverified == 1 ? <p><span className="font-bold">Verified by:</span> {selectedImage?.verifyBy ? selectedImage?.verifyBy : 'N/A'}</p> : null}
                      </div>
                      {(selectedImage?.Isverified || verified || verifiedResponse) ?
                        <>
                          {!verified ?
                            <Button
                              size="small"
                              className={`${verified && 'cursor-not-allowed'} flex ${verified ? 'bg-green-500 hover:bg-green-500' : 'bg-zinc-100 text-slate-600 border-[1.3px] hover:bg-zinc-200'} justify-center items-center p-1 m-1 px-3 rounded-md mx-auto`}
                              onClick={() => handleVerifyApplication(1, 'getWBSEDCLDetails', fileNo, selectedImage?.DocumentId, { IdNumber: selectedImage?.IdNumber, IdNumber2: selectedImage?.IdNumber2 }, verifiedResponse)}
                              disabled={verified || verifyApplicationLoading}
                            >
                              {(verifyApplicationLoading) ? <span className="flex items-center gap-1"><Loader size={18} className="animate-spin font-bold" /> Approving</span> : verified ? <><CheckCircle2Icon className="h-4 w-4 mx-0" /> <span>Document Verifed</span></> : <><span className="flex gap-1 justify-center items-center"><FileCheck2 size={18} className="font-extrabold text-green-600" />Approve The Document</span></>}
                            </Button>
                            : <button
                              className={`${verified && 'cursor-not-allowed'} flex bg-green-500 hover:bg-green-500 text-slate-50 justify-center items-center p-1 text-sm m-1 px-3 rounded-md mx-auto gap-1`}
                              disabled={verified || verifyApplicationLoading}
                            >
                              <><CheckCircle2Icon className="h-4 w-4 mx-0" /> <span>Document Verifed</span></>
                            </button>
                          }
                        </>
                        :
                        <button
                          className='flex bg-blue-500 text-slate-200 justify-center items-center p-1 m-1 my-3 px-3 rounded-md hover:bg-blue-600 mx-auto'
                          onClick={() => verifyBirthCertificate(selectedImage?.IdNumber, selectedImage?.IdNumber2)}
                        >
                          {verifyElectricityLoading ? <span className="flex items-center gap-2"><Loader size={18} className="animate-spin font-bold" /> Fetching</span> : <><span>Fetch Data</span></>}
                        </button>}

                      {/* already verified data */}
                      {(selectedImage?.Isverified && selectedImage?.UserAgent) ?
                        <div className="w-full h-full">
                          <hr className="my-2" />
                          <h1 className="text-center font-bold font-mono underline">Data fetched from Janma Mrityutathya Portal</h1>

                          <div className="w-full h-[45vh] overflow-y-auto text-sm p-2">
                            <p><span className="font-bold">Name</span> {JSON.parse(selectedImage?.UserAgent)?.ChNamae}</p>
                            <p><span className="font-bold">Gender</span> {JSON.parse(selectedImage?.UserAgent)?.ChGender}</p>
                            <p><span className="font-bold">Date of Birth</span> {JSON.parse(selectedImage?.UserAgent)?.ChDob}</p>
                            <p><span className="font-bold">Place of Birth</span> {JSON.parse(selectedImage?.UserAgent)?.PlaceOfBirth}</p>
                            <p><span className="font-bold">Mother Name</span> {JSON.parse(selectedImage?.UserAgent)?.MotherName}</p>
                            <p><span className="font-bold">Monther Identity Proof</span> {JSON.parse(selectedImage?.UserAgent)?.MontherIdentityProof}</p>
                            <p><span className="font-bold">Father Name</span> {JSON.parse(selectedImage?.UserAgent)?.FatherName}</p>
                            <p><span className="font-bold">Father Identity Proof</span> {JSON.parse(selectedImage?.UserAgent)?.FatherIdentityProof}</p>
                            <p><span className="font-bold">Certificate No.</span> {JSON.parse(selectedImage?.UserAgent)?.CertificateNO}</p>
                            <p><span className="font-bold">Date of Registration</span> {JSON.parse(selectedImage?.UserAgent)?.DateOfRegistration}</p>
                            <p><span className="font-bold">SUhid</span> {JSON.parse(selectedImage?.UserAgent)?.SUhid}</p>
                            <p><span className="font-bold">Date of Issue</span> {JSON.parse(selectedImage?.UserAgent)?.DateOfIssue}</p>
                            <p><span className="font-bold">Issuing Auth</span> {JSON.parse(selectedImage?.UserAgent)?.IssuingAuth}</p>
                            <p><span className="font-bold mt-2 flex">Present Address:</span> {JSON.parse(selectedImage?.UserAgent)?.PresentAdd}</p>
                            <p><span className="font-bold mt-2 flex">Permanent Address:</span> {JSON.parse(selectedImage?.UserAgent)?.PermanentAdd}</p>
                          </div>
                        </div>
                        : null}

                      {/* current verification data */}
                      {(!selectedImage?.Isverified && verifiedResponse) && <div className="w-full h-full">
                        <hr className="my-2" />
                        <h1 className="text-center font-bold font-mono underline m-2">Data fetched from Janma Mrityutathya Portal</h1>
                        <div className="w-full h-[45vh] overflow-y-auto text-sm p-2">
                          <p><span className="font-bold">Name: </span> {verifiedResponse?.ChNamae}</p>
                          <p><span className="font-bold">Gender: </span> {verifiedResponse?.ChGender}</p>
                          <p><span className="font-bold">Date of Birth: </span> {verifiedResponse?.ChDob}</p>
                          <p><span className="font-bold">Place of Birth: </span> {verifiedResponse?.PlaceOfBirth}</p>
                          <p><span className="font-bold">Mother Name: </span> {verifiedResponse?.MotherName}</p>
                          <p><span className="font-bold">Monther Identity Proof: </span> {verifiedResponse?.MontherIdentityProof}</p>
                          <p><span className="font-bold">Father Name: </span> {verifiedResponse?.FatherName}</p>
                          <p><span className="font-bold">Father Identity Proof: </span> {verifiedResponse?.FatherIdentityProof}</p>
                          <p><span className="font-bold">Certificate No.: </span> {verifiedResponse?.CertificateNO}</p>
                          <p><span className="font-bold">Date of Registration: </span> {verifiedResponse?.DateOfRegistration}</p>
                          <p><span className="font-bold">SUhid: </span> {verifiedResponse?.SUhid}</p>
                          <p><span className="font-bold">Date of Issue: </span> {verifiedResponse?.DateOfIssue}</p>
                          <p><span className="font-bold">Issuing Auth: </span> {verifiedResponse?.IssuingAuth}</p>
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
                <div className="space-y-2 h-full w-full px-5">
                  <h1 className="text-center text-slate-500 font-bold text-xl mb-10 underline">Locational Details</h1>
                  {selectedLocationDetails &&
                    <div>
                      {selectedLocationDetails?.ip && <div><span className='font-bold'>IP Address:</span> <span>{selectedLocationDetails?.ip}</span></div>}
                      {selectedLocationDetails?.city && <div><span className='font-bold'>City:</span> <span>{selectedLocationDetails?.city}</span></div>}
                      {selectedLocationDetails?.region && <div><span className='font-bold'>Region:</span> <span>{selectedLocationDetails?.region}</span></div>}
                      {selectedLocationDetails?.country && <div><span className='font-bold'>Country:</span> <span>{selectedLocationDetails?.country}</span></div>}
                      {selectedLocationDetails?.postal && <div><span className='font-bold'>Postal:</span> <span>{selectedLocationDetails?.postal}</span></div>}
                      {selectedLocationDetails?.timezone && <div><span className='font-bold'>Timezone:</span> <span>{selectedLocationDetails?.timezone}</span></div>}
                      {selectedLocationDetails?.MacAddress && <div><span className='font-bold'>Mac-Address:</span> <span>{selectedLocationDetails?.MacAddress}</span></div>}

                      <div><span className='font-bold'>Lat-Long:</span> {selectedLocationDetails?.loc}</div>
                      <div><span className='font-bold'>Map:</span> <a className='text-blue-500 underline' target="_blank" href={`https://www.google.co.in/maps/@${selectedLocationDetails?.loc}`}>view in map</a></div>
                    </div>
                  }
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardContent>
    </Card >
  )
}

export default DocumentTable

