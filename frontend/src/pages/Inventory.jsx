import { Box, Typography, Card, CardContent, Button } from '@mui/material';
import { Inventory as InventoryIcon } from '@mui/icons-material';

const Inventory = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Inventory Management
      </Typography>
      
      <Card sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
        <CardContent sx={{ textAlign: 'center', py: 6 }}>
          <InventoryIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
          
          <Typography variant="h5" gutterBottom>
            Inventory Module
          </Typography>
          
          <Typography variant="body1" color="text.secondary" paragraph>
            The inventory management system will be implemented here. This will include:
          </Typography>
          
          <Box sx={{ textAlign: 'left', maxWidth: 400, mx: 'auto' }}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              • Product catalog management
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              • Stock level tracking
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              • Purchase orders
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              • Supplier management
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              • Stock alerts and notifications
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              • Inventory reports
            </Typography>
          </Box>
          
          <Button 
            variant="contained" 
            sx={{ mt: 3 }}
            onClick={() => alert('Inventory module coming soon!')}
          >
            Coming Soon
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Inventory;
