import React, {useState} from "react";
import styled, {createGlobalStyle} from 'styled-components';
import {useAuthStatus} from "./hooks";
import {redirect, useNavigate} from "react-router";
import {authAPI} from "./authAPI";
import {Navigate} from "react-router-dom";

const GlobalStyle = createGlobalStyle`
  body {
    background: #232946;
    font-family: Arial, sans-serif;
  }
`

const Container = styled.div`
  display: flex;
  margin-top: 150px;
  margin-left: auto;
  margin-right: auto;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 400px;
  height: 400px;
  background-color: #232946;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 1);

  @media screen and (max-width: 768px) {
    width: 90%;
    height: auto;
  }
`

const Title = styled.h1`
  font-size: 2rem;
  color: #fff;
  margin-bottom: 80px;
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const Input = styled.input`
  padding: 8px;
  margin-bottom: 16px;
  border: none;
  border-radius: 4px;
  font-size: 1.25rem;
`

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 16px;
  padding-left: 120px;
`

const Button = styled.button`
  padding: 8px 16px;
  margin-right: 16px;
  border: none;
  border-radius: 4px;
  font-size: 1.25rem;
  background-color: #eebbc3;
  color: #232946;
  cursor: pointer;

  transition: all 0.2s ease-in-out;

  &:hover {
    box-shadow: 1px 1px #53a7ea, 2px 2px #53a7ea, 3px 3px #53a7ea;
    transform: translateX(-3px);
`

const RegistrationApp: React.FC = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const authStatus = useAuthStatus();
    const navigate = useNavigate();

    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        const input = event.target.value;
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input)) {
            event.target.setCustomValidity('Введите действительный адрес электронной почты');
        } else {
            event.target.setCustomValidity('');
        }
    };
    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        const input = event.target.value;
        if (!/^(?=.*[0-9])(?=.*[a-zA-Z])[a-zA-Z0-9]+$/.test(input)) {
            event.target.setCustomValidity('Пароль должен состоять только из латинских букв и цифр');
        } else {
            event.target.setCustomValidity('');
            setPassword(input);
        }
    };

    const handleConfirmPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        const input = event.target.value;
        if (input !== password) {
            event.target.setCustomValidity('Пароли не совпадают');
        } else {
            event.target.setCustomValidity('');
            setConfirmPassword(input);
        }
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (password === confirmPassword) {
            const target = event.target as typeof event.target & {
                email: { value: string },
                password: { value: string }
            }

            const data = {
                username: target.email.value,
                password: target.password.value,
                petname: 'KROT'
            }

            authAPI.sendRegister(data)
                .then(() => navigate("/login"));
        }
    };

    return (
        <>
            {authStatus.value ? <Navigate to={"/"}/> : null}
            <GlobalStyle/>
            <Container>
                <Title>Registration</Title>
                <Form onSubmit={handleSubmit}>
                    <Input type="email" placeholder="Email" name='email' required onChange={handleEmailChange}/>
                    <Input type="password" placeholder="Password" name="password" required
                           onChange={handlePasswordChange}/>
                    <Input type="password" placeholder="Repeat Password" required
                           onChange={handleConfirmPasswordChange}/>
                    <ButtonContainer>
                        <Button>Registration</Button>
                    </ButtonContainer>
                </Form>
            </Container>
        </>
    );
};

export default RegistrationApp;
