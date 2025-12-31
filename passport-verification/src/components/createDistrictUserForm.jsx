"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { UserPlus } from "lucide-react"
import { saveUser } from "@/app/createUserForm/api"
import * as XLSX from "xlsx"
import jsPDF from "jspdf"
import "jspdf-autotable"
import { getDistrict, showDistrictNodal, tooglebutton } from "@/app/createDistrictUserForm/api"
import { useToast } from "../hooks/use-toast"
import { ToastAction } from "@/components/ui/toast"
import { FileAcceptModal } from "@/components/file-accept-modal"
import UploadDocumentsModal from "@/components/uploadDocumentModal"
import Cookies from "react-cookies"

const UserManagement = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)
    const [users, setUsers] = useState([])
    const [searchTerm, setSearchTerm] = useState("")
    const itemsPerPage = 6
    const [currentPage, setCurrentPage] = useState(1)
    const [selectedFile, setSelectedFile] = useState(null)
    const [uploadFile, setUploadFile] = useState(null)
    const [districtsData, setDistrictsData] = useState([])
    const [policeStationsData, setPoliceStationsData] = useState([])
    const [psLoader, setPsLoader] = useState("Select District First")
    const [statuUpdateLoader, setStatuUpdateLoader] = useState(null)
    const { toast } = useToast()

    const [formData, setFormData] = useState({
        UserName: "",
        FullName: "",
        Firstname: "",
        LastName: "",
        MobileNo: "",
        EmailID: "",
        Gender: "",
        AADHAARNo: "",
        Designation: "",
        UserRoleID: "10",
        DistrictID: "0",
        PSID: "0",
        aadharRegisterMobileNumber: "",
    })

    const [formErrors, setFormErrors] = useState({
        UserName: "",
        FullName: "",
        Firstname: "",
        LastName: "",
        EmailID: "",
        MobileNo: "",
        AADHAARNo: "",
        Designation: "",
        UserRoleID: "",
        aadharRegisterMobileNumber: "",
    })

    const [invalidInput, setInvalidInput] = useState({
        UserName: "",
        FullName: "",
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
        aadharRegisterMobileNumber: "",
    })

    const checkForSqlInjection = (value) => {
        return /select\s+\*\s+from/i.test(value)
    }

    const exportToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(users)
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, "UserData")
        XLSX.writeFile(wb, "user_management_data.xlsx")
    }

    const exportToPDF = () => {
        const doc = new jsPDF()
        doc.autoTable({
            head: [["User Name", "Full Name", "District Name", "Designation", "User Role"]],
            body: users?.map((row) => [
                row?.UserName,
                row?.FullName,
                row?.DistrictName,
                row?.Designation,
                row?.userType,
            ]),
        })
        doc.save("user_management_data.pdf")
    }

    const printTable = () => {
        const printContent = document.getElementById("user-management-table")
        const windowPrint = window.open("", "", "left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0")
        windowPrint.document.write(printContent.innerHTML)
        windowPrint.document.close()
        windowPrint.focus()
        windowPrint.print()
        windowPrint.close()
    }

    const filteredData = users?.filter((row) =>
        Object.values(row).some((value) => value?.toString()?.toLowerCase()?.includes(searchTerm?.toLowerCase())),
    )

    const totalPages = Math?.ceil(filteredData?.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const currentData = filteredData?.slice(startIndex, endIndex)

    const fetchDistricts = async () => {
        try {
            const districtData = await getDistrict()
            console.log(districtData)

            if (districtData) {
                console.log("districts", districtData.data)

                setDistrictsData(districtData.data)
            }
        } catch (error) {
            console.error("Error fetching districts:", error)
        }
    }

    const fetchUserDetails = async () => {
        try {
            const userDetails = await showDistrictNodal()
            if (userDetails) {
                console.log("table", userDetails)
                setUsers(userDetails.data)
            }
        } catch (error) {
            console.error("Error fetching user details:", error)
        }
    }

    const handleCreateUser = async () => {
        const dataToSend = { ...formData, DistrictID: formData.DistrictID || Cookies.load("ds_id"), PSID: "0" }
        const hasErrors = Object?.values(formErrors)?.some((error) => error !== "")
        if (hasErrors) {
            toast({
                variant: "destructive",
                title: "Failed to create user",
                description: "Please fill all required fields before submitting.",
                action: <ToastAction altText="Try again">Try again</ToastAction>,
            })
            return null
        }

        setLoading(true)
        setError(null)
        setSuccess(null)
        try {
            const response = await saveUser(dataToSend)
            console.log("user saved", response)
            if (response?.status == 0) {
                toast({
                    title: "Successful!",
                    description: "User Created Successfully",
                    action: <ToastAction altText="Close">Close</ToastAction>,
                })

                setFormData({
                    UserName: "",
                    FullName: "",
                    Firstname: "",
                    LastName: "",
                    MobileNo: "",
                    EmailID: "",
                    Gender: "",
                    AADHAARNo: "",
                    Designation: "",
                    UserRoleID: "10",
                    DistrictID: "",
                    PSID: "0",
                    aadharRegisterMobileNumber: "",
                })
                fetchUserDetails() // Refresh user list after creating a new user
            } else {
                toast({
                    variant: "destructive",
                    title: "Failed to Create User!",
                    description: response?.message,
                    action: <ToastAction altText="Try again">Try again</ToastAction>,
                })
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Failed to Create User!",
                description: "Something went wrong, Please try again",
                action: <ToastAction altText="Try again">Try again</ToastAction>,
            })
            setError(`Error: ${error.message}`)
        } finally {
            setLoading(false)
        }

        const requiredFields = [
            "UserName",
            "Firstname",
            "LastName",
            "MobileNo",
            "EmailID",
            "Gender",
            "UserRoleID",
            "AADHAARNo",
            "Designation",
            "aadharRegisterMobileNumber"
        ]

        const errors = {}
        requiredFields?.forEach((field) => {
            if (!formData[field]) {
                errors[field] = "This field is required."
                setInvalidInput((prev) => ({
                    ...prev,
                    [field]: `Invalid ${field} input`,
                }))
            } else {
                errors[field] = ""
                setInvalidInput((prev) => ({
                    ...prev,
                    [field]: "",
                }))
            }
        })

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors)
            return
        }
    }



    const toggleUserStatus = (userId) => {
        setUsers((prev) => prev.map((user) => (user.id === userId ? { ...user, isEnabled: !user.isEnabled } : user)))
    }

    useEffect(() => {
        fetchDistricts()
        fetchUserDetails()
        const districtId = Cookies.load("ds_id")
        console.log("districtId", districtId)
    }, []) // Added empty dependency array to fix the issue

    useEffect(() => {
        const districtId = Cookies.load("ds_id")
        if (districtId) {
            // fetchPoliceStation();
            setFormData((prevState) => ({ ...prevState, DistrictID: districtId }))
        }
    }, [])

    const handleUpdateUserStatus = async (UserID, Status) => {
        try {
            setStatuUpdateLoader("Loading...")
            const response = await tooglebutton(UserID, Status)
            if (response.status == 0) {
                await fetchUserDetails()
            } else {
                console.log(response.message)
            }
        } catch (error) {
            console.log("Error fetching police stations:", error)
        } finally {
            setStatuUpdateLoader(null)
        }
    }


    const handleInputChange = (e) => {
        const { name, value } = e.target;

        let newValue = value;

        // Prevent spaces in UserName field
        if (name === "UserName") {
            newValue = newValue.replace(/\s/g, ""); // Remove spaces

            if (newValue.length === 0) {
                setInvalidInput((prev) => ({
                    ...prev,
                    [name]: "UserName cannot be empty or contain spaces.",
                }));
            } else {
                setInvalidInput((prev) => ({ ...prev, [name]: "" }));
            }
        }
        else if (["MobileNo", "AADHAARNo"].includes(name)) {
            newValue = value.replace(/\D/g, ""); // Allow only numbers

            if (name === "MobileNo") {
                newValue = newValue.slice(0, 10); // Restrict to 10 digits

                if (newValue.length < 10) {
                    setInvalidInput((prev) => ({
                        ...prev,
                        [name]: "Must be exactly 10 digits.",
                    }));
                } else {
                    setInvalidInput((prev) => ({ ...prev, [name]: "" }));
                }
            }
            else if (name === "AADHAARNo") {
                newValue = newValue.slice(0, 12); // Restrict to 12 digits

                if (newValue.length < 12) {
                    setInvalidInput((prev) => ({
                        ...prev,
                        [name]: "AADHAAR number must be exactly 12 digits.",
                    }));
                } else {
                    setInvalidInput((prev) => ({ ...prev, [name]: "" }));
                }
            }
        }

        setFormData((prev) => ({ ...prev, [name]: newValue }));
    };



    const handleAcceptFile = () => {
        console.log("File accepted!")
        setSelectedFile(null)
    }

    return (
        <div className="container mx-auto px-0 space-y-8 shadow-md">
            <div className="mt-0 bg-white dark:bg-gray-800 rounded-t-xl overflow-hidden">
                <div className="bg-gradient-to-r to-purple-600 from-indigo-600 px-6 py-3">
                    <h2 className="text-2xl font-bold text-white">User Registration</h2>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-6">
                <div className="space-y-2">
                    <Label htmlFor="UserName">
                        User Name  <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="UserName"
                        name="UserName"
                        value={formData?.UserName}
                        onChange={handleInputChange}
                        required
                        pattern="^\d{10}$"
                        title="Enter a 10-digit mobile number."
                        className={`${invalidInput["UserName"] && "border-[1.4px] border-red-400"}`}
                    />
                    {invalidInput["UserName"] && <p className="text-red-500 text-xs">{invalidInput["UserName"]}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="FullName">
                        User Full Name <span className="text-red-500"></span>
                    </Label>
                    <Input
                        id="FullName"
                        className={`${invalidInput["FullName"] && "border-[1.4px] border-red-400"}`}
                        name="FullName"
                        value={formData?.FullName}
                        onChange={handleInputChange}
                        required
                    />
                    {invalidInput["FullName"] && <p className="text-red-500 text-xs">{invalidInput["FullName"]}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="Firstname">
                        First Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="Firstname"
                        className={`${invalidInput["Firstname"] && "border-[1.4px] border-red-400"}`}
                        name="Firstname"
                        value={formData?.Firstname}
                        onChange={handleInputChange}
                        required
                    />
                    {invalidInput["Firstname"] && <p className="text-red-500 text-xs">{invalidInput["Firstname"]}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="LastName">
                        Last Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="LastName"
                        className={`${invalidInput["LastName"] && "border-[1.4px] border-red-400"}`}
                        name="LastName"
                        value={formData?.LastName}
                        onChange={handleInputChange}
                        required
                    />
                    {invalidInput["LastName"] && <p className="text-red-500 text-xs">{invalidInput["LastName"]}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="EmailID">
                        Email <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="EmailID"
                        name="EmailID"
                        className={`${invalidInput["EmailID"] && "border-[1.4px] border-red-400"}`}
                        type="email"
                        value={formData?.EmailID}
                        onChange={handleInputChange}
                        required
                    />
                    {invalidInput["EmailID"] && <p className="text-red-500 text-xs">{invalidInput["EmailID"]}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="userRole">
                        Gender <span className="text-red-500">*</span>
                    </Label>
                    <Select name="userRole" onValueChange={(value) => setFormData({ ...formData, Gender: value })} required>
                        <SelectTrigger className={`${invalidInput["Gender"] && "border-[1.4px] border-red-400"}`}>
                            <SelectValue placeholder="Select Gender" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="MobileNo">
                        Phone Number <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="MobileNo"
                        name="MobileNo"
                        className={`${invalidInput["MobileNo"] && "border-[1.4px] border-red-400"}`}
                        value={formData?.MobileNo}
                        onChange={handleInputChange}
                        maxLength={10}
                        required
                    />
                    {invalidInput["MobileNo"] && <p className="text-red-500 text-xs">{invalidInput["MobileNo"]}</p>}
                    {formData.MobileNo.length > 0 && formData.MobileNo.length < 10 && (
                        <p className="text-red-500 text-sm">Phone number must be 10 digits</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="userRole">
                        User Role
                    </Label>
                    <Select
                        name="userRole"
                        value={formData?.UserRoleID}
                        onValueChange={(value) => {
                            setFormData({ ...formData, UserRoleID: value })
                            if (value === "20" || value === "10" || value === "50") {
                                setFormData((prev) => ({ ...prev, PSID: "0" }))
                            }
                        }}
                        required
                    >
                        <SelectTrigger disabled className={`${invalidInput["UserRoleID"] && "border-[1.4px] border-red-400"}`}>
                            <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="30">OC/IC</SelectItem>
                            <SelectItem value="20">SP/DCP</SelectItem>
                            <SelectItem value="10">District Nodal</SelectItem>
                            <SelectItem value="40">EO</SelectItem>
                            <SelectItem value="50">Spl.Enquiry Officer</SelectItem>
                        </SelectContent>
                    </Select>
                    {invalidInput["UserRoleID"] && <p className="text-red-500 text-xs">{invalidInput["UserRoleID"]}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="userRole">
                        Designation <span className="text-red-500">*</span>
                    </Label>
                    <Select name="userRole" onValueChange={(value) => setFormData({ ...formData, Designation: value })} required>
                        <SelectTrigger className={`${invalidInput["Designation"] && "border-[1.4px] border-red-400"}`}>
                            <SelectValue placeholder="Select Designation" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="300">OC/IC</SelectItem>
                            <SelectItem value="700">DIO/SBO</SelectItem>
                            <SelectItem value="100">Dy.SP/ACP</SelectItem>
                            <SelectItem value="200">SP/DCP</SelectItem>
                            <SelectItem value="400">Addl.SP</SelectItem>
                            <SelectItem value="500">Addl.CP/JointCP</SelectItem>
                            <SelectItem value="600">CP</SelectItem>
                        </SelectContent>
                    </Select>
                    {invalidInput["Designation"] && <p className="text-red-500 text-xs">{invalidInput["Designation"]}</p>}
                </div>

                <div className="space-y-2">
                    <Label
                        htmlFor="district"
                        className={`${invalidInput["DistrictID"] && "border-[1.4px] border-red-400"}`}
                    >
                        District <span className="text-red-500">*</span>
                    </Label>
                    <Select
                        name="district"
                        onValueChange={(value) => setFormData({ ...formData, DistrictID: value })}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select District" />
                        </SelectTrigger>
                        <SelectContent>
                            {districtsData?.map((dist, index) => (
                                <SelectItem key={index} value={dist?.districtId}>
                                    {dist?.districtName}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {invalidInput["DistrictID"] && <p className="text-red-500 text-xs">{invalidInput["DistrictID"]}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="AADHAARNo">
                        Aadhar Number <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        className={`${invalidInput["AADHAARNo"] && "border-[1.4px] border-red-400"}`}
                        id="AADHAARNo"
                        name="AADHAARNo"
                        value={formData.AADHAARNo}
                        onChange={handleInputChange}
                        maxLength={12}
                        required
                    />
                    {invalidInput["AADHAARNo"] && <p className="text-red-500 text-xs">{invalidInput["AADHAARNo"]}</p>}
                    {formData?.AADHAARNo?.length > 0 && formData?.AADHAARNo?.length < 12 && (
                        <p className="text-red-500 text-sm">Aadhar number must be 12 digits</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label
                        htmlFor="aadharRegisterMobileNumber"
                    >
                        Aadhar Register Mobile Number <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="aadharRegisterMobileNumber"
                        name="aadharRegisterMobileNumber"
                        className={`${invalidInput["aadharRegisterMobileNumber"] && "border-[1.4px] border-red-400"}`}
                        maxLength={10}
                        value={formData?.aadharRegisterMobileNumber || ""}
                        onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, "").slice(0, 10)
                            setFormData((prev) => ({ ...prev, aadharRegisterMobileNumber: value }))
                        }}
                        required
                    />
                    {invalidInput["aadharRegisterMobileNumber"] && <p className="text-red-500 text-xs">{invalidInput["aadharRegisterMobileNumber"]}</p>}
                    {formData?.aadharRegisterMobileNumber && formData.aadharRegisterMobileNumber?.length < 10 && (
                        <p className="text-red-500 text-sm">Phone number must be 10 digits</p>
                    )}
                </div>

                <div className="md:col-span-2 lg:col-span-3 flex justify-center">
                    <Button onClick={handleCreateUser} disabled={loading} className="px-6 bg-blue-600 hover:bg-blue-700">
                        <UserPlus className="mr-2 h-4 w-4" /> Create User
                    </Button>
                </div>
            </div>

            {/* TABLE STARTED HERE */}

            <div className="mt-0 bg-white dark:bg-gray-800  overflow-hidden">
                <div className="bg-gradient-to-r from-green-600 to-teal-600 p-6">
                    <h2 className="text-2xl font-bold text-white text-center">All Authority User List</h2>
                </div>
            </div>
            <div className="space-y-4 px-6">
                <div className="flex space-x-4">{/* Search fields removed as per your previous request */}</div>
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="space-x-2">
                            <Button variant="outline" onClick={exportToExcel}>
                                Excel
                            </Button>
                            <Button variant="outline" onClick={exportToPDF}>
                                PDF
                            </Button>
                            <Button variant="outline" onClick={printTable}>
                                Print
                            </Button>
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
                    <div className="border rounded-lg" id="user-management-table">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-[#e6f3ff]">
                                    <TableHead className="font-semibold">User Name</TableHead>
                                    <TableHead className="font-semibold">Full Name</TableHead>
                                    <TableHead className="font-semibold">District Name</TableHead>
                                    {/* <TableHead className="font-semibold">Police Station</TableHead> */}
                                    <TableHead className="font-semibold">Designation</TableHead>
                                    <TableHead className="font-semibold">User Role</TableHead>
                                    {/* <TableHead className="font-semibold text-center">Actions</TableHead> */}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={6}>Loading...</TableCell>
                                    </TableRow>
                                ) : currentData?.length > 0 ? (
                                    currentData?.map((row, index) => (
                                        <TableRow key={index}>
                                            <TableCell>
                                                <p>{row?.UserName || "N/A"}</p>
                                            </TableCell>
                                            <TableCell>
                                                <p>{row?.FullName || "N/A"}</p>
                                            </TableCell>
                                            <TableCell>
                                                <p>{row?.DistrictName || "N/A"}</p>
                                            </TableCell>
                                            {/* <TableCell>
                                                <p>{row?.PoliceStationName || "N/A"}</p>
                                            </TableCell> */}
                                            <TableCell>
                                                <p>{row?.Designation || "N/A"}</p>
                                            </TableCell>
                                            <TableCell>
                                                <p>{row?.userType || "N/A"}</p>
                                            </TableCell>
                                            {/* <TableCell>
                                                <div className="flex space-x-1">
                                                    {row.IsActive == 0 && (
                                                        <Button
                                                            onClick={() => handleUpdateUserStatus(row.UserID, 1)}
                                                            size="sm"
                                                            variant="default"
                                                            className="bg-green-600 hover:bg-green-700 text-white text-xs px-1 py-1"
                                                        >
                                                            {statuUpdateLoader ? statuUpdateLoader : "Activate"}
                                                        </Button>
                                                    )}
                                                    {row.IsActive == 1 && (
                                                        <Button
                                                            onClick={() => handleUpdateUserStatus(row.UserID, 0)}
                                                            size="sm"
                                                            variant="default"
                                                            className="bg-red-600 hover:bg-red-700 text-white text-xs px-1 py-1"
                                                        >
                                                            {statuUpdateLoader ? statuUpdateLoader : "Deactivate"}
                                                        </Button>
                                                    )}
                                                </div>
                                            </TableCell> */}
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
                            Showing {startIndex + 1} to {Math.min(endIndex, filteredData?.length)} of {filteredData?.length} entries
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
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
                                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
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
                        <UploadDocumentsModal isOpen={true} onClose={() => setUploadFile(null)} fileData={uploadFile} />
                    )}
                </div>
            </div>
        </div>
    )
}

export default UserManagement
