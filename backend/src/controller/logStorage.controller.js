import Log from "../models/log.model.js";

// Get logs (pagination + filters)
export const getLogs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      severity,
      ip,
      endpoint,
      user,
      dateFrom,
      dateTo,
      search,
    } = req.query;

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;

    const query = {};

    if (severity) query.severity = severity;
    if (ip) query.ip = ip;
    if (endpoint) query.endpoint = endpoint;
    if (user) query.user = user;

    if (dateFrom || dateTo) {
      query.timestamp = {};
      if (dateFrom) query.timestamp.$gte = new Date(dateFrom);
      if (dateTo) {
        const d = new Date(dateTo);
        d.setHours(23, 59, 59, 999);
        query.timestamp.$lte = d;
      }
    }

    if (search) {
      query.message = { $regex: search, $options: "i" };
    }

    const skip = (pageNum - 1) * limitNum;

    const [logs, totalLogs] = await Promise.all([
      Log.find(query)
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(limitNum),
      Log.countDocuments(query),
    ]);

    const totalPages = Math.ceil(totalLogs / limitNum) || 1;

    res.json({ logs, totalLogs, totalPages });
  } catch (err) {
    console.error("Error in getLogs:", err);
    res.status(500).json({ msg: "Failed to fetch logs" });
  }
};

// Get single log
export const getLogById = async (req, res) => {
  const log = await Log.findById(req.params.id);
  if (!log) return res.status(404).json({ msg: "Not found" });
  res.json(log);
};

// Search logs
export const searchLogs = async (req, res) => {
  const { q } = req.query;
  
  const logs = await Log.find({
    $or: [
      { ip: q },
      { user: new RegExp(q, "i") },
      { endpoint: new RegExp(q, "i") }
    ]
  }).limit(50);

  res.json(logs);
};

// Delete single log
export const deleteLog = async (req, res) => {
  await Log.findByIdAndDelete(req.params.id);
  res.json({ msg: "Log deleted" });
};

// Bulk delete logs
export const bulkDeleteLogs = async (req, res) => {
  const { ids } = req.body; // array of log IDs
  await Log.deleteMany({ _id: { $in: ids } });
  res.json({ msg: "Logs deleted" });
};
