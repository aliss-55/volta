import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { useSignup } from "../../hooks/useSignup";
import validator from "validator";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signup, error, isLoading } = useSignup();
  const navigate = useNavigate();

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [signupError, setSignupError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación del email
    if (!email) {
      setEmailError("Please enter your email");
    } else if (!validator.isEmail(email)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }

    // Validación de la contraseña
    if (!password) {
      setPasswordError("Please enter your password");
    } else if (!validator.isStrongPassword(password)) {
      setPasswordError(
        "Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one special character"
      );
    } else {
      setPasswordError("");
    }

    if (!emailError && !passwordError) {
      try {
        const response = await signup(email, password);

        if (response.success) {
          navigate("/"); 
        }
      } catch (error) {
        if (error.response && error.response.status === 409) {
          setSignupError("This email is already registered");
        } else {
          console.error("Signup failed:", error);
        }
      }
    }
  };

  useEffect(() => {
    setEmailError("");
    setPasswordError("");
    setSignupError("");
  }, [email, password]);

  return (
    <SignupContainer>
      <SignupForm onSubmit={handleSubmit}>
        <h2>Sign Up</h2>
        <FormField>
          <label>Email address:</label>
          <input
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
          {emailError && <ErrorMessage>{emailError}</ErrorMessage>}
        </FormField>
        <FormField>
          <label>Password:</label>
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
          {passwordError && <ErrorMessage>{passwordError}</ErrorMessage>}
        </FormField>
        <SubmitButton disabled={isLoading}>Sign up</SubmitButton>
        {signupError && <ErrorMessage>{signupError}</ErrorMessage>}
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </SignupForm>
      <LoginLink to="/">Already have an account? Login here.</LoginLink>
    </SignupContainer>
  );
};

const SignupContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const SignupForm = styled.form`
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
  margin-bottom: 20px;

  label {
    display: block;
    font-weight: bold;
    margin-bottom: 5px;
  }

  input {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.p`
  margin-top: 10px;
  color: red;
`;

const LoginLink = styled(Link)`
  margin-top: 10px;
  color: #007bff;
  text-decoration: none;
  font-weight: bold;
  transition: color 0.3s;

  &:hover {
    color: #0056b3;
  }
`;

export default Signup;
