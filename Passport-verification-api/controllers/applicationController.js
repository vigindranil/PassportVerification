import { getApplicationDetailsByApplicationId, getDocumentApplicationDetailsById, getApplicationStatusHistoryById } from '../models/applicationModel.js';
import { saveTransactionHistory } from '../models/logModel.js'


export const getApplicationDetails = async (req, res) => {
    try {
        const { applicationId } = req.body;
        const entryUserId = req.user.UserID;
        console.log("entryUserId", entryUserId);

        if (!applicationId || !entryUserId) {
            return res.status(400).json({
                status: 1,
                message: 'Invalid input data',
            });
        }

        const applicationDetails = await getApplicationDetailsByApplicationId(applicationId, entryUserId);


        const documents = await getDocumentApplicationDetailsById(applicationId, entryUserId);
        const status = await getApplicationStatusHistoryById(applicationId, entryUserId);

        const ipaddress = "test";
        const macAddress = "test";
        const Longitude = "test";
        const Latitude = "test";
        const OperationName = "getApplicationDetails";
        const json = "{}"
        const saveTransaction = await saveTransactionHistory(ipaddress, macAddress, Longitude, Latitude, applicationId, OperationName, json, entryUserId)

        return res.status(200).json({
            status: 0,
            message: 'Application details retrieved successfully',
            data: {
                applicationDetails,
                documents: documents,
                status: status,
                saveTransaction
            },
        });
    } catch (error) {
        console.error('Error retrieving application details:', error);
        return res.status(500).json({
            status: 1,
            message: 'An error occurred while retrieving the application details',
            error: error.message,
        });
    }
};
