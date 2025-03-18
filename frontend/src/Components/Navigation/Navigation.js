import React from 'react';
import styled from 'styled-components';
import avatar from '../../img/avatar.png';
import { menuItems } from '../../utils/menuItems';
import { useNavigate } from 'react-router-dom';
import { useLogout } from '../../hooks/useLogout';
import { useAuthContext } from '../../hooks/useAuthContext';

function Navigation({ active, setActive }) {
    const navigate = useNavigate();
    const { logout } = useLogout();
    const authContext = useAuthContext();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const userEmail = authContext.user ? authContext.user.email : '';
    const getUsernameFromEmail = (email) => {
        const atIndex = email.indexOf('@');
        return email.substring(0, atIndex);
    };
    const userName = getUsernameFromEmail(userEmail);

    return (
        <NavStyled>
            <div className="user-con">
                <img src={avatar} alt="User Avatar" />
                <div className="text">
                    <h2>{userName}</h2>
                    <p>Lleva el Control</p>
                </div>
            </div>
            <ul className="menu-items">
                {menuItems.map((item) => (
                    <li
                        key={item.id}
                        onClick={() => setActive(item.id)}
                        className={active === item.id ? 'active' : ''}
                    >
                        {item.icon}
                        <span>{item.title}</span>
                    </li>
                ))}
                <LogoutButton onClick={handleLogout}>Cerrar Sesión</LogoutButton>
            </ul>
        </NavStyled>
    );
}

const NavStyled = styled.nav`
    padding: 2rem 1.5rem;
    width: 374px;
    height: 100%;
    background: rgba(249, 250, 251, 0.9); /* Fondo claro */
    border: 3px solid #E5E7EB; /* Gris claro */
    backdrop-filter: blur(6px); /* Desenfoque suave */
    border-radius: 32px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 2rem;

    .user-con {
        height: 100px;
        display: flex;
        align-items: center;
        gap: 1rem;

        img {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            object-fit: cover;
            background: #f3f4f6; /* Fondo gris claro */
            border: 2px solid #E5E7EB; /* Gris claro */
            padding: 0.2rem;
            box-shadow: 0px 1px 12px rgba(0, 0, 0, 0.1); /* Sombra sutil */
        }

        h2 {
            color: #1F2937; /* Texto gris oscuro */
        }

        p {
            color: #4B5563; /* Texto gris medio */
        }
    }

    .menu-items {
        flex: 1;
        display: flex;
        flex-direction: column;

        li {
            display: grid;
            grid-template-columns: 40px auto;
            align-items: center;
            margin: 0.6rem 0;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.4s ease-in-out;
            color: #4B5563; /* Texto gris medio */
            padding-left: 1rem;
            position: relative;

            i {
                color: #4B5563; /* Iconos gris medio */
                font-size: 1.4rem;
                transition: all 0.4s ease-in-out;
            }
        }
    }

    .active {
        color: #1F2937 !important; /* Texto gris oscuro */
        
        i {
            color: #1F2937 !important; /* Iconos gris oscuro */
        }

        &::before {
            content: "";
            position: absolute;
            left: 0;
            top: 0;
            width: 4px;
            height: 100%;
            background: #2563EB; /* Azul acento */
            border-radius: 0 10px 10px 0;
        }
    }
`;

const LogoutButton = styled.button`
    background-color: transparent;
    border: none;
    color: #2563EB; /* Azul acento */
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    margin-top: 20px;
    transition: color 0.3s ease;

    &:hover {
        color: #1D4ED8; /* Azul más oscuro */
    }
`;

export default Navigation;
