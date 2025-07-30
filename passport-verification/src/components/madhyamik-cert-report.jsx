"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, CheckCircle2, AlertCircle, Info } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { getMadhyamikCertificateApi } from "@/app/thirt-party-api/madhyamik-cert/api";

export default function MadhyamikCertReport() {
  const [isLoading, setIsLoading] = useState(false);
  const [roll, setRoll] = useState("");
  const [number, setNumber] = useState("");
  const [examYear, setExamYear] = useState("");
  const [apiResponse, setApiResponse] = useState(null);

  const fetchThirdPartyApiData = async () => {
    setIsLoading(true);
    try {
      if (!roll || !number || !examYear) {
        toast({
          variant: "destructive",
          title: "Please enter all values!",
          description: "Please ensure all required fields are filled or not.",
        });
        return;
      }

      const response = await getMadhyamikCertificateApi(roll, number, examYear);

      setApiResponse(response);
      if (response?.status == 0) {
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
          <h2 className="text-2xl font-bold text-white">Madhyamik Certificate Report</h2>
        </div>
      </div>
      <div className="bg-white rounded-lg p-6 w-96 mx-auto">
        <div className="space-y-4">

          {/* roll */}
          <div className="relative">
            <Input
              type="text"
              placeholder="Roll"
              value={roll}
              onChange={(e) => setRoll(e.target.value)}
              className="w-full"
            />
          </div>

          {/* setNumber */}
          <div className="relative">
            <Input
              type="text"
              placeholder="Number"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              className="w-full"
            />
          </div>

          {/* setNumber */}
          <div className="relative">
            <Input
              type="number"
              placeholder="Exam Year"
              value={examYear}
              onChange={(e) => setExamYear(e.target.value)}
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

          {(apiResponse?.status == 0) ?
            (<div className="bg-purple-50 border rounded-md shadow w-full mx-auto text-sm">
              <h1 className="flex justify-center text-lg items-center gap-1 p-2 bg-purple-100"><CheckCircle2 className="text-green-400" /> Record Found</h1>

              <div className="p-5">
                <div className="border-b-purple-200 border-b-2 mb-1">
                  <b>Roll: </b>
                  <span>{apiResponse?.data?.roll}</span>
                </div>
                <div className="border-b-purple-200 border-b-2 mb-1">
                  <b>Number: </b>
                  <span>{apiResponse?.data?.no}</span>
                </div>
                <div className="border-b-purple-200 border-b-2 mb-1">
                  <b>Exam Year: </b>
                  <span>{apiResponse?.data?.examYear}</span>
                </div>
                <div className="border-b-purple-200 border-b-2 mb-1">
                  <b>Student Name: </b>
                  <span>{apiResponse?.data?.name}</span>
                </div>
                <div className="border-b-purple-200 border-b-2 mb-1">
                  <b>Gender: </b>
                  <span>{apiResponse?.data?.gender}</span>
                </div>
                <div className="border-b-purple-200 border-b-2 mb-1">
                  <b>Father Name: </b>
                  <span>{apiResponse?.data?.fatherName}</span>
                </div>
                <div className="border-b-purple-200 border-b-2 mb-1">
                  <b>Date of Birth: </b>
                  <span>{apiResponse?.data?.dob}</span>
                </div>
                <div className="border-b-purple-200 border-b-2 mb-1">
                  <b>School Name: </b>
                  <span>{apiResponse?.data?.schoolName}</span>
                </div>
                <div className="border-b-purple-200 border-b-2 mb-1">
                  <b>Result: </b>
                  <span>{apiResponse?.data?.result}</span>
                </div>
                <div className="border-b-purple-200 border-b-2 mb-1">
                  <b>Cert Number: </b>
                  <span>{apiResponse?.data?.certNo}</span>
                </div>
                <div className="border-b-purple-200 border-b-2 mb-1">
                  <b>Certificate Date: </b>
                  <span>{apiResponse?.data?.certDate}</span>
                </div>
              </div>
            </div>)
            : (apiResponse?.status == 1) ?
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