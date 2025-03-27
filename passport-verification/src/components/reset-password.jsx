"use client";

import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { getApplicationStatus, revokeEnquiryStatus } from "@/app/totalPending/api";
import moment from "moment";
import { useRouter } from "next/navigation";
import { CheckCircle2, CircleCheckBig, CircleX, FileUser, RotateCcw } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { ToastAction } from "./ui/toast";
import Cookies from "react-cookies";
import { FileAcceptModal } from "./approve-reject-modal";
import { TransferModal } from "@/components/transferModal";
import { updateEnquiryStatus } from "@/app/acceptedAndVerificationPending-eo/api";
import { transferapplication } from "@/app/allFiles-sp/api";
import { updatePassword } from "@/app/reset-password/api";

export default function ResetPassword() {

  // State for Reset Password Modal
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Passwords do not match!",
        description: "Please ensure both passwords are the same.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
      return;
    }

    const response = await updatePassword(null, oldPassword, newPassword);

    if(response?.status == 0){
      toast({
        title: "Password Reset Successful",
        description: "Your password has been updated.",
        action: <ToastAction altText="Close">Close</ToastAction>,
      });
    }else{
      toast({
        variant: "destructive",
        title: "Failed to reset password!",
        description: response?.message,
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    }

    // Close the modal after successful reset
    setIsResetPasswordModalOpen(false);
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="mx-auto px-0 space-y-8 shadow-md">
      <div className="mt-0 bg-white dark:bg-gray-800 rounded-t-lg overflow-hidden">
        <div
          className={`bg-gradient-to-r to-yellow-300 from-amber-600 px-6 py-3`}
        >
          <h2 className="text-2xl font-bold text-white">Reset Password</h2>
        </div>
      </div>
      <div className="bg-white rounded-lg p-6 w-96 mx-auto">
            
            <div className="space-y-4">
            <Input
                type="password"
                placeholder="Old Password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full"
              />
              <Input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full"
              />
              <Input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full"
              />
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsResetPasswordModalOpen(false)}>
                  Cancel
                </Button>
                <Button
                  variant="default"
                  className="bg-blue-500 text-white hover:bg-blue-600"
                  onClick={handleResetPassword}
                >
                  Reset
                </Button>
              </div>
            </div>
          </div>
    
    </div>
  );
}