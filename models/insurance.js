const mongoose = require('mongoose');

// College Schema
const insuranceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    address: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Insurance = mongoose.model('Insurance', insuranceSchema);

module.exports = Insurance;