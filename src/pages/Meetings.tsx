import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Fab,
} from '@mui/material';
import {
  Add,
  CalendarMonth,
  Person,
  AccessTime,
  LocationOn,
  MoreVert,
} from '@mui/icons-material';

const Meetings: React.FC = () => {
  // Empty meetings data
  const meetings: any[] = [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'primary';
      case 'pending':
        return 'warning';
      case 'completed':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ mb: 1, fontWeight: 600 }}>
          Meetings
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage your meetings and schedule
        </Typography>
      </Box>

      {/* Action Buttons */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <Button
          variant="contained"
          startIcon={<Add />}
          sx={{ borderRadius: 2 }}
        >
          Schedule Meeting
        </Button>
        <Button
          variant="outlined"
          startIcon={<CalendarMonth />}
          sx={{ borderRadius: 2 }}
        >
          View Calendar
        </Button>
      </Box>

      {/* Meetings Overview Cards */}
      <Box sx={{ mb: 3, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <Typography variant="h3" color="primary" sx={{ fontWeight: 700 }}>
              0
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Meetings This Month
            </Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <Typography variant="h3" color="warning.main" sx={{ fontWeight: 700 }}>
              0
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Pending Meetings
            </Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <Typography variant="h3" color="success.main" sx={{ fontWeight: 700 }}>
              0
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Completed Meetings
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Meetings Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Upcoming & Recent Meetings
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Meeting Details</TableCell>
                  <TableCell>Client</TableCell>
                  <TableCell>Date & Time</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {meetings.map((meeting) => (
                  <TableRow key={meeting.id} hover>
                    <TableCell>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {meeting.title}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                          <AccessTime sx={{ fontSize: 14, color: 'text.secondary', mr: 0.5 }} />
                          <Typography variant="caption" color="text.secondary">
                            {meeting.time}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Person sx={{ fontSize: 16, color: 'text.secondary', mr: 1 }} />
                        <Typography variant="body2">
                          {meeting.client}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {meeting.date}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <LocationOn sx={{ fontSize: 16, color: 'text.secondary', mr: 1 }} />
                        <Typography variant="body2">
                          {meeting.location}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={meeting.type}
                        size="small"
                        variant="outlined"
                        sx={{ borderRadius: 1 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={meeting.status}
                        size="small"
                        color={getStatusColor(meeting.status) as any}
                        sx={{ borderRadius: 1, textTransform: 'capitalize' }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small">
                        <MoreVert />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add meeting"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
        }}
      >
        <Add />
      </Fab>
    </Box>
  );
};

export default Meetings;