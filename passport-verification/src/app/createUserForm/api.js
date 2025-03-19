import { postRequest } from "../commonAPI";

export const saveUser = async (userData) => {
  try {
    return await postRequest("user/saveUser", {
      UserID: 0,
      UserName: userData.UserName,
      UserPassword: "admin@123",
      FullName: userData.FullName,
      Firstname: userData.Firstname,
      LastName: userData.LastName,
      MobileNo: userData.MobileNo,
      EmailID: userData.EmailID,
      Gender: userData.Gender,
      AADHAARNo: userData.AADHAARNo,
      Designation: userData.Designation,
      UserRoleID: userData.UserRoleID,
      DistrictID: userData.DistrictID,
      PSID: userData.PSID,
      AADHAARMobileNo: userData.aadharRegisterMobileNumber,
    });
  } catch (error) {
    console.log("Error saving user:", error);
    return null;
  }
};

export const getDistrict = async () => {
  try {
    return await postRequest("master/showDistrict");
  } catch (error) {
    console.log("Error:", error);
    return null;
  }
};

export const getPoliceStationsByDistrict = async (districtID) => {
  try {
    const response = await postRequest("master/getPoliceStationsByDistrict", {
      districtId: districtID,
    });
    return response;
  } catch (error) {
    console.log("Error saving user:", error);
    return null;
  }
};

export const showuserDetails = async () => {
  try {
    return await postRequest("user/showuserDetails");
  } catch (error) {
    console.log("Error saving user:", error);
    return null;
  }
};

export const tooglebutton = async (UserID, ActivationStatus) => {
  try {
    return await postRequest("user/updateUser", {
      UserID: UserID,
      ActivationStatus: ActivationStatus,
    });
  } catch (error) {
    console.log("Error:", error);
    return null;
  }
};
