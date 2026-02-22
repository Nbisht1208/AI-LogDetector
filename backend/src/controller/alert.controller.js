import Alert from "../models/alert.model.js";
import mongoose from "mongoose";

// Get all alerts
export const getAlerts = async (req, res) => {
  try {
    const userId = req.user.id; 
    const { severity, isResolved, page = 1, limit = 20 } = req.query;
    const query = { userId };

    if (severity) query.severity = severity;
    if (isResolved !== undefined) query.isResolved = isResolved === "true";

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [alerts, total] = await Promise.all([
      Alert.find(query).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
      Alert.countDocuments(query)
    ]);

    res.json({ alerts, total, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch alerts", error: err.message });
  }
};

// Create alert (called after AI analysis)
export const createAlert = async (req, res) => {
  try {
    const { fileId, ip, severity, threatType, message, explanation, recommendedAction } = req.body;

    const alert = await Alert.create({
      fileId, ip, severity, threatType, message, explanation, recommendedAction
    });

    res.status(201).json({ success: true, alert });
  } catch (err) {
    res.status(500).json({ msg: "Failed to create alert", error: err.message });
  }
};

// Resolve alert
export const resolveAlert = async (req, res) => {
  try {
    const alert = await Alert.findByIdAndUpdate(
      req.params.id,
      { isResolved: true, resolvedAt: new Date() },
      { new: true }
    );

    if (!alert) return res.status(404).json({ msg: "Alert not found" });
    res.json({ success: true, alert });
  } catch (err) {
    res.status(500).json({ msg: "Failed to resolve alert", error: err.message });
  }
};

// Delete alert
export const deleteAlert = async (req, res) => {
  try {
    await Alert.findByIdAndDelete(req.params.id);
    res.json({ success: true, msg: "Alert deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Failed to delete alert", error: err.message });
  }
};

// Alert stats
export const getAlertStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const stats = await Alert.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: "$severity", count: { $sum: 1 } } }
    ]);
    const total = await Alert.countDocuments({ userId });
    const unresolved = await Alert.countDocuments({ userId, isResolved: false });
    res.json({ stats, total, unresolved });
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch stats" });
  }
};