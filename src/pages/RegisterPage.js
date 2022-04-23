import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import styled from 'styled-components';
import { Button, Chip, Divider, Grid, Paper, Stack, TextField, Typography } from '@mui/material';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
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

//funcion para generar una cadena randómica para la autogeneración de contraseña
const randomString = (num) => {
  const composition = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let rand = '';
  for (let i = 0; i < num; i++) {
    rand += composition.charAt(Math.floor(Math.random() * composition.length));
  }
  return rand;
};

function RegisterPage(props) {
  //Custom hook para identificar al usuario de la sesión activa
  const { data } = useAuth();

  let navigate = useNavigate();

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

  const [username, setUsername] = useState('**********');
  const [password, setPassword] = useState('******');
  //objeto de datos para guardar todos los datos requeridos para completar un registro
  const [userData, setUserData] = useState({});
  //controButton controla el estado(habilitado/deshabilitado) del botón de registro
  const [controlButton, setControlButton] = useState(true);

  //Funcion para verificar los campos requeridos y generar credenciales de acceso
  const onGenerateCreds = (formData) => {
    if (props.usersData.find((user) => user.ci === formData.ci)) {
      //En el caso de coincidencia entre cédulas de usuarios
      alert(`Ya existe un usuario con la CI ${formData.ci}`);
      //Botón para registrar datos se deshabilita hasta ingresar un #ci único
      setControlButton(true);
    } else {
      let aux = randomString(6);
      alert('Datos válidos, puedes continuar con el registro');
      setPassword(aux);
      setUsername(formData.ci);
      setUserData({ ...formData, password: aux, username: formData.ci, role: 'employee' });
      setControlButton(false);
    }
  };

  const handleRegister = () => {
    props.onSave(userData);
    reset();
    setUsername('**********');
    setPassword('******');
  };

  if (Object.keys(data).length !== 0) {
    if (data.role !== 'admin') {
      navigate('/profile');
    } else {
      return (
        <RegisterContainer container direction="row" justifyContent="center" alignItems="center">
          <Header />
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
                            label="Apellidos"
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
                        Generar Credenciales
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </FormContainer>
              <Divider style={{ margin: '20px 0' }} />
              <Grid container spacing={2} justifyContent="center" alignItems="center">
                <Grid item>
                  <Stack direction="row" spacing={1}>
                    <Chip label={`Usuario: ${username}`} />
                    <Chip label={`Contraseña: ${password}`} />
                  </Stack>
                </Grid>
                <Grid item>
                  <Button
                    disabled={controlButton}
                    variant="contained"
                    size="large"
                    fullWidth={true}
                    onClick={() => handleRegister(username, password)}>
                    Registrar empleado
                  </Button>
                </Grid>
              </Grid>
            </PaperStyled>
          </Grid>
        </RegisterContainer>
      );
    }
  } else {
    navigate('/');
  }
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
`;
