// import { useState, useEffect } from 'react';
// import {
//   Box,
//   Typography,
//   Card,
//   CardContent,
//   Button,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   Grid,
//   IconButton,
//   Menu,
//   MenuItem,
//   Chip,
//   Alert,
//   CircularProgress,
//   Paper,
//   Accordion,
//   AccordionSummary,
//   AccordionDetails,
//   CardActions,
//   Stack,
//   Divider,
//   Avatar,
//   InputAdornment
// } from '@mui/material';
// import {
//   Add as AddIcon,
//   ArrowBack as ArrowBackIcon,
//   MoreVert as MoreVertIcon,
//   ExpandMore as ExpandMoreIcon,
//   Build as BuildIcon,
//   CheckCircle as CheckCircleIcon,
//   Schedule as ScheduleIcon,
//   Edit as EditIcon,
//   CalendarToday as CalendarIcon,
//   Business as BusinessIcon,
//   Search as SearchIcon,
//   FiberManualRecord as DotIcon
// } from '@mui/icons-material';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import dayjs from 'dayjs';
// import { projectsAPI } from '../services/api';

// const ProjectsTab = () => {
//   const [projects, setProjects] = useState({
//     inProgress: [],
//     completed: []
//   });
//   const [selectedProject, setSelectedProject] = useState(null);
//   const [openCreateDialog, setOpenCreateDialog] = useState(false);
//   const [openEditDialog, setOpenEditDialog] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [contextMenu, setContextMenu] = useState(null);
//   const [selectedForContext, setSelectedForContext] = useState(null);
//   const [stageDropdown, setStageDropdown] = useState({ open: false, projectId: null, anchorEl: null });
//   const [progressDropdown, setProgressDropdown] = useState({ open: false, projectId: null, anchorEl: null });
//   const [searchTerm, setSearchTerm] = useState('');

//   const [newProject, setNewProject] = useState({
//     title: '',
//     client_name: '',
//     due_date: null,
//     id: null // Add id to track which project is being updated
//   });

//   const manufacturingStages = [
//     { value: 'cnc', label: 'CNC' },
//     { value: 'sanding', label: 'Sanding' },
//     { value: 'painting', label: 'Painting' },
//     { value: 'assembly', label: 'Assembly' },
//     { value: 'delivery', label: 'Delivery' },
//     { value: 'installation', label: 'Installation' },
//     { value: 'completed', label: 'Completed' }
//   ];

//   const progressOptions = [
//     { value: 'not_started', label: 'Not Started' },
//     { value: 'in_progress', label: 'In Progress' },
//     { value: 'completed', label: 'Completed' },
//     { value: 'delivered', label: 'Delivered' },
//     { value: 'cancelled', label: 'Cancelled' }
//   ];

//   useEffect(() => {
//     fetchProjects();
//   }, []);

//   const fetchProjects = async () => {
//     setLoading(true);
//     try {
//       const [inProgressRes, completedRes] = await Promise.all([
//         projectsAPI.getInProgress(),
//         projectsAPI.getCompleted()
//       ]);
      
//       setProjects({
//         inProgress: inProgressRes.data,
//         completed: completedRes.data
//       });
//     } catch (err) {
//       setError('Failed to fetch projects');
//       console.error('Error fetching projects:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCreateProject = async () => {
//     setLoading(true);
//     setError('');
    
//     try {
//       await projectsAPI.create(newProject);
//       setSuccess('Project created successfully!');
//       setOpenCreateDialog(false);
//       setNewProject({
//         title: '',
//         client_name: '',
//         due_date: null,
//         id: null
//       });
//       fetchProjects();
//     } catch (err) {
//       setError('Failed to create project');
//       console.error('Error creating project:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEditProject = async () => {
//     setLoading(true);
//     setError('');
    
//     try {
//       await projectsAPI.update(newProject.id, newProject);
//       setSuccess('Project updated successfully!');
//       setOpenEditDialog(false);
      
//       // Reset form
//       setNewProject({
//         title: '',
//         client_name: '',
//         due_date: null,
//         id: null
//       });
      
//       fetchProjects();
//       const updatedProject = await projectsAPI.detail(newProject.id);
//       setSelectedProject(updatedProject.data);
//     } catch (err) {
//       setError('Failed to update project');
//       console.error('Error updating project:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDeleteProject = async (projectId) => {
//     setLoading(true);
//     setError('');
    
//     try {
//       await projectsAPI.delete(projectId);
//       setSuccess('Project deleted successfully!');
//       fetchProjects();
//       if (selectedProject && selectedProject.id === projectId) {
//         setSelectedProject(null);
//       }
//     } catch (err) {
//       setError('Failed to delete project');
//       console.error('Error deleting project:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCompleteProject = async (projectId) => {
//     setLoading(true);
//     setError('');
    
//     try {
//       await projectsAPI.complete(projectId);
//       setSuccess('Project marked as completed!');
//       fetchProjects();
//       if (selectedProject && selectedProject.id === projectId) {
//         const updatedProject = await projectsAPI.detail(projectId);
//         setSelectedProject(updatedProject.data);
//       }
//     } catch (err) {
//       setError('Failed to complete project');
//       console.error('Error completing project:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleStageUpdate = async (projectId, newStage) => {
//     try {
//       await projectsAPI.update(projectId, { manufacture_stage: newStage });
//       setSuccess('Manufacturing stage updated successfully!');
//       fetchProjects();
//       if (selectedProject && selectedProject.id === projectId) {
//         const updatedProject = await projectsAPI.detail(projectId);
//         setSelectedProject(updatedProject.data);
//       }
//     } catch (err) {
//       setError('Failed to update manufacturing stage');
//       console.error('Error updating stage:', err);
//     }
//     setStageDropdown({ open: false, projectId: null, anchorEl: null });
//   };

//   const handleProgressUpdate = async (projectId, newProgress) => {
//     try {
//       await projectsAPI.update(projectId, { progress: newProgress });
//       setSuccess('Progress updated successfully!');
//       fetchProjects();
//       if (selectedProject && selectedProject.id === projectId) {
//         const updatedProject = await projectsAPI.detail(projectId);
//         setSelectedProject(updatedProject.data);
//       }
//     } catch (err) {
//       setError('Failed to update progress');
//       console.error('Error updating progress:', err);
//     }
//     setProgressDropdown({ open: false, projectId: null, anchorEl: null });
//   };

//   const handleProjectClick = async (project) => {
//     try {
//       const response = await projectsAPI.detail(project.id);
//       setSelectedProject(response.data);
//     } catch (err) {
//       setError('Failed to fetch project details');
//       console.error('Error fetching project details:', err);
//     }
//   };

//   const handleRightClick = (event, project) => {
//     event.preventDefault();
//     // Only allow context menu in detail view
//     if (selectedProject && selectedProject.id === project.id) {
//       setSelectedForContext(project);
//       setContextMenu(
//         contextMenu === null
//           ? { mouseX: event.clientX + 2, mouseY: event.clientY - 6 }
//           : null
//       );
//     }
//   };

//   const handleContextMenuClose = () => {
//     setContextMenu(null);
//     setSelectedForContext(null);
//   };

//   const openEditDialogHandler = () => {
//     setNewProject({
//       title: selectedProject.title,
//       client_name: selectedProject.client_name,
//       due_date: selectedProject.due_date ? dayjs(selectedProject.due_date) : null,
//       id: selectedProject.id
//     });
//     setOpenEditDialog(true);
//   };

//   const getStageColor = (stage) => {
//     const colors = {
//       cnc: 'info',
//       sanding: 'warning',
//       painting: 'secondary',
//       assembly: 'primary',
//       delivery: 'success',
//       installation: 'default',
//       completed: 'success'
//     };
//     return colors[stage] || 'default';
//   };

//   const getProgressColor = (progress) => {
//     const colors = {
//       not_started: 'default',
//       in_progress: 'info',
//       completed: 'success',
//       delivered: 'success',
//       cancelled: 'error'
//     };
//     return colors[progress] || 'default';
//   };

//   if (selectedProject) {
//     return (
//       <LocalizationProvider dateAdapter={AdapterDayjs}>
//         <Box>
//           <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
//             <IconButton onClick={() => setSelectedProject(null)} sx={{ mr: 2 }}>
//               <ArrowBackIcon />
//             </IconButton>
//             <Typography variant="h4" sx={{ flexGrow: 1 }}>
//               {selectedProject.title}
//             </Typography>
//             <IconButton 
//               onClick={(e) => {
//                 setSelectedForContext(selectedProject);
//                 setContextMenu(
//                   contextMenu === null
//                     ? { mouseX: e.clientX + 2, mouseY: e.clientY - 6 }
//                     : null
//                 );
//               }}
//             >
//               <MoreVertIcon />
//             </IconButton>
//           </Box>

//           <Card>
//             <CardContent>
//               <Grid container spacing={3}>
//                 <Grid item xs={12} md={6}>
//                   <Typography variant="h6" gutterBottom>
//                     Project Information
//                   </Typography>
//                   <Typography variant="body1" paragraph>
//                     <strong>Client:</strong> {selectedProject.client_name || 'Not specified'}
//                   </Typography>
//                   <Typography variant="body1" paragraph>
//                     <strong>Due Date:</strong> {selectedProject.due_date ? dayjs(selectedProject.due_date).format('MMM D, YYYY') : 'Not set'}
//                   </Typography>
//                   <Typography variant="body1" paragraph>
//                     <strong>Created:</strong> {dayjs(selectedProject.created_at).format('MMM D, YYYY h:mm A')}
//                   </Typography>
//                   <Typography variant="body1" paragraph>
//                     <strong>Last Updated:</strong> {dayjs(selectedProject.updated_at).format('MMM D, YYYY h:mm A')}
//                     {selectedProject.updated_by && (
//                       <span style={{ color: '#666', fontSize: '0.9em' }}>
//                         {' by '}
//                         {selectedProject.updated_by.first_name && selectedProject.updated_by.last_name 
//                           ? `${selectedProject.updated_by.first_name} ${selectedProject.updated_by.last_name}`
//                           : selectedProject.updated_by.username
//                         }
//                       </span>
//                     )}
//                   </Typography>
//                 </Grid>
//                 <Grid item xs={12} md={6}>
//                   <Typography variant="h6" gutterBottom>
//                     Status
//                   </Typography>
//                   <Box sx={{ mb: 2 }}>
//                     <Chip 
//                       label={`Stage: ${manufacturingStages.find(s => s.value === selectedProject.manufacture_stage)?.label}`}
//                       color={getStageColor(selectedProject.manufacture_stage)}
//                       sx={{ mr: 1, mb: 1, cursor: 'pointer' }}
//                       clickable
//                       onClick={(e) => setStageDropdown({ open: true, projectId: selectedProject.id, anchorEl: e.currentTarget })}
//                     />
//                     <Chip 
//                       label={`Progress: ${progressOptions.find(p => p.value === selectedProject.progress)?.label}`}
//                       color={getProgressColor(selectedProject.progress)}
//                       sx={{ mr: 1, mb: 1, cursor: 'pointer' }}
//                       clickable
//                       onClick={(e) => setProgressDropdown({ open: true, projectId: selectedProject.id, anchorEl: e.currentTarget })}
//                     />
//                     {selectedProject.is_completed && (
//                       <Chip 
//                         label="Completed"
//                         color="success"
//                         icon={<CheckCircleIcon />}
//                         sx={{ mb: 1 }}
//                       />
//                     )}
//                   </Box>
                  
//                   <Box sx={{ display: 'flex', gap: 2 }}>
//                     <Button
//                       variant="outlined"
//                       onClick={openEditDialogHandler}
//                       sx={{ mt: 2 }}
//                     >
//                       Edit Project
//                     </Button>
                    
//                     {!selectedProject.is_completed && (
//                       <Button
//                         variant="contained"
//                         color="success"
//                         onClick={() => handleCompleteProject(selectedProject.id)}
//                         disabled={loading}
//                         startIcon={<CheckCircleIcon />}
//                         sx={{ mt: 2 }}
//                       >
//                         Mark as Completed
//                       </Button>
//                     )}
//                   </Box>
//                 </Grid>
//               </Grid>
//             </CardContent>
//           </Card>

//           {/* Stage Dropdown Menu - Only in detail view */}
//           <Menu
//             open={stageDropdown.open}
//             onClose={() => setStageDropdown({ open: false, projectId: null, anchorEl: null })}
//             anchorEl={stageDropdown.anchorEl}
//           >
//             {manufacturingStages.map((stage) => (
//               <MenuItem 
//                 key={stage.value}
//                 onClick={() => handleStageUpdate(stageDropdown.projectId, stage.value)}
//               >
//                 {stage.label}
//               </MenuItem>
//             ))}
//           </Menu>

//           {/* Progress Dropdown Menu - Only in detail view */}
//           <Menu
//             open={progressDropdown.open}
//             onClose={() => setProgressDropdown({ open: false, projectId: null, anchorEl: null })}
//             anchorEl={progressDropdown.anchorEl}
//           >
//             {progressOptions.map((progress) => (
//               <MenuItem 
//                 key={progress.value}
//                 onClick={() => handleProgressUpdate(progressDropdown.projectId, progress.value)}
//               >
//                 {progress.label}
//               </MenuItem>
//             ))}
//           </Menu>

//           {/* Context Menu - Only available in detail view */}
//           <Menu
//             open={contextMenu !== null}
//             onClose={handleContextMenuClose}
//             anchorReference="anchorPosition"
//             anchorPosition={
//               contextMenu !== null
//                 ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
//                 : undefined
//             }
//           >
//             <MenuItem onClick={openEditDialogHandler}>
//               <EditIcon sx={{ mr: 1 }} />
//               Edit Project
//             </MenuItem>
//             <MenuItem 
//               onClick={() => {
//                 handleDeleteProject(selectedForContext.id);
//                 handleContextMenuClose();
//               }}
//               sx={{ color: 'error.main' }}
//             >
//               Delete Project
//             </MenuItem>
//             {selectedForContext && !selectedForContext.is_completed && (
//               <MenuItem 
//                 onClick={() => {
//                   handleCompleteProject(selectedForContext.id);
//                   handleContextMenuClose();
//                 }}
//                 sx={{ color: 'success.main' }}
//               >
//                 Mark as Completed
//               </MenuItem>
//             )}
//           </Menu>

//           {/* Edit Project Dialog - Only title, client, and due date */}
//           <Dialog open={openEditDialog} onClose={() => {
//             setOpenEditDialog(false);
//             setNewProject({
//               title: '',
//               client_name: '',
//               due_date: null,
//               id: null
//             });
//           }} maxWidth="sm" fullWidth>
//             <DialogTitle>Edit Project Details</DialogTitle>
//             <DialogContent>
//               <Box sx={{ pt: 1 }}>
//                 <TextField
//                   fullWidth
//                   label="Project Title"
//                   value={newProject.title}
//                   onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
//                   margin="normal"
//                   required
//                 />
                
//                 <TextField
//                   fullWidth
//                   label="Client Name"
//                   value={newProject.client_name}
//                   onChange={(e) => setNewProject({ ...newProject, client_name: e.target.value })}
//                   margin="normal"
//                 />
                
//                 <DatePicker
//                   label="Due Date"
//                   value={newProject.due_date}
//                   onChange={(newValue) => setNewProject({ ...newProject, due_date: newValue })}
//                   sx={{ width: '100%', mt: 2, mb: 1 }}
//                 />
                
//                 <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
//                   Note: Use the clickable chips above to change manufacturing stage and progress.
//                 </Typography>
//               </Box>
//             </DialogContent>
//             <DialogActions>
//               <Button onClick={() => {
//                 setOpenEditDialog(false);
//                 setNewProject({
//                   title: '',
//                   client_name: '',
//                   due_date: null,
//                   id: null
//                 });
//               }}>Cancel</Button>
//               <Button 
//                 onClick={handleEditProject} 
//                 variant="contained"
//                 disabled={!newProject.title.trim() || loading}
//               >
//                 {loading ? <CircularProgress size={24} /> : 'Save Changes'}
//               </Button>
//             </DialogActions>
//           </Dialog>
//         </Box>
//       </LocalizationProvider>
//     );
//   }

//   // Filter projects based on search term
//   const filteredInProgress = projects.inProgress.filter(project =>
//     project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     project.client_name?.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const filteredCompleted = projects.completed.filter(project =>
//     project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     project.client_name?.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <LocalizationProvider dateAdapter={AdapterDayjs}>
//       <Box sx={{ maxWidth: '100%', mx: 'auto' }}>
//         {/* Header */}
//         <Box sx={{ mb: 4 }}>
//           <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
//             <Typography variant="h4" sx={{ fontWeight: 600, color: 'text.primary' }}>
//               Projects
//             </Typography>
//             <Button
//               variant="contained"
//               startIcon={<AddIcon />}
//               onClick={() => setOpenCreateDialog(true)}
//               sx={{
//                 borderRadius: 2,
//                 textTransform: 'none',
//                 fontWeight: 500,
//                 px: 3,
//                 py: 1
//               }}
//             >
//               New Project
//             </Button>
//           </Box>

//           {/* Search Bar */}
//           <TextField
//             fullWidth
//             placeholder="Search projects..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             InputProps={{
//               startAdornment: (
//                 <InputAdornment position="start">
//                   <SearchIcon sx={{ color: 'text.secondary' }} />
//                 </InputAdornment>
//               ),
//             }}
//             sx={{
//               maxWidth: 400,
//               '& .MuiOutlinedInput-root': {
//                 borderRadius: 2,
//                 backgroundColor: 'background.paper',
//               }
//             }}
//           />
//         </Box>

//         {/* Alerts */}
//         {error && (
//           <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setError('')}>
//             {error}
//           </Alert>
//         )}

//         {success && (
//           <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setSuccess('')}>
//             {success}
//           </Alert>
//         )}

//         {loading && !openCreateDialog && !openEditDialog ? (
//           <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
//             <CircularProgress />
//           </Box>
//         ) : (
//           <Box sx={{ space: 4 }}>
//             {/* In Progress Projects */}
//             <Box sx={{ mb: 6 }}>
//               <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
//                 <DotIcon sx={{ color: 'warning.main', mr: 1, fontSize: 12 }} />
//                 <Typography variant="h6" sx={{ fontWeight: 600 }}>
//                   In Progress
//                 </Typography>
//                 <Chip 
//                   label={filteredInProgress.length} 
//                   size="small" 
//                   sx={{ ml: 2, backgroundColor: 'background.paper' }}
//                 />
//               </Box>
              
//               {filteredInProgress.length === 0 ? (
//                 <Paper sx={{ 
//                   p: 6, 
//                   textAlign: 'center', 
//                   borderRadius: 2,
//                   border: '1px dashed',
//                   borderColor: 'divider',
//                   backgroundColor: 'background.paper'
//                 }}>
//                   <Typography color="text.secondary">
//                     {searchTerm ? 'No projects match your search' : 'No projects in progress'}
//                   </Typography>
//                 </Paper>
//               ) : (
//                 <Grid container spacing={3}>
//                   {filteredInProgress.map((project) => (
//                     <Grid item xs={12} sm={6} md={4} key={project.id}>
//                       <Card 
//                         sx={{ 
//                           cursor: 'pointer',
//                           borderRadius: 2,
//                           border: '1px solid',
//                           borderColor: 'divider',
//                           transition: 'all 0.2s ease-in-out',
//                           '&:hover': { 
//                             transform: 'translateY(-2px)',
//                             boxShadow: 3,
//                             borderColor: 'primary.main'
//                           }
//                         }}
//                         onClick={() => handleProjectClick(project)}
//                       >
//                         <CardContent sx={{ p: 3 }}>
//                           <Typography variant="h6" sx={{ 
//                             fontWeight: 600, 
//                             mb: 2,
//                             overflow: 'hidden',
//                             textOverflow: 'ellipsis',
//                             whiteSpace: 'nowrap'
//                           }}>
//                             {project.title}
//                           </Typography>
                          
//                           <Box sx={{ mb: 2 }}>
//                             <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
//                               {project.client_name || 'No client specified'}
//                             </Typography>
//                             <Typography variant="caption" color="text.secondary">
//                               Due: {project.due_date ? dayjs(project.due_date).format('MMM D, YYYY') : 'Not set'}
//                             </Typography>
//                           </Box>
                          
//                           <Divider sx={{ my: 2 }} />
                          
//                           <Stack direction="row" spacing={1}>
//                             <Chip 
//                               label={manufacturingStages.find(s => s.value === project.manufacture_stage)?.label || 'Unknown'}
//                               size="small"
//                               variant="outlined"
//                               sx={{ fontSize: '0.75rem' }}
//                             />
//                             <Chip 
//                               label={progressOptions.find(p => p.value === project.progress)?.label || 'Unknown'}
//                               size="small"
//                               variant="outlined"
//                               sx={{ fontSize: '0.75rem' }}
//                             />
//                           </Stack>
//                         </CardContent>
//                       </Card>
//                     </Grid>
//                   ))}
//                 </Grid>
//               )}
//             </Box>

//             {/* Completed Projects */}
//             <Box>
//               <Accordion 
//                 sx={{ 
//                   borderRadius: 2,
//                   border: '1px solid',
//                   borderColor: 'divider',
//                   '&:before': { display: 'none' },
//                   boxShadow: 'none'
//                 }}
//               >
//                 <AccordionSummary
//                   expandIcon={<ExpandMoreIcon />}
//                   sx={{ 
//                     '& .MuiAccordionSummary-content': { 
//                       alignItems: 'center' 
//                     }
//                   }}
//                 >
//                   <DotIcon sx={{ color: 'success.main', mr: 1, fontSize: 12 }} />
//                   <Typography variant="h6" sx={{ fontWeight: 600 }}>
//                     Completed
//                   </Typography>
//                   <Chip 
//                     label={filteredCompleted.length} 
//                     size="small" 
//                     sx={{ ml: 2, backgroundColor: 'background.paper' }}
//                   />
//                 </AccordionSummary>
//                 <AccordionDetails sx={{ pt: 0 }}>
//                   {filteredCompleted.length === 0 ? (
//                     <Box sx={{ 
//                       p: 4, 
//                       textAlign: 'center',
//                       border: '1px dashed',
//                       borderColor: 'divider',
//                       borderRadius: 2,
//                       backgroundColor: 'background.paper'
//                     }}>
//                       <Typography color="text.secondary">
//                         {searchTerm ? 'No completed projects match your search' : 'No completed projects'}
//                       </Typography>
//                     </Box>
//                   ) : (
//                     <Grid container spacing={3}>
//                       {filteredCompleted.map((project) => (
//                         <Grid item xs={12} sm={6} md={4} key={project.id}>
//                           <Card 
//                             sx={{ 
//                               cursor: 'pointer',
//                               borderRadius: 2,
//                               border: '1px solid',
//                               borderColor: 'divider',
//                               transition: 'all 0.2s ease-in-out',
//                               opacity: 0.9,
//                               '&:hover': { 
//                                 transform: 'translateY(-2px)',
//                                 boxShadow: 2,
//                                 opacity: 1,
//                                 borderColor: 'success.main'
//                               }
//                             }}
//                             onClick={() => handleProjectClick(project)}
//                           >
//                             <CardContent sx={{ p: 3 }}>
//                               <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
//                                 <Typography variant="h6" sx={{ 
//                                   fontWeight: 600, 
//                                   flexGrow: 1,
//                                   overflow: 'hidden',
//                                   textOverflow: 'ellipsis',
//                                   whiteSpace: 'nowrap'
//                                 }}>
//                                   {project.title}
//                                 </Typography>
//                                 <CheckCircleIcon sx={{ color: 'success.main', ml: 1, fontSize: 20 }} />
//                               </Box>
                              
//                               <Box sx={{ mb: 2 }}>
//                                 <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
//                                   {project.client_name || 'No client specified'}
//                                 </Typography>
//                                 <Typography variant="caption" color="text.secondary">
//                                   Completed: {project.completion_date ? dayjs(project.completion_date).format('MMM D, YYYY') : 'Recently'}
//                                 </Typography>
//                               </Box>
                              
//                               <Divider sx={{ my: 2 }} />
                              
//                               <Chip 
//                                 label="Completed"
//                                 size="small"
//                                 color="success"
//                                 variant="outlined"
//                                 sx={{ fontSize: '0.75rem' }}
//                               />
//                             </CardContent>
//                           </Card>
//                         </Grid>
//                       ))}
//                     </Grid>
//                   )}
//                 </AccordionDetails>
//               </Accordion>
//             </Box>
//           </Box>
//         )}
//                             cursor: 'pointer',
//                             opacity: 0.9,
//                             transition: 'all 0.2s',
//                             '&:hover': { 
//                               opacity: 1,
//                               transform: 'translateY(-2px)',
//                               boxShadow: 4 
//                             }
//                           }}
//                           onClick={() => handleProjectClick(project)}
//                         >
//                           <CardContent sx={{ pb: 1 }}>
//                             <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
//                               <Typography variant="h6" component="div" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
//                                 {project.title}
//                               </Typography>
//                             </Box>
                            
//                             <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
//                               <BusinessIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
//                               <Typography variant="body2" color="text.secondary">
//                                 {project.client_name || 'No client specified'}
//                               </Typography>
//                             </Box>
                            
//                             <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
//                               <CheckCircleIcon sx={{ fontSize: 16, mr: 1, color: 'success.main' }} />
//                               <Typography variant="body2" color="text.secondary">
//                                 Completed {dayjs(project.updated_at).format('MMM D, YYYY')}
//                               </Typography>
//                             </Box>
                            
//                             <Chip 
//                               label="Completed"
//                               size="small"
//                               color="success"
//                               icon={<CheckCircleIcon />}
//                             />
//                           </CardContent>
//                         </Card>
//                       ))}
//                     </Box>
//                   )}
//                 </AccordionDetails>
//               </Accordion>
//             </Grid>
//           </Grid>
//         )}

//         {/* Create Project Dialog */}
//         <Dialog open={openCreateDialog} onClose={() => setOpenCreateDialog(false)} maxWidth="sm" fullWidth>
//           <DialogTitle>Create New Project</DialogTitle>
//           <DialogContent>
//             <Box sx={{ pt: 1 }}>
//               <TextField
//                 fullWidth
//                 label="Project Title"
//                 value={newProject.title}
//                 onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
//                 margin="normal"
//                 required
//               />
              
//               <TextField
//                 fullWidth
//                 label="Client Name"
//                 value={newProject.client_name}
//                 onChange={(e) => setNewProject({ ...newProject, client_name: e.target.value })}
//                 margin="normal"
//               />
              
//               <DatePicker
//                 label="Due Date"
//                 value={newProject.due_date}
//                 onChange={(newValue) => setNewProject({ ...newProject, due_date: newValue })}
//                 sx={{ width: '100%', mt: 2, mb: 1 }}
//               />
              
//               <TextField
//                 fullWidth
//                 select
//                 label="Manufacturing Stage"
//                 value={newProject.manufacture_stage || 'cnc'}
//                 onChange={(e) => setNewProject({ ...newProject, manufacture_stage: e.target.value })}
//                 margin="normal"
//                 SelectProps={{
//                   native: true,
//                 }}
//               >
//                 {manufacturingStages.map((stage) => (
//                   <option key={stage.value} value={stage.value}>
//                     {stage.label}
//                   </option>
//                 ))}
//               </TextField>
              
//               <TextField
//                 fullWidth
//                 select
//                 label="Progress"
//                 value={newProject.progress || 'not_started'}
//                 onChange={(e) => setNewProject({ ...newProject, progress: e.target.value })}
//                 margin="normal"
//                 SelectProps={{
//                   native: true,
//                 }}
//               >
//                 {progressOptions.map((progress) => (
//                   <option key={progress.value} value={progress.value}>
//                     {progress.label}
//                   </option>
//                 ))}
//               </TextField>
//             </Box>
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={() => setOpenCreateDialog(false)}>Cancel</Button>
//             <Button 
//               onClick={handleCreateProject} 
//               variant="contained"
//               disabled={!newProject.title.trim() || loading}
//             >
//               {loading ? <CircularProgress size={24} /> : 'Create Project'}
//             </Button>
//           </DialogActions>
//         </Dialog>
//       </Box>
//     </LocalizationProvider>
//   );
// };

// export default ProjectsTab;
