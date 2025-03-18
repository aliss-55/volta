const mongoose = require('mongoose');

const PurchaseSchema = new mongoose.Schema({
    description: { type: String, required: true },
    amount: { type: Number, required: true },
    installments: { type: Number, required: true },
    purchaseDate: { type: Date, required: true },
    card: { type: String, required: true }, // Guardar el nombre de la tarjeta
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    remainingInstallments: { type: Number, default: function() { return this.installments; } },
    remainingAmount: { type: Number},
    type: { type: String, default: 'purchase' } 
}, { timestamps: true });

module.exports = mongoose.model('Purchase', PurchaseSchema);

