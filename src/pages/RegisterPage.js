import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import styled from 'styled-components';
import { Button, Chip, Divider, Grid, Paper, Stack, TextField, Typography } from '@mui/material';
import Header from '../components/Header';
import { device } from '../styles/device';

//Validacion de campos para registrar empleados:
//Los 4 campos deben ser de tipo string y todos son requeridos
const schema = yup.object().shape({
  ci: yup
    .string()
    .required('Ingresa el número de cédula')
    .matches(/^[0-2]{1}\d{9}$/, 'El número de cédula debe tener 10 números'),
  name: yup
    .string()
    .required('Ingresa los nombres')
    .matches(
      /^[[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ]+$/,
      'Este campo no permite números ni caracteres especiales '
    ),
  lastname: yup
    .string()
    .required('Ingresa los apellidos')
    .matches(
      /^[[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ]+$/,
      'Este campo no permite números ni caracteres especiales '
    ),
  email: yup.string().email('Ingresa un correo válido').required('Ingresa el correo electrónico')
});

//Genera una cadena randómica para la autogeneración de contraseña
const randomString = (num) => {
  const composition = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let rand = '';
  for (let i = 0; i < num; i++) {
    rand += composition.charAt(Math.floor(Math.random() * composition.length));
  }
  return rand;
};

//Genera un nombre de usuario
const createUsername = (name, lastname) => {
  const randomNum = Math.floor(Math.random() * 10);
  const uname = name.charAt(0) + lastname + randomNum.toString();
  return uname;
};

function RegisterPage(props) {
  const defaultValues = {
    ci: '',
    name: '',
    lastname: '',
    email: ''
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

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [formData, setFormData] = useState({});
  const [users, setUsers] = useState([]);

  //consumo de API que trae todos los usuarios
  useEffect(() => {
    fetch('https://app-help-back.herokuapp.com/user/all')
      .then(async (response) => {
        const data = await response.json();
        setUsers(data.content);
        if (!response.ok) {
          const error = (data && data.message) || response.statusText;
          return Promise.reject(error);
        }
      })
      .catch((error) => {
        console.error('Error', error);
      });
  }, []);

  //Generación de credenciales (username y password)
  const onGenerateCreds = (e) => {
    const existingCi = users.find((user) => user.identification === e.ci);
    const existingEmail = users.find((user) => user.email === e.email);
    if (existingCi) {
      alert('LA CÉDULA PERTENECE A UN USUARIO REGISTRADO, INGRESA OTRA');
    }
    if (existingEmail) {
      alert('EL CORREO PERTENECE A UN USUARIO REGISTRADO, INGRESA OTRO');
    }
    setPassword(randomString(6));
    setFormData(e);
    do {
      setUsername(createUsername(e.name, e.lastname));
    } while (users.find((user) => user.username === username));
  };

  //consumo de API para registrar un nuevo empleado
  const handleRegister = async () => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...formData, username, password })
    };
    const response = await fetch('https://app-help-back.herokuapp.com/auth/nuevo', requestOptions);
    if (!response.ok) {
      const existingCi = users.find((user) => user.identification === formData.ci);
      const existingEmail = users.find((user) => user.email === formData.email);
      if (existingCi) {
        alert('LA CÉDULA PERTENECE A UN USUARIO REGISTRADO, INGRESA OTRA');
      }
      if (existingEmail) {
        alert('EL CORREO PERTENECE A UN USUARIO REGISTRADO, INGRESA OTRO');
      }
    } else {
      alert('REGISTRADO EXITOSAMENTE');
      reset();
      setUsername('');
      setPassword('');
    }
  };

  return (
    <RegisterContainer container direction="row" justifyContent="center" alignItems="center">
      <Header data={props.data} />
      <Grid item xs={11} sm={10} md={8} lg={6}>
        <PaperStyled elevation={24}>
          <Typography variant="h2" align="center">
            Registra un empleado
          </Typography>
          <FormContainer>
            <form noValidate onSubmit={handleSubmit(onGenerateCreds)}>
              <Grid container spacing={2} justifyContent="center" alignItems="center">
                <Grid xs={12} sm={6} item>
                  <Controller
                    name="name"
                    control={control}
                    defaultValue=""
                    render={({ field: { ref, ...rest } }) => (
                      <RegisterTextField
                        {...rest}
                        label="Nombre(s)"
                        type="text"
                        inputRef={ref}
                        error={!!errors.name}
                        helperText={errors.name?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid xs={12} sm={6} item>
                  <Controller
                    name="lastname"
                    control={control}
                    defaultValue=""
                    render={({ field: { ref, ...rest } }) => (
                      <RegisterTextField
                        {...rest}
                        label="Apellido(s)"
                        type="text"
                        inputRef={ref}
                        error={!!errors.lastname}
                        helperText={errors.lastname?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid xs={12} sm={6} item>
                  <Controller
                    name="ci"
                    control={control}
                    defaultValue=""
                    render={({ field: { ref, ...rest } }) => (
                      <RegisterTextField
                        {...rest}
                        label="Cédula"
                        type="text"
                        inputRef={ref}
                        error={!!errors.ci}
                        helperText={errors.ci?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid xs={12} sm={6} item>
                  <Controller
                    name="email"
                    control={control}
                    defaultValue=""
                    render={({ field: { ref, ...rest } }) => (
                      <RegisterTextField
                        {...rest}
                        label="Correo electrónico"
                        type="email"
                        autoComplete="email"
                        inputRef={ref}
                        error={!!errors.email}
                        helperText={errors.email?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item>
                  <Button
                    name="submit"
                    variant="contained"
                    type="submit"
                    size="large"
                    color="secondary"
                    fullWidth={true}>
                    Dar de alta
                  </Button>
                </Grid>
              </Grid>
            </form>
          </FormContainer>
          <Divider style={{ margin: '20px 0' }} />
          <Grid container spacing={2} justifyContent="center" alignItems="center">
            <Grid item>
              <StackStyled direction="row" spacing={1}>
                <Chip label={`Usuario: ${username}`} />
                <Chip label={`Contraseña: ${password}`} />
              </StackStyled>
            </Grid>
            <Grid item>
              <Button variant="contained" size="large" fullWidth={true} onClick={handleRegister}>
                Registrar empleado
              </Button>
            </Grid>
          </Grid>
        </PaperStyled>
      </Grid>
    </RegisterContainer>
  );
}

export default RegisterPage;

const RegisterContainer = styled(Grid)`
  background: #023047 url('/images/home-background.svg') no-repeat center center scroll;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
  height: 100vh;
  width: 100%;
`;

const PaperStyled = styled(Paper)`
  && {
    margin-top: 40px;
    padding: 5px;
    border-radius: 15px;
    background-color: rgba(255, 255, 255);
    h2 {
      font-size: 22px;
    }
    @media ${device.mobileL} {
      padding: 25px 20px;
      border-radius: 20px;
      margin: 0;
      h2 {
        font-size: 2rem;
      }
    }
  }
`;
const FormContainer = styled.div`
  margin: 15px;
`;

const RegisterTextField = styled(TextField)`
  width: 100%;
`;

const StackStyled = styled(Stack)`
  span {
    font-size: 17px;
    font-weight: bold;
  }
`;
