import { postRequest } from "@/app/commonAPI";

export const getDistrictWiseCount = async (statusId ) => {
    try {

        return await postRequest("stateadmin/getDistrictwiseApplicationCount", {
            statusId: statusId,
        });
    } catch (error) {
        console.log("Error saving user:", error);
        return null;
    }
};