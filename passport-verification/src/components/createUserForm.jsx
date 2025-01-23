"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { Search, UserPlus } from "lucide-react"
import { saveUser } from "@/app/createUserForm/api"
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { getDistrict, getPoliceStationsByDistrict, showuserDetails, showDesignation } from "@/app/createUserForm/api"

const UserManagement = () => {
  const [searchDistrict, setSearchDistrict] = useState("")
  const [searchPoliceStation, setSearchPoliceStation] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [users, setUsers] = useState([])
  const [designation, setDesignation] = useState([])
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadFile, setUploadFile] = useState(null);
  const [districtsData, setDistrictsData] = useState([])
  const [policeStationsData, setPoliceStationsData] = useState([])
  const [psLoader, setPsLoader] = useState("Select District First")

  const [formData, setFormData] = useState({
    UserName: "",
    UserFullName: "",
    Firstname: "",
    LastName: "",
    MobileNo: "",
    EmailID: "",
    Gender: "",
    AADHAARNo: "",
    Designation: "",
    UserRoleID: "",
    DistrictID: "",
    PSID: "",
  })


  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(verificationData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "VerificationData");
    XLSX.writeFile(wb, "police_verification_data.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['File Number', 'Applicant Name', 'Police Station', 'Phone No.', 'Date of Birth']],
      body: verificationData.map(row => [row.fileNumber, row.applicantName, row.policeStation, row.phoneNo, row.dateOfBirth]),
    });
    doc.save('police_verification_data.pdf');
  };

  const printTable = () => {
    const printContent = document.getElementById('police-verification-table');
    const windowPrint = window.open('', '', 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0');
    windowPrint.document.write(printContent.innerHTML);
    windowPrint.document.close();
    windowPrint.focus();
    windowPrint.print();
    windowPrint.close();
  };

  const filteredData = users?.filter(row =>
    Object.values(row).some(value =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const fetchDistricts = async () => {
    try {
      const districtData = await getDistrict();
      console.log(districtData);

      if (districtData) {
        setDistrictsData(districtData.data)
      }
    } catch (error) {
      console.error("Error fetching districts:", error)
    }
  }
  
  const fetchDesignation = async () => {
    try {
      const designation = await showDesignation();
      console.log("designation",designation.data);
      if (designation.data.length > 0) {
        setDesignation(designation?.data);
      }
    } catch (error) {
      console.error("Error fetching user details:", error)
    }
  }


  const fetchUserDetails = async () => {
    try {
      const userDetails = await showuserDetails()
      if (userDetails) {
        console.log("table",userDetails);
        setUsers(userDetails.data);
      }
    } catch (error) {
      console.error("Error fetching user details:", error)
    }
  }

  const handleCreateUser = async () => {
    setLoading(true)
    setError(null)
    setSuccess(null)
    try {
      const response = await saveUser(formData)
      setSuccess(`User created successfully: ${response.message}`)
      fetchUserDetails() // Refresh user list after creating a new user
    } catch (error) {
      setError(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const onChangeDistrict = async (DistrictID) => {
    try {
      setPsLoader("Loading...")
      setFormData({ ...formData, DistrictID: formData.DistrictID });
      const policeStationData = await getPoliceStationsByDistrict(DistrictID);
      if (policeStationData) {
        setPoliceStationsData(policeStationData.data);
        setPsLoader("Select Police Station")
      } else {
        setPoliceStationsData([]);
        setPsLoader("Select District First")
      }
    } catch (error) {
      console.error("Error fetching police stations:", error)
    }
  }
  

  const toggleUserStatus = (userId) => {
    setUsers((prev) => prev.map((user) => (user.id === userId ? { ...user, isEnabled: !user.isEnabled } : user)))
  }

  useEffect(() => {
    fetchDistricts()
    fetchUserDetails()
    fetchDesignation()
  }, [])


  return (
    <div className="container mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold mb-6">User Management</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

        <div className="space-y-2">
          <Label htmlFor="UserName">User Name</Label>
          <Input
            id="UserName"
            name="UserName"
            value={formData.UserName}
            onChange={(e) => setFormData({ ...formData, UserName: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="UserName">User Full Name</Label>
          <Input
            id="UserFullName"
            name="UserFullName"
            value={formData.UserFullName}
            onChange={(e) => setFormData({ ...formData, UserFullName: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="FirstName">First Name</Label>
          <Input
            id="FirstName"
            name="FirstName"
            value={formData.Firstname}
            onChange={(e) => setFormData({ ...formData, Firstname: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="Last Name">Last Name</Label>
          <Input
            id="LastNameID"
            name="LastNameID"
            value={formData.LastName}
            onChange={(e) => setFormData({ ...formData, LastName: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.EmailID}
            onChange={(e) => setFormData({ ...formData, EmailID: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="userRole">Gender</Label>
          <Select name="userRole" onValueChange={(value) => setFormData({ ...formData, Gender: value })} required>
            <SelectTrigger>
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <Input
            id="phoneNumber"
            name="phoneNumber"
            value={formData.MobileNo}
            onChange={(e) => setFormData({ ...formData, MobileNo: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="district">District</Label>
          <Select
            name="district"
            onValueChange={(value) => { onChangeDistrict(value) }}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select district" />
            </SelectTrigger>
            <SelectContent>
              {districtsData?.map((district, index) => (
                <SelectItem key={index} value={district.districtId}>
                  {district.districtName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="policeStation">Police Station</Label>
          <Select name="policeStation" onValueChange={(value) => setFormData({ ...formData, PSID: value })} required>
            <SelectTrigger>
              <SelectValue placeholder={psLoader} />
            </SelectTrigger>
            <SelectContent>
              {policeStationsData?.map((station, index) => (
                <SelectItem key={index} value={station.psm_id}>
                  {station.psm_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="userRole">Designation</Label>
          <Select name="userRole" onValueChange={(value) => setFormData({ ...formData, Designation: value })} required>
            <SelectTrigger>
              <SelectValue placeholder="Select Designation" />
            </SelectTrigger>
            <SelectContent>
            {designation?.map((des, index) => (
                <SelectItem key={index} value={des.desCode}>
                  {des.Name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="aadharNumber">Aadhar Number</Label>
          <Input
            id="aadharNumber"
            name="aadharNumber"
            value={formData.AADHAARNo}
            onChange={(e) => setFormData({ ...formData, AADHAARNo: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="aadharRegisterMobileNumber">Aadhar Register Mobile Number</Label>
          <Input id="aadharRegisterMobileNumber" name="aadharRegisterMobileNumber" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="userRole">User Role</Label>
          <Select name="userRole" onValueChange={(value) => setFormData({ ...formData, UserRoleID: value })} required>
            <SelectTrigger>
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30">OC/IC</SelectItem>
              <SelectItem value="20">SP</SelectItem>
              <SelectItem value="10">DYSP</SelectItem>
              <SelectItem value="40">EO</SelectItem>
              <SelectItem value="50">Enquiry Officer</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="md:col-span-2 lg:col-span-3 flex justify-center">
          <Button onClick={handleCreateUser} disabled={loading} className="px-6">
            <UserPlus className="mr-2 h-4 w-4" /> Create User
          </Button>
        </div>
      </div>



{/* TABLE STARTED HERE */}

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">User List</h2>
        <div className="flex space-x-4">
          <div className="flex-1">
            <Label htmlFor="searchDistrict">Search by District</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                id="searchDistrict"
                placeholder="Enter district"
                value={searchDistrict}
                onChange={(e) => setSearchDistrict(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex-1">
            <Label htmlFor="searchPoliceStation">Search by Police Station</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                id="searchPoliceStation"
                placeholder="Enter police station"
                value={searchPoliceStation}
                onChange={(e) => setSearchPoliceStation(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="space-x-2">
              <Button variant="outline" onClick={exportToExcel}>Excel</Button>
              <Button variant="outline" onClick={exportToPDF}>PDF</Button>
              <Button variant="outline" onClick={printTable}>Print</Button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Search:</span>
              <Input
                className="w-64"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="border rounded-lg" id="police-verification-table">
            <Table>
              <TableHeader>
               <TableRow className="bg-[#e6f3ff]">
                  <TableHead className="font-semibold">User Name</TableHead>
                  <TableHead className="font-semibold">Full Name</TableHead>
                  <TableHead className="font-semibold">District Name</TableHead>
                  <TableHead className="font-semibold">Police Station</TableHead>
                  <TableHead className="font-semibold">Designation</TableHead>
                  <TableHead className="font-semibold">User Role</TableHead>
                  <TableHead className="font-semibold text-center">Actions</TableHead>
               </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6}>Loading...</TableCell> Loading...
                  </TableRow>): users.length > 0 ? (
                users?.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{row.UserName || "N/A"}</TableCell>
                    <TableCell>{row.FullName || "N/A"}</TableCell>
                    <TableCell>{row.DistrictName || "N/A"}</TableCell>
                    <TableCell>{row.PoliceStationName || "N/A"}</TableCell>
                    <TableCell>{row.Designation || "N/A"}</TableCell>
                    <TableCell>{row.userType || "N/A"}</TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button size="sm" variant="default" className="bg-green-600 hover:bg-green-700 text-white text-xs px-1 py-1">Details</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                    <TableCell colSpan={6} className="text-center">
                       No Data Found
                    </TableCell>
                </TableRow>
                )}
                </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-between mt-4 text-sm">
            <div>
              Showing {startIndex + 1} to {Math.min(endIndex, filteredData.length)} of {filteredData.length} entries
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Prev
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
          {selectedFile && (
            <FileAcceptModal
              isOpen={true}
              onClose={() => setSelectedFile(null)}
              fileData={selectedFile}
              onAccept={handleAcceptFile}
            />
          )}
          {uploadFile && (
            <UploadDocumentsModal
              isOpen={true}
              onClose={() => setUploadFile(null)}
              fileData={uploadFile}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default UserManagement

