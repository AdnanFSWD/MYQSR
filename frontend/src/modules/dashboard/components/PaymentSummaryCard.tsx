import React from 'react';
import { Card, CardContent, Typography, Box, useTheme } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import type { PaymentSummary } from '../api/dashboardApi';

interface PaymentSummaryCardProps {
  summary: PaymentSummary;
}

export const PaymentSummaryCard: React.FC<PaymentSummaryCardProps> = ({ summary }) => {
  const theme = useTheme();

  const data = [
    { name: 'Cash', value: summary.cash, color: '#10B981' }, // emerald green
    { name: 'UPI', value: summary.upi, color: '#3B82F6' },  // dodger blue
    { name: 'Card', value: summary.card, color: '#F59E0B' }, // amber orange
  ].filter(item => item.value > 0);

  const total = summary.cash + summary.upi + summary.card;

  // Custom tooltips
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const value = payload[0].value;
      const pct = total > 0 ? ((value / total) * 100).toFixed(1) : '0';
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
          <Typography variant="body2" sx={{ fontWeight: 700 }}>
            {payload[0].name}
          </Typography>
          <Typography variant="body2" color="primary" sx={{ fontWeight: 800 }}>
            ₹{value.toFixed(2)} ({pct}%)
          </Typography>
        </Box>
      );
    }
    return null;
  };

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
          Payment Summary
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
          Revenue split by transaction type today.
        </Typography>

        {total === 0 ? (
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
            <Typography variant="body2" color="text.secondary">
              No sales transactions today
            </Typography>
          </Box>
        ) : (
          <Box sx={{ width: '100%', height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  formatter={(value) => (
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: theme.palette.text.primary }}>
                      {value}
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
