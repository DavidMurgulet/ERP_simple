import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  Avatar,
  Divider,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Person as PersonIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { employeesAPI } from '../services/api';

const UserSettingsTab = () => {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [employee, setEmployee] = useState(null);
  
  const [formData, setFormData] = useState({
    email: user?.email || '',
    phone: employee?.phone || '',
    current_password: '',
    new_password: '',
    confirm_password: '',
  });

  useEffect(() => {
    fetchEmployeeData();
  }, [user]);

  const fetchEmployeeData = async () => {
    if (!user?.id) return;
    
    try {
      const response = await employeesAPI.list();
      const userEmployee = response.data.find(emp => emp.user === user.id);
      if (userEmployee) {
        setEmployee(userEmployee);
        setFormData(prev => ({
          ...prev,
          phone: userEmployee.phone || ''
        }));
      }
    } catch (err) {
      console.error('Error fetching employee data:', err);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear messages when user starts typing
    if (success) setSuccess('');
    if (error) setError('');
  };

  const handleEdit = () => {
    setIsEditing(true);
    setFormData({
      ...formData,
      email: user?.email || '',
      phone: employee?.phone || '',
      current_password: '',
      new_password: '',
      confirm_password: '',
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      email: user?.email || '',
      phone: employee?.phone || '',
      current_password: '',
      new_password: '',
      confirm_password: '',
    });
    setError('');
    setSuccess('');
  };

  const handleSave = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    // Validate password confirmation if changing password
    if (formData.new_password && formData.new_password !== formData.confirm_password) {
      setError('New passwords do not match');
      setLoading(false);
      return;
    }

    try {
      // Update employee phone if changed
      if (employee && formData.phone !== employee.phone) {
        await employeesAPI.update(employee.id, {
          ...employee,
          phone: formData.phone
        });
      }

      // TODO: Implement user profile update API call for email and password
      // This would need to be implemented in the backend
      
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
      
      // Refresh employee data
      await fetchEmployeeData();
      
      // Clear password fields
      setFormData({
        ...formData,
        current_password: '',
        new_password: '',
        confirm_password: '',
      });
      
    } catch (err) {
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    // Account deletion removed - only available through admin panel
  };

  const getUserInitials = () => {
    const first = user?.first_name?.[0] || '';
    const last = user?.last_name?.[0] || '';
    return `${first}${last}`.toUpperCase();
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        User Settings
      </Typography>

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Profile Information */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">
                  Profile Information
                </Typography>
                {!isEditing ? (
                  <Button
                    startIcon={<EditIcon />}
                    onClick={handleEdit}
                    variant="outlined"
                  >
                    Edit Profile
                  </Button>
                ) : (
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      startIcon={<CancelIcon />}
                      onClick={handleCancel}
                      variant="outlined"
                      color="inherit"
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                    <Button
                      startIcon={loading ? <CircularProgress size={16} /> : <SaveIcon />}
                      onClick={handleSave}
                      variant="contained"
                      disabled={loading}
                    >
                      Save Changes
                    </Button>
                  </Box>
                )}
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name="email"
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                    variant={isEditing ? "outlined" : "filled"}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name="phone"
                    label="Phone Number"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={!isEditing}
                    variant={isEditing ? "outlined" : "filled"}
                    placeholder="Enter your phone number"
                  />
                </Grid>

                {isEditing && (
                  <>
                    <Grid item xs={12}>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="h6" gutterBottom>
                        Change Password (Optional)
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        name="current_password"
                        label="Current Password"
                        type="password"
                        value={formData.current_password}
                        onChange={handleChange}
                        helperText="Required only if changing password"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        name="new_password"
                        label="New Password"
                        type="password"
                        value={formData.new_password}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        name="confirm_password"
                        label="Confirm New Password"
                        type="password"
                        value={formData.confirm_password}
                        onChange={handleChange}
                      />
                    </Grid>
                  </>
                )}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Profile Picture & Account Actions */}
        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  mx: 'auto',
                  mb: 2,
                  bgcolor: 'primary.main',
                  fontSize: 36
                }}
              >
                {getUserInitials()}
              </Avatar>
              <Typography variant="h6" gutterBottom>
                {user?.first_name} {user?.last_name}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {user?.email}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Member since {new Date(user?.date_joined || Date.now()).toLocaleDateString()}
              </Typography>
              {employee && (
                <>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Employee ID: {employee.employee_id}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Position: {employee.position}
                  </Typography>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UserSettingsTab;
