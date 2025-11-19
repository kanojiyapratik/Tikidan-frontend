import React, { useState } from 'react';
import { Typography, Box, Grid, Paper, TextField, Button } from '@mui/material';
import {
  Event as EventIcon,
  People as PeopleIcon,
  Repeat as RepeatIcon,
  Description as DescriptionIcon,
  HourglassEmpty as HourglassEmptyIcon,
  Download as DownloadIcon,
  CalendarToday as CalendarTodayIcon,
} from '@mui/icons-material';

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => {
  return (
    <Paper
      elevation={2}
      sx={{
        p: 2,
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        borderRadius: 1.5,
        background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
        border: '1px solid rgba(0, 0, 0, 0.08)',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 6px 16px rgba(0, 0, 0, 0.1)',
        },
      }}
    >
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: 1.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
          color: 'white',
        }}
      >
        {icon}
      </Box>
      <Box sx={{ flex: 1 }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            color: '#1a1a1a',
            mb: 0.25,
            fontSize: '1.5rem',
          }}
        >
          {value}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: '#666',
            fontWeight: 500,
            fontSize: '0.75rem',
          }}
        >
          {title}
        </Typography>
      </Box>
    </Paper>
  );
};

const Reports: React.FC = () => {
  const stats = [
    {
      title: 'Total Meetings',
      value: 0,
      icon: <EventIcon sx={{ fontSize: 22 }} />,
      color: '#2196f3',
    },
    {
      title: 'Clients',
      value: 0,
      icon: <PeopleIcon sx={{ fontSize: 22 }} />,
      color: '#4caf50',
    },
    {
      title: 'Repeat Visit',
      value: 0,
      icon: <RepeatIcon sx={{ fontSize: 22 }} />,
      color: '#ff9800',
    },
    {
      title: 'Total Quotation',
      value: 0,
      icon: <DescriptionIcon sx={{ fontSize: 22 }} />,
      color: '#9c27b0',
    },
    {
      title: 'Pending Quotation',
      value: 0,
      icon: <HourglassEmptyIcon sx={{ fontSize: 22 }} />,
      color: '#f44336',
    },
  ];

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleDownload = () => {
    console.log('Downloading report...', { startDate, endDate });
    // Add download logic here
  };

  return (
    <Paper
      elevation={1}
      sx={{
        p: 2,
        borderRadius: 1.5,
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      }}
    >
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        {/* Stats */}
        {stats.map((stat, index) => (
          <Box
            key={index}
            sx={{
              flex: '1 1 0',
              minWidth: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 0.25,
              px: 1.5,
              borderRight: index < stats.length - 1 ? '1px solid rgba(0, 0, 0, 0.08)' : 'none',
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                color: '#1a1a1a',
                fontSize: '1.5rem',
              }}
            >
              {stat.value}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: '#666',
                fontWeight: 500,
                fontSize: '0.7rem',
                textAlign: 'center',
                lineHeight: 1.2,
              }}
            >
              {stat.title}
            </Typography>
          </Box>
        ))}

        {/* Date Pickers */}
        <TextField
          label="Start"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
          size="small"
          sx={{
            minWidth: 130,
            '& .MuiOutlinedInput-root': {
              borderRadius: 1,
              fontSize: '0.875rem',
            },
            '& .MuiInputLabel-root': {
              fontSize: '0.875rem',
            },
          }}
        />
        
        <TextField
          label="End"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
          size="small"
          sx={{
            minWidth: 130,
            '& .MuiOutlinedInput-root': {
              borderRadius: 1,
              fontSize: '0.875rem',
            },
            '& .MuiInputLabel-root': {
              fontSize: '0.875rem',
            },
          }}
        />

        {/* Download Button */}
        <Button
          variant="contained"
          onClick={handleDownload}
          sx={{
            background: '#2196f3',
            borderRadius: 1,
            minWidth: 40,
            height: 36,
            p: 0,
            '&:hover': {
              background: '#1976d2',
            },
          }}
        >
          <DownloadIcon sx={{ fontSize: 20 }} />
        </Button>
      </Box>
    </Paper>
  );
};

export default Reports;
