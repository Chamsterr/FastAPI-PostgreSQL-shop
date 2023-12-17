import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useAuth } from './useAuth';
import { useNavigate } from 'react-router-dom';
import { NavLink } from 'react-router-dom';

export default function MenuAppBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Chamster Hole
            </Typography>
            {user ? (
              <>
                <IconButton color="white">
                  <NavLink to='/profile'>
                    <AccountCircle style={{color: 'white'}}/>
                  </NavLink>
                </IconButton>
                <Button color="inherit" onClick={handleLogout}>Logout</Button>
              </>
            ) : (
              <Button color="inherit">
                <NavLink to='/login' style={{ color: 'white' }}>Login</NavLink>
              </Button>
            )}
          </Toolbar>
        </AppBar>
      </Box>
    </div>
  );
}