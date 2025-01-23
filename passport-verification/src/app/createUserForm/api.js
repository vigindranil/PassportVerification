import { postRequest } from "../commonAPI";



export const saveUser = async (userData) => {
  try {

    return await postRequest("user/saveUser", {
      "UserID": 0,
      "UserName": userData.UserName,
      "UserPassword": `${userData.UserName}@${userData?.MobileNo.slice(-4)}`,
      "UserFullName": userData.UserFullName,
      "Firstname": userData.Firstname,
      "LastName": userData.LastName,
      "MobileNo": userData.MobileNo,
      "EmailID": userData.EmailID,
      "Gender": userData.Gender,
      "AADHAARNo": userData.AADHAARNo,
      "Designation": userData.Designation,
      "UserRoleID": userData.UserRoleID,
      "DistrictID": userData.DistrictID,
      "PSID": userData.PSID
    });
  } catch (error) {
    console.log("Error saving user:", error);
    return null;
  }
};


export const getDistrict = async () => {
  try {

    return await postRequest("master/showDistrict")
  } catch (error) {
    console.log("Error:", error);
    return null;
  }
};

export const getPoliceStationsByDistrict = async (districtID) => {
  try {

    return await postRequest("master/getPoliceStationsByDistrict",
      {
        "districtId": districtID,
      });
  } catch (error) {
    console.log("Error saving user:", error);
    return null;
  }
};

export const showuserDetails = async () => {
  try {

    return await postRequest("user/showuserDetails")
  } catch (error) {
    console.log("Error saving user:", error);
    return null;
  }
};