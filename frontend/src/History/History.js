import React from 'react';
import styled from 'styled-components';
import { useGlobalContext } from '../context/globalContext';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

function History() {
    const { transactionHistory, totalIncome, totalExpenses, totalBalance } = useGlobalContext();
    const history = transactionHistory();

    const handleGeneratePDF = () => {
        const doc = new jsPDF();

        const title = 'Transaction History';
        const date = new Date().toLocaleDateString();
        const titleFontSize = 18;
        const dateFontSize = 12;
        const titleY = 15;
        const dateY = titleY + 10;

        doc.setFontSize(titleFontSize);
        doc.text(title, 10, titleY);

        doc.setFontSize(dateFontSize);
        doc.setTextColor(150);
        doc.text(`Date: ${date}`, 10, dateY);

        const rows = history.map((item) => {
            const { description, amount, type } = item;
            const formattedAmount = type === 'purchase' ? `+${amount.toFixed(0)}` : `-${Math.abs(amount).toFixed(2)}`;
            return [description || 'Payment', formattedAmount]; // Mostrar 'Payment' si no hay descripción
        });

        const totalRow = ['Total Incomes:', `+${totalIncome().toFixed(0)}`];
        const expensesRow = ['Total Expenses:', `-${totalExpenses().toFixed(0)}`];
        const balanceRow = ['Balance:', `${totalBalance().toFixed(0)}`];

        rows.push([], totalRow, expensesRow, balanceRow);

        doc.autoTable({
            startY: dateY + 10,
            head: [['Title', 'Amount']],
            body: rows,
        });

        doc.save('transaction_history.pdf');
    };

    return (
        <HistoryStyled>
            <h2>Historial Reciente</h2>
            {history.slice(0, 3).map((item) => {
                const { _id, description, amount, type } = item;
                const amountValue = Math.abs(amount).toFixed();
                const sign = type === 'payment' ? '+' : '-';
                const color = type === 'payment' ? 'green' : 'red';

                return (
                    <div key={_id} className="history-item">
                        <p style={{ color }}>{description || 'Payment'}</p>
                        <p style={{ color }}>{`${sign}${amountValue}`}</p>
                    </div>
                );
            })}
            <GeneratePDFButton onClick={handleGeneratePDF}>Generate PDF</GeneratePDFButton>
        </HistoryStyled>
    );
}

const HistoryStyled = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    .history-item {
        background:rgba(249, 250, 251, 0.9);
        border: 3px solid #E5E7EB;;
        box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
        padding: 1rem;
        border-radius: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
`;

const GeneratePDFButton = styled.button`
    padding: 10px 20px;
    background-color: #007bff;
    border: 3px solid #E5E7EB;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
`;

export default History;
