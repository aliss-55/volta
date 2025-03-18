const mongoose = require('mongoose');

const CardSchema = new mongoose.Schema({
    name: { type: String, required: true },
    bank: { type: String, required: true },
    creditLimit: { type: Number, required: true }, // Cupo total
    availableLimit: { type: Number, required: true }, // Cupo disponible
    interestRate: { type: Number, required: true },
    cutOffDate: { type: Date, required: true },
    paymentDueDate: { type: Date, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Card', CardSchema);
