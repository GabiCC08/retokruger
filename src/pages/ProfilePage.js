import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  Button,
  Divider,
  FormControlLabel,
  Grid,
  MenuItem,
  Paper,
  Switch,
  TextField,
  Typography
} from '@mui/material';
import Header from '../components/Header';
import { device } from '../styles/device';
import { parseJwt } from '../lib/utils/decoder';

const vaccines = [
  {
    id: 1,
    type: 'Sputnik'
  },
  {
    id: 2,
    type: 'AstraZeneca'
  },
  {
    id: 3,
    type: 'Pfizer'
  },
  {
    id: 4,
    type: 'Jhonson&Jhonson'
  }
];

/* const phoneRegex = /^[0-9()+/. -]{5,20}$/;
const dateRegex = /^([0-2][0-9]|3[0-1])(\/|-)(0[1-9]|1[0-2])\2(19|20)(\d{2})$/;
 */
function ProfilePage() {
  const [user, setUser] = useState('');
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState('');
  const [checked, setChecked] = useState(false);
  const [address, setAddress] = useState('');
  const [birthday, setBirthday] = useState('');
  const [dateVaccines, setDateVaccines] = useState('');
  const [doses, setDoses] = useState('');
  const [phone, setPhone] = useState('');

  //consulta localStorage, decodifica el token y
  //obtiene la cédula del usuario para traer el registro completo
  useEffect(() => {
    const { CI } = parseJwt(JSON.parse(localStorage.getItem('user')));
    fetch(`https://app-help-back.herokuapp.com/user/byCi/${CI}`).then(async (response) => {
      const data = await response.json();
      setUser(data);
      setAddress(data.address);
      setBirthday(data.birthday);
      setChecked(data.state);
      setDateVaccines(data.dateVaccines);
      setDoses(data.doses);
      setPhone(data.phone);
      setType(data.typeVaccines);
    });
  }, []);

  const handleChangeSelect = (event) => {
    setType(event.target.value);
  };

  const handleChange = (event) => {
    if (event.target.checked === false) {
      setType('');
      setDateVaccines('');
      setDoses(0);
    }
    setChecked(event.target.checked);
  };

  //consumo de API para actualizar los datos de perfil
  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        address,
        birthday,
        state: checked,
        dateVaccines,
        doses,
        phone,
        typeVaccines: type,
        name: user.name,
        lastname: user.lastname
      })
    };
    const response = await fetch(
      `https://app-help-back.herokuapp.com/user/${user.id}`,
      requestOptions
    );
    const data = await response.json();
    /* console.log('New ProfileInfo: ', data); */
    if (data) {
      alert('Datos actualizados exitosamente');
    }
    setLoading(false);
  };

  return (
    <>
      <Header />
      <ProfileContainer container direction="row" justifyContent="center" alignItems="center">
        {user ? (
          <Grid item xs={11} sm={10} md={8} lg={6}>
            <PaperStyled elevation={24}>
              <Typography variant="h2" align="center">
                Información de perfil
              </Typography>
              <FormContainer>
                <Grid container spacing={2} justifyContent="center" alignItems="center">
                  <Grid xs={12} sm={6} item>
                    <UpdateTextField disabled label="Nombre(s)" defaultValue={user.name} />
                  </Grid>
                  <Grid xs={12} sm={6} item>
                    <UpdateTextField disabled label="Apellidos" defaultValue={user.lastname} />
                  </Grid>
                  <Grid xs={12} sm={6} item>
                    <UpdateTextField disabled label="Cédula" defaultValue={user.identification} />
                  </Grid>
                  <Grid xs={12} sm={6} item>
                    <UpdateTextField
                      disabled
                      label="Correo electrónico"
                      defaultValue={user.email}
                    />
                  </Grid>
                </Grid>
                <Divider style={{ margin: '20px 0' }} />
                <form noValidate onSubmit={handleUpdate}>
                  <Grid container spacing={2} justifyContent="center" alignItems="center">
                    <Grid xs={12} sm={6} item>
                      <UpdateTextField
                        required
                        label="Fecha de nacimiento"
                        type="text"
                        value={birthday}
                        onChange={(e) => setBirthday(e.target.value)}
                      />
                    </Grid>
                    <Grid xs={12} sm={6} item>
                      <UpdateTextField
                        required
                        label="Dirección"
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                      />
                    </Grid>
                    <Grid xs={12} sm={6} item>
                      <UpdateTextField
                        required
                        label="Teléfono móvil"
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </Grid>
                    <Grid xs={12} sm={6} item>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={checked}
                            onChange={handleChange}
                            inputProps={{ 'aria-label': 'controlled' }}
                          />
                        }
                        label="Con vacunas"
                      />
                    </Grid>
                    {checked === true ? (
                      <>
                        <Grid xs={12} sm={6} item>
                          <UpdateTextField
                            select
                            label="Tipo de vacuna"
                            value={type}
                            onChange={handleChangeSelect}>
                            {vaccines?.map((option) => (
                              <MenuItem key={option.id} value={option.type}>
                                {option.type}
                              </MenuItem>
                            ))}
                          </UpdateTextField>
                        </Grid>
                        <Grid xs={12} sm={6} item>
                          <UpdateTextField
                            required
                            label="Fecha"
                            value={dateVaccines}
                            onChange={(e) => setDateVaccines(e.target.value)}
                          />
                        </Grid>
                        <Grid xs={12} sm={6} item>
                          <UpdateTextField
                            required
                            type="number"
                            InputLabelProps={{
                              shrink: true
                            }}
                            label="N° de dosis"
                            value={doses}
                            onChange={(e) => setDoses(e.target.value)}
                          />
                        </Grid>
                      </>
                    ) : (
                      ''
                    )}
                    <Grid xs={12} sm={6} item>
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
        ) : (
          ''
        )}
      </ProfileContainer>
    </>
  );
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
`;
