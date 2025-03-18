import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useGlobalContext } from '../../context/globalContext';
import { InnerLayout } from '../../styles/Layouts';
import CardItem from './CardItem'; 
import CardForm from './CardForm'; 

function Cards() {
    const { cards, getCards, deleteCard, totalCards } = useGlobalContext();

    useEffect(() => {
        getCards(); // Cargar tarjetas al montar el componente
    }, []);

    return (
        <CardStyled>
            <InnerLayout>
                <h1>Tarjetas</h1>
                <h2 className="total-credit-limit">
                    Cantidad de Tarjetas: <span>{totalCards()}</span>
                </h2>
                <div className="card-content">
                    <div className="form-container">
                        <CardForm />
                    </div>
                    <div className="cards">
                        {cards.map((card) => (
                            <CardItem
                                key={card._id}
                                id={card._id}
                                name={card.name}
                                bank={card.bank}
                                creditLimit={card.creditLimit}
                                availableLimit={card.availableLimit}
                                interestRate={card.interestRate}
                                cutOffDate={card.cutOffDate}
                                paymentDueDate={card.paymentDueDate}
                                deleteItem={deleteCard}
                                indicatorColor="blue"
                            />
                        ))}
                    </div>
                </div>
            </InnerLayout>
        </CardStyled>
    );
}

const CardStyled = styled.div`
    display: flex;
    overflow: auto;

    .total-credit-limit {
        display: flex;
        justify-content: center;
        align-items: center;
        background:rgba(249, 250, 251, 0.9);
        border:  3px solid #E5E7EB;
        box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
        border-radius: 20px;
        padding: 1rem;
        margin: 1rem 0;
        font-size: 2rem;
        gap: .5rem;

        span {
            font-size: 2.5rem;
            font-weight: 800;
            color: blue;
        }
    }

    .card-content {
        display: flex;
        gap: 2rem;

        .cards {
            flex: 1;
        }
    }
`;

export default Cards;
