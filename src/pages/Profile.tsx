import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Avatar,
  Card,
  CardContent,
  Tab,
  Tabs,
  Divider,
} from '@mui/material';
import {
  Person,
  Phone,
  Email,
  Security,
  Notifications,
  Badge,
  Work,
  BusinessCenter,
} from '@mui/icons-material';
import { useTheme, alpha } from '@mui/material/styles';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const Profile: React.FC = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);

  // User state
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    // Load user data from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setUserData(JSON.parse(userData));
    }
  }, []);

// Get user initials for avatar
  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Format role display (role-department or just role)
  const getRoleDisplay = (role: string, department: string) => {
    if (!role) return 'User';
    
    // Simple role name formatting for display
    const formatRoleName = (roleName: string) => {
      return roleName
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (l: string) => l.toUpperCase());
    };
    
    const formattedRole = formatRoleName(role);
    
    // If no department is assigned, return just the role
    if (!department) return formattedRole;
    
    // If department exists, return "Role - Department" format
    return `${formattedRole} - ${department}`;
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  if (!userData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Typography variant="body1" color="text.secondary">Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      p: 3, 
      backgroundColor: '#f8f9fa', 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'
    }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography 
          variant="h5" 
          sx={{ 
            fontWeight: 700, 
            color: '#2c3e50', 
            letterSpacing: '-0.5px',
            mb: 0.5
          }}
        >
          My Profile
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage your personal information and account settings
        </Typography>
      </Box>

      {/* Profile Overview and Main Content */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '300px 1fr' }, gap: 3 }}>
        {/* Profile Overview Card */}
        <Card sx={{ 
          borderRadius: 3, 
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          border: '1px solid rgba(255,255,255,0.2)',
          background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)'
        }}>
          <CardContent sx={{ textAlign: 'center', py: 3 }}>
            <Avatar
              sx={{
                width: 100,
                height: 100,
                bgcolor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: '3px solid #ffffff',
                boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)',
                mx: 'auto',
                mb: 2,
              }}
            >
              <Typography variant="h4" sx={{ color: 'white', fontWeight: 700 }}>
                {getUserInitials(userData.name || 'User')}
              </Typography>
            </Avatar>
            
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#2c3e50' }}>
              {userData.name || 'User Name'}
            </Typography>
            
            <Box sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              px: 2,
              py: 0.5,
              borderRadius: 20,
              display: 'inline-block',
              mb: 2
            }}>
              <Typography variant="caption" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {getRoleDisplay(userData.role, userData.department)}
              </Typography>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, alignItems: 'flex-start' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, width: '100%' }}>
                <Box sx={{ 
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  p: 1,
                  borderRadius: 1.5
                }}>
                  <Email sx={{ fontSize: 18, color: 'primary.main' }} />
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.2 }}>
                    Email
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500, color: '#2c3e50' }}>
                    {userData.email || 'Not provided'}
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, width: '100%' }}>
                <Box sx={{ 
                  backgroundColor: alpha(theme.palette.success.main, 0.1),
                  p: 1,
                  borderRadius: 1.5
                }}>
                  <Phone sx={{ fontSize: 18, color: 'success.main' }} />
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.2 }}>
                    Phone
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500, color: '#2c3e50' }}>
                    {userData.mobile || 'Not provided'}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Card sx={{ 
          borderRadius: 3, 
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          border: '1px solid rgba(255,255,255,0.2)',
          overflow: 'hidden'
        }}>
          <Box sx={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderBottom: '1px solid rgba(255,255,255,0.1)'
          }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange} 
              sx={{ 
                px: 3, 
                minHeight: 56,
                '& .MuiTab-root': {
                  color: 'rgba(255,255,255,0.7)',
                  fontWeight: 600,
                  textTransform: 'none',
                  minHeight: 56,
                  '&.Mui-selected': {
                    color: 'white',
                  }
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: 'white',
                  height: 3,
                  borderRadius: '3px 3px 0 0'
                }
              }}
            >
              <Tab 
                label="Personal Information" 
                icon={<Person fontSize="small" />} 
                iconPosition="start" 
              />
              <Tab 
                label="Security" 
                icon={<Security fontSize="small" />} 
                iconPosition="start" 
              />
              <Tab 
                label="Preferences" 
                icon={<Notifications fontSize="small" />} 
                iconPosition="start" 
              />
            </Tabs>
          </Box>

          {/* Personal Info Tab */}
          <TabPanel value={tabValue} index={0}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 700, color: '#2c3e50' }}>
              Personal Information
            </Typography>
            
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
              <Box sx={{ 
                backgroundColor: '#f8f9fa',
                p: 2,
                borderRadius: 2,
                border: '1px solid #e9ecef'
              }}>
                <Typography variant="caption" sx={{ 
                  color: '#6c757d', 
                  display: 'block', 
                  mb: 1,
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Full Name
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600, color: '#2c3e50' }}>
                  {userData.name || 'Not provided'}
                </Typography>
              </Box>
              
              <Box sx={{ 
                backgroundColor: '#f8f9fa',
                p: 2,
                borderRadius: 2,
                border: '1px solid #e9ecef'
              }}>
                <Typography variant="caption" sx={{ 
                  color: '#6c757d', 
                  display: 'block', 
                  mb: 1,
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Email Address
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600, color: '#2c3e50' }}>
                  {userData.email || 'Not provided'}
                </Typography>
              </Box>
              
              <Box sx={{ 
                backgroundColor: '#f8f9fa',
                p: 2,
                borderRadius: 2,
                border: '1px solid #e9ecef'
              }}>
                <Typography variant="caption" sx={{ 
                  color: '#6c757d', 
                  display: 'block', 
                  mb: 1,
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Mobile Number
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600, color: '#2c3e50' }}>
                  {userData.mobile || 'Not provided'}
                </Typography>
              </Box>
              
              <Box sx={{ 
                backgroundColor: '#f8f9fa',
                p: 2,
                borderRadius: 2,
                border: '1px solid #e9ecef'
              }}>
                <Typography variant="caption" sx={{ 
                  color: '#6c757d', 
                  display: 'block', 
                  mb: 1,
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Role
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600, color: '#2c3e50' }}>
                  {getRoleDisplay(userData.role, userData.department)}
                </Typography>
              </Box>
              
              <Box sx={{ 
                backgroundColor: '#f8f9fa',
                p: 2,
                borderRadius: 2,
                border: '1px solid #e9ecef'
              }}>
                <Typography variant="caption" sx={{ 
                  color: '#6c757d', 
                  display: 'block', 
                  mb: 1,
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Department
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600, color: '#2c3e50' }}>
                  {userData.department || 'Not provided'}
                </Typography>
              </Box>
            </Box>
          </TabPanel>

          {/* Security Tab */}
          <TabPanel value={tabValue} index={1}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 700, color: '#2c3e50' }}>
              Security Settings
            </Typography>
            
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Security settings and password management will be available soon.
            </Typography>
            
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 2 }}>
              <Box sx={{ 
                backgroundColor: '#f8f9fa',
                p: 2,
                borderRadius: 2,
                border: '1px solid #e9ecef'
              }}>
                <Typography variant="caption" sx={{ 
                  color: '#6c757d', 
                  display: 'block', 
                  mb: 1,
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Current Password
                </Typography>
                <Typography variant="body1" sx={{ fontFamily: 'monospace', letterSpacing: '2px', color: '#495057' }}>
                  ••••••••••
                </Typography>
              </Box>
              
              <Box sx={{ 
                backgroundColor: '#fff3cd',
                p: 2,
                borderRadius: 2,
                border: '1px solid #ffeaa7'
              }}>
                <Typography variant="caption" sx={{ 
                  color: '#856404', 
                  display: 'block', 
                  mb: 1,
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  New Password
                </Typography>
                <Typography variant="body1" sx={{ color: '#856404' }}>
                  Password change feature coming soon
                </Typography>
              </Box>
              
              <Box sx={{ 
                backgroundColor: '#fff3cd',
                p: 2,
                borderRadius: 2,
                border: '1px solid #ffeaa7'
              }}>
                <Typography variant="caption" sx={{ 
                  color: '#856404', 
                  display: 'block', 
                  mb: 1,
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Confirm New Password
                </Typography>
                <Typography variant="body1" sx={{ color: '#856404' }}>
                  Password change feature coming soon
                </Typography>
              </Box>
            </Box>
          </TabPanel>

          {/* Preferences Tab */}
          <TabPanel value={tabValue} index={2}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 700, color: '#2c3e50' }}>
              Preferences
            </Typography>
            
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Preference settings will be available in a future update.
            </Typography>
            
            <Card sx={{ 
              borderRadius: 2,
              backgroundColor: '#f8f9fa',
              border: '1px solid #e9ecef'
            }}>
              <CardContent sx={{ py: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ 
                    backgroundColor: alpha(theme.palette.info.main, 0.1),
                    p: 1.5,
                    borderRadius: 2
                  }}>
                    <Notifications sx={{ fontSize: 20, color: 'info.main' }} />
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" sx={{ mb: 0.5, fontWeight: 700, color: '#2c3e50' }}>
                      Notification Settings
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Email notifications, push notifications, and other preference options will be configurable here.
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </TabPanel>
        </Card>
      </Box>
    </Box>
  );
};

export default Profile;