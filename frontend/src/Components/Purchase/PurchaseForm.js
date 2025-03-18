import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { useGlobalContext } from '../../context/globalContext';
import Button from '../Button/Button';
import { plus } from '../../utils/Icons';

function PurchaseForm() {
    const { addPurchase, getCards, cards, error, setError } = useGlobalContext();
    const [inputState, setInputState] = useState({
        description: '',
        amount: '',
        installments: 1,
        purchaseDate: new Date(),
        cardName: ''
    });

    useEffect(() => {
        getCards();
    }, []);

    const { description, amount, installments, purchaseDate, cardName } = inputState;

    const handleInput = name => e => {
        setInputState({ ...inputState, [name]: e.target.value });
        setError('');
    };

    const handleSubmit = async e => {
        e.preventDefault();
        const amountValue = parseFloat(amount);

        if (isNaN(amountValue) || amountValue <= 0) {
            setError('Amount must be a positive number');
            return;
        }

        if (!description || !amount || !installments || !purchaseDate || !cardName) {
            setError('All fields are required');
            return;
        }

        try {
            await addPurchase(inputState);
            setInputState({
                description: '',
                amount: '',
                installments: 1,
                purchaseDate: new Date(),
                cardName: ''
            });
        } catch (error) {
            setError('Failed to add purchase. Please try again.');
        }
    };

    return (
        <FormStyled onSubmit={handleSubmit}>
            {error && <p className='error'>{error}</p>}
            <div className="input-control">
                <input
                    type="text"
                    value={description}
                    name="description"
                    placeholder="Descripción"
                    onChange={handleInput('description')}
                />
            </div>
            <div className="input-control">
                <input
                    type="number"
                    value={amount}
                    name="amount"
                    placeholder="Monto"
                    onChange={handleInput('amount')}
                />
            </div>
            <div className="input-control">
                <input
                    type="number"
                    value={installments}
                    name="installments"
                    placeholder="Número de Cuotas"
                    min="1"
                    onChange={handleInput('installments')}
                />
            </div>
            <div className="input-control">
                <DatePicker
                    selected={purchaseDate}
                    dateFormat="dd/MM/yyyy"
                    onChange={(date) => setInputState({ ...inputState, purchaseDate: date })}
                />
            </div>
            <div className="input-control">
                <select
                    required
                    value={cardName}
                    name="cardName"
                    onChange={handleInput('cardName')}
                >
                    <option value="" disabled>Tarjeta</option>
                    {cards && cards.map((card) => (  // Mapear tarjetas del contexto
                        <option key={card.name} value={card.name}>
                            {card.name} - Saldo Disponible: ${card.availableLimit}
                        </option>
                    ))}
                </select>
            </div>
            <div className="submit-btn">
                <Button
                    name="Añadir Compra"
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

export default PurchaseForm;