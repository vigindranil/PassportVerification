"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "./ui/input";
import moment from "moment";
import { getKolkataPoliceCriminalRecordSearchv4, getPCCApplicationDetails, getPCCApplicationDetailsV2, getPccCrimeDetails } from "@/app/applicationDetails/[FileNumber]/api";
import DateRangePicker from "./date-range-picker";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { VisuallyHidden } from "./ui/visually-hidden";
import { AlertCircle, CheckCircle2, Eye } from "lucide-react";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import Cookies from "react-cookies";
import { decrypt } from "../utils/enc_aadhaar";

const SkeletonLoader = () => (
  <>
    {[...Array(3)].map((_, index) => (
      <TableRow key={index}>
        {[...Array(7)].map((_, i) => (
          <TableCell key={i}>
            <div className="h-4 bg-gray-300 rounded w-24 animate-pulse"></div>
          </TableCell>
        ))}
      </TableRow>
    ))}
  </>
);

const PoliceClearanceCertificate = ({ selectedRows, setSelectedRows, setApplicationDetails = null, applicant_details = null }) => {

  const [pccData, setPccData] = useState(null);
  const [isLoadingPccRecords, setIsLoadingPccRecords] = useState(false);
  const [dec_aadhar, setDecAadhar] = useState(null);

  useEffect(() => {
    setDecAadhar(applicant_details?.AadharNumber);
    console.log("applicant_details", applicant_details);

  }, [applicant_details?.AadharNumber]);

  const fetchPccData = async () => {
    try {

      setIsLoadingPccRecords(true);
      const response = await getPCCApplicationDetailsV2(applicant_details?.ApplicantName, applicant_details?.PhoneNo);
      // const response = await getPCCApplicationDetailsV2("", "7980544903");
      
      setPccData(response?.data || null);


    } catch (e) {
      console.log("Error:", e);
    } finally {
      setIsLoadingPccRecords(false);
    }
  };
  return (
    <div className="mt-12 bg-white dark:bg-gray-800 rounded-xl overflow-hidden">
      <div className="m-3">
        <h1 className="text-xl font-bold text-zinc-500">Special Category</h1>
        <hr className="my-2" />
        <div className="flex items-center justify-center mb-6 flex-col">
          <div className="flex flex-wrap items-end gap-y-2 w-full my-4 px-14">
            <div className="w-1/3 px-3">
              <Label className="text-zinc-500">Applicant Name</Label>
              {setApplicationDetails && (
                <Input
                  type="text"
                  placeholder="Enter First Name (required)"
                  className="ring-0 border-gray-300 rounded-md w-full p-2"
                  value={applicant_details?.ApplicantName}
                  readOnly={false}
                  onChange={e => setApplicationDetails(prev => ({ ...prev, ApplicantName: e.target.value }))}
                />
              )}
              {!setApplicationDetails && (
                <Input
                  type="text"
                  placeholder="Enter First Name (required)"
                  className="ring-0 border-gray-300 rounded-md w-full p-2"
                  value={applicant_details?.ApplicantName}
                  readOnly={true}
                />
              )}

            </div>
            <div className="w-1/3 px-3">
              <Label className="text-zinc-500">Mobile Number</Label>
              {setApplicationDetails && (
                <Input
                  type="text"
                  placeholder="Enter First Name (required)"
                  className="ring-0 border-gray-300 rounded-md w-full p-2"
                  value={applicant_details?.PhoneNo}
                  readOnly={false}
                  onChange={e => setApplicationDetails(prev => ({ ...prev, PhoneNo: e.target.value }))}
                />
              )}
              {!setApplicationDetails && (
                <Input
                  type="text"
                  placeholder="Enter First Name (required)"
                  className="ring-0 border-gray-300 rounded-md w-full p-2"
                  value={applicant_details?.PhoneNo}
                  readOnly={true}
                />
              )}
            </div>



            <Button
              variant="secondary"
              disabled={isLoadingPccRecords}
              className="mx-2 text-slate-700 hover:bg-zinc-200 shadow-sm border-2"
              onClick={() => fetchPccData()}
            >
              {isLoadingPccRecords ? 'Searching...' : 'Search PCC Details'}
            </Button>
          </div>
        </div>

        <Card>
          <CardContent className="p-0">

            <h1 className="text-center font-bold text-slate-500 py-2 flex justify-center gap-1">{pccData?.data?.length ? <> <CheckCircle2 className="text-green-500" />PCC Record found</>: <><AlertCircle className="text-amber-500" /> No record found.</>}</h1>

            {pccData?.data?.length ? (
              <div className="container py-5">
                <div className="row">
                    <div className="col-md-4 flex text-sm items-center flex-col">
                      <div className="flex flex-col gap-2">
                        <span><b>Name:</b> {pccData?.data[0]?.FirstName} {pccData?.data[0]?.LastName}</span>
                        <span><b>Father/Mother Name:</b> {pccData?.data[0]?.FatherOrMotherName}</span>
                        <span><b>Address:</b> {pccData?.data[0]?.AadhaarAddress}</span>
                        <span><b>Pincode:</b> {pccData?.data[0]?.Pincode}</span>
                        <span><b>City:</b> {pccData?.data[0]?.City}</span>
                        <span><b>District:</b> {pccData?.data[0]?.District}</span>
                       
                        <span><b>Police Station:</b> {pccData?.data[0]?.PoliceStation}</span>
                        <span><b>Adverse Report:</b> {pccData?.data[0]?.AdverseReport}</span>
                        <span><b>Remarks:</b> {pccData?.data[0]?.Remarks}</span>
                      </div>
                    </div>
                </div>
              </div>
            ) : (
              <span className="flex justify-center text-sm">
                No PCC certificate has generated with this name and aadhaar
              </span>
            )}

          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PoliceClearanceCertificate;
