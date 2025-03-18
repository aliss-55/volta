import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useGlobalContext } from '../../context/globalContext';
import { InnerLayout } from '../../styles/Layouts';
import PaymentItem from './PaymentItem';
import PaymentForm from './PaymentForm';

function Payments() {
    const { payments, getPayments, deletePayment, totalPayments } = useGlobalContext();

    useEffect(() => {
        getPayments(); // Cargar pagos al montar el componente
    }, []);

    return (
        <PaymentStyled>
            <InnerLayout>
                <h1>Pagos</h1>
                <h2 className="total-payments">
                    Agrega un Pago <span>{ }</span>
                </h2>
                <div className="payment-content">
                    <div className="form-container">
                        <PaymentForm />
                    </div>
                    <div className="payments">
                        {payments.map((payment) => (
                            <PaymentItem
                                key={payment._id}
                                id={payment._id}
                                purchase={payment.purchase}
                                amount={payment.amount}
                                paymentDate={payment.paymentDate}
                                card={payment.card}
                                deleteItem={deletePayment}
                                indicatorColor="green"
                            />
                        ))}
                    </div>
                </div>
            </InnerLayout>
        </PaymentStyled>
    );
}

const PaymentStyled = styled.div`
    display: flex;
    overflow: auto;

    .total-payments {
        display: flex;
        justify-content: center;
        align-items: center;
        background:rgba(249, 250, 251, 0.9);
        border: 2px solid #E5E7EB;
        box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
        border-radius: 20px;
        padding: 1rem;
        margin: 1rem 0;
        font-size: 2rem;
        gap: .5rem;

        span {
            font-size: 2.5rem;
            font-weight: 800;
            color: green;
        }
    }

    .payment-content {
        display: flex;
        gap: 2rem;

        .payments {
            flex: 1;
        }
    }
`;

export default Payments;
