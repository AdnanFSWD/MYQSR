import React from 'react';
import { Box, Typography, Card, CardContent, Button, Divider } from '@mui/material';
import Grid from '@mui/material/Grid2';
import {
  Assessment as AssessmentIcon,
  Timeline as TimelineIcon,
  Fastfood as FastfoodIcon,
  Storage as StorageIcon,
  People as PeopleIcon,
} from '@mui/icons-material';

interface ReportMock {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export const Reports: React.FC = () => {
  const reports: ReportMock[] = [
    { title: 'Daily Sales Report', description: 'Breakdown of transactions, items sold, and revenue summaries.', icon: <AssessmentIcon fontSize="large" color="primary" /> },
    { title: 'Hourly Sales Analytics', description: 'Sales volume spikes during peak times (Lunch, Dinner).', icon: <TimelineIcon fontSize="large" color="secondary" /> },
    { title: 'Product Performance', description: 'Detailed sales statistics for menu items and food categories.', icon: <FastfoodIcon fontSize="large" color="info" /> },
    { title: 'Inventory Consumption', description: 'Audit trail of ingredient utilization and wastage tracking.', icon: <StorageIcon fontSize="large" color="warning" /> },
    { title: 'User Actions Log', description: 'Operational shifts, cashier login logs, and drawer open records.', icon: <PeopleIcon fontSize="large" color="error" /> },
  ];

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Reports & Analytics
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Export performance logs and analyze quick-service restaurant metrics.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {reports.map((report, idx) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={idx}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'action.hover' }}>
                    {report.icon}
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {report.title}
                  </Typography>
                </Box>
                <Divider sx={{ my: 1.5 }} />
                <Typography variant="body2" color="text.secondary">
                  {report.description}
                </Typography>
              </CardContent>
              <Box sx={{ p: 2, pt: 0 }}>
                <Button fullWidth variant="outlined" size="small">
                  Generate PDF / CSV
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
