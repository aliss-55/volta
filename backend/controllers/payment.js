const mongoose = require('mongoose');
const Payment = require('../models/PaymentModel');
const Purchase = require('../models/PurchaseModel');
const Card = require('../models/CardModel');

// Agregar un pago
exports.addPayment = async (req, res) => {
    const { purchaseId, installmentNumber, amount, paymentDate } = req.body;
    const userId = req.user._id;

    console.log('Datos recibidos:', req.body);

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        console.log('Paso 1: Buscando la compra...');
        const purchaseObjectId = mongoose.Types.ObjectId(purchaseId); // Convertir a ObjectId
        const purchase = await Purchase.findById(purchaseObjectId).session(session);
        if (!purchase) {
            console.log('Error: Compra no encontrada');
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: 'Purchase not found', field: 'purchaseId' });
        }

        console.log('Compra encontrada:', purchase);

        // Validar que amount e installments sean números válidos
        const totalAmount = Number(purchase.amount);
        const totalInstallments = Math.round(Number(purchase.installments)); // Redondear a entero

        if (isNaN(totalAmount) || isNaN(totalInstallments) || totalInstallments <= 0) {
            console.log('Error: Valores de monto o cuotas inválidos');
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: 'Invalid purchase data', field: 'purchase' });
        }

        console.log('Paso 2: Validando monto...');
        const installmentValue = totalAmount / totalInstallments;
        const roundedInstallmentsToPay = installmentNumber; // Redondear cuotas ingresadas
        const totalPaymentAmount = Math.round(installmentValue * roundedInstallmentsToPay); // Redondear a entero
        const tolerance = 1;
        
        console.log('Total Payment Amount (redondeado):', totalPaymentAmount);        

        console.log(`Monto esperado: ${totalPaymentAmount}, Monto recibido: ${amount}`);

        if (Math.abs(amount - totalPaymentAmount) > tolerance) {
            console.log('Error: Monto del pago incorrecto');
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({
                message: 'Invalid payment amount',
                field: 'amount',
                expectedAmount: totalPaymentAmount,
                receivedAmount: amount
            });
        }

        if (roundedInstallmentsToPay > purchase.remainingInstallments) {
            console.log('Error: Cuotas a pagar exceden el saldo restante');
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({
                message: 'Installments exceed the remaining balance',
                field: 'installmentsToPay',
                remainingInstallments: purchase.remainingInstallments
            });
        }

        console.log('Paso 3: Buscando la tarjeta...');
        const card = await Card.findOne({ name: purchase.card }).session(session);
        if (!card) {
            console.log('Error: Tarjeta no encontrada');
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: 'Card not found', field: 'card' });
        }

        console.log('Paso 4: Registrando el pago...');
        const payment = new Payment({
            purchase: purchase._id,
            amount,
            installmentNumber: roundedInstallmentsToPay,
            paymentDate,
            user: userId,
            cardName: card.name,
            type: 'payment'
        });
        await payment.save({ session });

        console.log('Paso 5: Actualizando la compra...');
        purchase.remainingInstallments -= roundedInstallmentsToPay;
        purchase.remainingAmount -= totalPaymentAmount;
        await purchase.save({ session });

        console.log('Paso 6: Actualizando el límite de la tarjeta...');
        card.availableLimit += amount;
        await card.save({ session });

        console.log('Paso 7: Confirmando transacción...');
        await session.commitTransaction();
        session.endSession();

        console.log('Pago registrado con éxito');
        res.status(201).json({
            message: 'Payment registered successfully!',
            payment,
            updatedPurchase: purchase,
            updatedCardLimit: card.availableLimit
        });
    } catch (error) {
        console.error('Error en el servidor:', error);
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// Obtener pagos
exports.getPayments = async (req, res) => {
    const userId = req.user._id;

    try {
        const payments = await Payment.find({ user: userId })
            .populate('purchase')
            .populate('user');
        if (!payments.length) {
            return res.status(404).json({ message: 'No payments found' });
        }

        res.status(200).json({ message: 'Payments retrieved successfully', payments });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Eliminar un pago
exports.deletePayment = async (req, res) => {
    const { paymentId } = req.params;
    const userId = req.user._id;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const payment = await Payment.findById(paymentId).populate('purchase').session(session);
        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }

        if (payment.user.toString() !== userId.toString()) {
            await session.abortTransaction();
            session.endSession();
            return res.status(403).json({ message: 'Unauthorized' });
        }

        // Revertir la actualización en la compra
        const purchase = payment.purchase;
        purchase.remainingInstallments += payment.installmentNumber;
        purchase.remainingAmount += payment.amount;
        await purchase.save({ session });

        // Actualizar el cupo disponible de la tarjeta
        const card = await Card.findOne({ name: payment.cardName, user: userId }).session(session);
        if (card) {
            card.availableLimit -= payment.amount;
            await card.save({ session });
        }

        // Eliminar el pago
        await payment.remove({ session });

        await session.commitTransaction();
        session.endSession();

        res.status(200).json({
            message: 'Payment deleted successfully',
            updatedPurchase: purchase,
            updatedCardLimit: card ? card.availableLimit : null
        });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

