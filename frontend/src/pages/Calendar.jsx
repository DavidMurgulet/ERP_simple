import { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  CircularProgress,
  Alert,
  Chip,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { calendarAPI } from '../services/api';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const CalendarView = () => {
  const [open, setOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_type: 'meeting',
    start_date: null,
    end_date: null,
    location: '',
  });
  const [error, setError] = useState('');

  const queryClient = useQueryClient();

  // Fetch events
  const { data: events = [], isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: () => calendarAPI.getEvents().then(res => res.data),
  });

  // Mutations
  const createEventMutation = useMutation({
    mutationFn: calendarAPI.createEvent,
    onSuccess: () => {
      queryClient.invalidateQueries(['events']);
      handleClose();
    },
    onError: (error) => {
      setError(error.response?.data?.message || 'Failed to create event');
    },
  });

  const updateEventMutation = useMutation({
    mutationFn: ({ id, ...data }) => calendarAPI.updateEvent(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['events']);
      handleClose();
    },
    onError: (error) => {
      setError(error.response?.data?.message || 'Failed to update event');
    },
  });

  const deleteEventMutation = useMutation({
    mutationFn: calendarAPI.deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries(['events']);
      handleClose();
    },
  });

  // Transform events for react-big-calendar
  const calendarEvents = events.map(event => ({
    id: event.id,
    title: event.title,
    start: new Date(event.start_date),
    end: new Date(event.end_date),
    resource: event,
  }));

  const handleSelectSlot = ({ start, end }) => {
    setSelectedEvent(null);
    setFormData({
      title: '',
      description: '',
      event_type: 'meeting',
      start_date: dayjs(start),
      end_date: dayjs(end),
      location: '',
    });
    setError('');
    setOpen(true);
  };

  const handleSelectEvent = (event) => {
    const eventData = event.resource;
    setSelectedEvent(eventData);
    setFormData({
      title: eventData.title,
      description: eventData.description || '',
      event_type: eventData.event_type,
      start_date: dayjs(eventData.start_date),
      end_date: dayjs(eventData.end_date),
      location: eventData.location || '',
    });
    setError('');
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedEvent(null);
    setError('');
  };

  const handleSubmit = () => {
    const eventData = {
      ...formData,
      start_date: formData.start_date.toISOString(),
      end_date: formData.end_date.toISOString(),
    };

    if (selectedEvent) {
      updateEventMutation.mutate({ id: selectedEvent.id, ...eventData });
    } else {
      createEventMutation.mutate(eventData);
    }
  };

  const handleDelete = () => {
    if (selectedEvent && window.confirm('Are you sure you want to delete this event?')) {
      deleteEventMutation.mutate(selectedEvent.id);
    }
  };

  const eventStyleGetter = (event) => {
    const eventType = event.resource.event_type;
    const colors = {
      meeting: { backgroundColor: '#3174ad', borderColor: '#3174ad' },
      task: { backgroundColor: '#f57c00', borderColor: '#f57c00' },
      holiday: { backgroundColor: '#388e3c', borderColor: '#388e3c' },
      deadline: { backgroundColor: '#d32f2f', borderColor: '#d32f2f' },
      other: { backgroundColor: '#7b1fa2', borderColor: '#7b1fa2' },
    };

    return {
      style: colors[eventType] || colors.other,
    };
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
          <Typography variant="h4">Calendar</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleSelectSlot({ 
              start: new Date(), 
              end: new Date(Date.now() + 60 * 60 * 1000) 
            })}
          >
            Add Event
          </Button>
        </Box>

        {/* Legend */}
        <Box display="flex" gap={2} mb={2} flexWrap="wrap">
          <Chip label="Meeting" sx={{ bgcolor: '#3174ad', color: 'white' }} size="small" />
          <Chip label="Task" sx={{ bgcolor: '#f57c00', color: 'white' }} size="small" />
          <Chip label="Holiday" sx={{ bgcolor: '#388e3c', color: 'white' }} size="small" />
          <Chip label="Deadline" sx={{ bgcolor: '#d32f2f', color: 'white' }} size="small" />
          <Chip label="Other" sx={{ bgcolor: '#7b1fa2', color: 'white' }} size="small" />
        </Box>

        <Paper sx={{ p: 2, height: 600 }}>
          <Calendar
            localizer={localizer}
            events={calendarEvents}
            startAccessor="start"
            endAccessor="end"
            onSelectSlot={handleSelectSlot}
            onSelectEvent={handleSelectEvent}
            selectable
            eventPropGetter={eventStyleGetter}
            views={['month', 'week', 'day', 'agenda']}
            defaultView="month"
          />
        </Paper>

        {/* Event Dialog */}
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
          <DialogTitle>
            {selectedEvent ? 'Edit Event' : 'Create New Event'}
          </DialogTitle>

          <DialogContent>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <TextField
              fullWidth
              label="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              margin="normal"
              required
            />

            <TextField
              fullWidth
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              margin="normal"
              multiline
              rows={3}
            />

            <TextField
              fullWidth
              select
              label="Event Type"
              value={formData.event_type}
              onChange={(e) => setFormData({ ...formData, event_type: e.target.value })}
              margin="normal"
            >
              <MenuItem value="meeting">Meeting</MenuItem>
              <MenuItem value="task">Task</MenuItem>
              <MenuItem value="holiday">Holiday</MenuItem>
              <MenuItem value="deadline">Deadline</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </TextField>

            <DateTimePicker
              label="Start Date & Time"
              value={formData.start_date}
              onChange={(date) => setFormData({ ...formData, start_date: date })}
              renderInput={(params) => (
                <TextField {...params} fullWidth margin="normal" />
              )}
            />

            <DateTimePicker
              label="End Date & Time"
              value={formData.end_date}
              onChange={(date) => setFormData({ ...formData, end_date: date })}
              renderInput={(params) => (
                <TextField {...params} fullWidth margin="normal" />
              )}
            />

            <TextField
              fullWidth
              label="Location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              margin="normal"
            />
          </DialogContent>

          <DialogActions>
            {selectedEvent && (
              <Button
                onClick={handleDelete}
                color="error"
                disabled={deleteEventMutation.isLoading}
              >
                Delete
              </Button>
            )}
            <Button onClick={handleClose}>Cancel</Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              disabled={createEventMutation.isLoading || updateEventMutation.isLoading}
            >
              {createEventMutation.isLoading || updateEventMutation.isLoading ? (
                <CircularProgress size={24} />
              ) : (
                selectedEvent ? 'Update' : 'Create'
              )}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
};

export default CalendarView;
