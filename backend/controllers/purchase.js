const Purchase = require("../models/PurchaseModel");
const Card = require("../models/CardModel");

// Agregar una nueva compra
exports.addPurchase = async (req, res) => {
    const { description, amount, installments, purchaseDate, cardName } = req.body; // Usar cardName en lugar de cardId
    const userId = req.user._id;

    try {
        // Validar campos requeridos
        if (!description || !amount || !installments || !purchaseDate || !cardName) {
            return res.status(400).json({ message: 'All fields are required!' });
        }

        // Buscar la tarjeta por nombre y usuario
        const card = await Card.findOne({ name: cardName, user: userId });
        if (!card) {
            return res.status(404).json({ message: 'Card not found' });
        }

        // Verificar si hay suficiente cupo disponible
        if (amount > card.availableLimit) {
            return res.status(400).json({ message: 'Insufficient available credit on the card!' });
        }

        // Calcular el valor de la cuota con interés
        const monthlyInterestRate = card.interestRate / 100 / 12; // Tasa mensual
        const totalInstallments = parseInt(installments);

        let installmentValue;
        if (monthlyInterestRate > 0) {
            // Fórmula de amortización
            installmentValue = amount * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, totalInstallments))
                / (Math.pow(1 + monthlyInterestRate, totalInstallments) - 1);
        } else {
            // Sin intereses (por si la tarjeta tiene interés 0%)
            installmentValue = amount / totalInstallments;
        }

        installmentValue = installmentValue.toFixed(2); // Redondear a 2 decimales
        

        // Descontar el monto total del cupo disponible
        card.availableLimit -= amount;

        // Guardar la tarjeta con el nuevo cupo
        await card.save();

        // Crear la nueva compra
        const newPurchase = new Purchase({
            description,
            amount,
            installments,
            purchaseDate,
            card: card.name, // Guardar el nombre de la tarjeta
            user: userId,
            remainingAmount: amount, // Inicializar remainingAmount con el valor de amount
            remainingInstallments: installments,
            type: 'purchase'  
        });

        await newPurchase.save();

        res.status(201).json({
            message: 'Purchase added successfully!',
            purchase: newPurchase,
            installmentValue,
            totalAmountWithInterest: (installmentValue * totalInstallments).toFixed(2),
            availableLimit: card.availableLimit
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Obtener todas las compras del usuario
exports.getPurchase = async (req, res) =>{
    const userId = req.user._id;
    try {
        const purchases = await Purchase.find({ user: userId }).sort({ createdAt: -1 });
        res.status(200).json(purchases);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
}

exports.getPurchases2 = async (req, res) => {
    const userId = req.user._id;

    try {
        // Buscar compras solo con cuotas restantes
        const purchases = await Purchase.find({ user: userId, remainingInstallments: { $gt: 0 } });

        res.status(200).jsonjson(purchases);
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Eliminar una compra por ID
exports.deletePurchase = async (req, res) => {
    const { id } = req.params;
    const userId = req.user._id;
    try {
        const purchase = await Purchase.findById(id);
        if (!purchase) {
            return res.status(404).json({ message: 'Purchase not found' });
        }
        if (purchase.user.toString() !== userId.toString()) {
            return res.status(403).json({ message: 'You do not have permission to delete this purchase' });
        }
        await purchase.remove();
        res.status(200).json({ message: 'Purchase Deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
