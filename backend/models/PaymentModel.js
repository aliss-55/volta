const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
    purchase: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Purchase',
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    installmentNumber: {
        type: Number,
        required: false
    },
    paymentDate: {
        type: Date,
        default: Date.now
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    cardName: { type: String, required: true }, 
    type: { type: String, default: 'payment' }
}, { timestamps: true });

module.exports = mongoose.model('Payment', PaymentSchema);
