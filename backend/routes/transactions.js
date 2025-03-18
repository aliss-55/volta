const { addExpense, getExpense, deleteExpense } = require('../controllers/expense');
const { addIncome, getIncomes, deleteIncome } = require('../controllers/income');
const { addPurchase, getPurchase} = require('../controllers/purchase');
const { addPayment,getPayments } = require('../controllers/payment');
const { addCard, getCard, deleteCard } = require('../controllers/card');


const requireAuth = require('../middleware/requireAuth'); 

const router = require('express').Router();


router.post('/add-income', requireAuth, addIncome);
router.get('/get-incomes', requireAuth, getIncomes);
router.delete('/delete-income/:id', requireAuth, deleteIncome);

router.post('/add-expense', requireAuth, addExpense);
router.get('/get-expenses', requireAuth, getExpense);
router.delete('/delete-expense/:id', requireAuth, deleteExpense);

router.post('/add-card', requireAuth, addCard);
router.get('/get-cards', requireAuth, getCard);
router.delete('/delete-card/:id', requireAuth, deleteCard);

router.post('/add-purchase', requireAuth, addPurchase);
router.get('/get-purchases', requireAuth, getPurchase);


router.post('/add-payment', requireAuth, addPayment); 
router.get('/get-payments', requireAuth,getPayments);

module.exports = router;