const mongoose = require('mongoose');

const docterSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    address: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Docter = mongoose.model('Docter', docterSchema);

module.exports = Docter;