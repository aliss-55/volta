const Income = require("../models/IncomeModel")

exports.addIncome = async (req, res) => {
    const { title, amount, category, description, date } = req.body;
    const userId = req.user._id;

    try {
        if (!title || !category || !description || !date) {
            return res.status(400).json({ message: 'All fields are required!' });
        }

        const amountValue = parseFloat(amount);
        if (isNaN(amountValue) || amountValue <= 0) {
            return res.status(400).json({ message: 'Amount must be a positive number!' });
        }

        const newIncome = new Income({
            title,
            amount: amountValue,
            category,
            description,
            date,
            user: userId
        });

        await newIncome.save();

        res.status(200).json({ message: 'Income Added', income: newIncome });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
}

exports.getIncomes = async (req, res) =>{
    const userId = req.user._id;
    try {
        const incomes = await Income.find({ user: userId }).sort({ createdAt: -1 });
        res.status(200).json(incomes)
    } catch (error) {
        res.status(500).json({message: 'Server Error'})
    }
}

exports.deleteIncome = async (req, res) => {
    const { id } = req.params;
    const userId = req.user._id;
    try {
        const income = await Income.findById(id);
        if (!income) {
            return res.status(404).json({ message: 'Income not found' });
        }
        if (income.user.toString() !== userId.toString()) {
            return res.status(403).json({ message: 'You do not have permission to delete this income' });
        }
        await income.remove();
        res.status(200).json({ message: 'Income Deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
}