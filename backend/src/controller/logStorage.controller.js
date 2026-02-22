import Log from "../models/log.model.js";
import LogFile from "../models/LogFile.model.js";

// Helper
const getUserFileIds = async (userId) => {
  const files = await LogFile.find({ userId });
  return files.map(f => f._id);
};

// Get logs (pagination + filters)
export const getLogs = async (req, res) => {
  try {
    const {
      page = 1, limit = 20, severity, ip,
      endpoint, user, dateFrom, dateTo, search,
    } = req.query;

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;

    const fileIds = await getUserFileIds(req.user.id);
    const query = { fileId: { $in: fileIds } };

    if (severity) query.severity = severity;
    if (ip) query.ip = ip;
    if (endpoint) query.endpoint = endpoint;
    if (user) query.user = user;
    if (search) query.message = { $regex: search, $options: "i" };
    if (dateFrom || dateTo) {
      query.timestamp = {};
      if (dateFrom) query.timestamp.$gte = new Date(dateFrom);
      if (dateTo) {
        const d = new Date(dateTo);
        d.setHours(23, 59, 59, 999);
        query.timestamp.$lte = d;
      }
    }

    const skip = (pageNum - 1) * limitNum;
    const [logs, totalLogs] = await Promise.all([
      Log.find(query).sort({ timestamp: -1 }).skip(skip).limit(limitNum),
      Log.countDocuments(query),
    ]);

    res.json({ logs, totalLogs, totalPages: Math.ceil(totalLogs / limitNum) || 1 });
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch logs" });
  }
};

// Get single log — userId ownership check
export const getLogById = async (req, res) => {
  try {
    const fileIds = await getUserFileIds(req.user.id);
    const log = await Log.findOne({ _id: req.params.id, fileId: { $in: fileIds } });
    if (!log) return res.status(404).json({ msg: "Not found" });
    res.json(log);
  } catch (err) {
    res.status(500).json({ msg: "Failed" });
  }
};

// Search logs — userId filter
export const searchLogs = async (req, res) => {
  try {
    const { q } = req.query;
    const fileIds = await getUserFileIds(req.user.id);

    const logs = await Log.find({
      fileId: { $in: fileIds }, // ← userId filter
      $or: [
        { ip: q },
        { user: new RegExp(q, "i") },
        { endpoint: new RegExp(q, "i") }
      ]
    }).limit(50);

    res.json(logs);
  } catch (err) {
    res.status(500).json({ msg: "Failed" });
  }
};

// Delete single log — ownership check
export const deleteLog = async (req, res) => {
  try {
    const fileIds = await getUserFileIds(req.user.id);
    await Log.findOneAndDelete({ _id: req.params.id, fileId: { $in: fileIds } });
    res.json({ msg: "Log deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Failed" });
  }
};

// Bulk delete logs — ownership check
export const bulkDeleteLogs = async (req, res) => {
  try {
    const { ids } = req.body;
    const fileIds = await getUserFileIds(req.user.id);
    await Log.deleteMany({ _id: { $in: ids }, fileId: { $in: fileIds } });
    res.json({ msg: "Logs deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Failed" });
  }
};