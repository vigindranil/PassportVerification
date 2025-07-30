"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, CheckCircle2, AlertCircle, Info } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { getBirthCertificateDetailsApi } from "@/app/thirt-party-api/birth-certificate/api";
import { Label } from "./ui/label";

export default function BirthCertificateReport() {
  const [isLoading, setIsLoading] = useState(false);
  const [CertificateNo, setCertificateNo] = useState("");
  const [dateofbirth, setdateofbirth] = useState("");
  const [apiResponse, setApiResponse] = useState(null);

  const fetchThirdPartyApiData = async () => {
    setIsLoading(true);
    try {
      if (!CertificateNo || !dateofbirth) {
        toast({
          variant: "destructive",
          title: "Please enter all values!",
          description: "Please ensure all required fields are filled or not.",
        });
        return;
      }

      const response = await getBirthCertificateDetailsApi(CertificateNo, dateofbirth);

      setApiResponse(response);
      if (response?.status == 0 && response?.data?.status == "1") {
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
          <h2 className="text-2xl font-bold text-white">Birth Certificate Details</h2>
        </div>
      </div>
      <div className="bg-white rounded-lg p-6 w-96 mx-auto">
        <div className="space-y-4">

          {/* CertificateNo */}
          <div className="relative">
            <Label className="font-bold">Certificate No.</Label>
            <Input
              type="text"
              placeholder="Enter Certificate No."
              value={CertificateNo}
              onChange={(e) => setCertificateNo(e.target.value)}
              className="w-full"
            />
          </div>

          {/* setdateofbirth */}
          <div className="relative">
            <Label className="font-bold">Date of Birth</Label>
            <Input
              type="date"
              placeholder="Date of Birth"
              value={dateofbirth}
              onChange={(e) => setdateofbirth(e.target.value)}
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

          {(apiResponse?.data?.status && apiResponse?.data?.status == "1") ?
            (<div className="bg-purple-50 border rounded-md shadow w-[400px] mx-auto text-sm">
              <h1 className="flex justify-center text-lg items-center gap-1 p-2 bg-purple-100"><CheckCircle2 className="text-green-400" /> Record Found</h1>

              <div className="p-5">
                <div className="border-b-purple-200 border-b-2 mb-1">
                  <b>Name: </b>
                  <span>{apiResponse?.data?.data?.ChNamae}</span>
                </div>
                
                <div className="border-b-purple-200 border-b-2 mb-1">
                  <b>Gender: </b>
                  <span>{apiResponse?.data?.data?.ChGender}</span>
                </div>
                
                <div className="border-b-purple-200 border-b-2 mb-1">
                  <b>Dob: </b>
                  <span>{apiResponse?.data?.data?.ChDob}</span>
                </div>
                
                <div className="border-b-purple-200 border-b-2 mb-1">
                  <b>Place Of Birth: </b>
                  <span>{apiResponse?.data?.data?.PlaceOfBirth}</span>
                </div>
                
                <div className="border-b-purple-200 border-b-2 mb-1">
                  <b>Mother Name: </b>
                  <span>{apiResponse?.data?.data?.MotherName}</span>
                </div>
                
                <div className="border-b-purple-200 border-b-2 mb-1">
                  <b>Monther Identity Proof: </b>
                  <span>{apiResponse?.data?.data?.MontherIdentityProof}</span>
                </div>
                
                <div className="border-b-purple-200 border-b-2 mb-1">
                  <b>Father Name: </b>
                  <span>{apiResponse?.data?.data?.FatherName}</span>
                </div>
                
                <div className="border-b-purple-200 border-b-2 mb-1">
                  <b>Father Identity Proof: </b>
                  <span>{apiResponse?.data?.data?.FatherIdentityProof}</span>
                </div>
                
                <div className="border-b-purple-200 border-b-2 mb-1">
                  <b>Present Address: </b>
                  <span>{apiResponse?.data?.data?.PresentAdd}</span>
                </div>
                
                <div className="border-b-purple-200 border-b-2 mb-1">
                  <b>Permanent Address: </b>
                  <span>{apiResponse?.data?.data?.PermanentAdd}</span>
                </div>
                
                <div className="border-b-purple-200 border-b-2 mb-1">
                  <b>Certificate NO: </b>
                  <span>{apiResponse?.data?.data?.CertificateNO}</span>
                </div>
                
                <div className="border-b-purple-200 border-b-2 mb-1">
                  <b>Date Of Registration: </b>
                  <span>{apiResponse?.data?.data?.DateOfRegistration}</span>
                </div>
                
                <div className="border-b-purple-200 border-b-2 mb-1">
                  <b>SUhid: </b>
                  <span>{apiResponse?.data?.data?.SUhid}</span>
                </div>
                
                <div className="border-b-purple-200 border-b-2 mb-1">
                  <b>Date Of Issue: </b>
                  <span>{apiResponse?.data?.data?.DateOfIssue}</span>
                </div>
                
                <div className="border-b-purple-200 border-b-2 mb-1">
                  <b>Udin: </b>
                  <span>{apiResponse?.data?.data?.Udin}</span>
                </div>
                
                <div className="border-b-purple-200 border-b-2 mb-1">
                  <b>Updated: </b>
                  <span>{apiResponse?.data?.data?.UpdatedOn}</span>
                </div>
                
                <div className="border-b-purple-200 border-b-2 mb-1">
                  <b>Issuing Authority: </b>
                  <span>{apiResponse?.data?.data?.IssuingAuth}</span>
                </div>
                
              </div>
            </div>)
            : (apiResponse?.data?.status == "0") ?
              (<div className="bg-purple-50 border rounded-md shadow w-full mx-auto p-5">
                <div>
                  <span className="flex"><Info className="text-red-500 mr-2" /> No Record Found!</span>
                </div>
              </div>) : null
          }
        </div>
      </div>
    </div>
  );
}