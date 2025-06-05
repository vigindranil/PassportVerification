import { getApplicationTimeLineModel, getDashboardCountStateMasterAdminModel, getDistrictwiseApplicationCountModel, getPoliceStationtwiseApplicationCountModel } from "../models/stateAdminModel.js";
import logger from "../utils/logger.js";

export const getDashboardCountStateMasterAdmin = async (req, res) => {
  try {
    // const { userId } = req.body;
    const userId = req.user.UserID;
    if (!userId) {
      logger.debug(
        JSON.stringify({
          API: "getDashboardCountStateMasterAdmin",
          REQUEST: { userId },
          RESPONSE: {
            status: 1,
            message: "Invalid input data",
          },
        })
      );
      return res.status(400).json({
        status: 1,
        message: "Invalid input data",
      });
    }

    const [dashboardCount] = await getDashboardCountStateMasterAdminModel(
      userId
    );

    logger.debug(
      JSON.stringify({
        API: "getDashboardCountStateMasterAdmin",
        REQUEST: { userId },
        RESPONSE: {
          status: 0,
          message: "Application details retrieved successfully",
          data:
            dashboardCount,

        },
      })
    );
    return res.status(200).json({
      status: 0,
      message: "Dashboard details retrieved successfully",
      data: {
        dashboardCount,

      },
    });
  } catch (error) {
    logger.error("Error retrieving dashboard details:", error);
    return res.status(500).json({
      status: 1,
      message: "An error occurred while retrieving the dashboard details",
      error: error.message,
    });
  }
};


export const getDistrictwiseApplicationCount = async (req, res) => {
  try {
    const { statusId } = req.body;
    const userId = req.user.UserID;
    if (!userId || !statusId) {
      logger.debug(
        JSON.stringify({
          API: "getDistrictwiseApplicationCount",
          REQUEST: { userId, statusId },
          RESPONSE: {
            status: 1,
            message: "Invalid input data",
          },
        })
      );
      return res.status(400).json({
        status: 1,
        message: "Invalid input data",
      });
    }

    const [districtCount] = await getDistrictwiseApplicationCountModel(
      statusId,
      userId
    );

    logger.debug(
      JSON.stringify({
        API: "getDistrictwiseApplicationCount",
        REQUEST: { userId },
        RESPONSE: {
          status: 0,
          message: "District wise count retrieved successfully",
          data:
            districtCount,

        },
      })
    );
    return res.status(200).json({
      status: 0,
      message: "District wise count retrieved successfully",
      data: {
        districtCount,

      },
    });
  } catch (error) {
    logger.error("Error retrieving District wise count details:", error);
    return res.status(500).json({
      status: 1,
      message: "An error occurred while retrieving the District wise count details",
      error: error.message,
    });
  }
};


export const getPoliceStationtwiseApplicationCount = async (req, res) => {
  try {
    const { statusId,districtId } = req.body;
    const userId = req.user.UserID;
    if (!userId || !statusId || !districtId) {
      logger.debug(
        JSON.stringify({
          API: "getPoliceStationtwiseApplicationCount",
          REQUEST: { userId, statusId, districtId },
          RESPONSE: {
            status: 1,
            message: "Invalid input data",
          },
        })
      );
      return res.status(400).json({
        status: 1,
        message: "Invalid input data",
      });
    }

    const [districtCount] = await getPoliceStationtwiseApplicationCountModel(
      statusId,
      districtId,
      userId
    );

    logger.debug(
      JSON.stringify({
        API: "getPoliceStationtwiseApplicationCount",
        REQUEST: { userId },
        RESPONSE: {
          status: 0,
          message: "Police station wise count retrieved successfully",
          data:
            districtCount,

        },
      })
    );
    return res.status(200).json({
      status: 0,
      message: "Police station count retrieved successfully",
      data: {
        districtCount,

      },
    });
  } catch (error) {
    logger.error("Error retrieving Police station wise count details:", error);
    return res.status(500).json({
      status: 1,
      message: "An error occurred while retrieving the Police station wise count details",
      error: error.message,
    });
  }
};

export const getApplicationTimeLine = async (req, res) => {
  try {
    const { userId, districtId, psId, startdate, enddate } = req.body;

    if (!userId) {
      logger.debug(
        JSON.stringify({
          API: "getApplicationTimeLine",
          REQUEST: { userId },
          RESPONSE: {
            status: 1, 
            message: "Invalid input data",
          },
        })
      );
      return res.status(400).json({
        status: 1,
        message: "Invalid input data",
      });
    }

    const [timeline] = await getApplicationTimeLineModel(
      req.user.UserID,
      districtId,
      psId, 
      startdate,
      enddate
    );

    logger.debug(
      JSON.stringify({
        API: "getApplicationTimeLine", 
        REQUEST: { userId },
        RESPONSE: {
          status: 0,
          message: "Application timeline retrieved successfully",
          data: timeline,
        },
      })
    );

    return res.status(200).json({
      status: 0,
      message: "Application timeline retrieved successfully",
      data: {
        timeline,
      },
    });

  } catch (error) {
    logger.error("Error retrieving application timeline:", error);
    return res.status(500).json({
      status: 1,
      message: "An error occurred while retrieving the application timeline",
      error: error.message,
    });
  }
};
