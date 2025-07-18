import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  CardHeader,
  Button,
  Chip,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  Grid
} from '@mui/material';
import {
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Person as PersonIcon,
  Flag as FlagIcon
} from '@mui/icons-material';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const KanbanTab = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    assignee: '',
    priority: 'medium',
    column: 'todo'
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Mock data for kanban board
  const [columns, setColumns] = useState({
    todo: {
      id: 'todo',
      title: 'To Do',
      color: '#e3f2fd',
      tasks: [
        {
          id: 'task-1',
          title: 'Design new product layout',
          description: 'Create wireframes and mockups for the new product page',
          assignee: 'John Doe',
          priority: 'high',
          dueDate: '2025-07-15'
        },
        {
          id: 'task-2',
          title: 'Update inventory system',
          description: 'Implement new barcode scanning functionality',
          assignee: 'Jane Smith',
          priority: 'medium',
          dueDate: '2025-07-20'
        }
      ]
    },
    inprogress: {
      id: 'inprogress',
      title: 'In Progress',
      color: '#fff3e0',
      tasks: [
        {
          id: 'task-3',
          title: 'Manufacturing process optimization',
          description: 'Analyze current workflow and identify bottlenecks',
          assignee: 'Mike Johnson',
          priority: 'high',
          dueDate: '2025-07-12'
        }
      ]
    },
    review: {
      id: 'review',
      title: 'Review',
      color: '#f3e5f5',
      tasks: [
        {
          id: 'task-4',
          title: 'Quality control checklist',
          description: 'Review and update QC procedures for new products',
          assignee: 'Sarah Wilson',
          priority: 'low',
          dueDate: '2025-07-18'
        }
      ]
    },
    done: {
      id: 'done',
      title: 'Done',
      color: '#e8f5e8',
      tasks: [
        {
          id: 'task-5',
          title: 'Employee onboarding guide',
          description: 'Create comprehensive guide for new employees',
          assignee: 'John Doe',
          priority: 'medium',
          dueDate: '2025-07-08'
        }
      ]
    }
  });

  function handleDragEnd(event) {
    const { active, over } = event;

    if (active.id !== over?.id) {
      // Find source and destination columns
      let sourceColumnId = null;
      let destColumnId = null;
      let sourceIndex = -1;
      let destIndex = -1;

      // Find which columns contain the active and over items
      Object.entries(columns).forEach(([columnId, column]) => {
        const activeIndex = column.tasks.findIndex(task => task.id === active.id);
        if (activeIndex !== -1) {
          sourceColumnId = columnId;
          sourceIndex = activeIndex;
        }
        
        if (over) {
          const overIndex = column.tasks.findIndex(task => task.id === over.id);
          if (overIndex !== -1) {
            destColumnId = columnId;
            destIndex = overIndex;
          }
        }
      });

      if (sourceColumnId && destColumnId) {
        const sourceColumn = columns[sourceColumnId];
        const destColumn = columns[destColumnId];

        if (sourceColumnId === destColumnId) {
          // Reordering within the same column
          const newTasks = arrayMove(sourceColumn.tasks, sourceIndex, destIndex);
          setColumns({
            ...columns,
            [sourceColumnId]: {
              ...sourceColumn,
              tasks: newTasks
            }
          });
        } else {
          // Moving between different columns
          const sourceTasks = [...sourceColumn.tasks];
          const destTasks = [...destColumn.tasks];
          
          const [movedTask] = sourceTasks.splice(sourceIndex, 1);
          destTasks.splice(destIndex, 0, movedTask);

          setColumns({
            ...columns,
            [sourceColumnId]: {
              ...sourceColumn,
              tasks: sourceTasks
            },
            [destColumnId]: {
              ...destColumn,
              tasks: destTasks
            }
          });
        }
      }
    }
  }

  const handleMenuClick = (event, task) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    // TODO: Implement menu actions for task
    console.log('Task menu clicked:', task);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleAddTask = () => {
    setOpenDialog(true);
  };

  const handleCreateTask = () => {
    const taskId = `task-${Date.now()}`;
    const column = columns[newTask.column];
    
    const updatedColumn = {
      ...column,
      tasks: [...column.tasks, {
        id: taskId,
        title: newTask.title,
        description: newTask.description,
        assignee: newTask.assignee,
        priority: newTask.priority,
        dueDate: new Date().toISOString().split('T')[0]
      }]
    };

    setColumns({
      ...columns,
      [newTask.column]: updatedColumn
    });

    setNewTask({
      title: '',
      description: '',
      assignee: '',
      priority: 'medium',
      column: 'todo'
    });
    setOpenDialog(false);
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'error',
      medium: 'warning',
      low: 'info'
    };
    return colors[priority] || 'default';
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('');
  };

  const SortableTask = ({ task }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id: task.id });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.5 : 1,
    };

    return (
      <Card
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        sx={{
          mb: 1,
          cursor: 'grab',
          '&:active': {
            cursor: 'grabbing'
          }
        }}
      >
        <CardHeader
          title={
            <Typography variant="subtitle2" sx={{ fontSize: '0.9rem' }}>
              {task.title}
            </Typography>
          }
          action={
            <IconButton 
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleMenuClick(e, task);
              }}
            >
              <MoreVertIcon fontSize="small" />
            </IconButton>
          }
          sx={{ pb: 1 }}
        />
        <CardContent sx={{ pt: 0 }}>
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ mb: 2, fontSize: '0.8rem' }}
          >
            {task.description}
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar sx={{ width: 24, height: 24, fontSize: '0.7rem' }}>
                {getInitials(task.assignee)}
              </Avatar>
              <Chip
                icon={<FlagIcon />}
                label={task.priority}
                size="small"
                color={getPriorityColor(task.priority)}
                variant="outlined"
                sx={{ fontSize: '0.7rem', height: 20 }}
              />
            </Box>
            
            <Typography variant="caption" color="text.secondary">
              {new Date(task.dueDate).toLocaleDateString()}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  };

  return (
    <Box sx={{ p: 3, height: 'calc(100vh - 200px)', overflow: 'hidden' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Workspace
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddTask}
        >
          Add Task
        </Button>
      </Box>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <Grid container spacing={2} sx={{ height: '100%' }}>
          {Object.values(columns).map((column) => (
            <Grid item xs={12} sm={6} md={3} key={column.id}>
              <Paper 
                sx={{ 
                  height: '100%',
                  backgroundColor: column.color,
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                  <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {column.title}
                    <Chip 
                      label={column.tasks.length} 
                      size="small" 
                      color="primary" 
                      variant="outlined"
                    />
                  </Typography>
                </Box>
                
                <SortableContext
                  items={column.tasks.map(task => task.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <Box
                    sx={{
                      flex: 1,
                      p: 1,
                      minHeight: 200,
                      overflow: 'auto'
                    }}
                  >
                    {column.tasks.map((task) => (
                      <SortableTask key={task.id} task={task} />
                    ))}
                  </Box>
                </SortableContext>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </DndContext>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>Edit Task</MenuItem>
        <MenuItem onClick={handleMenuClose}>Assign To</MenuItem>
        <MenuItem onClick={handleMenuClose} sx={{ color: 'error.main' }}>
          Delete Task
        </MenuItem>
      </Menu>

      {/* Add Task Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Task</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField
              label="Task Title"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              fullWidth
              required
            />
            
            <TextField
              label="Description"
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              fullWidth
              multiline
              rows={3}
            />
            
            <TextField
              label="Assignee"
              value={newTask.assignee}
              onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })}
              fullWidth
            />
            
            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                value={newTask.priority}
                label="Priority"
                onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl fullWidth>
              <InputLabel>Column</InputLabel>
              <Select
                value={newTask.column}
                label="Column"
                onChange={(e) => setNewTask({ ...newTask, column: e.target.value })}
              >
                <MenuItem value="todo">To Do</MenuItem>
                <MenuItem value="inprogress">In Progress</MenuItem>
                <MenuItem value="review">Review</MenuItem>
                <MenuItem value="done">Done</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleCreateTask} 
            variant="contained"
            disabled={!newTask.title.trim()}
          >
            Create Task
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default KanbanTab;
