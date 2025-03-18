import React from 'react';
import styled from 'styled-components';
import { dateFormat } from '../../utils/dateFormat';
import { dollar, calender, trash } from '../../utils/Icons';
import Button from '../Button/Button';

function PaymentItem({
    id,
    purchase,
    amount,
    paymentDate,
    deleteItem,
    indicatorColor
}) {
    return (
        <PaymentItemStyled indicator={indicatorColor}>
            <div className="content">
                <h5>{purchase?.description}</h5>
                <div className="inner-content">
                    <div className="text">
                        <p>{dollar} {amount}</p>
                        <p>{calender} {dateFormat(paymentDate)}</p>
                    </div>
                </div>
            </div>
        </PaymentItemStyled>
    );
}

const PaymentItemStyled = styled.div`
    background: rgba(249, 250, 251, 0.9);
    border: 2px solid #E5E7EB;
    box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
    padding: 1rem;
    margin-bottom: 1rem;
    border-radius: 20px;

    h5 {
        font-size: 1.3rem;
        position: relative;
    }

    .inner-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .text {
            display: flex;
            gap: 1.5rem;
            p {
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
        }
    }
`;

export default PaymentItem;
