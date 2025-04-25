import { postRequest } from "@/app/commonAPI";

export const getDistrictWiseCount = async (statusId,districtId) => {
    try {

        return await postRequest("stateadmin/getPoliceStationtwiseApplicationCount", {
            statusId: statusId,
            districtId: districtId,
        });
    } catch (error) {
        console.log("Error saving user:", error);
        return null;
    }
};