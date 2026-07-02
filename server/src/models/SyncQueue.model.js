const mongoose = require('mongoose');

const syncQueueSchema = new mongoose.Schema({
  deviceId: { type: String, required: true, index: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  operationType: { type: String, enum: ['create', 'update', 'delete'], required: true },
  collection: { type: String, required: true },
  documentId: String,
  payload: mongoose.Schema.Types.Mixed,
  status: { type: String, enum: ['pending', 'synced', 'conflict', 'failed'], default: 'pending' },
  conflictData: mongoose.Schema.Types.Mixed,
  syncedAt: Date,
  createdAt: { type: Date, default: Date.now }
});

syncQueueSchema.index({ deviceId: 1, status: 1 });

module.exports = mongoose.model('SyncQueue', syncQueueSchema);
