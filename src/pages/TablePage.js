import {
  Chip,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import styled from 'styled-components';
import Header from '../components/Header';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
/* import { device } from '../styles/device'; */
import { useEffect, useState } from 'react';
import { Box } from '@mui/system';
import EditionModal from '../components/EditionModal';

const TablePage = () => {
  const headers = [
    'Nombre Completo',
    'Usuario',
    'Correo electrónico',
    'Teléfono móvil',
    'Estado',
    'Tipo',
    'Acciones'
  ];
  const [rows, setRows] = useState([]);
  const [completeData, setCompleteData] = useState([]);
  const [status, setStatus] = useState('all');
  const [type, setType] = useState('');
  const [employeeData, setEmployeeData] = useState({});
  const [open, setOpen] = useState(false);

  const handleOpen = (data) => {
    setOpen(true);
    setEmployeeData(data);
  };
  const handleClose = () => setOpen(false);

  useEffect(() => {
    fetch('https://app-help-back.herokuapp.com/user/all')
      .then(async (response) => {
        const data = await response.json();
        const users = data.content.filter((user) => user.username !== 'admin');
        setCompleteData(users);
        setRows(users);
        if (!response.ok) {
          const error = (data && data.message) || response.statusText;
          return Promise.reject(error);
        }
      })
      .catch((error) => {
        console.error('Ocurrio un error', error);
      });
  }, []);
  useEffect(() => {
    if (status !== 'all') {
      if (status != true) {
        setRows(completeData.filter((user) => user.state == false));
      } else {
        if (type == '') {
          setRows(completeData.filter((user) => user.state == true));
        } else {
          setRows(completeData.filter((user) => user.typeVaccines == type));
        }
      }
    } else {
      if (type == '') {
        setRows(completeData);
      } else {
        setRows(completeData.filter((user) => user.typeVaccines == type));
      }
    }
  }, [status, type]);

  const handleChange = (event) => {
    setStatus(event.target.value);
    if (event.target.value == false) {
      setType('');
    }
  };
  const handleChangeType = (event) => {
    setType(event.target.value);
  };

  function handleDelete(id) {
    fetch(`https://app-help-back.herokuapp.com/user/delete/${id}`, { method: 'DELETE' }).then(() =>
      alert('Delete successful')
    );
    location.reload();
  }

  return (
    <>
      <Container>
        <Header />
        <Actions container direction="row" justifyContent="center" alignItems="center" spacing={2}>
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
                  <MenuItem value={true}>Con vacunas</MenuItem>
                  <MenuItem value={false}>Sin vacunas</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Grid>
          <Grid item xs={8} sm={4} md={2}>
            <Box>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label" color="secondary">
                  Tipo de vacuna
                </InputLabel>
                <Select
                  disabled={!status}
                  sx={{ background: '#fff' }}
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={type}
                  label="Tipo de vacuna"
                  onChange={handleChangeType}>
                  <MenuItem value=""> Ninguna </MenuItem>
                  <MenuItem value="Sputnik">Sputnik</MenuItem>
                  <MenuItem value="AstraZeneca">AstraZeneca</MenuItem>
                  <MenuItem value="Pfizer">Pfizer</MenuItem>
                  <MenuItem value="Jhonson&Jhonson">Jhonson&Jhonson</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Grid>
        </Actions>
        {rows ? (
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
                    key={row.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell align="left">
                      {row.name} {row.lastname}
                    </TableCell>
                    <TableCell align="left">{row.username}</TableCell>
                    <TableCell align="left">
                      <a href={`mailto:${row.email}`}>{row.email}</a>
                    </TableCell>
                    <TableCell align="left">{row.phone}</TableCell>
                    <TableCell align="left">
                      {row.state === true ? (
                        <Chip label="Vacunado/a" color="primary" />
                      ) : (
                        <Chip label="Sin vacunas" color="secondary" />
                      )}
                    </TableCell>
                    <TableCell align="left">
                      {row.state === true ? <p>{row.typeVaccines}</p> : <p>N/A</p>}
                    </TableCell>
                    <TableCell align="left">
                      <Stack direction="row" spacing={2}>
                        <IconButton
                          aria-label="edit"
                          size="large"
                          color="success"
                          onClick={() => handleOpen(row)}>
                          <EditIcon fontSize="inherit" />
                        </IconButton>
                        <IconButton
                          aria-label="delete"
                          size="large"
                          color="error"
                          onClick={() => handleDelete(row.id)}>
                          <DeleteIcon fontSize="inherit" />
                        </IconButton>
                      </Stack>{' '}
                    </TableCell>
                  </TableRowStyled>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          ''
        )}
      </Container>

      <EditionModal open={open} handleClose={handleClose} employeeData={{ ...employeeData }} />
    </>
  );
};

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
