import mongoose from "mongoose";
import LogFile from "../models/LogFile.model.js";
import Log from "../models/log.model.js";
import Alert from "../models/alert.model.js";

const getUserFileIds = async (userId) => {
  const files = await LogFile.find({ userId });
  return files.map(f => f._id);
};

export const getLogsByIP = async (req, res) => {
  try {
    const fileIds = await getUserFileIds(req.user.id);
    const data = await Log.aggregate([
      { $match: { fileId: { $in: fileIds }, ip: { $exists: true, $ne: null } } },
      { $group: { _id: "$ip", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    res.json(data);
  } catch (err) {
    res.status(500).json({ msg: "Failed" });
  }
};

export const getSeverityStats = async (req, res) => {
  try {
    const fileIds = await getUserFileIds(req.user.id);
    const data = await Log.aggregate([
      { $match: { fileId: { $in: fileIds }, severity: { $exists: true, $ne: null } } },
      { $group: { _id: "$severity", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    res.json(data);
  } catch (err) {
    res.status(500).json({ msg: "Failed" });
  }
};

export const getTimeSeries = async (req, res) => {
  try {
    const fileIds = await getUserFileIds(req.user.id);
    const data = await Log.aggregate([
      { $match: { fileId: { $in: fileIds }, timestamp: { $exists: true, $ne: null } } },
      {
        $group: {
          _id: {
            year: { $year: "$timestamp" },
            month: { $month: "$timestamp" },
            day: { $dayOfMonth: "$timestamp" },
            hour: { $hour: "$timestamp" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1, "_id.hour": 1 } },
      { $limit: 24 }
    ]);
    res.json(data);
  } catch (err) {
    res.status(500).json({ msg: "Failed" });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const fileIds = await getUserFileIds(userId);

    const [totalLogs, totalAlerts, unresolvedAlerts, severityDist] = await Promise.all([
      Log.countDocuments({ fileId: { $in: fileIds } }),
      Alert.countDocuments({ userId }),
      Alert.countDocuments({ userId, isResolved: false }),
      Log.aggregate([
        { $match: { fileId: { $in: fileIds } } },
        { $group: { _id: "$severity", count: { $sum: 1 } } }
      ])
    ]);

    res.json({ totalLogs, totalAlerts, unresolvedAlerts, severityDist });
  } catch (err) {
    res.status(500).json({ msg: "Failed" });
  }
};