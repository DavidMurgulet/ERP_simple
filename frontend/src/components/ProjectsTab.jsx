import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  Alert,
  CircularProgress,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CardActions,
  Stack,
  Grid
} from '@mui/material';
import {
  Add as AddIcon,
  ArrowBack as ArrowBackIcon,
  MoreVert as MoreVertIcon,
  ExpandMore as ExpandMoreIcon,
  Build as BuildIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Edit as EditIcon,
  CalendarToday as CalendarIcon,
  Business as BusinessIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import api from '../services/api';

const ProjectsTab = () => {
  const [projects, setProjects] = useState({
    inProgress: [],
    completed: []
  });
  const [selectedProject, setSelectedProject] = useState(null);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [contextMenu, setContextMenu] = useState(null);
  const [selectedForContext, setSelectedForContext] = useState(null);
  const [stageDropdown, setStageDropdown] = useState({ open: false, projectId: null, anchorEl: null });
  const [progressDropdown, setProgressDropdown] = useState({ open: false, projectId: null, anchorEl: null });

  const [newProject, setNewProject] = useState({
    title: '',
    client_name: '',
    due_date: null,
    id: null // Add id to track which project is being updated
  });

  const manufacturingStages = [
    { value: 'cnc', label: 'CNC' },
    { value: 'sanding', label: 'Sanding' },
    { value: 'painting', label: 'Painting' },
    { value: 'assembly', label: 'Assembly' },
    { value: 'delivery', label: 'Delivery' },
    { value: 'installation', label: 'Installation' },
    { value: 'completed', label: 'Completed' }
  ];

  const progressOptions = [
    { value: 'not_started', label: 'Not Started' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const [inProgressRes, completedRes] = await Promise.all([
        api.get('/projects/in-progress/'),
        api.get('/projects/completed/')
      ]);
      
      setProjects({
        inProgress: inProgressRes.data,
        completed: completedRes.data
      });
    } catch (err) {
      setError('Failed to fetch projects');
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async () => {
    setLoading(true);
    setError('');
    
    try {
      await api.post('/projects/create/', newProject);
      setSuccess('Project created successfully!');
      setOpenCreateDialog(false);
      setNewProject({
        title: '',
        client_name: '',
        due_date: null,
        id: null
      });
      fetchProjects();
    } catch (err) {
      setError('Failed to create project');
      console.error('Error creating project:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditProject = async () => {
    setLoading(true);
    setError('');
    
    try {
      await api.put(`/projects/${newProject.id}/update/`, newProject);
      setSuccess('Project updated successfully!');
      setOpenEditDialog(false);
      
      // Reset form
      setNewProject({
        title: '',
        client_name: '',
        due_date: null,
        id: null
      });
      
      fetchProjects();
      const updatedProject = await api.get(`/projects/${newProject.id}/`);
      setSelectedProject(updatedProject.data);
    } catch (err) {
      setError('Failed to update project');
      console.error('Error updating project:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (projectId) => {
    setLoading(true);
    setError('');
    
    try {
      await api.delete(`/projects/${projectId}/delete/`);
      setSuccess('Project deleted successfully!');
      fetchProjects();
      if (selectedProject && selectedProject.id === projectId) {
        setSelectedProject(null);
      }
    } catch (err) {
      setError('Failed to delete project');
      console.error('Error deleting project:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteProject = async (projectId) => {
    setLoading(true);
    setError('');
    
    try {
      await api.post(`/projects/${projectId}/complete/`);
      setSuccess('Project marked as completed!');
      fetchProjects();
      if (selectedProject && selectedProject.id === projectId) {
        const updatedProject = await api.get(`/projects/${projectId}/`);
        setSelectedProject(updatedProject.data);
      }
    } catch (err) {
      setError('Failed to complete project');
      console.error('Error completing project:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStageUpdate = async (projectId, newStage) => {
    try {
      await api.put(`/projects/${projectId}/update/`, { manufacture_stage: newStage });
      setSuccess('Manufacturing stage updated successfully!');
      fetchProjects();
      if (selectedProject && selectedProject.id === projectId) {
        const updatedProject = await api.get(`/projects/${projectId}/`);
        setSelectedProject(updatedProject.data);
      }
    } catch (err) {
      setError('Failed to update manufacturing stage');
      console.error('Error updating stage:', err);
    }
    setStageDropdown({ open: false, projectId: null, anchorEl: null });
  };

  const handleProgressUpdate = async (projectId, newProgress) => {
    try {
      await api.put(`/projects/${projectId}/update/`, { progress: newProgress });
      setSuccess('Progress updated successfully!');
      fetchProjects();
      if (selectedProject && selectedProject.id === projectId) {
        const updatedProject = await api.get(`/projects/${projectId}/`);
        setSelectedProject(updatedProject.data);
      }
    } catch (err) {
      setError('Failed to update progress');
      console.error('Error updating progress:', err);
    }
    setProgressDropdown({ open: false, projectId: null, anchorEl: null });
  };

  const handleProjectClick = async (project) => {
    try {
      const response = await api.get(`/projects/${project.id}/`);
      setSelectedProject(response.data);
    } catch (err) {
      setError('Failed to fetch project details');
      console.error('Error fetching project details:', err);
    }
  };

  const handleRightClick = (event, project) => {
    event.preventDefault();
    // Only allow context menu in detail view
    if (selectedProject && selectedProject.id === project.id) {
      setSelectedForContext(project);
      setContextMenu(
        contextMenu === null
          ? { mouseX: event.clientX + 2, mouseY: event.clientY - 6 }
          : null
      );
    }
  };

  const handleContextMenuClose = () => {
    setContextMenu(null);
    setSelectedForContext(null);
  };

  const openEditDialogHandler = () => {
    setNewProject({
      title: selectedProject.title,
      client_name: selectedProject.client_name,
      due_date: selectedProject.due_date ? dayjs(selectedProject.due_date) : null,
      id: selectedProject.id
    });
    setOpenEditDialog(true);
  };

  const getStageColor = (stage) => {
    const colors = {
      cnc: 'info',
      sanding: 'warning',
      painting: 'secondary',
      assembly: 'primary',
      delivery: 'success',
      installation: 'default',
      completed: 'success'
    };
    return colors[stage] || 'default';
  };

  const getProgressColor = (progress) => {
    const colors = {
      not_started: 'default',
      in_progress: 'info',
      completed: 'success',
      delivered: 'success',
      cancelled: 'error'
    };
    return colors[progress] || 'default';
  };

  if (selectedProject) {
    return (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <IconButton onClick={() => setSelectedProject(null)} sx={{ mr: 2 }}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h4" sx={{ flexGrow: 1 }}>
              {selectedProject.title}
            </Typography>
            <IconButton 
              onClick={(e) => {
                setSelectedForContext(selectedProject);
                setContextMenu(
                  contextMenu === null
                    ? { mouseX: e.clientX + 2, mouseY: e.clientY - 6 }
                    : null
                );
              }}
            >
              <MoreVertIcon />
            </IconButton>
          </Box>

          <Card>
            <CardContent>
              <Grid container spacing={3}>
                <Grid xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Project Information
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body1">
                      <strong>Client:</strong> {selectedProject.client_name || 'Not specified'}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body1">
                      <strong>Due Date:</strong> {selectedProject.due_date ? dayjs(selectedProject.due_date).format('MMM D, YYYY') : 'Not set'}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body1">
                      <strong>Created:</strong> {dayjs(selectedProject.created_at).format('MMM D, YYYY h:mm A')}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body1">
                      <strong>Last Updated:</strong> {dayjs(selectedProject.updated_at).format('MMM D, YYYY h:mm A')}
                      {selectedProject.updated_by && (
                        <span style={{ color: '#666', fontSize: '0.9em' }}>
                          {' by '}
                          {selectedProject.updated_by.first_name && selectedProject.updated_by.last_name 
                            ? `${selectedProject.updated_by.first_name} ${selectedProject.updated_by.last_name}`
                            : selectedProject.updated_by.username
                          }
                        </span>
                      )}
                    </Typography>
                  </Box>
                </Grid>
                <Grid xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Status
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Chip 
                      label={`Stage: ${manufacturingStages.find(s => s.value === selectedProject.manufacture_stage)?.label}`}
                      color={getStageColor(selectedProject.manufacture_stage)}
                      sx={{ mr: 1, mb: 1, cursor: 'pointer' }}
                      clickable
                      onClick={(e) => setStageDropdown({ open: true, projectId: selectedProject.id, anchorEl: e.currentTarget })}
                    />
                    <Chip 
                      label={`Progress: ${progressOptions.find(p => p.value === selectedProject.progress)?.label}`}
                      color={getProgressColor(selectedProject.progress)}
                      sx={{ mr: 1, mb: 1, cursor: 'pointer' }}
                      clickable
                      onClick={(e) => setProgressDropdown({ open: true, projectId: selectedProject.id, anchorEl: e.currentTarget })}
                    />
                    {selectedProject.is_completed && (
                      <Chip 
                        label="Completed"
                        color="success"
                        icon={<CheckCircleIcon />}
                        sx={{ mb: 1 }}
                      />
                    )}
                  </Box>
                  
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                      variant="outlined"
                      onClick={openEditDialogHandler}
                      sx={{ mt: 2 }}
                    >
                      Edit Project
                    </Button>
                    
                    {!selectedProject.is_completed && (
                      <Button
                        variant="contained"
                        color="success"
                        onClick={() => handleCompleteProject(selectedProject.id)}
                        disabled={loading}
                        startIcon={<CheckCircleIcon />}
                        sx={{ mt: 2 }}
                      >
                        Mark as Completed
                      </Button>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Stage Dropdown Menu - Only in detail view */}
          <Menu
            open={stageDropdown.open}
            onClose={() => setStageDropdown({ open: false, projectId: null, anchorEl: null })}
            anchorEl={stageDropdown.anchorEl}
          >
            {manufacturingStages.map((stage) => (
              <MenuItem 
                key={stage.value}
                onClick={() => handleStageUpdate(stageDropdown.projectId, stage.value)}
              >
                {stage.label}
              </MenuItem>
            ))}
          </Menu>

          {/* Progress Dropdown Menu - Only in detail view */}
          <Menu
            open={progressDropdown.open}
            onClose={() => setProgressDropdown({ open: false, projectId: null, anchorEl: null })}
            anchorEl={progressDropdown.anchorEl}
          >
            {progressOptions.map((progress) => (
              <MenuItem 
                key={progress.value}
                onClick={() => handleProgressUpdate(progressDropdown.projectId, progress.value)}
              >
                {progress.label}
              </MenuItem>
            ))}
          </Menu>

          {/* Context Menu - Only available in detail view */}
          <Menu
            open={contextMenu !== null}
            onClose={handleContextMenuClose}
            anchorReference="anchorPosition"
            anchorPosition={
              contextMenu !== null
                ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
                : undefined
            }
          >
            <MenuItem onClick={openEditDialogHandler}>
              <EditIcon sx={{ mr: 1 }} />
              Edit Project
            </MenuItem>
            <MenuItem 
              onClick={() => {
                handleDeleteProject(selectedForContext.id);
                handleContextMenuClose();
              }}
              sx={{ color: 'error.main' }}
            >
              Delete Project
            </MenuItem>
            {selectedForContext && !selectedForContext.is_completed && (
              <MenuItem 
                onClick={() => {
                  handleCompleteProject(selectedForContext.id);
                  handleContextMenuClose();
                }}
                sx={{ color: 'success.main' }}
              >
                Mark as Completed
              </MenuItem>
            )}
          </Menu>

          {/* Edit Project Dialog - Only title, client, and due date */}
          <Dialog open={openEditDialog} onClose={() => {
            setOpenEditDialog(false);
            setNewProject({
              title: '',
              client_name: '',
              due_date: null,
              id: null
            });
          }} maxWidth="sm" fullWidth>
            <DialogTitle>Edit Project Details</DialogTitle>
            <DialogContent>
              <Box sx={{ pt: 1 }}>
                <TextField
                  fullWidth
                  label="Project Title"
                  value={newProject.title}
                  onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                  margin="normal"
                  required
                />
                
                <TextField
                  fullWidth
                  label="Client Name"
                  value={newProject.client_name}
                  onChange={(e) => setNewProject({ ...newProject, client_name: e.target.value })}
                  margin="normal"
                />
                
                <DatePicker
                  label="Due Date"
                  value={newProject.due_date}
                  onChange={(newValue) => setNewProject({ ...newProject, due_date: newValue })}
                  sx={{ width: '100%', mt: 2, mb: 1 }}
                />
                
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Note: Use the clickable chips above to change manufacturing stage and progress.
                  </Typography>
                </Box>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => {
                setOpenEditDialog(false);
                setNewProject({
                  title: '',
                  client_name: '',
                  due_date: null,
                  id: null
                });
              }}>Cancel</Button>
              <Button 
                onClick={handleEditProject} 
                variant="contained"
                disabled={!newProject.title.trim() || loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Save Changes'}
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </LocalizationProvider>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" gutterBottom>
            Projects
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenCreateDialog(true)}
          >
            New Project
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>
            {success}
          </Alert>
        )}

        {loading && !openCreateDialog && !openEditDialog ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {/* In Progress Projects */}
            <Grid xs={12}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <ScheduleIcon sx={{ mr: 1 }} />
                  In Progress Projects ({projects.inProgress.length})
                </Typography>
                
                {projects.inProgress.length === 0 ? (
                  <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                    No projects in progress
                  </Typography>
                ) : (
                  <Box sx={{ 
                    display: 'flex', 
                    gap: 2, 
                    overflowX: 'auto',
                    pb: 1,
                    '&::-webkit-scrollbar': {
                      height: 8,
                    },
                    '&::-webkit-scrollbar-track': {
                      backgroundColor: 'rgba(0,0,0,0.1)',
                      borderRadius: 4,
                    },
                    '&::-webkit-scrollbar-thumb': {
                      backgroundColor: 'rgba(0,0,0,0.3)',
                      borderRadius: 4,
                    },
                  }}>
                    {projects.inProgress.map((project) => (
                      <Card 
                        key={project.id} 
                        sx={{ 
                          minWidth: 320,
                          maxWidth: 320,
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          '&:hover': { 
                            transform: 'translateY(-2px)',
                            boxShadow: 4 
                          }
                        }}
                        onClick={() => handleProjectClick(project)}
                      >
                        <CardContent sx={{ pb: 1 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                            <Typography variant="h6" component="div" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                              {project.title}
                            </Typography>
                          </Box>
                          
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <BusinessIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary">
                              {project.client_name || 'No client specified'}
                            </Typography>
                          </Box>
                          
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <CalendarIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary">
                              {project.due_date ? dayjs(project.due_date).format('MMM D, YYYY') : 'No due date'}
                            </Typography>
                          </Box>
                          
                          <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                            <Chip 
                              label={manufacturingStages.find(s => s.value === project.manufacture_stage)?.label || 'Unknown'}
                              size="small"
                              color={getStageColor(project.manufacture_stage)}
                            />
                            <Chip 
                              label={progressOptions.find(p => p.value === project.progress)?.label || 'Unknown'}
                              size="small"
                              color={getProgressColor(project.progress)}
                            />
                          </Stack>
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
                )}
              </Paper>
            </Grid>

            {/* Completed Projects - Accordion */}
            <Grid xs={12}>
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="completed-projects-content"
                  id="completed-projects-header"
                >
                  <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                    <CheckCircleIcon sx={{ mr: 1, color: 'success.main' }} />
                    Completed Projects ({projects.completed.length})
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {projects.completed.length === 0 ? (
                    <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                      No completed projects
                    </Typography>
                  ) : (
                    <Box sx={{ 
                      display: 'flex', 
                      gap: 2, 
                      overflowX: 'auto',
                      pb: 1,
                      '&::-webkit-scrollbar': {
                        height: 8,
                      },
                      '&::-webkit-scrollbar-track': {
                        backgroundColor: 'rgba(0,0,0,0.1)',
                        borderRadius: 4,
                      },
                      '&::-webkit-scrollbar-thumb': {
                        backgroundColor: 'rgba(0,0,0,0.3)',
                        borderRadius: 4,
                      },
                    }}>
                      {projects.completed.map((project) => (
                        <Card 
                          key={project.id} 
                          sx={{ 
                            minWidth: 320,
                            maxWidth: 320,
                            cursor: 'pointer',
                            opacity: 0.9,
                            transition: 'all 0.2s',
                            '&:hover': { 
                              opacity: 1,
                              transform: 'translateY(-2px)',
                              boxShadow: 4 
                            }
                          }}
                          onClick={() => handleProjectClick(project)}
                        >
                          <CardContent sx={{ pb: 1 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                              <Typography variant="h6" component="div" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                                {project.title}
                              </Typography>
                            </Box>
                            
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <BusinessIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                              <Typography variant="body2" color="text.secondary">
                                {project.client_name || 'No client specified'}
                              </Typography>
                            </Box>
                            
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                              <CheckCircleIcon sx={{ fontSize: 16, mr: 1, color: 'success.main' }} />
                              <Typography variant="body2" color="text.secondary">
                                Completed {dayjs(project.updated_at).format('MMM D, YYYY')}
                              </Typography>
                            </Box>
                            
                            <Chip 
                              label="Completed"
                              size="small"
                              color="success"
                              icon={<CheckCircleIcon />}
                            />
                          </CardContent>
                        </Card>
                      ))}
                    </Box>
                  )}
                </AccordionDetails>
              </Accordion>
            </Grid>
          </Grid>
        )}

        {/* Create Project Dialog */}
        <Dialog open={openCreateDialog} onClose={() => setOpenCreateDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 1 }}>
              <TextField
                fullWidth
                label="Project Title"
                value={newProject.title}
                onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                margin="normal"
                required
              />
              
              <TextField
                fullWidth
                label="Client Name"
                value={newProject.client_name}
                onChange={(e) => setNewProject({ ...newProject, client_name: e.target.value })}
                margin="normal"
              />
              
              <DatePicker
                label="Due Date"
                value={newProject.due_date}
                onChange={(newValue) => setNewProject({ ...newProject, due_date: newValue })}
                sx={{ width: '100%', mt: 2, mb: 1 }}
              />
              
              <TextField
                fullWidth
                select
                label="Manufacturing Stage"
                value={newProject.manufacture_stage || 'cnc'}
                onChange={(e) => setNewProject({ ...newProject, manufacture_stage: e.target.value })}
                margin="normal"
                SelectProps={{
                  native: true,
                }}
              >
                {manufacturingStages.map((stage) => (
                  <option key={stage.value} value={stage.value}>
                    {stage.label}
                  </option>
                ))}
              </TextField>
              
              <TextField
                fullWidth
                select
                label="Progress"
                value={newProject.progress || 'not_started'}
                onChange={(e) => setNewProject({ ...newProject, progress: e.target.value })}
                margin="normal"
                SelectProps={{
                  native: true,
                }}
              >
                {progressOptions.map((progress) => (
                  <option key={progress.value} value={progress.value}>
                    {progress.label}
                  </option>
                ))}
              </TextField>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenCreateDialog(false)}>Cancel</Button>
            <Button 
              onClick={handleCreateProject} 
              variant="contained"
              disabled={!newProject.title.trim() || loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Create Project'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
};

export default ProjectsTab;
