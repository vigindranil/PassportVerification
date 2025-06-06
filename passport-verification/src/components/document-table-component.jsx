"use client"
import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { AlertCircle, BadgeCheck, CheckCircle2, CheckCircle2Icon, Clock4, ClockAlert, Eye, FileCheck2, Frown, Loader, MapPin, Search } from "lucide-react"
import Image from "next/image"
import { VisuallyHidden } from "@/components/ui/visually-hidden"
import { getBirthCertificateDetails, getLandDeedDetails, getMadhyamikCertificate, getWBSEDCLDetails, verifyApplication } from "@/app/applicationDetails/[FileNumber]/api"
import Cookies from "react-cookies";
import { useToast } from "@/hooks/use-toast"
import { ToastAction } from "@/components/ui/toast"
import { motion } from "framer-motion";
import { Button } from "./ui/button"
import moment from "moment"
import { Badge } from "./ui/badge"

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


  const verifyMadhyamikCertificate = async (roll, number, year) => {
    try {
      setVerifyElectricityLoading(true);
      setVerifiedResponse(null)
      const response = await getMadhyamikCertificate(
        roll, number, year
        // "100021B", "032", "2014",
      );
      console.log("response", response);

      toast({
        title: (
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            <span>Success!</span>
          </div>
        ),
        description: "Data has been successfully retrieved",
        action: (
          <ToastAction altText="close">Close</ToastAction>
        ),
      })
      setVerifiedResponse(response || "");
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

  const verifyLandDeed = async (mouzaCode, khatianNo) => {
    try {
      setVerifyElectricityLoading(true);
      setVerifiedResponse(null)
      const response = await getLandDeedDetails(
        // "0101055", 276
        mouzaCode, khatianNo
      );
      console.log("response", response);

      toast({
        title: (
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            <span>Success!</span>
          </div>
        ),
        description: "Data has been successfully retrieved",
        action: (
          <ToastAction altText="close">Close</ToastAction>
        ),
      })
      setVerifiedResponse(response || "");
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
      if (response?.data?.messageCode == "04" || response?.status == 400) {
        toast({
          variant: "destructive",
          title: "Failure!",
          description: "Invalid Installation Number or Consumer ID",
        })
        setVerifiedResponse(null);
      }
      else {
        toast({
          title: (
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <span>Success!</span>
            </div>
          ),
          description: "Data has been successfully retrieved",
          action: (
            <ToastAction altText="close">Close</ToastAction>
          ),
        })
        setVerifiedResponse(response || "");
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
        description: "Data has been successfully retrieved",
        action: (
          <ToastAction altText="close">Close</ToastAction>
        ),
      })
      setVerifiedResponse(response?.data?.data || "");
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
          <TableCell><div className="h-4 bg-gray-300 rounded w-22 animate-pulse"></div></TableCell>
          <TableCell><div className="h-4 bg-gray-300 rounded w-20 animate-pulse"></div></TableCell>
          <TableCell><div className="h-4 bg-gray-300 rounded w-28 animate-pulse"></div></TableCell>
          <TableCell><div className="h-4 bg-gray-300 rounded w-20 animate-pulse"></div></TableCell>
          <TableCell><div className="h-4 bg-gray-300 rounded w-20 animate-pulse"></div></TableCell>
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
                            setSelectedDoc(`${doc?.DocumentPath}`)
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
                              setSelectedLocationDetails({ DeviceId: doc?.DeviceId, ip: doc?.LocationIp, MacAddress: doc?.MacAddress, loc: doc?.Latitude + "," + doc?.Longitude })
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
                    {selectedImage.FileType == "jpg" ? (
                      <div className="relative w-full h-full overflow-hidden mx-auto" onClick={() => setZoom(!zoom)}>
                        <motion.div className="mx-auto h-full" animate={{ scale: zoom ? 1.7 : 1 }} transition={{ duration: 0.3 }}>
                          <img
                            className="w-auto h-full max-h-[90vh] rounded-md mx-auto cursor-zoom-in"
                            src={selectedDoc || "/placeholder.svg"}
                            alt="Document preview"
                          />
                        </motion.div>
                      </div>
                    )
                      : selectedImage.FileType == "pdf" ? (
                        <embed src={`https://${selectedDoc}`} type="application/pdf" width="100%" height="100%" />
                      )
                        : (
                          "No file selected"
                        )}
                  </div>

                  {/* Matric Board Certificate */}
                  {((userType != 10) && docType == 14) && <div className={`w-1/2 p-10 h-full`}>
                    {/* {((userType != 10)) && <div className={`w-1/2 p-10 h-full`}> */}
                    <div className="px-2">
                      <h1 className="text-center font-bold text-xl my-3 mb-5 underline">Madhyamik Certificate (10th)</h1>

                      <div>
                        <p><span className="font-bold">Roll:</span> {selectedImage?.IdNumber}</p>
                        <p><span className="font-bold">Number:</span> {selectedImage?.IdNumber2}</p>
                        <p><span className="font-bold">Year of passing:</span> {selectedImage?.IdNumber3}</p>
                      </div>

                      {/* current verification Land Deed Data */}
                      {(selectedImage?.Isverified || verified || verifiedResponse) ?
                        null
                        :
                        <button
                          className="flex bg-blue-500 text-slate-200 justify-center items-center p-1 m-1 mt-5 px-3 rounded-md hover:bg-blue-600 mx-auto"
                          onClick={() => verifyMadhyamikCertificate(selectedImage?.IdNumber, selectedImage?.IdNumber2, selectedImage?.IdNumber3)}
                        >
                          {verifyElectricityLoading ? <span className="flex items-center gap-2"><Loader size={18} className="animate-spin font-bold" /> Retrieving...</span> : <><span>Retrieve Data</span></>}
                        </button>
                      }

                      {/* already verified Land Deed Data */}
                      {(selectedImage?.Isverified == 1) && <div className="w-full h-[150px]">
                        <hr className="my-2" />
                        <h1 className="text-center font-bold font-mono underline my-4">Data obtained from WBBSE</h1>
                        <p><span className="font-bold">Roll:</span> {JSON.parse(selectedImage?.UserAgent)?.data?.roll}</p>
                        <p><span className="font-bold">Number:</span> {JSON.parse(selectedImage?.UserAgent)?.data?.number}</p>
                        <p><span className="font-bold">Exam Year:</span> {JSON.parse(selectedImage?.UserAgent)?.data?.examYear}</p>
                        <p><span className="font-bold">Student Name:</span> {JSON.parse(selectedImage?.UserAgent)?.data?.studentName}</p>
                        <p><span className="font-bold">Father Name:</span> {JSON.parse(selectedImage?.UserAgent)?.data?.fatherName}</p>
                        <p><span className="font-bold">Date Of Birth:</span> {JSON.parse(selectedImage?.UserAgent)?.data?.dateOfBirth}</p>
                        <p><span className="font-bold">School Name:</span> {JSON.parse(selectedImage?.UserAgent)?.data?.schoolName}</p>
                        <p><span className="font-bold">Certificate Date:</span> {JSON.parse(selectedImage?.UserAgent)?.data?.certificateDate}</p>
                      </div>}


                      {(!selectedImage?.Isverified && verifiedResponse?.data) ? <div className="w-full h-[150px]">
                        <hr className="my-1" />
                        <h1 className="text-center font-bold font-mono underline my-4">Data retrieved from WBBSE</h1>
                        <p><span className="font-bold">Roll:</span> {verifiedResponse?.data?.roll}</p>
                        <p><span className="font-bold">Number:</span> {verifiedResponse?.data?.number}</p>
                        <p><span className="font-bold">Exam Year:</span> {verifiedResponse?.data?.examYear}</p>
                        <p><span className="font-bold">Student Name:</span> {verifiedResponse?.data?.studentName}</p>
                        <p><span className="font-bold">Father Name:</span> {verifiedResponse?.data?.fatherName}</p>
                        <p><span className="font-bold">Date Of Birth:</span> {verifiedResponse?.data?.dateOfBirth}</p>
                        <p><span className="font-bold">School Name:</span> {verifiedResponse?.data?.schoolName}</p>
                        <p><span className="font-bold">Certificate Date:</span> {verifiedResponse?.data?.certificateDate}</p>
                      </div>
                        : (verifiedResponse?.status == 1) ? <div className="w-full h-full">
                          <hr className="my-2" />
                          <h1 className="font-bold text-sm text-yellow-400 m-2 flex flex-col items-center justify-center gap-0"><Frown className="text-yellow-600 mr-1" /> No record found with this roll no. and year</h1>
                        </div> :
                          null
                      }

                    </div>
                  </div>}

                  {/* Land Deed */}
                  {((userType != 10) && docType == 26) && <div className={`w-1/2 p-10 h-full`}>
                    <div className="px-2">
                      <h1 className="text-center font-bold text-xl my-3 mb-5 underline">Land Deed Document</h1>

                      <div>
                        <p><span className="font-bold">Mouza Code (IDN):</span> {selectedImage?.IdNumber}</p>
                        <p><span className="font-bold">Khatian Number:</span> {selectedImage?.IdNumber2}</p>
                      </div>

                      {/* current verification Land Deed Data */}
                      {(selectedImage?.Isverified || verified || verifiedResponse) ?
                        null
                        :
                        <button
                          className="flex bg-blue-500 text-slate-200 justify-center items-center p-1 m-1 mt-5 px-3 rounded-md hover:bg-blue-600 mx-auto"
                          onClick={() => verifyLandDeed(selectedImage?.IdNumber, selectedImage?.IdNumber2)}
                        >
                          {verifyElectricityLoading ? <span className="flex items-center gap-2"><Loader size={18} className="animate-spin font-bold" /> Retrieving...</span> : <><span>Retrieve Data</span></>}
                        </button>
                      }

                      {/* already verified Land Deed Data */}
                      {(selectedImage?.Isverified == 1) && <div className="w-full h-[150px]">
                        <hr className="my-2" />
                        <h1 className="text-center font-bold font-mono underline my-4">Data obtained from Land Authority Department</h1>
                        <p><span className="font-bold">Total Area:</span> {JSON.parse(selectedImage?.UserAgent)?.data[0]?.TotalArea}</p>
                        <p><span className="font-bold">Owner Name:</span> {JSON.parse(selectedImage?.UserAgent)?.data[0]?.OwnerName}</p>
                        <p><span className="font-bold">Owner Type:</span> {JSON.parse(selectedImage?.UserAgent)?.data[0]?.OwnerType}</p>
                        <p><span className="font-bold">Address:</span> {JSON.parse(selectedImage?.UserAgent)?.data[0]?.Address}</p>
                        <p><span className="font-bold">Gurdian Name:</span> {JSON.parse(selectedImage?.UserAgent)?.data[0]?.GurdianName}</p>
                        <p><span className="font-bold">Khatian Creation Date:</span> {JSON.parse(selectedImage?.UserAgent)?.data[0]?.KhatianCreationDate}</p>
                        <p><span className="font-bold">No. of Plots:</span> {JSON.parse(selectedImage?.UserAgent)?.data[0]?.NoOfPlots}</p>
                      </div>}


                      {(!selectedImage?.Isverified && verifiedResponse?.data[0]?.ERROR == 1) ? <div className="w-full h-[150px]">
                        <hr className="my-1" />
                        <h1 className="text-center font-bold font-mono underline my-4">Data retrieved from Land Authority Department</h1>
                        <p><span className="font-bold">Total Area:</span> {verifiedResponse?.data[0]?.TotalArea}</p>
                        <p><span className="font-bold">Owner Name:</span> {verifiedResponse?.data[0]?.OwnerName}</p>
                        <p><span className="font-bold">Owner Type:</span> {verifiedResponse?.data[0]?.OwnerType}</p>
                        <p><span className="font-bold">Address:</span> {verifiedResponse?.data[0]?.Address}</p>
                        <p><span className="font-bold">Gurdian Name:</span> {verifiedResponse?.data[0]?.GurdianName}</p>
                        <p><span className="font-bold">Khatian Creation Date:</span> {verifiedResponse?.data[0]?.KhatianCreationDate}</p>
                        <p><span className="font-bold">No. of Plots:</span> {verifiedResponse?.data[0]?.NoOfPlots}</p>
                      </div>
                        : (verifiedResponse?.[0]) ? <div className="w-full h-full">
                          <hr className="my-2" />
                          <h1 className="font-bold text-sm text-yellow-400 m-2 flex flex-col items-center justify-center gap-0"><Frown className="text-yellow-600 mr-1" /> {verifiedResponse?.data[0]?.ERROR || 'No record found with this Mouza code & Khatian no.'}</h1>
                        </div> : null
                      }

                    </div>
                  </div>}

                  {/* Electricity Bill */}
                  {((userType != 10) && docType == 1) && <div className={`w-1/2 p-10 h-full`}>
                    {/* {(userType == 30) && <div className={`${(docType == 13) ? 'w-full p-10' : 'w-1/2'} h-full`}> */}
                    <div className="px-2">
                      <h1 className="text-center font-bold text-xl my-3 mb-5 underline">Verify Electricity Document</h1>

                      <div>
                        <p><span className="font-bold">Consumer ID:</span> {selectedImage?.IdNumber}</p>
                        <p><span className="font-bold">Installation Number:</span> {selectedImage?.IdNumber2}</p>
                      </div>

                      {/* already verified electricity data */}
                      {(selectedImage?.Isverified == 1) && <div className="w-full h-[150px]">
                        <hr className="my-2" />
                        <h1 className="text-center font-bold font-mono underline my-4">Data obtained from WBSEDCL</h1>
                        <p>
                          <span className="font-bold">Consumer Name:</span> {JSON.parse(selectedImage?.UserAgent)?.data?.consumerName}
                        </p>
                        <p>
                          <span className="font-bold">Consumer Address:</span> {JSON.parse(selectedImage?.UserAgent)?.data?.consumerAddress}
                        </p>
                      </div>}

                      {/* current verification electricity data */}
                      {(!selectedImage?.Isverified && verifiedResponse) ? <div className="w-full h-[150px]">
                        <hr className="my-1" />
                        <h1 className="text-center font-bold font-mono underline my-4">Data retrieved from WBSEDCL</h1>
                        <p>
                          <span className="font-bold">Consumer Name:</span> {verifiedResponse?.data?.consumerName}
                        </p>
                        <p>
                          <span className="font-bold">Consumer Address:</span> {verifiedResponse?.data?.consumerAddress}
                        </p>
                      </div>
                        : (verifiedResponse == "") ? <div className="w-full h-full">
                          <hr className="my-2" />
                          <h1 className="font-bold text-sm text-yellow-400 m-2 flex flex-col items-center justify-center gap-0"><Frown className="text-yellow-600 mr-1" /> No record found with this consumer ID. & installation no.</h1>
                        </div> : null
                      }

                      {(selectedImage?.Isverified || verified || verifiedResponse) ?
                        null
                        :
                        <button
                          className="flex bg-blue-500 text-slate-200 justify-center items-center p-1 m-1 mt-5 px-3 rounded-md hover:bg-blue-600 mx-auto"
                          onClick={() => verifyElectricityBill(selectedImage?.IdNumber, selectedImage?.IdNumber2)}
                        >
                          {verifyElectricityLoading ? <span className="flex items-center gap-2"><Loader size={18} className="animate-spin font-bold" /> Retrieving...</span> : <><span>Retrieve Data</span></>}
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
                        <p><span className="font-bold">Date of Birth:</span> {moment(selectedImage?.IdNumber2).format('DD/MM/YYYY')}</p>
                      </div>
                      {(selectedImage?.Isverified || verified || verifiedResponse) ?
                        null
                        :
                        <button
                          className='flex bg-blue-500 text-slate-200 justify-center items-center p-1 m-1 my-3 px-3 rounded-md hover:bg-blue-600 mx-auto'
                          onClick={() => verifyBirthCertificate(selectedImage?.IdNumber, moment(selectedImage?.IdNumber2).format('DD/MM/YYYY'))}
                        >
                          {verifyElectricityLoading ? <span className="flex items-center gap-2"><Loader size={18} className="animate-spin font-bold" /> Retrieving...</span> : <><span>Retrieve Data</span></>}
                        </button>}

                      {/* already verified birth certificate data */}
                      {(selectedImage?.Isverified && selectedImage?.UserAgent) ?
                        <div className="w-full h-full">
                          <hr className="my-2" />
                          <h1 className="text-center font-bold font-mono underline">Data obtained from Janma Mrityutathya Portal</h1>

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

                      {/* current verification birth certificate data */}
                      {(!selectedImage?.Isverified && verifiedResponse) ?
                        <div className="w-full h-full">
                          <hr className="my-2" />
                          <h1 className="text-center font-bold font-mono underline m-2">Data obtained from Janma Mrityutathya Portal</h1>
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
                        </div>
                        : (verifiedResponse == "") ? <div className="w-full h-full">
                          <hr className="my-2" />
                          <h1 className="font-bold text-sm text-yellow-400 m-2 flex flex-col items-center justify-center gap-0"><Frown className="text-yellow-600 mr-1" /> No record found</h1>
                          <div className="text-justify m-2 flex flex-col gap-1 border p-2 rounded-md bg-gray-50 text-xs"> 
                            <b className="flex gap-1 justify-center"><AlertCircle className="h-4 w-4 text-violet-600" /> Note:</b> Only the certificate which is generated from Janma-Mrityu-Tathya Portal will be show here. If no data is found, you can still approve it after manual check.
                          <br/>
                          <br/>
                          যদি কোনো ডেটা না পাওয়া যায়, তাহলে ম্যানুয়ালি যাচাই করে ডকুমেন্ট অনুমোদন করতে পারেন।
                          </div>
                        </div> : null
                      }
                    </div>
                  </div>}

                  {/* Remarks */}
                  {((type != "pdf") && (userType != 10) && (docType != 1)) && <div className={`w-1/3 p-2 pt-10 h-full`}>
                    <div className="px-2 pt-5">

                      <div className="flex my-1 gap-2"><span className="font-bold">Remarks: </span> {selectedImage?.Remarks || "N/A"}</div>

                      <div className="block w-auto mb-5"><span className="font-bold">Verified by:</span> {selectedImage?.verifyBy ? selectedImage?.verifyBy : <Badge className="bg-amber-400 hover:bg-amber-500"><Clock4 size={16} className="mr-1" /> EO Approval Pending</Badge>}</div>
                      {(verified) ? <>
                        <Button
                          className={`cursor-not-allowed disabled:bg-green-500 mt-5 bg-green-500 hover:bg-green-500 text-slate-200 p-1 m-1 flex items-center px-3 rounded-md mx-auto`}
                        >
                          <BadgeCheck className="h-6 w-6" /> Document Verifed
                        </Button>

                      </>
                        : <Button
                          className={`mt-5 flex bg-zinc-100 text-slate-600 border-[1.3px] hover:border-green-500 hover:bg-zinc-200 p-1 m-1 items-center px-3 rounded-md mx-auto`}
                          onClick={() => handleVerifyApplication(docType == 14 ? 4 : docType == 26 ? 3 : docType == 1 ? 2 : docType == 8 ? 1 : 99, docType == 14 ? 'MadhyamikCertificate' : docType == 26 ? 'LandDeedDetails' : docType == 1 ? 'WBSEDCLDetails' : docType == 8 ? 'BirthCertificateDetails' : 'otherThanThirdPartyApiDocs', fileNo, selectedImage?.DocumentId, { IdNumber: selectedImage?.IdNumber, IdNumber2: selectedImage?.IdNumber2, IdNumber3: selectedImage?.IdNumber3 }, verifiedResponse)}
                          disabled={selectedImage?.Isverified || verifyApplicationLoading}
                        >
                          {(verifyApplicationLoading) ? <span className="flex items-center gap-2"><Loader size={18} className="animate-spin font-bold" /> Approving</span> : verified ? <><CheckCircle2Icon className="h-4 w-4 mr-1" /> <span>Document Verifed</span></> : <><span className="flex gap-1 justify-center items-center text-xs"><FileCheck2 size={18} className="font-extrabold text-green-600" /><span className="flex flex-1">Approve the Document</span></span></>}
                        </Button>
                      }

                      {docType == 14 || docType == 26 || docType == 1 || docType == 8 ?
                        <div className="w-full h-[50vh] overflow-y-scroll border p-2 rounded-md mt-3 bg-violet-50 ">
                          <span className="flex justify-center items-center gap-1 text-slate-500 mb-2"><AlertCircle className="text-violet-700" />Instructions:</span>
                          <p className="text-xs text-slate-500 leading-tight mb-1"><b>1.</b> Click 'Retrieve Data'.</p>
                          <p className="text-xs text-slate-500 leading-tight mb-1"><b>2.</b> Match the data with the image on the left.</p>
                          <p className="text-xs text-slate-500 leading-tight mb-1"><b>3.</b> Then click 'Approve the Document'.</p>
                          <p className="text-xs text-slate-500 leading-tight mb-1"><b>Note:</b> If no data is found, you can still approve it after manual check.</p>

                          <br />

                          <p className="text-xs text-slate-500 leading-tight mb-1"><b>1.</b> 'Retrieve Data' বাটনে ক্লিক করুন।</p>
                          <p className="text-xs text-slate-500 leading-tight mb-1"><b>2.</b> বাম পাশে থাকা ছবির সাথে ডেটা মিলিয়ে দেখুন।</p>
                          <p className="text-xs text-slate-500 leading-tight mb-1"><b>3.</b> মিলিয়ে নেওয়ার পর 'Approve the Document' বাটনে ক্লিক করুন।</p>
                          <p className="text-xs text-slate-500 leading-tight mb-1"><b>Note:</b> যদি কোনো ডেটা না পাওয়া যায়, তাহলে ম্যানুয়ালি যাচাই করে ডকুমেন্ট অনুমোদন করতে পারেন।</p>
                        </div>
                        : 
                        <div className="w-full h-[50vh] overflow-y-scroll border p-2 rounded-md mt-3 bg-violet-50 ">
                          <span className="flex justify-center items-center gap-1 text-slate-500 mb-2"><AlertCircle className="text-violet-700" />Instructions:</span>
                          <p className="text-xs text-slate-500 leading-tight mb-1"><b>1.</b> Verify Document image & Click 'Approve the Document'.</p>
                          <p className="text-xs text-slate-500 leading-tight mb-1"><b>Note:</b> If already verified, button will show 'Verifed' in green.</p>

                          <br />

                          <p className="text-xs text-slate-500 leading-tight mb-1"><b>1.</b> ডকুমেন্টের ছবি যাচাই করুন এবং 'Approve the Document' বাটনে ক্লিক করুন।</p>
                          <p className="text-xs text-slate-500 leading-tight mb-1"><b>Note:</b> যদি আগে থেকেই যাচাই করা থাকে, তাহলে বাটনে 'Verified' সবুজ রঙে দেখা যাবে।</p>
                        </div>
                        }



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
                      {selectedLocationDetails?.DeviceId && <div><span className='font-bold'>Device ID:</span> <span>{selectedLocationDetails?.DeviceId}</span></div>}

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

