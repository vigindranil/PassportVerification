
import { encrypt } from "../enc_aadhaar.js";
import { getUserAADHARInfoModel, updateAadharNumber } from "../models/aadhaarUpdateModel.js";

export const getUserAADHARInfo = async (req, res) => {
  try {
    const { startindex, endIndex } = req.body;
   
    const result = await getUserAADHARInfoModel(
      startindex,
      endIndex
    );
    console.log("data", result);
    let response_arr = [];
    for await (const element of result) {
      
      let decoded_aadhaar = atob(element?.AAdharNumber);
      let enc_aadhaar = encrypt(decoded_aadhaar);
      const result = await updateAadharNumber(
        element.userId,
        enc_aadhaar
      );
      console.log("error code", result);
      
      response_arr.push({id: element.userId, ec: result});
    }
   
    if (result?.length > 0) {
      return res.status(200).json({
        status: 0,
        message: "Data fetched successfully",
        data: response_arr,
      });
    } else {
      return res.status(400).json({
        status: 1,
        message: "No data found",
      });
    }
  } catch (error) {
    console.log(error);
    
    res.status(500).json({
      status: 1,
      message: "An error occurred",
      data: null,
    });
  }
};

