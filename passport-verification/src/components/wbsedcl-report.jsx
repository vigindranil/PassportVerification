"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Eye, EyeOff, CheckCircle2, AlertCircle, Info } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { ToastAction } from "./ui/toast";
import { updatePassword } from "@/app/reset-password/api";
import { useRouter } from "next/navigation";
import { getWBSEDCLDetailsApi } from "@/app/thirt-party-api/wbsedcl/api";

export default function WBSEDCLReport() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [consumerId, setConsumerId] = useState("");
  const [installationNum, setInstallationNum] = useState("");
  const [apiResponse, setApiResponse] = useState(null);

  const fetchThirdPartyApiData = async () => {
    setIsLoading(true);
    try {
      if (!consumerId || !installationNum) {
        toast({
          variant: "destructive",
          title: "Please enter all values!",
          description: "Please ensure all required fields are filled or not.",
        });
        return;
      }

      const response = await getWBSEDCLDetailsApi(consumerId, installationNum);

      setApiResponse(response);
      if (response?.status == 0 && response?.data?.messageCode == "00") {
        toast({
          title: (
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <span>{'Successful!'}</span>
            </div>
          ),
          description: "Details has been fetched successfully.",
        });

      } else {
        toast({
          title: (
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <span>Failed!</span>
            </div>
          ),
          variant: "destructive",
          description: "No record found",
        });
      }
    } catch (e) {
      toast({
        variant: "destructive",
        title: (
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <span>Failed!</span>
          </div>
        ),
        description: e?.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto px-0 space-y-8 shadow-md">
      <div className="mt-0 bg-white dark:bg-gray-800 rounded-t-lg overflow-hidden">
        <div className="bg-gradient-to-r to-yellow-300 from-amber-600 px-6 py-3">
          <h2 className="text-2xl font-bold text-white">WBSCEL Electricity Bill</h2>
        </div>
      </div>
      <div className="bg-white rounded-lg p-6 w-96 mx-auto">
        <div className="space-y-4">

          {/* consumerId */}
          <div className="relative">
            <Input
              type="text"
              placeholder="Consumer ID"
              value={consumerId}
              onChange={(e) => setConsumerId(e.target.value)}
              className="w-full"
            />
          </div>

          {/* setInstallationNum */}
          <div className="relative">
            <Input
              type="text"
              placeholder="Installation Number"
              value={installationNum}
              onChange={(e) => setInstallationNum(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="flex justify-center space-x-2">
            <Button
              variant="default"
              className="bg-blue-500 text-white hover:bg-blue-600"
              onClick={fetchThirdPartyApiData}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex gap-1 justify-center items-center">
                  <Loader2 className="animate-spin" />
                  Searching...
                </div>
              ) : (
                "Search"
              )}
            </Button>
          </div>

          {/* Data */}

          {(apiResponse?.data?.messageCode && apiResponse?.data?.messageCode == "00") ?
            (<div className="bg-purple-50 border rounded-md shadow w-full mx-auto text-sm">
              <h1 className="flex justify-center text-lg items-center gap-1 p-2 bg-purple-100"><CheckCircle2 className="text-green-400" /> Record Found</h1>

              <div className="p-5">
                <div className="border-b-purple-200 border-b-2 mb-1">
                  <b>Consumer Name: </b>
                  <span>{apiResponse?.data?.consumerName}</span>
                </div>
                <div className="border-b-purple-200 border-b-2 mb-1">
                  <b>Consumer Address: </b>
                  <span>{apiResponse?.data?.consumerAddress}</span>
                </div>
              </div>
            </div>)
            : (apiResponse?.data?.messageCode && apiResponse?.data?.messageCode != "00") ?
              (<div className="bg-purple-50 border rounded-md shadow w-full mx-auto p-5">
                <div>
                  <span className="flex"><Info className="text-red-500 mr-2" /> No record found!</span>
                </div>
              </div>) : null
          }
        </div>
      </div>
    </div>
  );
}