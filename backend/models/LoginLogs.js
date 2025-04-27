const mongoose = require('mongoose');

const loginLogSchema = new mongoose.Schema({
    userId: String,
    timestamp: Date,
    ipAddress: String,
    status: { type: String, enum: ['success', 'failure'] },
});

const LoginLog = mongoose.model('LoginLog', loginLogSchema);
