"use client";

import React, { useState } from "react";
import { saveUser } from "@/api/api"; // Adjust the path as necessary
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const CreateUserForm = () => {
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
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateUser = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const token = "your_token_here"; // Replace with a valid token
      const result = await saveUser(formData, token);
      setSuccess("User created successfully!");
      console.log("API Response:", result);
      // Reset the form
      setFormData({
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
      });
    } catch (error) {
      setError("Failed to create user. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create User</h1>
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="UserName">Username</Label>
          <Input
            id="UserName"
            name="UserName"
            value={formData.UserName}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="UserPassword">Password</Label>
          <Input
            id="UserPassword"
            name="UserPassword"
            type="password"
            value={formData.UserPassword}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="Firstname">First Name</Label>
          <Input
            id="Firstname"
            name="Firstname"
            value={formData.Firstname}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="LastName">Last Name</Label>
          <Input
            id="LastName"
            name="LastName"
            value={formData.LastName}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="MobileNo">Mobile Number</Label>
          <Input
            id="MobileNo"
            name="MobileNo"
            value={formData.MobileNo}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="EmailID">Email</Label>
          <Input
            id="EmailID"
            name="EmailID"
            type="email"
            value={formData.EmailID}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="Gender">Gender</Label>
          <Input
            id="Gender"
            name="Gender"
            value={formData.Gender}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="AADHAARNo">Aadhar Number</Label>
          <Input
            id="AADHAARNo"
            name="AADHAARNo"
            value={formData.AADHAARNo}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="Designation">Designation</Label>
          <Input
            id="Designation"
            name="Designation"
            value={formData.Designation}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="UserRoleID">User Role ID</Label>
          <Input
            id="UserRoleID"
            name="UserRoleID"
            value={formData.UserRoleID}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="DistrictID">District ID</Label>
          <Input
            id="DistrictID"
            name="DistrictID"
            value={formData.DistrictID}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="PSID">Police Station ID</Label>
          <Input
            id="PSID"
            name="PSID"
            value={formData.PSID}
            onChange={handleInputChange}
            required
          />
        </div>
        <Button
          onClick={handleCreateUser}
          disabled={loading}
          className="mt-4"
        >
          {loading ? "Creating..." : "Create User"}
        </Button>
      </div>
    </div>
  );
};

export default CreateUserForm;
