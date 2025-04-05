"use client"
import React, { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "./ui/button"
import { BadgeAlert, BadgeCheck, CheckCircle2, Loader2 } from "lucide-react"
import { FileAcceptModal } from "./approve-reject-modal"
import { toast } from "@/hooks/use-toast"
import { ToastAction } from "./ui/toast"
import { updateEnquiryStatus } from "@/app/acceptedAndVerificationPending-eo/api"
import { updateEnquiryStatus as updateEnquiryStatusOC } from "@/app/allFiles-oc/api"
import { transferapplication, updateEnquiryStatus as updateEnquiryStatusSP } from "@/app/allFiles-sp/api"
import Cookies from "react-cookies";
import { useRouter } from "next/navigation"


const ApplicationRecommendation = ({ fileNo }) => {
  const [type, setType] = useState("");
  const [isFileAcceptModalOpen, setIsFileAcceptModalOpen] = useState(false)
  const [recommendationStage, setRecommendationStage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter()

  const [user_role, setUser_Role] = useState(null);
  const [ps, setPS] = useState("");
  const [ds, setDS] = useState("");

  useEffect(() => {
    // Load user role on the client side
    const role = Cookies.load("type");
    const police_station = Cookies.load("ps");
    const district = Cookies.load("district");
    setUser_Role(role);
    setPS(police_station);
    setDS(district);
  }, []);

  const handleCompleteVerification = async (applicationId, remarks = "Recommend for Apporval") => {
    try {
      // Implement the logic for accepting the file
      setIsLoading(true);
      setIsFileAcceptModalOpen(false);
      let response = null;

      if (user_role == 40) { // EO
        response = await updateEnquiryStatus(applicationId, remarks, type);
      }
      else if (user_role == 30) { // OC
        response = await updateEnquiryStatusOC(applicationId, remarks, type);
      }
      else if (user_role == 20) { // SP
        response = await updateEnquiryStatusSP(applicationId, remarks, type);
      }

      if (response?.status == 0) {
        setRecommendationStage(true);
        toast({
          title: (
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <span>Successfull!</span>
            </div>
          ),
          description: response?.message,
          action: <ToastAction altText="Try again">Close</ToastAction>,
        })

        setTimeout(() => {
          // Redirect to the desired page after 3 seconds
          if (user_role == 40) { // EO
            router.push('/acceptedAndVerificationPending-eo')
          }
          else if (user_role == 30) { // OC
            router.push('/allFiles-oc')
          }
          else if (user_role == 20) { // SP
            router.push('/allFiles-sp')
          }
        }, 3000);
      } else {
        toast({
          variant: "destructive",
          title: "Failed to update status!",
          description: response?.message,
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        })
      }
    } catch (e) {
      console.log('Error:', e);
      toast({
        variant: "destructive",
        title: "Failed to update status!",
        description: 'An error occurred',
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      })
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="mt-12 bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
      <div className="bg-gradient-to-r to-cyan-600 from-violet-600 px-6 py-3">
        <h2 className="text-2xl font-bold text-white">Application Recommendation</h2>
      </div>
      <div className="m-6">
        <Card>
          <CardContent className="p-10">
            <div className="overflow-x-auto">

              <h1 className="text-lg font-bold text-gray-800 dark:text-white text-center">Application/File No.: {fileNo}</h1>
              <h1 className="text-md text-gray-600 dark:text-white text-center">
                Please verify all supporting documents after taking any action on this application.
              </h1>

              {user_role === 40 && (
                <h1 className="text-md text-gray-600 dark:text-white text-center">
                  Upon recommendation, the application will be forwarded to the concerned OC/IC of <b>{ps}</b> Police Station.
                </h1>
              )}
              {user_role === 30 && (
                <h1 className="text-md text-gray-600 dark:text-white text-center">
                  Upon recommendation, the application will be forwarded to the concerned SP/DIB of <b>{ds}</b> District.
                </h1>
              )}
              {user_role === 20 && (
                <h1 className="text-md text-gray-600 dark:text-white text-center">
                  Once the application is approved or rejected, the applicant will be notified. Please note that this action is final and cannot be undone.
                </h1>
              )}


              <div className="flex justify-between items-center mt-4 w-full">
                <div className="flex items-center justify-center w-full">
                  <Button
                    disabled={recommendationStage || (isLoading && type == "approve")}
                    variant="outline"
                    className="mr-2 border-green-400 bg-green-50 hover:bg-green-400 hover:text-white group"
                    onClick={() => {
                      setType('approve')
                      setIsFileAcceptModalOpen(true)
                    }}>
                    {(isLoading && type == "approve") ? <div className="flex justify-center items-center gap-2"><Loader2 className="animate-spin" />Please wait a few moment...</div> : <div className="flex justify-center items-center gap-2"><BadgeCheck className="font-bold text-green-500 group-hover:text-white" />{user_role == 20 ? "Approve This Application" : "Recommend application for approval"} </div>}
                  </Button>

                  <Button
                    disabled={recommendationStage || (isLoading && type == "reject")}
                    variant="outline"
                    className="mr-2 border-red-400 bg-red-50 hover:bg-red-400 hover:text-white group"
                    onClick={() => {
                      setType('reject')
                      setIsFileAcceptModalOpen(true)
                    }}>
                    {(isLoading && type == "reject") ? <div className="flex justify-center items-center gap-2"><Loader2 className="animate-spin" />Please wait a few moment...</div> : <div className="flex justify-center items-center gap-2"><BadgeAlert className="font-bold text-red-500 group-hover:text-white" />{user_role == 20 ? "Reject This Application" : "Not Recommend application for approval"}</div>}
                  </Button>
                </div>
              </div>

            </div>

            {/* Modal */}
            {isFileAcceptModalOpen && (
              <FileAcceptModal
                isOpen={isFileAcceptModalOpen}
                onClose={() => setIsFileAcceptModalOpen(false)}
                applicationId={fileNo}
                onAccept={handleCompleteVerification}
                type={type}
              />
            )}

          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ApplicationRecommendation;
