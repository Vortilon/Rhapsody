import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Button,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  AccountCircle,
  Settings,
  Logout,
  Help,
} from '@mui/icons-material';
import Logo from '../logo';

const StyledAppBar = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open, drawerwidth }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerwidth,
    width: `calc(100% - ${drawerwidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

export default function Navbar({ open, drawerWidth, onDrawerToggle }) {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState(null);
  
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationsMenuOpen = (event) => {
    setNotificationsAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setNotificationsAnchorEl(null);
  };

  const handleLogout = () => {
    // Clear auth data
    localStorage.removeItem('jwt');
    localStorage.removeItem('user');
    
    // Redirect to login
    navigate('/login');
  };

  // Mock user data - in a real app, you would get this from your auth context
  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: '/assets/avatars/avatar_default.jpg',
  };

  return (
    <StyledAppBar position="fixed" open={open} drawerwidth={drawerWidth}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={onDrawerToggle}
          edge="start"
          sx={{
            marginRight: 2,
            ...(open && { display: 'none' }),
          }}
        >
          <MenuIcon />
        </IconButton>
        
        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', mr: 2 }}>
          <Logo sx={{ height: 40 }} />
        </Box>
        
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{ flexGrow: 1 }}
        >
          Vortilon
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {/* Help button */}
          <Tooltip title="Help">
            <IconButton color="inherit" sx={{ ml: 1 }}>
              <Help />
            </IconButton>
          </Tooltip>
          
          {/* Notifications */}
          <Tooltip title="Notifications">
            <IconButton
              color="inherit"
              onClick={handleNotificationsMenuOpen}
              sx={{ ml: 1 }}
            >
              <Badge badgeContent={3} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>
          
          {/* Profile */}
          <Tooltip title="Account">
            <IconButton
              onClick={handleProfileMenuOpen}
              color="inherit"
              sx={{ ml: 1 }}
            >
              <Avatar
                alt={user.name}
                src={user.avatar}
                sx={{ width: 32, height: 32 }}
              />
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
      
      {/* Profile menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        onClick={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem>
          <Avatar sx={{ mr: 2 }} />
          <Box>
            <Typography variant="subtitle1">{user.name}</Typography>
            <Typography variant="body2" color="text.secondary">
              {user.email}
            </Typography>
          </Box>
        </MenuItem>
        
        <Divider />
        
        <MenuItem component={RouterLink} to="/profile">
          <ListItemIcon>
            <AccountCircle fontSize="small" />
          </ListItemIcon>
          <ListItemText>Profile</ListItemText>
        </MenuItem>
        
        <MenuItem component={RouterLink} to="/settings">
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          <ListItemText>Settings</ListItemText>
        </MenuItem>
        
        <Divider />
        
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </MenuItem>
      </Menu>
      
      {/* Notifications menu */}
      <Menu
        anchorEl={notificationsAnchorEl}
        open={Boolean(notificationsAnchorEl)}
        onClose={handleMenuClose}
        onClick={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem>
          <Typography variant="subtitle1">New document uploaded</Typography>
        </MenuItem>
        <MenuItem>
          <Typography variant="subtitle1">Processing complete</Typography>
        </MenuItem>
        <MenuItem>
          <Typography variant="subtitle1">System update available</Typography>
        </MenuItem>
        <Divider />
        <MenuItem>
          <Typography variant="body2" color="primary">View all notifications</Typography>
        </MenuItem>
      </Menu>
    </StyledAppBar>
  );
}
