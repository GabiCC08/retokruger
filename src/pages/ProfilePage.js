import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import styled from 'styled-components';
import { Avatar, Button, Divider, Grid, Paper, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Header from '../components/Header';
import { device } from '../styles/device';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';

const phoneRegex = /^[0-9()+/. -]{5,20}$/;
const dateRegex = /^(?:3[01]|[12][0-9]|0?[1-9])([-/.])(0?[1-9]|1[1-2])\1\d{4}$/;

const schema = yup.object().shape({
  birthday: yup
    .string()
    .required('Selecciona una fecha')
    .matches(dateRegex, 'Ingresa una fecha válida'),
  address: yup.string().required('Ingresa tu dirección'),
  phone: yup
    .string()
    .required('Ingresa tu número de teléfono')
    .matches(phoneRegex, 'Ingresa un número de teléfono válido')
});

function ProfilePage() {
  const [loading, setLoading] = useState(false);
  const { data } = useAuth();
  let navigate = useNavigate();

  const defaultValues = {
    birthday: '',
    address: '',
    phone: ''
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

  const onUpdate = (formData) => {
    setLoading(true);
    alert('Sorry, no alcance a hacer el registro');
    console.log(formData);
    setLoading(false);
    reset();
  };

  if (Object.keys(data).length !== 0) {
    if (data.role != 'employee') {
      navigate('/register');
    } else {
      return (
        <>
          <Header />
          <ProfileContainer container direction="row" justifyContent="center" alignItems="center">
            <Grid item xs={11} sm={10} md={8} lg={6}>
              <PaperStyled elevation={24}>
                <Avatar
                  sx={{ bgcolor: 'secondary.main', height: 80, width: 80 }}
                  style={{ marginRight: 'auto', marginLeft: 'auto' }}>
                  <InsertEmoticonIcon sx={{ fontSize: 80 }} />
                </Avatar>
                <Typography variant="h2" align="center">
                  Información de perfil
                </Typography>
                <FormContainer>
                  <Grid container spacing={2} justifyContent="center" alignItems="center">
                    <Grid xs={12} sm={6} item>
                      <UpdateTextField disabled label="Nombre(s)" defaultValue={data.name} />
                    </Grid>
                    <Grid xs={12} sm={6} item>
                      <UpdateTextField disabled label="Apellidos" defaultValue={data.lastname} />
                    </Grid>
                    <Grid xs={12} sm={6} item>
                      <UpdateTextField disabled label="Cédula" defaultValue={data.ci} />
                    </Grid>
                    <Grid xs={12} sm={6} item>
                      <UpdateTextField
                        disabled
                        label="Correo electrónico"
                        defaultValue={data.email}
                      />
                    </Grid>
                  </Grid>
                  <Divider style={{ margin: '20px 0' }} />
                  <form noValidate onSubmit={handleSubmit(onUpdate)}>
                    <Grid container spacing={2} justifyContent="center" alignItems="center">
                      <Grid xs={12} sm={6} item>
                        <Controller
                          name="birthday"
                          control={control}
                          defaultValue=""
                          render={({ field: { ref, ...rest } }) => (
                            <UpdateTextField
                              {...rest}
                              label="Fecha de nacimiento"
                              type="text"
                              inputRef={ref}
                              error={!!errors.birthday}
                              helperText={errors.birthday?.message}
                            />
                          )}
                        />
                      </Grid>
                      <Grid xs={12} sm={6} item>
                        <Controller
                          name="address"
                          control={control}
                          defaultValue=""
                          render={({ field: { ref, ...rest } }) => (
                            <UpdateTextField
                              {...rest}
                              label="Dirección"
                              type="text"
                              inputRef={ref}
                              error={!!errors.address}
                              helperText={errors.address?.message}
                            />
                          )}
                        />
                      </Grid>
                      <Grid xs={12} sm={6} item>
                        <Controller
                          name="phone"
                          control={control}
                          defaultValue=""
                          render={({ field: { ref, ...rest } }) => (
                            <UpdateTextField
                              {...rest}
                              label="Teléfono móvil"
                              type="text"
                              inputRef={ref}
                              error={!!errors.phone}
                              helperText={errors.phone?.message}
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
                          color="secondary"
                          fullWidth={true}>
                          Actualizar
                        </Button>
                      </Grid>
                    </Grid>
                  </form>
                </FormContainer>
              </PaperStyled>
            </Grid>
          </ProfileContainer>
        </>
      );
    }
  } else {
    navigate('/');
  }
}

export default ProfilePage;

const ProfileContainer = styled(Grid)`
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

const UpdateTextField = styled(TextField)`
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
