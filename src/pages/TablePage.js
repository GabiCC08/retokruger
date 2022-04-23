import { Chip, FormControl, Grid, InputLabel, MenuItem, Select } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Header from '../components/Header';
import { useAuth } from '../hooks/useAuth';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
/* import { device } from '../styles/device'; */
import { useState } from 'react';
import { Box } from '@mui/system';

function TablePage(props) {
  let navigate = useNavigate();
  const headers = ['Nombres(s)', 'Apellido(s)', 'Correo electrónico', 'Estado', 'Tipo'];
  const rows = props.usersData;
  const { data } = useAuth();
  const [status, setStatus] = useState('');
  const [type, setType] = useState('');

  const handleChange = (event) => {
    setStatus(event.target.value);
    alert('Aun no filtra');
  };
  const handleChangeType = (event) => {
    setType(event.target.value);
    alert('Aun no filtra');
  };

  if (Object.keys(data).length !== 0) {
    if (data.role != 'admin') {
      navigate('/profile');
    } else {
      return (
        <>
          <Container>
            <Header />
            <Actions
              container
              direction="row"
              justifyContent="center"
              alignItems="center"
              spacing={2}>
              <Grid item xs={8} sm={4} md={2}>
                <Box>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label" color="secondary">
                      Estado
                    </InputLabel>
                    <Select
                      sx={{ background: '#fff' }}
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={status}
                      label="Estado"
                      onChange={handleChange}>
                      <MenuItem value="all">Todos</MenuItem>
                      <MenuItem value="vacinnes">Con vacunas</MenuItem>
                      <MenuItem value="">Sin vacunas</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Grid>
              <Grid item xs={8} sm={4} md={2}>
                <Box>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label" color="secondary">
                      Tipo
                    </InputLabel>
                    <Select
                      sx={{ background: '#fff' }}
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={type}
                      label="Tipo"
                      onChange={handleChangeType}>
                      <MenuItem value="Sputnik">Sputnik</MenuItem>
                      <MenuItem value="AstraZeneca">AstraZeneca</MenuItem>
                      <MenuItem value="Pfizer">Pfizer</MenuItem>
                      <MenuItem value="Jhonson&Jhonson">Jhonson&Jhonson</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Grid>
            </Actions>
            <TableContainer component={Paper} className="table-paper">
              <Table aria-label="simple table">
                <TableHead style={{ backgroundColor: 'rgba(2, 48, 71, 0.75)' }}>
                  <HeadRowStyled>
                    {headers.map((value) => (
                      <TableCell key={value} align="left">
                        {value}
                      </TableCell>
                    ))}
                  </HeadRowStyled>
                </TableHead>
                <TableBody>
                  {rows.map((row) => (
                    <TableRowStyled
                      key={row.ci}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell align="left">{row.name}</TableCell>
                      <TableCell align="left">{row.lastname}</TableCell>
                      <TableCell align="left">
                        <a href={`mailto:${row.email}`}>{row.email}</a>
                      </TableCell>
                      <TableCell align="left">
                        {row.vaccines ? (
                          <Chip label="Vacunado/a" color="primary" />
                        ) : (
                          <Chip label="Sin vacunas" color="secondary" />
                        )}
                      </TableCell>
                      <TableCell align="left">
                        {row.vaccines ? <p>{row.vaccines.type}</p> : <p>N/A</p>}
                      </TableCell>
                    </TableRowStyled>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Container>
        </>
      );
    }
  } else {
    navigate('/');
  }
}

export default TablePage;

const Container = styled.div`
  background: #023047 url('/images/table-background.svg') no-repeat center center scroll;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
  min-height: 100vh;
  width: 100%;
  text-align: center;
  .table-paper {
    background-color: rgba(2, 48, 71, 0.75);
    margin: 25px;
    width: 90%;
    display: inline-block;
  }
`;
const Actions = styled(Grid)`
  && {
    padding-top: 80px;
  }
`;

const HeadRowStyled = styled(TableRow)`
  && th {
    color: #fff;
  }
`;
const TableRowStyled = styled(TableRow)`
  && td {
    color: #fff;
    a {
      color: #fb8500;
    }
  }
`;
