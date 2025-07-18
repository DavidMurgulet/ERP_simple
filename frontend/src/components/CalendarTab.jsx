import { useState } from 'react';
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
  Grid,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Event as EventIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import dayjs from 'dayjs';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const CalendarTab = () => {
  const [events, setEvents] = useState([
    {
      id: 1,
      title: 'Team Meeting',
      start: moment().add(1, 'day').hour(10).minute(0).toDate(),
      end: moment().add(1, 'day').hour(11).minute(0).toDate(),
      description: 'Weekly team sync',
      type: 'meeting'
    },
    {
      id: 2,
      title: 'Project Deadline',
      start: moment().add(3, 'day').hour(9).minute(0).toDate(),
      end: moment().add(3, 'day').hour(17).minute(0).toDate(),
      description: 'Submit final deliverables',
      type: 'deadline'
    },
    {
      id: 3,
      title: 'Client Call',
      start: moment().add(5, 'day').hour(14).minute(0).toDate(),
      end: moment().add(5, 'day').hour(15).minute(0).toDate(),
      description: 'Quarterly review with client',
      type: 'call'
    }
  ]);
  
  const [openDialog, setOpenDialog] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    start: dayjs(),
    end: dayjs().add(1, 'hour'),
    type: 'meeting'
  });

  const handleOpenDialog = (event = null) => {
    if (event) {
      setEditingEvent(event);
      setNewEvent({
        title: event.title,
        description: event.description,
        start: dayjs(event.start),
        end: dayjs(event.end),
        type: event.type
      });
    } else {
      setEditingEvent(null);
      setNewEvent({
        title: '',
        description: '',
        start: selectedDate.hour(9).minute(0),
        end: selectedDate.hour(10).minute(0),
        type: 'meeting'
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingEvent(null);
    setNewEvent({
      title: '',
      description: '',
      start: dayjs(),
      end: dayjs().add(1, 'hour'),
      type: 'meeting'
    });
  };

  const handleSaveEvent = () => {
    const eventData = {
      title: newEvent.title,
      description: newEvent.description,
      start: newEvent.start.toDate(),
      end: newEvent.end.toDate(),
      type: newEvent.type
    };

    if (editingEvent) {
      setEvents(events.map(event => 
        event.id === editingEvent.id 
          ? { ...eventData, id: editingEvent.id }
          : event
      ));
    } else {
      setEvents([...events, { ...eventData, id: Date.now() }]);
    }
    handleCloseDialog();
  };

  const handleDeleteEvent = (eventId) => {
    setEvents(events.filter(event => event.id !== eventId));
  };

  const handleSelectSlot = ({ start, end }) => {
    setSelectedDate(dayjs(start));
    setNewEvent({
      title: '',
      description: '',
      start: dayjs(start),
      end: dayjs(end),
      type: 'meeting'
    });
    setOpenDialog(true);
  };

  const handleSelectEvent = (event) => {
    handleOpenDialog(event);
  };

  const getEventTypeColor = (type) => {
    switch (type) {
      case 'meeting': return 'primary';
      case 'deadline': return 'error';
      case 'call': return 'success';
      default: return 'default';
    }
  };

  const eventStyleGetter = (event) => {
    let backgroundColor = '#3174ad';
    switch (event.type) {
      case 'meeting':
        backgroundColor = '#1976d2';
        break;
      case 'deadline':
        backgroundColor = '#d32f2f';
        break;
      case 'call':
        backgroundColor = '#2e7d32';
        break;
      default:
        backgroundColor = '#9e9e9e';
    }

    return {
      style: {
        backgroundColor,
        borderRadius: '4px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block'
      }
    };
  };

  const upcomingEvents = events
    .filter(event => moment(event.start).isAfter(moment(), 'day') || moment(event.start).isSame(moment(), 'day'))
    .sort((a, b) => moment(a.start).diff(moment(b.start)));

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" gutterBottom>
            Calendar
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Add Event
          </Button>
        </Box>

        <Grid container spacing={3}>
          {/* Main Calendar */}
          <Grid item xs={12} lg={8}>
            <Card>
              <CardContent>
                <Box sx={{ height: 600 }}>
                  <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: '100%' }}
                    onSelectSlot={handleSelectSlot}
                    onSelectEvent={handleSelectEvent}
                    selectable
                    eventPropGetter={eventStyleGetter}
                    views={['month', 'week', 'day', 'agenda']}
                    defaultView="month"
                    popup
                    tooltipAccessor="description"
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Upcoming Events Sidebar */}
          <Grid item xs={12} lg={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Upcoming Events
                </Typography>
                
                {upcomingEvents.length === 0 ? (
                  <Typography color="text.secondary">
                    No upcoming events
                  </Typography>
                ) : (
                  <List>
                    {upcomingEvents.slice(0, 5).map((event, index) => (
                      <div key={event.id}>
                        <ListItem sx={{ px: 0 }}>
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                {event.title}
                                <Chip 
                                  label={event.type} 
                                  size="small" 
                                  color={getEventTypeColor(event.type)}
                                />
                              </Box>
                            }
                            secondary={
                              <Box>
                                <Typography variant="body2" color="text.secondary">
                                  {moment(event.start).format('MMM D, YYYY h:mm A')}
                                </Typography>
                                <Typography variant="body2">
                                  {event.description}
                                </Typography>
                              </Box>
                            }
                          />
                          <ListItemSecondaryAction>
                            <IconButton 
                              edge="end" 
                              aria-label="edit"
                              onClick={() => handleOpenDialog(event)}
                              size="small"
                              sx={{ mr: 1 }}
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton 
                              edge="end" 
                              aria-label="delete"
                              onClick={() => handleDeleteEvent(event.id)}
                              size="small"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </ListItemSecondaryAction>
                        </ListItem>
                        {index < upcomingEvents.slice(0, 5).length - 1 && <Divider />}
                      </div>
                    ))}
                  </List>
                )}
              </CardContent>
            </Card>

            {/* Quick Date Picker */}
            <Card sx={{ mt: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <EventIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Quick Add Event
                </Typography>
                <DatePicker
                  label="Select Date"
                  value={selectedDate}
                  onChange={(newValue) => setSelectedDate(newValue)}
                  sx={{ width: '100%', mb: 2 }}
                />
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => handleOpenDialog()}
                >
                  Add Event for This Date
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Add/Edit Event Dialog */}
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>
            {editingEvent ? 'Edit Event' : 'Add New Event'}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 1 }}>
              <TextField
                fullWidth
                label="Event Title"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                margin="normal"
                required
              />
              
              <TextField
                fullWidth
                label="Description"
                value={newEvent.description}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                margin="normal"
                multiline
                rows={3}
              />
              
              <DatePicker
                label="Start Date"
                value={newEvent.start}
                onChange={(newValue) => setNewEvent({ 
                  ...newEvent, 
                  start: newValue,
                  end: newEvent.end.isBefore(newValue) ? newValue.add(1, 'hour') : newEvent.end
                })}
                sx={{ width: '100%', mt: 2, mb: 1 }}
              />

              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Start Time"
                    type="time"
                    value={newEvent.start.format('HH:mm')}
                    onChange={(e) => {
                      const [hours, minutes] = e.target.value.split(':');
                      setNewEvent({
                        ...newEvent,
                        start: newEvent.start.hour(parseInt(hours)).minute(parseInt(minutes))
                      });
                    }}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="End Time"
                    type="time"
                    value={newEvent.end.format('HH:mm')}
                    onChange={(e) => {
                      const [hours, minutes] = e.target.value.split(':');
                      setNewEvent({
                        ...newEvent,
                        end: newEvent.start.hour(parseInt(hours)).minute(parseInt(minutes))
                      });
                    }}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </Grid>
              
              <TextField
                fullWidth
                select
                label="Event Type"
                value={newEvent.type}
                onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
                margin="normal"
                SelectProps={{
                  native: true,
                }}
              >
                <option value="meeting">Meeting</option>
                <option value="deadline">Deadline</option>
                <option value="call">Call</option>
                <option value="other">Other</option>
              </TextField>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button 
              onClick={handleSaveEvent} 
              variant="contained"
              disabled={!newEvent.title.trim()}
            >
              {editingEvent ? 'Update' : 'Add'} Event
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
};

export default CalendarTab;
