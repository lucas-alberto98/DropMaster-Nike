import React from 'react';
import { useFormik } from 'formik';
import styled from 'styled-components';
import { Content, CenterContent, Card } from '../../components/Layout';
import TextField from '../../components/TextField';
import { buildFormikFieldProps } from '../../helpers';
import Button from '../../components/Button';
import Logo from '../../components/Logo';
import ApiService from '../../services/ApiService';
import UserService from '../../services/UserService';

const Link = styled.a`
    color: rgba(0, 0, 0, 0.6);
    animation: all ease 0.3s;
    &:hover {
        color: #333333;
    }
`;

const LogoWrapper = styled.div`
    align-self: center;
    margin-bottom: 20px;
    & > svg {
        width: 50px;
        fill: #333333;
        cursor: pointer;
        transition: all ease 0.3s;
        &:hover {
            transform: scale(1.1);
        }
    }
`;

const Login = () => {
    const submit = async (values: any, { setErrors, setSubmitting }: any) => {
        setSubmitting(true);

        const response = await ApiService.call(
            '/authentication/login',
            'POST',
            {
                email: values.email,
                code: values.code,
            }
        );
        const data = await response.json();
        if (response.status === 400) {
            const { error } = data;

            if (error === 'email not found') {
                setErrors({
                    email: 'Endereço de e-mail não encontrado.',
                });
            }

            if (error === 'code is invalid') {
                setErrors({
                    code: 'Código de ativação inválido.',
                });
            }
        }

        if (response.status === 200) {
            setSubmitting(false);
            await UserService.getMe(data.access_token);
        }
    };

    const form = useFormik({
        initialValues: {},
        onSubmit: submit,
    });

    const { handleSubmit, isSubmitting } = form;

    return (
        <Content style={{ paddingTop: 0, paddingBottom: 0, height: '100%' }}>
            <CenterContent>
                <Card style={{ marginTop: 0 }}>
                    <LogoWrapper>
                        <Logo />
                    </LogoWrapper>
                    <h1 style={{ textAlign: 'center', marginBottom: 30 }}>
                        Entre com sua conta DropMaster
                    </h1>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            type="email"
                            name="email"
                            placeholder="E-mail"
                            {...buildFormikFieldProps(form, 'email')}
                        />
                        <TextField
                            type="password"
                            placeholder="Código de ativação"
                            name="code"
                            {...buildFormikFieldProps(form, 'code')}
                        />
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                            }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                }}
                            >
                                <Link href="/" style={{ marginBottom: 5 }}>
                                    Esqueceu seu código?
                                </Link>
                                <Link href="/">Ainda não é um assinante?</Link>
                            </div>
                            <Button
                                title={isSubmitting ? 'Entrando...' : 'Entrar'}
                                disabled={isSubmitting}
                                style={{ marginLeft: 'auto' }}
                            />
                        </div>
                    </form>
                </Card>
            </CenterContent>
        </Content>
    );
};

export default Login;
