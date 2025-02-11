import { postFileRequest, postRequest } from "../commonAPI";

export const updateEnquiryStatus = async (applicationId, type, remarks) => {
    try {
        const macAddress = "-";
        const locationIp = "-";
        const deviceId = "-";
        return await postRequest("application/updateEnquiryStatus", {
            "ApplicationID": applicationId,
            "locationIp": "115.187.62.100",
            "macAddress": "test-s4dn-3aos-dn338",
            "deviceId": "123#df",
            "StatusID": "80",
            "StatusText": type == 'approve' ? 'SP APPROVED' : 'SP NOT APPROVE',
            "Remarks": remarks
        });
    } catch (error) {
        console.log("Error:", error);
        return null;
    }
}



export const getSpecialEnquiryOfficers = async () => {
    try {
        return await postRequest("enquiryOfficers/getSpecialEnquiryOfficers");
    } catch (error) {
        console.log("Error:", error);
        return null;
    }
}

export const getApplicationStatus = async () => {
    try {
        return await postRequest("enquiryOfficers/getApplicationStatus");
    } catch (error) {
        console.log("Error:", error);
        return null;
    }
}

export const assignApplication = async ({ applicationId, assignTo, macAddress, locationIp, deviceId }) => {
    try {
      return await postRequest("enquiryOfficers/assignApplication", {
        applicationId,
        assignTo,
        macAddress,
        locationIp,
        deviceId
      });
    } catch (error) {
      console.log("Error:", error);
      return null;
    }
  }

  export const showDistrict = async () => {
    try {
      return await postRequest("master/showDistrict", {
      });
    } catch (error) {
      console.log("Error:", error);
      return null;
    }
  }

  
  export const getPoliceStationsByDsId = async (districtId) => {
    try {
      return await postRequest("master/getPoliceStationsByDsId", { "districtId": districtId });
    } catch (error) {
      console.log("Error:", error);
      return null;
    }
  }