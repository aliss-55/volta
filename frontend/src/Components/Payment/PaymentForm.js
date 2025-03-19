import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { useGlobalContext } from '../../context/globalContext';
import Button from '../Button/Button';
import { plus } from '../../utils/Icons';

function PaymentForm() {
    const { addPayment, findCardByName, getPurchases, getCards, purchases, error, setError } = useGlobalContext();

    const [inputState, setInputState] = useState({
        purchaseId: '',
        card: '',
        installmentsToPay: 1,
        paymentDate: new Date(),
        amount: 0,
    });

    const [installmentValue, setInstallmentValue] = useState(0); // Valor de cada cuota
    const [maxInstallments, setMaxInstallments] = useState(0); // Total de cuotas
    const [installmentValueWithInterest, setInstallmentValueWithInterest] = useState(0);

    useEffect(() => {
        getPurchases();
        getCards(); // Asegurar que las tarjetas se actualizan
    }, []);

    const { purchaseId, card, installmentsToPay, paymentDate, amount } = inputState;

    const handlePurchaseChange = (e) => {
        const selectedId = e.target.value;
        const selectedPurchase = purchases.find((purchase) => purchase._id === selectedId);
    
        if (selectedPurchase) {
            const valuePerInstallment = selectedPurchase.amount / selectedPurchase.installments;
            const remainingInstallments = selectedPurchase.remainingInstallments;
            const cardName = selectedPurchase.card;             
            const card = findCardByName(cardName); 

            console.log('Card found:', card); // Verificar si se encuentra la tarjeta correctamente

            const interestRate = card ? card.interestRate : 0;
            const interestRateDecimal = interestRate / 100;
            const installmentValueWithInterest = valuePerInstallment * (1 + interestRateDecimal);

            setInstallmentValueWithInterest(installmentValueWithInterest.toFixed(0));
            setInstallmentValue(valuePerInstallment.toFixed(0));
            setMaxInstallments(remainingInstallments);

            setInputState({
                ...inputState,
                purchaseId: selectedId,
                card: selectedPurchase.card,
                amount: installmentValueWithInterest.toFixed(0),
                installmentsToPay: 1,
            });
        } else {
            setInputState({
                ...inputState,
                purchaseId: '',
                card: '',
                amount: 0,
                installmentsToPay: 1,
            });
            setInstallmentValue(0);
            setMaxInstallments(0);
            setInstallmentValueWithInterest(0);
        }
    };
    
    const handleInstallmentsChange = (e) => {
        const installments = parseInt(e.target.value, 10);
        if (installments > 0 && installments <= maxInstallments) {
            const totalAmount = installmentValueWithInterest * installments;
            setInputState({
                ...inputState,
                installmentsToPay: installments,
                amount: totalAmount.toFixed(0),
            });
        } else {
            setError(`Please enter a number between 1 and ${maxInstallments}`);
        }
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!purchaseId || !amount || !installmentsToPay || !paymentDate || !card) {
            setError('All fields are required');
            return;
        }
    
        const amountWithoutInterest = installmentValue * installmentsToPay;
    
        try {
            await addPayment({
                purchaseId,
                cardName: card,
                amount: parseFloat(amountWithoutInterest.toFixed(0)), // Enviar sin interés
                installmentNumber: installmentsToPay,
                paymentDate,
            });
    
            // Forzar actualización de la información después del pago
            await getCards();
            await getPurchases();  // Asegura que los datos de la tarjeta también se actualicen
    
            setInputState({
                purchaseId: '',
                card: '',
                installmentsToPay: 1,
                paymentDate: new Date(),
                amount: 0,
            });
            setInstallmentValueWithInterest(0);
            setInstallmentValue(0);
            setMaxInstallments(0);
            setError('');
    
        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError('Failed to add payment. Please try again.');
            }
        }
    };
    

    return (
        <FormStyled onSubmit={handleSubmit}>
            {error && <p className='error'>{error}</p>}
            <div className="input-control">
                <label htmlFor="purchaseId">Seleccione una Compra</label>
                <select
                    required
                    value={purchaseId}
                    name="purchaseId"
                    onChange={handlePurchaseChange}
                >
                    <option value="" disabled>Seleccione una Compra</option>
                    {purchases.filter(purchase => purchase.remainingInstallments > 0).map((purchase) => (
                        <option key={purchase._id} value={purchase._id}>
                            {purchase.description} - Total: ${purchase.amount} - Cuotas: {purchase.remainingInstallments}
                        </option>
                    ))}
                </select>
            </div>

            {installmentValue > 0 && (
                <>
                    <div className="input-control">
                        <label htmlFor="installmentsToPay">
                            Paga máximo {maxInstallments} Cuotas
                        </label>
                        <input
                            type="number"
                            min="1"
                            max={maxInstallments}
                            value={installmentsToPay}
                            name="installmentsToPay"
                            onChange={handleInstallmentsChange}
                        />
                    </div>

                    <div className="installment-info">
                        <p>Valor Cuotas: <strong>${installmentValueWithInterest}</strong></p>
                        <p>Pago Total: <strong>${amount}</strong></p>
                    </div>
                </>
            )}

            <div className="input-control">
                <label htmlFor="paymentDate">Fecha de Pago</label>
                <DatePicker
                    selected={paymentDate}
                    dateFormat="dd/MM/yyyy"
                    onChange={(date) => setInputState({ ...inputState, paymentDate: date })}
                />
            </div>

            <div className="submit-btn">
                <Button
                    name="Add Payment"
                    icon={plus}
                    bPad=".8rem 1.6rem"
                    bRad="30px"
                    bg="var(--color-accent)"
                    color="#fff"
                />
            </div>
        </FormStyled>
    );
}


const FormStyled = styled.form`
display: flex;
    flex-direction: column;
    gap: 2rem;
    input, textarea, select{
        font-family: inherit;
        font-size: inherit;
        outline: none;
        border: none;
        padding: .5rem 1rem;
        border-radius: 5px;
        border: 2px solid #fff;
        background: transparent;
        resize: none;
        box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
        color: rgba(34, 34, 96, 0.9);
        &::placeholder{
            color: rgba(34, 34, 96, 0.4);
        }
    }
    .input-control{
        input, select{
            width: 100%;
        }
    }

    .selects{
        display: flex;
        justify-content: flex-end;
        select{
            color: rgba(34, 34, 96, 0.4);
            &:focus, &:active{
                color: rgba(34, 34, 96, 1);
            }
        }
    }

    .submit-btn{
        button{
            box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
            &:hover{
                background: var(--color-green) !important;
            }
        }
    }
`;

export default PaymentForm;
