const Card = require("../models/CardModel");

exports.addCard = async (req, res) => {
    const { name, bank, creditLimit, interestRate, cutOffDate, paymentDueDate } = req.body;
    const userId = req.user._id;

    try {
        if (!name || !bank || !creditLimit || !interestRate || !cutOffDate || !paymentDueDate) {
            return res.status(400).json({ message: 'All fields are required!' });
        }

        // Inicializar el cupo disponible igual al crédito total
        const newCard = new Card({
            name,
            bank,
            creditLimit,
            availableLimit: creditLimit, // Aquí igualamos el cupo disponible al crédito total
            interestRate,
            cutOffDate,
            paymentDueDate,
            user: userId
        });

        await newCard.save();

        res.status(201).json({ message: 'Card Added', card: newCard });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.getCard = async (req, res) => {
    const userId = req.user._id;
    try {
        const cards = await Card.find({ user: userId }).sort({ createdAt: -1 });
        res.status(200).json(cards);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.deleteCard = async (req, res) => {
    const { id } = req.params;
    const userId = req.user._id;
    try {
        const card = await Card.findById(id);
        if (!card) {
            return res.status(404).json({ message: 'Card not found' });
        }
        if (card.user.toString() !== userId.toString()) {
            return res.status(403).json({ message: 'You do not have permission to delete this card' });
        }
        await card.remove();
        res.status(200).json({ message: 'Card Deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
