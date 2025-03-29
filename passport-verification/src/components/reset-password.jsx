"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Eye, EyeOff, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { ToastAction } from "./ui/toast";
import { updatePassword } from "@/app/reset-password/api";
import { useRouter } from "next/navigation";

export default function ResetPassword() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmPassError, setConfirmPassError] = useState("");

  const handleResetPassword = async () => {
    setIsLoading(true);
    try {
      if (newPassword !== confirmPassword) {
        toast({
          variant: "destructive",
          title: "Passwords do not match!",
          description: "Please ensure both passwords are the same.",
        });
        return;
      }

      const response = await updatePassword(null, oldPassword, newPassword);

      if (response?.status == 0) {
        toast({
          title: (
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <span>{'Password Reset Successful!'}</span>
            </div>
          ),
          description: "Your password has been updated.",
        });

        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } else {
        toast({
          title: (
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <span>Failed!</span>
            </div>
          ),
          variant: "destructive",
          description: response?.message,
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
  const handleConfirmPassport = (value) => {

    setConfirmPassError("");
    if (value !== newPassword) {
      setConfirmPassError("Passwords do not match with new password!");
    }
    setConfirmPassword(value)
  }

  return (
    <div className="mx-auto px-0 space-y-8 shadow-md">
      <div className="mt-0 bg-white dark:bg-gray-800 rounded-t-lg overflow-hidden">
        <div className="bg-gradient-to-r to-yellow-300 from-amber-600 px-6 py-3">
          <h2 className="text-2xl font-bold text-white">Reset Password</h2>
        </div>
      </div>
      <div className="bg-white rounded-lg p-6 w-96 mx-auto">
        <div className="space-y-4">
          {/* Old Password */}
          <div className="relative">
            <Input
              type={showOldPassword ? "text" : "password"}
              placeholder="Old Password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-3 flex items-center text-gray-500"
              onClick={() => setShowOldPassword(!showOldPassword)}
            >
              {showOldPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* New Password */}
          <div className="relative">
            <Input
              type={showNewPassword ? "text" : "password"}
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-3 flex items-center text-gray-500"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <Input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => handleConfirmPassport(e.target.value)}
              className={`w-full ${confirmPassError ? "border-red-500" : ""}`}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-3 flex items-center text-gray-500"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              variant="default"
              className="bg-blue-500 text-white hover:bg-blue-600"
              onClick={handleResetPassword}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex gap-1 justify-center items-center">
                  <Loader2 className="animate-spin" />
                  Loading...
                </div>
              ) : (
                "Reset Password"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}