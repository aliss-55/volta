import React, { useState } from 'react';
import styled from 'styled-components';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { useGlobalContext } from '../../context/globalContext';
import Button from '../Button/Button';
import { plus } from '../../utils/Icons';

function ExpenseForm() {
    const { addExpense, error, setError } = useGlobalContext();
    const [inputState, setInputState] = useState({
        title: '',
        amount: '',
        date: new Date(),
        category: '',
        description: '',
    });

    const { title, amount, date, category, description } = inputState;

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

        if (!title || !amount || !date || !category || !description) {
            setError('All fields are required');
            return;
        }

        try {
            await addExpense(inputState);
            setInputState({
                title: '',
                amount: '',
                date: new Date(),
                category: '',
                description: '',
            });
        } catch (error) {
            if (error.response && error.response.status === 400) {
                setError('Invalid expense data. Please check your input.');
            } else {
                setError('Failed to add expense. Please try again.');
            }
        }
    };

    return (
        <ExpenseFormStyled onSubmit={handleSubmit}>
            {error && <p className='error'>{error}</p>}
            <div className="input-control">
                <input
                    type="text"
                    value={title}
                    name='title'
                    placeholder="Expense Title"
                    onChange={handleInput('title')}
                    required
                />
            </div>
            <div className="input-control">
                <input
                    type="text"
                    value={amount}
                    name='amount'
                    placeholder="Expense Amount"
                    onChange={handleInput('amount')}
                    required
                />
            </div>
            <div className="input-control">
                <DatePicker
                    selected={date}
                    onChange={date => setInputState({ ...inputState, date })}
                    dateFormat="dd/MM/yyyy"
                />
            </div>
            <div className="selects input-control">
                <select
                    value={category}
                    name="category"
                    onChange={handleInput('category')}
                    required
                >
                    <option value="">Select Option</option>
                    <option value="education">Education</option>
                    <option value="groceries">Groceries</option>
                    <option value="health">Health</option>
                    <option value="subscriptions">Subscriptions</option>
                    <option value="takeaways">Takeaways</option>
                    <option value="clothing">Clothing</option>
                    <option value="travelling">Travelling</option>
                    <option value="other">Other</option>
                </select>
            </div>
            <div className="input-control">
                <textarea
                    value={description}
                    name="description"
                    placeholder="Add A Reference"
                    onChange={handleInput('description')}
                ></textarea>
            </div>
            <div className="submit-btn">
                <Button
                    name='Add Expense'
                    icon={plus}
                    bPad='.8rem 1.6rem'
                    bRad='30px'
                    bg='var(--color-accent)'
                    color='#fff'
                />
            </div>
        </ExpenseFormStyled>
    );
}

const ExpenseFormStyled = styled.form`
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
        input{
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
export default ExpenseForm