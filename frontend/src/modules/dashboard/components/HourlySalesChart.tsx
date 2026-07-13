import React from 'react';
import { Card, CardContent, Typography, Box, useTheme } from '@mui/material';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { HourlySales } from '../api/dashboardApi';

interface HourlySalesChartProps {
  data: HourlySales[];
}

export const HourlySalesChart: React.FC<HourlySalesChartProps> = ({ data }) => {
  const theme = useTheme();

  // Custom tooltips
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const val = payload[0].value;
      return (
        <Box
          sx={{
            bgcolor: 'background.paper',
            p: 1.5,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: '8px',
            boxShadow: theme.shadows[3],
          }}
        >
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block' }}>
            Hour: {payload[0].payload.hour}
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 800, mt: 0.5 }}>
            Sales: ₹{val.toFixed(2)}
          </Typography>
        </Box>
      );
    }
    return null;
  };

  const hasSales = data.some((item) => item.sales > 0);

  return (
    <Card
      sx={{
        borderRadius: '16px',
        border: `1px solid ${theme.palette.divider}`,
        boxShadow: 'none',
        height: '100%',
        minHeight: 340,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 800, mb: 0.5 }}>
          Hourly Sales
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
          Sales trends throughout today's operating hours.
        </Typography>

        {!hasSales ? (
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
            <Typography variant="body2" color="text.secondary">
              No sales recorded today
            </Typography>
          </Box>
        ) : (
          <Box sx={{ width: '100%', height: 220, mt: 'auto' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.palette.divider} />
                <XAxis
                  dataKey="hour"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: theme.palette.text.secondary, fontSize: 11 }}
                  dy={10}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: theme.palette.text.secondary, fontSize: 11 }}
                  dx={-10}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke={theme.palette.primary.main}
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorSales)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
