"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, CheckCircle2, AlertCircle, Info } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { getLandDeedDetailsApi } from "@/app/thirt-party-api/land-deed/api";

export default function LandDeedReport() {
  const [isLoading, setIsLoading] = useState(false);
  const [MouzaCode, setMouzaCode] = useState("");
  const [KhatianNo, setKhatianNo] = useState("");
  const [apiResponse, setApiResponse] = useState(null);

  const fetchThirdPartyApiData = async () => {
    setIsLoading(true);
    try {
      if (!MouzaCode || !KhatianNo) {
        toast({
          variant: "destructive",
          title: "Please enter all values!",
          description: "Please ensure all required fields are filled or not.",
        });
        return;
      }

      const response = await getLandDeedDetailsApi(MouzaCode, KhatianNo);

      setApiResponse(response);
      if (response?.status == 0 && response?.data[0]?.ERROR == "1") {
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
          <h2 className="text-2xl font-bold text-white">Land Deed Details</h2>
        </div>
      </div>
      <div className="bg-white rounded-lg p-6 w-96 mx-auto">
        <div className="space-y-4">

          {/* MouzaCode */}
          <div className="relative">
            <Input
              type="text"
              placeholder="Mouza Code"
              value={MouzaCode}
              onChange={(e) => setMouzaCode(e.target.value)}
              className="w-full"
            />
          </div>

          {/* setKhatianNo */}
          <div className="relative">
            <Input
              type="text"
              placeholder="KhatianNo"
              value={KhatianNo}
              onChange={(e) => setKhatianNo(e.target.value)}
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

          {(apiResponse?.data[0]?.ERROR && apiResponse?.data[0]?.ERROR == "1") ?
            (<div className="bg-purple-50 border rounded-md shadow w-full mx-auto text-sm">
              <h1 className="flex justify-center text-lg items-center gap-1 p-2 bg-purple-100"><CheckCircle2 className="text-green-400" /> Record Found</h1>

              <div className="p-5">
                <div className="border-b-purple-200 border-b-2 mb-1">
                  <b>Total Area: </b>
                  <span>{apiResponse?.data[0]?.TotalArea}</span>
                </div>
                <div className="border-b-purple-200 border-b-2 mb-1">
                  <b>Owner Name: </b>
                  <span>{apiResponse?.data[0]?.OwnerName}</span>
                </div>
                <div className="border-b-purple-200 border-b-2 mb-1">
                  <b>Owner Type: </b>
                  <span>{apiResponse?.data[0]?.OwnerType}</span>
                </div>
                <div className="border-b-purple-200 border-b-2 mb-1">
                  <b>Address: </b>
                  <span>{apiResponse?.data[0]?.Address}</span>
                </div>
                <div className="border-b-purple-200 border-b-2 mb-1">
                  <b>Gurdian Name: </b>
                  <span>{apiResponse?.data[0]?.GurdianName}</span>
                </div>
                <div className="border-b-purple-200 border-b-2 mb-1">
                  <b>Khatian Creation Date: </b>
                  <span>{apiResponse?.data[0]?.KhatianCreationDate}</span>
                </div>
                <div className="border-b-purple-200 border-b-2 mb-1">
                  <b>No Of Plots: </b>
                  <span>{apiResponse?.data[0]?.NoOfPlots}</span>
                </div>
                
              </div>
            </div>)
            : (apiResponse?.data[0]?.ERROR && apiResponse?.data[0]?.ERROR != "1") ?
              (<div className="bg-purple-50 border rounded-md shadow w-full mx-auto p-5">
                <div>
                  <span className="flex"><Info className="text-red-500 mr-2" /> {apiResponse?.data[0]?.ERROR}!</span>
                </div>
              </div>) : null
          }
        </div>
      </div>
    </div>
  );
}