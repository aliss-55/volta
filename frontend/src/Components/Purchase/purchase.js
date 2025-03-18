import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useGlobalContext } from '../../context/globalContext';
import { InnerLayout } from '../../styles/Layouts';
import PurchaseItem from './PurchaseItem';
import PurchaseForm from './PurchaseForm';

function Purchases() {
    const { purchases, getPurchases, totalPurchases } = useGlobalContext();

    useEffect(() => {
        getPurchases(); 
    }, []); 

    return (
        <PurchaseStyled>
            <InnerLayout>
                <h1>Compras</h1>
                <h2 className="total-purchases">Cantidad de Compras: <span>{totalPurchases()}</span></h2>
                <div className="purchase-content">
                    <div className="form-container">
                        <PurchaseForm />
                    </div>
                    <div className="purchases">
                        {purchases.map((purchase) => (
                            <PurchaseItem
                                key={purchase._id}
                                id={purchase._id}
                                description={purchase.description}
                                amount={purchase.amount}
                                installments={purchase.installments}
                                purchaseDate={purchase.purchaseDate}
                                card={purchase.card}
                                indicatorColor="blue"
                            />
                        ))}
                    </div>
                </div>
            </InnerLayout>
        </PurchaseStyled>
    );
}

const PurchaseStyled = styled.div`
    display: flex;
    overflow: auto;
    .total-purchases {
        display: flex;
        justify-content: center;
        align-items: center;
        background: ba(249, 250, 251, 0.9);
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
            color: red;
        }
    }
    .purchase-content {
        display: flex;
        gap: 2rem;
        .purchases {
            flex: 1;
        }
    }
`;

export default Purchases;
