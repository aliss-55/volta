import React from 'react';
import styled from 'styled-components';
import { dateFormat } from '../../utils/dateFormat';
import { dollar, calender, stocks, trash } from '../../utils/Icons';
import Button from '../Button/Button';

function PurchaseItem({
    id,
    description,
    amount,
    installments,
    remainingAmount, // Recibir remainingAmount
    purchaseDate,
    card,
    deleteItem,
    indicatorColor
}) {
    const totalPaid = amount / installments;

    return (
        <PurchaseItemStyled indicator={indicatorColor}>
            <div className="content">
                <h5>{description}</h5>
                <div className="inner-content">
                    <div className="text">
                        <p>{dollar} Monto: {amount}</p>
                        <p>{dollar} Cuotas: {installments}</p>
                        <p>{dollar} Valor por Cuota: {totalPaid.toFixed(0)}</p>
                        <p>{calender} Fecha Compra: {dateFormat(purchaseDate)}</p>
                        <p>{calender} Tarjeta: {card}</p>
                    </div>
                </div>
            </div>
        </PurchaseItemStyled>
    );
}


const PurchaseItemStyled = styled.div`
    background: rgba(249, 250, 251, 0.9);
    border: 2px solid #E5E7EB;
    box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
    border-radius: 20px;
    padding: 1rem;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    width: 100%;
    color: #222260;

    .icon {
        width: 80px;
        height: 80px;
        border-radius: 20px;
        background: #F5F5F5;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid #FFFFFF;
        i {
            font-size: 2.6rem;
        }
    }

    .content {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: .2rem;
        h5 {
            font-size: 1.3rem;
            padding-left: 2rem;
            position: relative;
            &::before {
                content: '';
                position: absolute;
                left: 0;
                top: 50%;
                transform: translateY(-50%);
                width: .8rem;
                height: .8rem;
                border-radius: 50%;
                background: ${props => props.indicator};
            }
        }

        .inner-content {
            display: flex;
            justify-content: space-between;
            align-items: center;

            .text {
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
                p {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    color: var(--primary-color);
                    opacity: 0.8;
                }
            }

            .btn-con {
                button {
                    box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
                    &:hover {
                        background: var(--color-green) !important;
                    }
                }
            }
        }
    }
`;

export default PurchaseItem;
