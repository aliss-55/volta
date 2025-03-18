import {dashboard, trend,expenses, money, card} from '../utils/Icons'

export const menuItems = [
    {
        id: 1,
        title: 'Dashboard',
        icon: dashboard,
        link: '/dashboard'
    },
  
    {
        id: 5,
        title: 'Tarjetas',
        icon: card,
        link: '/dashboard'
    },
    {
        id: 6,
        title: "Compras",
        icon: money,
        link: "/dashboard",
    },
    {
        id: 7,
        title: "Pagos",
        icon: trend,
        link: "/dashboard",
    },
]