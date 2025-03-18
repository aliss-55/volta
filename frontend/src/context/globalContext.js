import React, { useContext, useState, useEffect } from "react";
import axios from 'axios';
import { useAuthContext } from '../hooks/useAuthContext';

const BASE_URL = "http://localhost:5050/api/v1/";

export const GlobalContext = React.createContext();

export const GlobalProvider = ({ children }) => {
    const { user } = useAuthContext();
    const [incomes, setIncomes] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [error, setError] = useState(null);
    const [cards, setCards] = useState([]); 
    const [payments, setPayments] = useState([]);
    const [purchases, setPurchases] = useState([]);

    const axiosInstance = axios.create({
        baseURL: BASE_URL,
        headers: {
            'Authorization': `Bearer ${user ? user.token : ''}`,
        },
    });

    const addIncome = async (income) => {
        try {
            await axiosInstance.post('add-income', income);
            getIncomes();
        } catch (error) {
            setError(error.message);
        }
    };

    const getIncomes = async () => {
        try {
            const response = await axiosInstance.get('get-incomes');
            setIncomes(response.data);
        } catch (error) {
            setError(error.message);
        }
    };

    const deleteIncome = async (id) => {
        try {
            await axiosInstance.delete(`delete-income/${id}`);
            getIncomes();
        } catch (error) {
            setError(error.message);
        }
    };

    const totalIncome = () => {
        return purchases.reduce((total, purchases) => total + purchases.amount, 0);
    };

    const getExpenses = async () => {
        try {
            const response = await axiosInstance.get('get-expenses');
            setExpenses(response.data);
        } catch (error) {
            setError(error.message);
        }
    };

    const addExpense = async (expenseData) => {
        try {
            await axiosInstance.post('add-expense', expenseData);
            getExpenses();
        } catch (error) {
            setError(error.message);
        }
    };

    const deleteExpense = async (id) => {
        try {
            await axiosInstance.delete(`delete-expense/${id}`);
            getExpenses();
        } catch (error) {
            setError(error.message);
        }
    };

    const getPayments = async () => {
        try {
            const response = await axiosInstance.get('get-payments');
            setPayments(response.data.payments); // Acceder a la propiedad payments del objeto de respuesta
        } catch (error) {
            setError(error.message);
        }
    };

    const addPayment = async (paymentData) => {
        try {
            await axiosInstance.post('add-payment', paymentData);
            getPayments();
        } catch (error) {
            setError(error.message);
        }
    };

    const totalExpenses = () => {
        return payments.reduce((total, payments) => total + payments.amount, 0);
    };

    const addCard = async (cardData) => {
        try {
            await axiosInstance.post('add-card', cardData);
            getCards();
        } catch (error) {
            setError(error.message);
        }
    };

    const getCards = async () => {
        try {
            const response = await axiosInstance.get('get-cards');
            setCards(response.data);
        } catch (error) {
            setError(error.message);
        }
    };

    const deleteCard = async (id) => {
        try {
            await axiosInstance.delete(`delete-card/${id}`);
            getCards();
        } catch (error) {
            setError(error.message);
        }
    };

    const addPurchase = async (purchaseData) => {
        try {
            await axiosInstance.post('add-purchase', purchaseData);
            getPurchases();
        } catch (error) {
            setError(error.message);
        }
    };

    const getPurchases = async () => {
        try {
            const response = await axiosInstance.get('get-purchases');
            setPurchases(response.data);
        } catch (error) {
            setError(error.message);
        }
    };

    const findCardByName = (cardName) => {
        return cards.find(card => card.name === cardName);
    };


    const totalBalance = () => {
        return totalIncome() - totalExpenses();
    };

    const totalCards = () => {
        return cards.length
    };

    const totalPurchases = () => {
        return purchases.length
    };

    const transactionHistory = () => {
        const history = [...purchases, ...payments];
        history.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        return history.slice();
    };

    return (
        <GlobalContext.Provider value={{
            addIncome,
            getIncomes,
            incomes,
            deleteIncome,
            expenses,
            totalIncome,
            addExpense,
            getExpenses,
            deleteExpense,
            totalExpenses,
            totalBalance,
            cards, 
            getCards, 
            addCard,
            deleteCard,
            payments,
            getPayments,
            addPayment,
            purchases, 
            addPurchase,
            getPurchases,
            totalCards,
            totalPurchases,
            findCardByName,
            error,
            setError,
            transactionHistory
        }}>
            {children}
        </GlobalContext.Provider>
    );
};

export const useGlobalContext = () => {
    return useContext(GlobalContext);
};
