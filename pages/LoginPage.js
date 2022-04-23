import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import styled from 'styled-components';
import { Button, Grid, Paper, SvgIcon, TextField, Typography } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const schema = yup.object().shape({
  username: yup.string().required('Ingresa tu nombre de usuario'),
  password: yup
    .string()
    .required('Ingresa tu contraseña')
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
});

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const defaultValues = {
    username: '',
    password: ''
  };
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues
  });

  const onSubmit = (data) => {
    setLoading(true);
    console.log({ data });
    reset();
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <LoginContainer container direction="row" justifyContent="center" alignItems="center">
        <Grid item xs={11} sm={7} md={5} lg={4}>
          <PaperStyled elevation={3}>
            <Typography variant="h2" align="center">
              Bienvenido/a
            </Typography>
            <FormContainer>
              <form noValidate onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={1} justifyContent="center" alignItems="center">
                  <Grid xs={12} item>
                    <Controller
                      name="username"
                      control={control}
                      defaultValue=""
                      render={({ field: { ref, ...rest } }) => (
                        <LoginTextField
                          {...rest}
                          label="Usuario"
                          type="text"
                          color="secondary"
                          autoComplete="username"
                          inputRef={ref}
                          error={!!errors.username}
                          helperText={errors.username?.message}
                        />
                      )}
                    />
                  </Grid>
                  <Grid xs={12} item>
                    <Controller
                      name="password"
                      control={control}
                      defaultValue=""
                      render={({ field: { ref, ...rest } }) => (
                        <LoginTextField
                          {...rest}
                          type={showPassword ? 'text' : 'password'}
                          label="Contraseña"
                          color="secondary"
                          autoComplete="current-password"
                          inputRef={ref}
                          error={!!errors.password}
                          helperText={errors.password?.message}
                          InputProps={{
                            endAdornment: showPassword ? (
                              <StyledSvgIcon
                                component={Visibility}
                                onClick={handleClickShowPassword}
                              />
                            ) : (
                              <StyledSvgIcon
                                component={VisibilityOff}
                                onClick={handleClickShowPassword}
                              />
                            )
                          }}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item>
                    <Button
                      name="submit"
                      variant="contained"
                      type="submit"
                      disabled={loading}
                      size="large"
                      fullWidth={true}>
                      Iniciar sesión
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </FormContainer>
          </PaperStyled>
        </Grid>
      </LoginContainer>
    </>
  );
};

export default LoginPage;

const LoginContainer = styled(Grid)`
  background: #fff url('/images/login-background.webp') no-repeat center center scroll;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
  height: 100vh;
  width: 100%;
`;

const PaperStyled = styled(Paper)`
  && {
    padding: 5%;
    border-radius: 40px 4px;
    background-color: rgba(255, 255, 255, 0.9);
  }
`;
const FormContainer = styled.div`
  margin: 5%;
`;

const LoginTextField = styled(TextField)`
  width: 100%;
  input ~ svg {
    font-size: 22px;
  }
  input ~ svg.MuiSelect-icon {
    display: none;
  }
  input[value=''] ~ svg {
    opacity: 0.11;
  }
  .MuiSelect-iconOutlined {
    margin-right: 10px;
  }
  && {
    background-color: rgba(255, 255, 255, 0.5);
  }
`;
const StyledSvgIcon = styled(SvgIcon)`
  cursor: pointer;
`;
