import { Box, Typography, Card, CardContent, Button } from '@mui/material';
import { Work as WorkIcon } from '@mui/icons-material';

const Jobs = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Job Management
      </Typography>
      
      <Card sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
        <CardContent sx={{ textAlign: 'center', py: 6 }}>
          <WorkIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
          
          <Typography variant="h5" gutterBottom>
            Job Management Module
          </Typography>
          
          <Typography variant="body1" color="text.secondary" paragraph>
            The job management system will be implemented here. This will include:
          </Typography>
          
          <Box sx={{ textAlign: 'left', maxWidth: 400, mx: 'auto' }}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              • Job posting and tracking
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              • Client project management
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              • Time tracking and billing
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              • Resource allocation
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              • Progress monitoring
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              • Invoice generation
            </Typography>
          </Box>
          
          <Button 
            variant="contained" 
            sx={{ mt: 3 }}
            onClick={() => alert('Job management module coming soon!')}
          >
            Coming Soon
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Jobs;
