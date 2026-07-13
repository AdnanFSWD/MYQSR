import React from 'react';
import { Card, CardContent, Box, Typography, useTheme } from '@mui/material';

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  gradient: string;
  shadowColor: string;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  icon,
  gradient,
  shadowColor,
}) => {
  const theme = useTheme();

  return (
    <Card
      sx={{
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: `0 8px 24px ${shadowColor}`,
        border: `1px solid ${theme.palette.divider}`,
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 12px 30px ${shadowColor}`,
        },
        background: theme.palette.mode === 'dark' ? '#1E293B' : '#FFFFFF',
      }}
    >
      <CardContent sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {title}
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 800, mt: 0.5 }}>
            {value}
          </Typography>
        </Box>

        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: '12px',
            background: gradient,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
          }}
        >
          {icon}
        </Box>
      </CardContent>
    </Card>
  );
};
