import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  Avatar, 
  Chip, 
  Container,
  CircularProgress,
  Alert,
  Divider,
  Stack
} from '@mui/material';
import {
  Person,
  Email,
  Badge,
  BusinessCenter
} from '@mui/icons-material';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  designation: string;
  role: string;
  employeeId: string;
}

interface CurrentUser {
  name: string;
  designation: string;
  role: string;
}

const Team: React.FC = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch current user data
  useEffect(() => {
    const fetchCurrentUser = () => {
      const userData = localStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        setCurrentUser({
          name: user.name || '',
          designation: user.designation || '',
          role: user.role || ''
        });
      }
    };

    fetchCurrentUser();
  }, []);

  // Fetch team members
  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        const response = await fetch('http://localhost:5000/api/auth/team-members', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          setTeamMembers(data.teamMembers);
        } else {
          setError('Failed to fetch team members');
        }
      } catch (error) {
        console.error('Error fetching team members:', error);
        setError('Error fetching team members');
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, []);

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return '#d32f2f';
      case 'manager':
      case 'senior_manager':
        return '#1976d2';
      case 'assistant_manager':
      case 'deputy_manager':
        return '#388e3c';
      default:
        return '#757575';
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Loading your team...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Card
        elevation={2}
        sx={{
          backgroundColor: '#ffffff',
          borderRadius: 2,
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ mb: 4 }}>
            <Typography 
              variant="h4" 
              gutterBottom 
              sx={{ 
                fontSize: '2rem', 
                fontWeight: 600, 
                color: '#333',
                mb: 1 
              }}
            >
              My Team
            </Typography>
            
            {currentUser && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Avatar sx={{ bgcolor: getRoleColor(currentUser.role) }}>
                  <Person />
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 500 }}>
                    {currentUser.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {currentUser.designation}
                  </Typography>
                </Box>
                <Chip 
                  label={currentUser.role.replace('_', ' ').toUpperCase()} 
                  size="small"
                  sx={{ 
                    bgcolor: getRoleColor(currentUser.role),
                    color: 'white',
                    fontWeight: 500 
                  }}
                />
              </Box>
            )}
            
            <Divider sx={{ mb: 3 }} />
          </Box>

          {teamMembers.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <BusinessCenter sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No Team Members
              </Typography>
              <Typography variant="body1" color="text.secondary">
                You don't have any team members reporting to you yet.
              </Typography>
            </Box>
          ) : (
            <Box>
              <Typography 
                variant="h6" 
                sx={{ mb: 3, fontWeight: 500, color: '#333' }}
              >
                Team Members ({teamMembers.length})
              </Typography>
              
              <Stack spacing={3}>
                {teamMembers.map((member) => (
                  <Card 
                    key={member.id}
                    variant="outlined"
                    sx={{
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                      }
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar sx={{ bgcolor: getRoleColor(member.role), mr: 2 }}>
                          <Person />
                        </Avatar>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography 
                            variant="h6" 
                            sx={{ 
                              fontWeight: 500, 
                              fontSize: '1.1rem',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {member.name}
                          </Typography>
                          <Typography 
                            variant="body2" 
                            color="text.secondary"
                            sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}
                          >
                            {member.designation}
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Email sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{ 
                            overflow: 'hidden', 
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {member.email}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Badge sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {member.employeeId}
                        </Typography>
                      </Box>
                      
                      <Chip 
                        label={member.role.replace('_', ' ').toUpperCase()} 
                        size="small"
                        sx={{ 
                          bgcolor: getRoleColor(member.role),
                          color: 'white',
                          fontWeight: 500,
                          fontSize: '0.75rem'
                        }}
                      />
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            </Box>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default Team;