import React, { useState } from 'react';
import styled from 'styled-components';
import { useGlobalContext } from '../../context/globalContext';
import Button from '../Button/Button';
import { plus } from '../../utils/Icons';

function CardForm() {
    const { addCard, error, setError } = useGlobalContext();
    const [inputState, setInputState] = useState({
        name: '',
        bank: '',
        creditLimit: '',
        interestRate: '',
        cutOffDate: '',
        paymentDueDate: ''
    });

    const { name, bank, creditLimit, interestRate, cutOffDate, paymentDueDate } = inputState;

    const handleInput = name => e => {
        setInputState({ ...inputState, [name]: e.target.value });
        setError('');
    };

    const handleSubmit = async e => {
        e.preventDefault();
        const creditLimitValue = parseFloat(creditLimit);
        const interestRateValue = parseFloat(interestRate);
        if (isNaN(creditLimitValue) || isNaN(interestRateValue)) {
            setError('Credit limit and interest rate must be numbers');
            return;
        }

        if (creditLimitValue <= 0 || interestRateValue <= 0) {
            setError('Credit limit and interest rate must be positive numbers');
            return;
        }

        if (!name || !bank || !creditLimit || !interestRate || !cutOffDate || !paymentDueDate) {
            setError('All fields are required');
            return;
        }

        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        const cutOffDateObject = new Date(currentYear, currentMonth, parseInt(cutOffDate));
        const paymentDueDateObject = new Date(currentYear, currentMonth, parseInt(paymentDueDate));

        if (isNaN(cutOffDateObject.getTime()) || isNaN(paymentDueDateObject.getTime())) {
            setError('Invalid cut-off date or payment due date');
            return;
        }

        const cardData = {
            ...inputState,
            cutOffDate: cutOffDateObject,
            paymentDueDate: paymentDueDateObject
        };

        try {
            await addCard(cardData);
            setInputState({
                name: '',
                bank: '',
                creditLimit: '',
                interestRate: '',
                cutOffDate: '',
                paymentDueDate: ''
            });
        } catch (error) {
            if (error.response && error.response.status === 400) {
                setError('Invalid card data. Please check your input.');
            } else {
                setError('Failed to add card. Please try again.');
            }
        }
    };

    const renderDaysOptions = () => {
        const days = [];
        for (let i = 1; i <= 30; i++) {
            days.push(<option key={i} value={i}>{i}</option>);
        }
        return days;
    };

    return (
        <FormStyled onSubmit={handleSubmit}>
            {error && <p className='error'>{error}</p>}
            <div className="input-control">
                <input
                    type="text"
                    value={name}
                    name={'name'}
                    placeholder="Nombre"
                    onChange={handleInput('name')}
                />
            </div>
            <div className="input-control">
                <input
                    value={bank}
                    type="text"
                    name={'bank'}
                    placeholder={'Banco'}
                    onChange={handleInput('bank')}
                />
            </div>
            <div className="input-control">
                <input
                    value={creditLimit}
                    type="text"
                    name={'creditLimit'}
                    placeholder={'Limite de Credito'}
                    onChange={handleInput('creditLimit')}
                />
            </div>
            <div className="input-control">
                <input
                    value={interestRate}
                    type="text"
                    name={'interestRate'}
                    placeholder={'Tasa de Interes'}
                    onChange={handleInput('interestRate')}
                />
            </div>
            <div className="input-control">
                <select
                    value={cutOffDate}
                    name={'cutOffDate'}
                    onChange={handleInput('cutOffDate')}
                >
                    <option value="">Seleccione Fecha de Corte</option>
                    {renderDaysOptions()}
                </select>
            </div>
            <div className="input-control">
                <select
                    value={paymentDueDate}
                    name={'paymentDueDate'}
                    onChange={handleInput('paymentDueDate')}
                >
                    <option value="">Seleccione Fecha de Vencimiento de Pago</option>
                    {renderDaysOptions()}
                </select>
            </div>
            <div className="submit-btn">
                <Button
                    name={'Añadir Tarjeta'}
                    icon={plus}
                    bPad={'.8rem 1.6rem'}
                    bRad={'30px'}
                    bg={'var(--color-accent)'}
                    color={'#fff'}
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

export default CardForm;
