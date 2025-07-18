import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Container,
  Paper,
  Grid
} from '@mui/material';
import {
  Inventory as InventoryIcon,
  Add as AddIcon,
  Search as SearchIcon,
  Category as CategoryIcon
} from '@mui/icons-material';

const InventoryTab = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Inventory
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          disabled
        >
          Add Item
        </Button>
      </Box>

      <Container maxWidth="md">
        <Paper 
          sx={{ 
            p: 6, 
            textAlign: 'center',
            bgcolor: 'grey.50',
            border: '2px dashed',
            borderColor: 'grey.300'
          }}
        >
          <InventoryIcon sx={{ fontSize: 80, color: 'grey.400', mb: 3 }} />
          
          <Typography variant="h5" gutterBottom color="text.secondary">
            Inventory Module
          </Typography>
          
          <Typography variant="body1" color="text.secondary" paragraph>
            The inventory management system will be implemented here.
          </Typography>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            This module will include features for tracking materials, supplies, and finished goods.
          </Typography>

          <Grid container spacing={2} sx={{ mt: 2, justifyContent: 'center' }}>
            <Grid item>
              <Card sx={{ p: 2, minWidth: 200 }}>
                <CardContent sx={{ textAlign: 'center', py: 1 }}>
                  <CategoryIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                  <Typography variant="h6" gutterBottom>
                    Categories
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Organize inventory by categories
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item>
              <Card sx={{ p: 2, minWidth: 200 }}>
                <CardContent sx={{ textAlign: 'center', py: 1 }}>
                  <SearchIcon sx={{ fontSize: 40, color: 'secondary.main', mb: 1 }} />
                  <Typography variant="h6" gutterBottom>
                    Search & Filter
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Find items quickly and efficiently
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item>
              <Card sx={{ p: 2, minWidth: 200 }}>
                <CardContent sx={{ textAlign: 'center', py: 1 }}>
                  <InventoryIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                  <Typography variant="h6" gutterBottom>
                    Stock Tracking
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Monitor stock levels and usage
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" color="primary.main" gutterBottom>
              Coming Soon
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • Material tracking and management<br/>
              • Stock level monitoring and alerts<br/>
              • Purchase order integration<br/>
              • Barcode scanning support<br/>
              • Inventory reporting and analytics
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default InventoryTab;
