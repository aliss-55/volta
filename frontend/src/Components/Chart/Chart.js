import React from 'react'
import {Chart as ChartJs, 
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js'

import {Line} from 'react-chartjs-2'
import styled from 'styled-components'
import { useGlobalContext } from '../../context/globalContext'
import { dateFormat } from '../../utils/dateFormat'

ChartJs.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
)

function Chart() {
    const {purchases, payments} = useGlobalContext()

    const data = {
    labels: purchases.map((inc) => dateFormat(inc.date)),
    datasets: [
        {
            label: 'Compras',
            data: purchases.map((purchase) => purchase.amount),
            backgroundColor: 'white',
            tension: .2
        },
        {
            label: 'Pagos',
            data: payments.map((payment) => payment.amount),
            backgroundColor: 'black',
            tension: .2
        }
    ]
};


    return (
        <ChartStyled >
            <Line data={data} />
        </ChartStyled>
    )
}

const ChartStyled = styled.div`
    background: rgba(249, 250, 251, 0.9);
    border: 2px solid #E5E7EB;
    box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
    padding: 1rem;
    border-radius: 20px;
    height: 100%;
`;

export default Chart