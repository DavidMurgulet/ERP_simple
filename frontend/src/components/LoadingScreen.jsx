import React from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Fade,
} from '@mui/material';

const LoadingScreen = ({ message = 'Loading...' }) => {
  return (
    <Fade in={true} timeout={{ enter: 300, exit: 500 }}>
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'background.default',
          zIndex: 9999,
        }}
      >
        {/* Company Logo/Name */}
        <Typography
          variant="h2"
          component="h1"
          sx={{
            fontWeight: 800,
            mb: 4,
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textAlign: 'center',
            letterSpacing: '2px',
          }}
        >
          SERP
        </Typography>

        {/* Loading Spinner */}
        <Box sx={{ position: 'relative', mb: 3 }}>
          <CircularProgress
            size={60}
            thickness={4}
            sx={{
              color: 'primary.main',
              animationDuration: '1s',
            }}
          />
          
          {/* Decorative ring */}
          <CircularProgress
            variant="determinate"
            value={25}
            size={80}
            thickness={2}
            sx={{
              color: 'primary.light',
              position: 'absolute',
              top: -10,
              left: -10,
              opacity: 0.3,
            }}
          />
        </Box>

        {/* Loading Message */}
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{
            textAlign: 'center',
            fontSize: '1.1rem',
            fontWeight: 500,
            opacity: 0.8,
          }}
        >
          {message}
        </Typography>

        {/* Animated dots */}
        <Box sx={{ mt: 1, display: 'flex', gap: 0.5 }}>
          {[0, 1, 2].map((index) => (
            <Box
              key={index}
              sx={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                backgroundColor: 'primary.main',
                animation: `pulse 1.5s infinite ${index * 0.2}s`,
                '@keyframes pulse': {
                  '0%, 80%, 100%': {
                    opacity: 0.3,
                    transform: 'scale(0.8)',
                  },
                  '40%': {
                    opacity: 1,
                    transform: 'scale(1)',
                  },
                },
              }}
            />
          ))}
        </Box>
      </Box>
    </Fade>
  );
};

export default LoadingScreen;
