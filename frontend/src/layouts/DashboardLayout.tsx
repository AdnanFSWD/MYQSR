import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  Dashboard as DashboardIcon,
  Category as CategoryIcon,
  Fastfood as FastfoodIcon,
  PointOfSale as PointOfSaleIcon,
  Inventory as InventoryIcon,
  Assessment as AssessmentIcon,
  Settings as SettingsIcon,
  Brightness4 as Brightness4Icon,
  Brightness7 as Brightness7Icon,
  ReceiptLong as ReceiptLongIcon,
  Logout as LogoutIcon,
  ListAlt as ListAltIcon,
} from '@mui/icons-material';
import { useThemeMode } from '../theme/ThemeModeContext';
import { authApi } from '../api/authApi';

const drawerWidth = 260;

interface NavItem {
  text: string;
  path: string;
  icon: React.ReactNode;
}

export const DashboardLayout: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopOpen, setDesktopOpen] = useState(true);
  const { mode, toggleThemeMode } = useThemeMode();
  const navigate = useNavigate();
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleDesktopDrawerToggle = () => {
    setDesktopOpen(!desktopOpen);
  };

  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch (e) {
      // Ignore network errors on logout and clear local storage anyway
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login', { replace: true });
  };

  const navItems: NavItem[] = [
    { text: 'Dashboard', path: '/', icon: <DashboardIcon /> },
    { text: 'POS', path: '/pos', icon: <PointOfSaleIcon /> },
    { text: 'Categories', path: '/categories', icon: <CategoryIcon /> },
    { text: 'Menu Items', path: '/menu-items', icon: <FastfoodIcon /> },
    { text: 'Inventory', path: '/inventory', icon: <InventoryIcon /> },
    { text: 'Sales', path: '/sales', icon: <ReceiptLongIcon /> },
    { text: 'Orders', path: '/orders', icon: <ListAltIcon /> },
    { text: 'Reports', path: '/reports', icon: <AssessmentIcon /> },
    { text: 'Settings', path: '/settings', icon: <SettingsIcon /> },
  ];

  // Helper to determine active route
  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  // Drawer Content
  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Toolbar
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: [2],
          background: theme.palette.mode === 'dark' ? 'linear-gradient(180deg, #111827 0%, #0F172A 100%)' : '#FFFFFF',
        }}
      >
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{
            fontWeight: 800,
            background: 'linear-gradient(45deg, #FF6F00 30%, #FFB300 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '0.05em',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          🍔 MYQSR
        </Typography>
        {isMobile && (
          <IconButton onClick={handleDrawerToggle}>
            <ChevronLeftIcon />
          </IconButton>
        )}
      </Toolbar>
      <Divider />
      <List sx={{ px: 1, py: 2, flexGrow: 1 }}>
        {navItems.map((item) => {
          const active = isActive(item.path);
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => {
                  navigate(item.path);
                  if (isMobile) setMobileOpen(false);
                }}
                sx={{
                  borderRadius: '10px',
                  py: 1.2,
                  px: 2,
                  backgroundColor: active
                    ? theme.palette.mode === 'dark'
                      ? 'rgba(245, 158, 11, 0.15)'
                      : 'rgba(217, 119, 6, 0.08)'
                    : 'transparent',
                  color: active
                    ? theme.palette.primary.main
                    : theme.palette.text.secondary,
                  '&:hover': {
                    backgroundColor: theme.palette.mode === 'dark'
                      ? 'rgba(255, 255, 255, 0.05)'
                      : 'rgba(0, 0, 0, 0.02)',
                    color: theme.palette.text.primary,
                    '& .MuiListItemIcon-root': {
                      color: theme.palette.text.primary,
                    },
                  },
                  transition: 'all 0.2s ease-in-out',
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    color: active ? theme.palette.primary.main : theme.palette.text.secondary,
                    transition: 'color 0.2s',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography sx={{ fontSize: '0.9rem', fontWeight: active ? 600 : 500 }}>
                      {item.text}
                    </Typography>
                  }
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      <Box sx={{ p: 2 }}>
        <Typography variant="caption" sx={{ color: theme.palette.text.secondary, display: 'block', textAlign: 'center' }}>
          v1.0.0 © MYQSR
        </Typography>
      </Box>
    </Box>
  );

  // Get current page header title
  const currentNav = navItems.find((item) => isActive(item.path));
  const pageTitle = currentNav ? currentNav.text : 'MYQSR';

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: theme.palette.background.default }}>
      <CssBaseline />
      
      {/* AppBar / Header */}
      <AppBar
        position="fixed"
        sx={{
          width: isMobile || !desktopOpen ? '100%' : `calc(100% - ${drawerWidth}px)`,
          ml: isMobile || !desktopOpen ? 0 : `${drawerWidth}px`,
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', px: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {isMobile ? (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 1 }}
              >
                <MenuIcon />
              </IconButton>
            ) : (
              <IconButton
                color="inherit"
                onClick={handleDesktopDrawerToggle}
                edge="start"
                sx={{ mr: 1 }}
              >
                <MenuIcon />
              </IconButton>
            )}
            <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 700 }}>
              {pageTitle}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* User details */}
            {user && (
              <Box sx={{ display: { xs: 'none', sm: 'flex' }, flexDirection: 'column', alignItems: 'flex-end', mr: 0.5 }}>
                <Typography variant="body2" sx={{ fontWeight: 700, color: 'inherit' }}>
                  {user.name}
                </Typography>
                <Typography variant="caption" sx={{ color: 'inherit', opacity: 0.8, fontWeight: 500 }}>
                  {user.role}
                </Typography>
              </Box>
            )}

            {/* Theme Toggle Button */}
            <IconButton onClick={toggleThemeMode} color="inherit">
              {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>

            {/* Logout Button */}
            <IconButton onClick={handleLogout} color="inherit" title="Sign Out">
              <LogoutIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebars (Mobile / Desktop) */}
      <Box
        component="nav"
        sx={{ width: { md: desktopOpen ? drawerWidth : 0 }, flexShrink: { md: 0 } }}
        aria-label="mailbox folders"
      >
        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawerContent}
        </Drawer>

        {/* Desktop Drawer */}
        <Drawer
          variant="persistent"
          open={desktopOpen}
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              transform: desktopOpen ? 'none' : `translateX(-${drawerWidth}px)`,
              transition: theme.transitions.create('transform', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
            },
          }}
        >
          {drawerContent}
        </Drawer>
      </Box>

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: '100%',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          mt: '64px', // Height of toolbar
          transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Box sx={{ flexGrow: 1 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};
