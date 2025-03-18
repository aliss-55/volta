import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import styled from "styled-components";
import { MainLayout } from '../../styles/Layouts';
import Navigation from '../Navigation/Navigation';
import Dashboard from '../Dashboard/Dashboard';
import Login from '../Pages/Login';
import Income from '../Income/Income';
import Expenses from '../Expenses/Expenses';
import Card from '../Card/Card';
import Payment from '../Payment/Payment';
import Purchase from '../Purchase/purchase';
import { useAuthContext } from '../../hooks/useAuthContext';

function MainApp() {
  const [active, setActive] = useState(1);
  const { user } = useAuthContext();

  const displayData = () => {
    if (!user) {
      return <Navigate to="/" />;
    }

    switch (active) {
      case 1:
        return <Dashboard />;
      case 2:
        return <Income />;
      case 3:
        return <Login />;
      case 4:
        return <Expenses />;
      case 5:
        return <Card />;
      case 6:
        return <Purchase />;
      case 7:
        return <Payment />;
      default:
        return <Dashboard />;
    }
  }

  return (
    <AppStyled className="App">
      <MainLayout>
        <Navigation active={active} setActive={setActive} />
        <main>
          {displayData()}
        </main>
      </MainLayout>
    </AppStyled>
  );
}

const AppStyled = styled.div`
  height: 100vh;
  background-image: url(${props => props.bg});
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  position: relative;

  main {
    flex: 1;
    background: rgba(249, 250, 251, 0.9); /* Fondo claro profesional */
    border: 3px solid #E5E7EB; /* Gris suave */
    backdrop-filter: blur(6px); /* Efecto de desenfoque */
    border-radius: 32px;
    overflow-x: hidden;

    &::-webkit-scrollbar {
      width: 0;
    }
  }
`;

export default MainApp;

