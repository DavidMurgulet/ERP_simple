import { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Grid,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  CircularProgress,
  Alert,
  Avatar,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Email as EmailIcon, Phone as PhoneIcon } from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { employeesAPI } from '../services/api';

const Employees = () => {
  const [open, setOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    position: '',
    department: '',
    hire_date: null,
    salary: '',
    status: 'active',
  });
  const [error, setError] = useState('');

  const queryClient = useQueryClient();

  // Fetch employees
  const { data: employees = [], isLoading } = useQuery({
    queryKey: ['employees'],
    queryFn: () => employeesAPI.getEmployees().then(res => res.data),
  });

  // Mutations
  const createEmployeeMutation = useMutation({
    mutationFn: employeesAPI.createEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries(['employees']);
      handleClose();
    },
    onError: (error) => {
      setError(error.response?.data?.message || 'Failed to create employee');
    },
  });

  const updateEmployeeMutation = useMutation({
    mutationFn: ({ id, ...data }) => employeesAPI.updateEmployee(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['employees']);
      handleClose();
    },
    onError: (error) => {
      setError(error.response?.data?.message || 'Failed to update employee');
    },
  });

  const deleteEmployeeMutation = useMutation({
    mutationFn: employeesAPI.deleteEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries(['employees']);
    },
  });

  const handleOpen = (employee = null) => {
    if (employee) {
      setEditingEmployee(employee);
      setFormData({
        first_name: employee.first_name,
        last_name: employee.last_name,
        email: employee.email,
        phone: employee.phone || '',
        position: employee.position || '',
        department: employee.department || '',
        hire_date: employee.hire_date ? dayjs(employee.hire_date) : null,
        salary: employee.salary || '',
        status: employee.status,
      });
    } else {
      setEditingEmployee(null);
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        position: '',
        department: '',
        hire_date: null,
        salary: '',
        status: 'active',
      });
    }
    setError('');
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingEmployee(null);
    setError('');
  };

  const handleSubmit = () => {
    const employeeData = {
      ...formData,
      hire_date: formData.hire_date ? formData.hire_date.format('YYYY-MM-DD') : null,
      salary: formData.salary ? parseFloat(formData.salary) : null,
    };

    if (editingEmployee) {
      updateEmployeeMutation.mutate({ id: editingEmployee.id, ...employeeData });
    } else {
      createEmployeeMutation.mutate(employeeData);
    }
  };

  const handleDelete = (employeeId) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      deleteEmployeeMutation.mutate(employeeId);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      active: 'success',
      inactive: 'warning',
      terminated: 'error',
    };
    return colors[status] || 'default';
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4">Employees</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpen()}
          >
            Add Employee
          </Button>
        </Box>

        <Grid container spacing={3}>
          {employees.map((employee) => (
            <Grid item xs={12} md={6} lg={4} key={employee.id}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                      {getInitials(employee.first_name, employee.last_name)}
                    </Avatar>
                    <Box>
                      <Typography variant="h6">
                        {employee.first_name} {employee.last_name}
                      </Typography>
                      <Chip
                        label={employee.status}
                        color={getStatusColor(employee.status)}
                        size="small"
                      />
                    </Box>
                  </Box>

                  {employee.position && (
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Position: {employee.position}
                    </Typography>
                  )}

                  {employee.department && (
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Department: {employee.department}
                    </Typography>
                  )}

                  <Box display="flex" alignItems="center" gap={1} mt={1}>
                    <EmailIcon fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      {employee.email}
                    </Typography>
                  </Box>

                  {employee.phone && (
                    <Box display="flex" alignItems="center" gap={1} mt={1}>
                      <PhoneIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {employee.phone}
                      </Typography>
                    </Box>
                  )}

                  {employee.hire_date && (
                    <Typography variant="body2" color="text.secondary" mt={1}>
                      Hired: {new Date(employee.hire_date).toLocaleDateString()}
                    </Typography>
                  )}
                </CardContent>

                <CardActions>
                  <Button
                    size="small"
                    startIcon={<EditIcon />}
                    onClick={() => handleOpen(employee)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDelete(employee.id)}
                  >
                    Delete
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {employees.length === 0 && (
          <Box textAlign="center" py={4}>
            <Typography variant="h6" color="text.secondary">
              No employees found. Add your first employee!
            </Typography>
          </Box>
        )}

        {/* Employee Dialog */}
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
          <DialogTitle>
            {editingEmployee ? 'Edit Employee' : 'Add New Employee'}
          </DialogTitle>

          <DialogContent>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  margin="normal"
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  margin="normal"
                  required
                />
              </Grid>
            </Grid>

            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              margin="normal"
              required
            />

            <TextField
              fullWidth
              label="Phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              margin="normal"
            />

            <TextField
              fullWidth
              label="Position"
              value={formData.position}
              onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              margin="normal"
            />

            <TextField
              fullWidth
              label="Department"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              margin="normal"
            />

            <DatePicker
              label="Hire Date"
              value={formData.hire_date}
              onChange={(date) => setFormData({ ...formData, hire_date: date })}
              renderInput={(params) => (
                <TextField {...params} fullWidth margin="normal" />
              )}
            />

            <TextField
              fullWidth
              label="Salary"
              type="number"
              value={formData.salary}
              onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
              margin="normal"
            />

            <TextField
              fullWidth
              select
              label="Status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              margin="normal"
            >
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
              <MenuItem value="terminated">Terminated</MenuItem>
            </TextField>
          </DialogContent>

          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              disabled={createEmployeeMutation.isLoading || updateEmployeeMutation.isLoading}
            >
              {createEmployeeMutation.isLoading || updateEmployeeMutation.isLoading ? (
                <CircularProgress size={24} />
              ) : (
                editingEmployee ? 'Update' : 'Create'
              )}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
};

export default Employees;
