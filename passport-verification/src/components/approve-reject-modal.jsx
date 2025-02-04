"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { getSpecialEnquiryOfficers } from "@/app/allFiles-sp/api";
import { CircleHelp, Eye } from "lucide-react";

export function FileAcceptModal({ isOpen, onClose, applicationId, onAccept, type }) {
  const [remarks, setRemarks] = useState("");
  const [enquiryOfficer, setEnquiryOfficer] = useState("0");
  const [officers, setOfficers] = useState([]);

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
      }
    };
    if (isOpen) {
      fetchEnquiryOfficers();
    }
  }, [isOpen]);


  const handleAccept = () => {
    onAccept(applicationId, type, remarks);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center text-slate-600">
            <CircleHelp size="60" className="mx-auto text-blue-200" />
            Are you sure you want to {type} this application request?
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
          <Label htmlFor="remarks">Remarks <span className="text-slate-400">(optional)</span>:</Label>
          <textarea
            id="remarks"
            placeholder="Enter remarks here"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            rows={2}
            className="border-2 p-4 rounded-lg border-gray-400 focus:border-blue-500 w-full"
          />
        </div>
        <div className="flex justify-center gap-3 pt-5">
          <Button
            onClick={handleAccept}
            className={`${type === "approve" ? "bg-blue-500 hover:bg-blue-600" : type === "reject" ? "bg-red-500 hover:bg-red-600" : type === "query" ? "bg-green-500 hover:bg-green-600" : ""}`}
          >
            {type === "approve" ? "Yes, Proceed" : type === "reject" ? "Yes, Proceed" : type === "query" ? "Query" : ""}
          </Button>
          <Button onClick={onClose} variant="secondary" className="hover:bg-zinc-200">
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
