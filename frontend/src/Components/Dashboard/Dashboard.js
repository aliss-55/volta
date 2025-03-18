import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useGlobalContext } from '../../context/globalContext';
import History from '../../History/History';
import { InnerLayout } from '../../styles/Layouts';
import { dollar } from '../../utils/Icons';
import Chart from '../Chart/Chart';

function Dashboard() {
    const {
        totalExpenses,
        purchases,
        payments,
        incomes,
        expenses,
        totalIncome,
        totalBalance,
        getPurchases,
        getPayments
    } = useGlobalContext();

    useEffect(() => {
        getPurchases();
        getPayments()

    }, []); // Dependencia vacía para ejecución única al montar

    return (
        <DashboardStyled>
            <InnerLayout>
                <h1>VOLTA</h1>
                <div className="stats-con">
                    <div className="chart-con">
                        <Chart />
                        <div className="amount-con">
                            <div className="income">
                                <h2>Compras</h2>
                                <p>
                                    {dollar} {totalIncome()}
                                </p>
                            </div>
                            <div className="expense">
                                <h2>Saldo pendiente</h2>
                                <p>
                                    {dollar} {totalExpenses()}
                                </p>
                            </div>
                            <div className="balance">
                                <h2>Balance</h2>
                                <p>
                                    {dollar} {totalBalance()}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="history-con">
                        <History />
                        <h2 className="salary-title">
                            Min <span>Compras</span>Max
                        </h2>
                        <div className="salary-item">
                            <p>${Math.min(...purchases.map((item) => item.amount))}</p>
                            <p>${Math.max(...purchases.map((item) => item.amount))}</p>
                        </div>
                        <h2 className="salary-title">
                            Min <span>Pagos</span>Max
                        </h2>
                        <div className="salary-item">
                            <p>${Math.min(...payments.map((item) => item.amount))}</p>
                            <p>${Math.max(...payments.map((item) => item.amount))}</p>
                        </div>
                    </div>
                </div>
            </InnerLayout>
        </DashboardStyled>
    );
}

const DashboardStyled = styled.div`

    .stats-con {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: 2rem;

        .chart-con {
            grid-column: 1 / 4;
            height: 400px;

            .amount-con {
                display: grid;
                grid-template-columns: repeat(4, 1fr); /* Ajusta el diseño para balance */
                gap: 2rem;
                margin-top: 2rem;

                .income, .expense {
                    grid-column: span 2; /* Cada uno ocupa 2 columnas */
                }

                .income, .expense, .balance {
                    background: rgba(249, 250, 251, 0.9);
                    border: 2px solid #E5E7EB;
                    box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
                    border-radius: 20px;
                    padding: 1rem;

                    p {
                        font-size: 3.0rem;
                        font-weight: 700;
                    }
                }

                .balance {
                    grid-column: span 4; /* Balance ocupa 4 columnas, igual al tamaño combinado de income y expense */
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;

                    p {
                        color: var(--color-green);
                        opacity: ;
                        font-size: 4.5rem;
                    }
                }
            }
        }

        .history-con {
            grid-column: 4 / -1;

            h2 {
                margin: 1rem 0;
                display: flex;
                align-items: center;
                justify-content: space-between;
            }

            .salary-title {
                font-size: 1.2rem;

                span {
                    font-size: 1.8rem;
                }
            }

            .salary-item {
                background: rgba(249, 250, 251, 0.9);
                border: 2px solid #E5E7EB;
                box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
                padding: 1rem;
                border-radius: 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;

                p {
                    font-weight: 600;
                    font-size: 1.6rem;
                }
            }
        }
    }
`;

export default Dashboard;
