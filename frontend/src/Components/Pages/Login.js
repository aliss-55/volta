import React, { useState } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { useLogin } from "../../hooks/useLogin";
import validator from "validator";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, error, isLoading } = useLogin();
  const navigate = useNavigate();

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loginError, setLoginError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setEmailError("");
    setPasswordError("");
    setLoginError("");    

    if (!email) {
      setEmailError("Please enter your email");
    } else if (!isValidEmail(email)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }

    if (!password) {
      setPasswordError("Please enter your password");
    } else if (!validator.isStrongPassword(password)) {
      setPasswordError("Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one special character");
    } else {
      setPasswordError("");
    }

    if (email && password && isValidEmail(email) && validator.isStrongPassword(password)) {
      try {
        await login(email, password);
        navigate("/app/*");
      } catch (error) {
        setLoginError("Invalid email or password");
      }
    }
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  return (
    <CenteredContainer>
      <LoginForm onSubmit={handleSubmit}>
        <h2>Login</h2>
        <FormField>
          <label>Email address:</label>
          <input
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            placeholder="Enter your email"
          />
          {emailError && <ErrorMessage>{emailError}</ErrorMessage>}
        </FormField>
        <FormField>
          <label>Password:</label>
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            placeholder="Enter your password"
          />
          {passwordError && <ErrorMessage>{passwordError}</ErrorMessage>}
        </FormField>
        <SubmitButton disabled={isLoading}>Log in</SubmitButton>
        {loginError && <ErrorMessage>{loginError}</ErrorMessage>}
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </LoginForm>
      <SignupLink to="/signup">Don't have an account? Sign up</SignupLink>
    </CenteredContainer>
  );
};

const CenteredContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

const LoginForm = styled.form`
width: 300px;
padding: 20px;
border-radius: 8px;
box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
background-color: #fff;
text-align: center;

h2 {
  margin-bottom: 20px;
}
`;

const FormField = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 15px;

  label {
    margin-bottom: 5px;
  }

  input {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    width: 100%;
  }
`;

const SubmitButton = styled.button`
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: 100%;
  &:hover {
    background-color: #0056b3;
  }
`;

const ErrorMessage = styled.p`
  margin-top: 10px;
  color: #007bff;
  text-decoration: none;
`;

const SignupLink = styled(Link)`
margin-top: 10px;
color: #007bff;
text-decoration: none;
font-weight: bold;
transition: color 0.3s;

&:hover {
  color: #0056b3;
}
`;

export default Login;
