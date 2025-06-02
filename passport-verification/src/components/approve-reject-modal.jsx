"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { assignApplication, getSpecialEnquiryOfficers } from "@/app/allFiles-sp/api";
import { CircleHelp, Eye } from 'lucide-react';
import { toast } from "@/hooks/use-toast"; // Assuming you have a toast component

export function FileAcceptModal({ isOpen, onClose, applicationId, onAccept, type, mobile }) {
  const [remarks, setRemarks] = useState("");
  const [enquiryOfficer, setEnquiryOfficer] = useState("");
  const [officers, setOfficers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchEnquiryOfficers = async () => {
      try {
        const response = await getSpecialEnquiryOfficers()
        if (response?.data) {
          console.log(response.data);
          setOfficers(response?.data || []);
        }
      } catch (error) {
        console.error("Error fetching enquiry officers:", error);
        toast({
          title: "Error",
          description: "Failed to fetch enquiry officers. Please try again.",
          variant: "destructive",
        });
      }
    };
    if (isOpen) {
      fetchEnquiryOfficers();
    }
  }, [isOpen]);

  const handleAccept = async () => {
    if (type === "query") {
      setIsLoading(true);
      try {
        if (!enquiryOfficer) {
          throw new Error("Please select an enquiry officer.");
        }

        const response = await assignApplication({
          applicationId,
          assignTo: enquiryOfficer,
          macAddress: "test", // You might want to get this dynamically
          locationIp: "127", // You might want to get this dynamically
          deviceId: "123#df" // You might want to get this dynamically
        });

        if (response && response.status === 0) {
          console.log("Application assigned successfully:", response?.message);
          toast({
            title: "Success",
            description: response?.message || "Application assigned successfully.",
          });
        } else {
          console.log("Failed to assign application:", response?.message);
          toast({
            title: "Error",
            description: response?.message || "Failed to assign application. Please try again.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.log("Error assigning application:", error);
        toast({
          title: "Error",
          description: error.message || "An error occurred while assigning the application.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      onAccept(applicationId, type, remarks, mobile);
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center text-slate-600">
            <CircleHelp size="60" className="mx-auto text-blue-200" />
            Are you sure you want to {type == "approve" ? "recommend for approval" : type == "reject" ? "not recommend for approval" : type == "send-back-to-eo" ? "Send back to EO" : "forward to sp"} ?
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 p-4">
          {type === "query" && (
            <div className="mb-4">
              <Label htmlFor="enquiryOfficer" className="mb-2 block">
                Choose enquiry officer:
              </Label>
              <Select onValueChange={setEnquiryOfficer} value={enquiryOfficer}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select an enquiry officer" />
                </SelectTrigger>
                <SelectContent>
                  {officers?.length > 0 ? (
                    officers
                      .filter((officer) => officer?.UserID && officer?.UserID.toString().trim() !== "")
                      .map((officer, index) => (
                        <SelectItem key={index} value={officer.UserID.toString()}>{officer?.FullName || "N/A"}</SelectItem>
                      ))
                  ) : (
                    <SelectItem value="none" disabled>
                      No officers available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          )}
          <div className={`${type == 'approve' && 'hidden'}`}>
            <Label htmlFor="remarks">Remarks:</Label>
            <textarea
              id="remarks"
              placeholder="Enter remarks here"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              rows={2}
              className="border-2 p-4 rounded-lg border-gray-400 focus:border-blue-500 w-full"
            />
          </div>
        </div>
        <div className="flex justify-center gap-3 pt-5">
          <Button
            onClick={handleAccept}
            className={`${type === "approve"
                ? "bg-blue-500 hover:bg-blue-600"
                : type === "reject"
                  ? "bg-red-500 hover:bg-red-600"
                  : type === "query"
                    ? "bg-green-500 hover:bg-green-600"
                    : type === "revoke"
                      ? "bg-yellow-500 hover:bg-yellow-600"
                      : "bg-violet-500 hover:bg-violet-600"
              }`}
            disabled={(type === "query" && !enquiryOfficer) || isLoading}
          >
            {isLoading
              ? "Processing..."
              : type === "approve" || type === "forward-sp" || type === "send-back-to-eo"
                ? "Yes, Proceed"
                : type === "reject"
                  ? "Yes, Proceed"
                  : type === "query"
                    ? "Assign"
                    : type === "revoke"
                      ? "Revoke"
                      : ""}
          </Button>

          <Button onClick={onClose} variant="secondary" className="hover:bg-zinc-200" disabled={isLoading}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}