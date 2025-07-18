import { useState } from 'react';
import { 
  Box, 
  Typography, 
  Tabs, 
  Tab, 
  Button,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Tooltip,
  Fade
} from '@mui/material';
import { 
  AccountCircle as AccountCircleIcon,
  Logout as LogoutIcon,
  CalendarToday as CalendarIcon,
  Work as ProjectsIcon,
  People as PeopleIcon,
  Inventory as InventoryIcon,
  ViewKanban as KanbanIcon,
  Settings as SettingsIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import CalendarTab from '../components/CalendarTab';
import ProjectsTab from '../components/ProjectsTab';
import EmployeesTab from '../components/EmployeesTab';
import InventoryTab from '../components/InventoryTab';
import KanbanTab from '../components/KanbanTab';
import UserSettingsTab from '../components/UserSettingsTab';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3, width: '100%' }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const drawerWidth = 220;
const drawerWidthCollapsed = 72;

const Dashboard = () => {
  const [tabValue, setTabValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerMinimized, setDrawerMinimized] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const tabItems = [
    { label: 'Calendar', icon: <CalendarIcon /> },
    { label: 'Projects', icon: <ProjectsIcon /> },
    { label: 'Employees', icon: <PeopleIcon /> },
    { label: 'Inventory', icon: <InventoryIcon /> },
    { label: 'Workspace', icon: <KanbanIcon /> },
    { label: 'User Settings', icon: <SettingsIcon /> }
  ];

  const handleTabChange = (newValue) => {
    setTabValue(newValue);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleMenuClose();
    await logout();
    navigate('/login');
  };

  const handleUserSettings = () => {
    handleMenuClose();
    setTabValue(5); // Switch to User Settings tab (now index 5)
  };

  const toggleDrawer = () => {
    setDrawerMinimized(!drawerMinimized);
  };

  return (
    <Fade in={true} timeout={800}>
      <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerMinimized ? drawerWidthCollapsed : drawerWidth,
          flexShrink: 0,
          transition: 'width 0.3s ease',
          '& .MuiDrawer-paper': {
            width: drawerMinimized ? drawerWidthCollapsed : drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: '#2d2d2d',
            color: 'white',
            borderRight: 'none',
            transition: 'width 0.3s ease',
            overflowX: 'hidden'
          },
        }}
      >
        {/* SERP Logo/Brand */}
        <Box sx={{ 
          p: drawerMinimized ? 1 : 3, 
          textAlign: 'center', 
          borderBottom: '1px solid #404040',
          transition: 'padding 0.3s ease'
        }}>
          {drawerMinimized ? (
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 'bold', 
                color: '#4fc3f7',
                letterSpacing: '1px',
                fontSize: '1rem'
              }}
            >
              S
            </Typography>
          ) : (
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 'bold', 
                color: '#4fc3f7',
                letterSpacing: '2px'
              }}
            >
              SERP
            </Typography>
          )}
        </Box>

        {/* Toggle Button */}
        <Box sx={{ 
          textAlign: 'center', 
          py: 1,
          borderBottom: '1px solid #404040'
        }}>
          <IconButton
            onClick={toggleDrawer}
            sx={{ 
              color: '#bdbdbd',
              '&:hover': { 
                backgroundColor: '#404040',
                color: '#4fc3f7'
              }
            }}
          >
            {drawerMinimized ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </Box>

        {/* User Section */}
        <Box sx={{ 
          p: drawerMinimized ? 1 : 2, 
          textAlign: 'center',
          borderBottom: '1px solid #404040',
          transition: 'padding 0.3s ease'
        }}>
          <IconButton
            onClick={handleMenuOpen}
            sx={{ 
              mb: drawerMinimized ? 0 : 1,
              '&:hover': { backgroundColor: '#404040' }
            }}
          >
            <Avatar sx={{ 
              bgcolor: '#4fc3f7', 
              width: drawerMinimized ? 40 : 56, 
              height: drawerMinimized ? 40 : 56,
              fontSize: drawerMinimized ? '1rem' : '1.5rem',
              transition: 'all 0.3s ease'
            }}>
              {user?.first_name?.[0]}{user?.last_name?.[0]}
            </Avatar>
          </IconButton>
          {!drawerMinimized && (
            <Typography variant="body2" sx={{ color: '#bdbdbd', fontSize: '0.875rem' }}>
              {user?.first_name} {user?.last_name}
            </Typography>
          )}
          
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleUserSettings}>
              <AccountCircleIcon sx={{ mr: 2 }} />
              User Settings
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <LogoutIcon sx={{ mr: 2 }} />
              Logout
            </MenuItem>
          </Menu>
        </Box>

        {/* Navigation Tabs */}
        <List sx={{ flexGrow: 1, py: 1 }}>
          {tabItems.map((item, index) => (
            <ListItem key={item.label} disablePadding>
              {drawerMinimized ? (
                <Tooltip title={item.label} placement="right" arrow>
                  <ListItemButton
                    selected={tabValue === index}
                    onClick={() => handleTabChange(index)}
                    sx={{
                      mx: 1,
                      mb: 0.5,
                      borderRadius: 2,
                      justifyContent: 'center',
                      minHeight: 48,
                      '&.Mui-selected': {
                        backgroundColor: '#4fc3f7',
                        color: 'white',
                        '&:hover': {
                          backgroundColor: '#29b6f6',
                        },
                      },
                      '&:hover': {
                        backgroundColor: '#404040',
                      },
                    }}
                  >
                    <ListItemIcon sx={{ 
                      color: tabValue === index ? 'white' : '#bdbdbd',
                      minWidth: 0,
                      justifyContent: 'center'
                    }}>
                      {item.icon}
                    </ListItemIcon>
                  </ListItemButton>
                </Tooltip>
              ) : (
                <ListItemButton
                  selected={tabValue === index}
                  onClick={() => handleTabChange(index)}
                  sx={{
                    mx: 1,
                    mb: 0.5,
                    borderRadius: 2,
                    '&.Mui-selected': {
                      backgroundColor: '#4fc3f7',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: '#29b6f6',
                      },
                    },
                    '&:hover': {
                      backgroundColor: '#404040',
                    },
                  }}
                >
                  <ListItemIcon sx={{ 
                    color: tabValue === index ? 'white' : '#bdbdbd',
                    minWidth: 40
                  }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.label}
                    primaryTypographyProps={{
                      fontSize: '0.875rem',
                      fontWeight: tabValue === index ? 600 : 400
                    }}
                  />
                </ListItemButton>
              )}
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          backgroundColor: '#f5f5f5',
          overflow: 'auto'
        }}
      >
        {/* Tab Panels */}
        <TabPanel value={tabValue} index={0}>
          <CalendarTab />
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <ProjectsTab />
        </TabPanel>
        <TabPanel value={tabValue} index={2}>
          <EmployeesTab />
        </TabPanel>
        <TabPanel value={tabValue} index={3}>
          <InventoryTab />
        </TabPanel>
        <TabPanel value={tabValue} index={4}>
          <KanbanTab />
        </TabPanel>
        <TabPanel value={tabValue} index={5}>
          <UserSettingsTab />
        </TabPanel>
      </Box>
    </Box>
    </Fade>
  );
};

export default Dashboard;
