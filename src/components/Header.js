import * as React from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import styled from 'styled-components';
import AddReactionIcon from '@mui/icons-material/AddReaction';
import GroupIcon from '@mui/icons-material/Group';
import { device } from '../styles/device';
import { AppBar, Button, Grid, Toolbar } from '@mui/material';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const { data } = useAuth();
  let navigate = useNavigate();

  const handleLogout = () => {
    localStorage.setItem('userLog', JSON.stringify({}));
    navigate('/');
  };

  return (
    <AppBarStyled position="static">
      <Toolbar>
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={1}>
          <Grid item>
            <Logo src="/images/retoK.png" alt="" className="logo" />
          </Grid>
          <ButtonMobileGrid item>
            <Button color="inherit">Cerrar Sesión</Button>
          </ButtonMobileGrid>
          {data ? (
            data.role === 'admin' ? (
              <NavGrid item>
                <Breadcrumbs aria-label="breadcrumb">
                  <Link
                    underline="hover"
                    sx={{ display: 'flex', alignItems: 'center' }}
                    color="inherit"
                    href="/register">
                    <AddReactionIcon sx={{ mr: 0.8 }} fontSize="inherit" />
                    Formulario de registro
                  </Link>

                  <Link
                    underline="hover"
                    sx={{ display: 'flex', alignItems: 'center' }}
                    color="inherit"
                    href="/employees">
                    <GroupIcon sx={{ mr: 0.8 }} fontSize="inherit" />
                    Registro de empleados
                  </Link>
                </Breadcrumbs>
              </NavGrid>
            ) : null
          ) : null}
          <ButtonWebGrid item>
            <Button variant="coutlined" color="inherit" onClick={handleLogout}>
              Cerrar Sesión
            </Button>
          </ButtonWebGrid>
        </Grid>
      </Toolbar>
    </AppBarStyled>
  );
}

const AppBarStyled = styled(AppBar)`
  && {
    position: absolute;
    top: 0px;
    color: #fff;
    nav {
      color: #023047;
    }
    padding: 10px 2px;
    @media ${device.mobileL} {
      padding: 0;
    }
  }
`;
const Logo = styled.img`
  background: #fff;
  height: 35px;
  @media ${device.laptop} {
    height: 55px;
  }
`;
const NavGrid = styled(Grid)`
  && {
    margin-left: auto;
    margin-right: auto;
    nav {
      font-size: 12px;
    }
    @media ${device.tablet} {
      nav {
        font-size: 15px;
      }
    }
  }
`;
const ButtonWebGrid = styled(Grid)`
  display: none;
  @media ${device.mobileL} {
    display: flex;
  }
`;
const ButtonMobileGrid = styled(Grid)`
  display: flex;
  @media ${device.mobileL} {
    display: none;
  }
`;
