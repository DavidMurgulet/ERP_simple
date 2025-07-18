import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Chip,
  Grid,
  TextField,
  InputAdornment,
  Paper,
  Divider,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Search as SearchIcon,
  Close as CloseIcon,
  Badge as BadgeIcon,
  Work as WorkIcon
} from '@mui/icons-material';
import { employeesAPI } from '../services/api';

const EmployeesTab = () => {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isManager, setIsManager] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employeeDetailOpen, setEmployeeDetailOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    fetchEmployees();
    checkManagerPermissions();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await employeesAPI.list();
      setEmployees(response.data);
    } catch (err) {
      console.error('Error fetching employees:', err);
      setError('Failed to load employees. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const checkManagerPermissions = async () => {
    try {
      const response = await employeesAPI.checkManagerPermissions();
      setIsManager(response.data.is_manager);
    } catch (error) {
      console.error('Error checking permissions:', error);
      setIsManager(false);
    }
  };

  const handleEmployeeClick = async (employee) => {
    if (!isManager) {
      console.log('Access denied: Manager permissions required');
      return;
    }

    setDetailLoading(true);
    setEmployeeDetailOpen(true);
    
    try {
      const response = await employeesAPI.detail(employee.id);
      setSelectedEmployee(response.data);
    } catch (error) {
      console.error('Error fetching employee details:', error);
      setError('Failed to load employee details. Please try again.');
      setEmployeeDetailOpen(false);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleCloseDetail = () => {
    setEmployeeDetailOpen(false);
    setSelectedEmployee(null);
  };

  const filteredEmployees = employees.filter(employee =>
    `${employee.first_name} ${employee.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getInitials = (firstName, lastName) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading employees...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Employees
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* {!isManager && (
        <Alert severity="info" sx={{ mb: 3 }}>
          You have view-only access to employee information. Manager permissions required to view detailed employee information.
        </Alert>
      )} */}

      {/* Search Bar */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search employees by name, email, or position..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Employee Count */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          {filteredEmployees.length} employee{filteredEmployees.length !== 1 ? 's' : ''} found
          {searchTerm && ` matching "${searchTerm}"`}
        </Typography>
      </Box>

      {/* Employees List */}
      <Grid container spacing={2}>
        {filteredEmployees.length === 0 ? (
          <Grid item xs={12}>
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <PersonIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                {searchTerm ? 'No employees found' : 'No employees to display'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {searchTerm ? 'Try adjusting your search criteria' : 'Add employees to get started'}
              </Typography>
            </Paper>
          </Grid>
        ) : (
          filteredEmployees.map((employee) => (
            <Grid item xs={12} md={6} lg={4} key={employee.id}>
              <Card 
                sx={{ 
                  height: '100%',
                  cursor: isManager ? 'pointer' : 'default',
                  opacity: isManager ? 1 : 0.9,
                  '&:hover': isManager ? { 
                    elevation: 4,
                    transform: 'translateY(-2px)',
                    transition: 'all 0.2s ease-in-out'
                  } : {}
                }}
                onClick={() => handleEmployeeClick(employee)}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar 
                      sx={{ 
                        bgcolor: employee.is_active ? 'primary.main' : 'grey.400',
                        mr: 2,
                        width: 56,
                        height: 56
                      }}
                    >
                      {getInitials(employee.first_name, employee.last_name)}
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" component="div">
                        {employee.first_name} {employee.last_name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {employee.position}
                      </Typography>
                      <Chip
                        label={employee.is_active ? 'Active' : 'Inactive'}
                        size="small"
                        color={employee.is_active ? 'success' : 'default'}
                        variant={employee.is_active ? 'filled' : 'outlined'}
                      />
                    </Box>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <EmailIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {employee.email}
                      </Typography>
                    </Box>
                    
                    {employee.phone && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PhoneIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          {employee.phone}
                        </Typography>
                      </Box>
                    )}
                    
                    {employee.address && (
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                        <LocationIcon fontSize="small" color="action" sx={{ mt: 0.2 }} />
                        <Typography variant="body2" color="text.secondary">
                          {employee.address}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      {/* Employee Detail Dialog */}
      <Dialog
        open={employeeDetailOpen}
        onClose={handleCloseDetail}
        maxWidth="md"
        fullWidth
        aria-labelledby="employee-detail-dialog-title"
      >
        <DialogTitle
          id="employee-detail-dialog-title"
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            pb: 1
          }}
        >
          <Typography variant="h5">
            Employee Details
          </Typography>
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleCloseDetail}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent dividers>
          {detailLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
              <CircularProgress />
              <Typography sx={{ ml: 2 }}>Loading employee details...</Typography>
            </Box>
          ) : selectedEmployee ? (
            <Grid container spacing={3}>
              {/* Profile Section */}
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                  <Avatar
                    sx={{
                      width: 120,
                      height: 120,
                      mx: 'auto',
                      mb: 2,
                      bgcolor: selectedEmployee.is_active ? 'primary.main' : 'grey.400',
                      fontSize: 42
                    }}
                  >
                    {getInitials(selectedEmployee.first_name, selectedEmployee.last_name)}
                  </Avatar>
                  <Typography variant="h5" gutterBottom>
                    {selectedEmployee.first_name} {selectedEmployee.last_name}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" gutterBottom>
                    {selectedEmployee.position}
                  </Typography>
                  <Chip
                    label={selectedEmployee.is_active ? 'Active' : 'Inactive'}
                    color={selectedEmployee.is_active ? 'success' : 'default'}
                    variant={selectedEmployee.is_active ? 'filled' : 'outlined'}
                  />
                </Box>
              </Grid>
              
              {/* Details Section */}
              <Grid item xs={12} md={8}>
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                  Employee Information
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <BadgeIcon fontSize="small" color="action" />
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Employee ID
                        </Typography>
                        <Typography variant="body1">
                          {selectedEmployee.employee_id}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <WorkIcon fontSize="small" color="action" />
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Position
                        </Typography>
                        <Typography variant="body1">
                          {selectedEmployee.position}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <EmailIcon fontSize="small" color="action" />
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Email Address
                        </Typography>
                        <Typography variant="body1">
                          {selectedEmployee.email}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  
                  {selectedEmployee.phone && (
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <PhoneIcon fontSize="small" color="action" />
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Phone Number
                          </Typography>
                          <Typography variant="body1">
                            {selectedEmployee.phone}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  )}
                  
                  {selectedEmployee.address && (
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 2 }}>
                        <LocationIcon fontSize="small" color="action" sx={{ mt: 0.5 }} />
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Address
                          </Typography>
                          <Typography variant="body1">
                            {selectedEmployee.address}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  )}
                </Grid>
              </Grid>
            </Grid>
          ) : (
            <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
              No employee details available.
            </Typography>
          )}
        </DialogContent>
        
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={handleCloseDetail} variant="outlined">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EmployeesTab;
