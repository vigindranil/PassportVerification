"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { getApplicationStatusByFileNumber } from "@/app/application-status-check/api";

const ApplicationStatusTable = ({ heading }) => {

    const [searchText, setSearchText] = useState("");
    const [tableData, setTableData] = useState([]);

    const handleSearch = () => {
        getApplicationStatusByFileNumber(searchText).then((response) => {
            if (response && response.data && response.data.applicationStatus) {
                const mapped = response.data.applicationStatus.map((item) => ({
                    userName: item.UserName,
                    fullName: item.userFullName,
                    psName: item.PsName,
                    applicationStatus: item.ApplicationStatus
                }));
                setTableData(mapped);
            } else {
                setTableData([]);
            }
        });
    };

    return (
        <div className="mx-auto px-0 space-y-8 shadow-md">
            
            {/* Header */}
            <div className="mt-0 bg-white dark:bg-gray-800 rounded-t-lg overflow-hidden">
                <div className="bg-gradient-to-r from-green-600 to-green-600 px-6 py-3">
                    <h2 className="text-2xl font-bold text-white">{heading}</h2>
                </div>
            </div>

            <div className="p-6">

                {/* Search Bar */}
                <div className="flex items-center mb-4 gap-2 max-w-md">
                    <Input
                        placeholder="Search using Application ID..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                    <Button onClick={handleSearch}>
                        <Search className="w-4 h-4 mr-1" /> Search
                    </Button>
                </div>

                {/* Table */}
                <div className="rounded-md border overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User Name</TableHead>
                                <TableHead>User Full Name</TableHead>
                                <TableHead>PS Name</TableHead>
                                <TableHead>Application Status</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {tableData.length > 0 ? (
                                tableData.map((row, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{row.userName || "-"}</TableCell>
                                        <TableCell>{row.fullName || "-"}</TableCell>
                                        <TableCell>{row.psName || "-"}</TableCell>
                                        <TableCell>{row.applicationStatus || "-"}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan="4" className="text-center text-gray-500 py-4">
                                        No data found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>

                    </Table>
                </div>

            </div>
        </div>
    );
};

export default ApplicationStatusTable;
