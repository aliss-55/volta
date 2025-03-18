import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        list-style: none;
    }

    :root {
        --primary-color: #1E3A8A; /* Azul oscuro */
        --primary-color2: rgba(30, 58, 138, 0.6);
        --primary-color3: rgba(30, 58, 138, 0.4);
        --color-success: #10B981; /* Verde para ingresos */
        --color-warning: #FACC15; /* Amarillo dorado */
        --color-error: #EF4444; /* Rojo para errores */
        --color-neutral: #6B7280; /* Gris para texto o fondos */
        --color-accent: #3B82F6; /* Azul claro para elementos destacados */
    }

    body {
        font-family: 'Nunito', sans-serif;
        font-size: clamp(1rem, 1.5vw, 1.2rem);
        overflow: hidden;
        color: var(--primary-color2);
        background-color: #F9FAFB; /* Fondo claro y limpio */
    }

    h1, h2, h3, h4, h5, h6 {
        color: var(--primary-color);
    }

    .error {
        color: var(--color-error);
        animation: shake 0.5s ease-in-out;
        @keyframes shake {
            0% {
                transform: translateX(0);
            }
            25% {
                transform: translateX(10px);
            }
            50% {
                transform: translateX(-10px);
            }
            75% {
                transform: translateX(10px);
            }
            100% {
                transform: translateX(0);
            }
        }
    }
`;
