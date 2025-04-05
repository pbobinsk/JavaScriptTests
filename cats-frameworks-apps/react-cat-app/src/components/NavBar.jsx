import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

const NavBar = () => (
  <AppBar position="static">
    <Toolbar>
      <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
        Cat Favourites
      </Typography>
      <Box>
        <Button color="inherit">Home</Button>
        <Button color="inherit">Favourites</Button>
      </Box>
    </Toolbar>
  </AppBar>
);

export default NavBar;
