import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import styled from 'styled-components';
import { Button, Grid, Modal, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';

const phoneRegex = /^[0-9()+/. -]{5,20}$/;

//Validacion de campos para registrar empleados:
//Los 4 campos deben ser de tipo string y todos son requeridos
const schema = yup.object().shape({
  name: yup
    .string()
    .matches(
      /^[[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ]+$/,
      'Este campo no permite números ni caracteres especiales '
    ),
  lastname: yup
    .string()
    .matches(
      /^[[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ]+$/,
      'Este campo no permite números ni caracteres especiales '
    ),
  phone: yup.string().matches(phoneRegex, 'Este campo no permite números ni caracteres especiales ')
});

export default function EditionModal(props) {
  const defaultValues = {
    name: '',
    lastname: '',
    phone: '',
    address: ''
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

  const onUpdate = async (e) => {
    console.log(e);
    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...e })
    };
    const response = await fetch(
      `https://app-help-back.herokuapp.com/user/${props.employeeData.id}`,
      requestOptions
    );
    const data = await response.json();
    /* console.log('New ProfileInfo: ', data); */
    if (data) {
      alert('Datos actualizados exitosamente');
      reset();
    }
  };

  return (
    <Modal
      open={props.open}
      onClose={props.handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description">
      {props.employeeData ? (
        <BoxStyled>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Edición de datos
          </Typography>
          <FormContainer>
            <form noValidate onSubmit={handleSubmit(onUpdate)}>
              <Grid container spacing={2} justifyContent="center" alignItems="center">
                <Grid xs={12} sm={6} item>
                  <Controller
                    name="name"
                    control={control}
                    defaultValue=""
                    render={({ field: { ref, ...rest } }) => (
                      <UpdateTextField
                        {...rest}
                        label="Nombre(s)"
                        type="text"
                        inputRef={ref}
                        error={!!errors.name}
                        helperText={errors.name?.message}
                        placeholder={props.employeeData.name}
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
                      <UpdateTextField
                        {...rest}
                        label="Apellido(s)"
                        type="text"
                        inputRef={ref}
                        error={!!errors.lastname}
                        helperText={errors.lastname?.message}
                        placeholder={props.employeeData.lastname}
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
                    Actualizar
                  </Button>
                </Grid>
              </Grid>
            </form>
          </FormContainer>
        </BoxStyled>
      ) : (
        <p>Cargando...</p>
      )}
    </Modal>
  );
}

const BoxStyled = styled(Box)`
  background: #fff;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60%;
  border: 2px solid #000;
  boxshadow: 24px;
  padding: 20px;
`;

const FormContainer = styled.div`
  margin: 15px;
`;

const UpdateTextField = styled(TextField)`
  width: 100%;
`;
