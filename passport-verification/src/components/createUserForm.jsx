"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { Search, UserPlus } from "lucide-react"
import { saveUser } from "@/app/createUserForm/api"

const UserManagement = () => {
  const [searchDistrict, setSearchDistrict] = useState("")
  const [searchPoliceStation, setSearchPoliceStation] = useState("")
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [formData, setFormData] = useState({
    UserID: 0,
    UserName: "",
    UserPassword: "",
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

  const handleCreateUser = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await saveUser(formData)
      setSuccess(`User created successfully: ${response.message}`)
    } catch (error) {
      setError(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }
  // const toggleUserStatus = (userId) => {
  //   setUsers((prev) => prev.map((user) => (user.id === userId ? { ...user, isEnabled: !user.isEnabled } : user)))
  // }

  // const filteredUsers = users.filter(
  //   (user) =>
  //     user.district.toLowerCase().includes(searchDistrict.toLowerCase()) &&
  //     user.policeStation.toLowerCase().includes(searchPoliceStation.toLowerCase()),
  // )

  return (
    <div className="container mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold mb-6">User Management</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input id="username" name="username" value={formData.UserName} onChange={(e) => setFormData({ ...formData, UserName: e.target.value })} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" value={formData.EmailID} onChange={(e) => setFormData({ ...formData, EmailID: e.target.value })} required />
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
          <Input id="district" name="district" value={formData.DistrictID} onChange={(e) => setFormData({ ...formData, DistrictID: e.target.value })} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="policeStation">Police Station</Label>
          <Input
            id="policeStation"
            name="policeStation"
            value={formData.PSID}
            onChange={(e) => setFormData({ ...formData, PSID: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="designation">Designation</Label>
          <Input
            id="designation"
            name="designation"
            value={formData.Designation}
            onChange={(e) => setFormData({ ...formData, Designation: e.target.value })}
            required
          />
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
          <Input
            id="aadharRegisterMobileNumber"
            name="aadharRegisterMobileNumber"

          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="userRole">User Role</Label>
          <Select name="userRole" onValueChange={(value) => setFormData({ ...formData, UserRoleID: value })} required>
            <SelectTrigger>
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">OC/IC</SelectItem>
              <SelectItem value="user">SP</SelectItem>
              <SelectItem value="manager">DYSP</SelectItem>
              <SelectItem value="manager">EO</SelectItem>
              <SelectItem value="manager">Enquiry Officer</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="md:col-span-2 lg:col-span-3 flex justify-center">
          <Button onClick={handleCreateUser} disabled={loading} className="px-6">
            <UserPlus className="mr-2 h-4 w-4" /> Create User
          </Button>
        </div>
      </div>

      {/* <div className="space-y-4">
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
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Username</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>District</TableHead>
              <TableHead>Police Station</TableHead>
              <TableHead>User Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.district}</TableCell>
                <TableCell>{user.policeStation}</TableCell>
                <TableCell>{user.userRole}</TableCell>
                <TableCell>{user.isEnabled ? "Enabled" : "Disabled"}</TableCell>
                <TableCell>
                  <Switch checked={user.isEnabled} onCheckedChange={() => toggleUserStatus(user.id)} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div> */}
    </div>
  )
}

export default UserManagement

