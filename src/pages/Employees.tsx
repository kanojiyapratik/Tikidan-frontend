import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
  InputAdornment,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  Avatar,
  Tooltip,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import AddEmployeeForm from '../components/AddEmployeeForm';

// Types
interface Employee {
  id: string;
  name: string;
  role: string;
  reportingTo: string;
  status: 'Active' | 'Inactive';
  allMeetings: number;
  mostVisitedCategory: string;
  phone: string;
}

const Employees: React.FC = () => {
  const theme = useTheme();
  
  // State
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof Employee>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [editingEmployeeId, setEditingEmployeeId] = useState<string | undefined>(undefined);

  // Fetch employees from backend
  React.useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.error('No token found');
        return;
      }

      const response = await fetch('http://localhost:5000/api/auth/employees', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Get current user info to filter out admin
        const currentUserData = localStorage.getItem('user');
        const currentUser = currentUserData ? JSON.parse(currentUserData) : null;
        
        // Get all employees to map reporting names
        const allEmployees = data.employees;
        
        // Create a mapping of employee IDs to names
        const employeeNameMap: Record<string, string> = {};
        allEmployees.forEach((emp: any) => {
          const name = emp.name || `${emp.firstName || ''} ${emp.lastName || ''}`.trim() || 'N/A';
          employeeNameMap[emp._id] = name;
        });
        
        // Transform backend data to match Employee interface and filter out admin
        const transformedEmployees: Employee[] = data.employees
          .filter((emp: any) => emp.role !== 'admin' && emp._id !== currentUser?.id)
          .map((emp: any) => {
            // Map reporting field to actual manager name using reportsTo field (ObjectId reference)
            let reportingTo = 'N/A';
            if (emp.reportsTo) {
              // If reportsTo is set, look up the manager's name from the employee map
              if (employeeNameMap[emp.reportsTo]) {
                reportingTo = employeeNameMap[emp.reportsTo];
              } else {
                reportingTo = 'Manager Not Found';
              }
            } else if (emp.reporting && emp.reporting !== 'self') {
              // Fallback to reporting field for cases where it's a direct name/ID
              reportingTo = emp.reporting;
            }
            
            return {
              id: emp._id,
              name: emp.name || `${emp.firstName || ''} ${emp.lastName || ''}`.trim() || 'N/A',
              role: emp.role ?
                (emp.department ?
                  `${emp.role.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())} - ${emp.department}` :
                  emp.role.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())
                ) : 'N/A',
              reportingTo: reportingTo,
              status: 'Active', // Default to active
              allMeetings: 0, // Placeholder - will be implemented later
              mostVisitedCategory: 'N/A', // Placeholder - will be implemented later
              phone: emp.mobile || 'N/A',
            };
          });
        
        setEmployees(transformedEmployees);
      } else {
        console.error('Failed to fetch employees:', data.message);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort employees
  const filteredAndSortedEmployees = React.useMemo(() => {
    let filtered = employees.filter(employee =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.mostVisitedCategory.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return filtered.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [employees, searchTerm, sortField, sortDirection]);

  const handleSort = (field: keyof Employee) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleAddEmployee = () => {
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
    setEditingEmployeeId(undefined);
  };

  const handleDeleteEmployee = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          console.error('No token found');
          return;
        }

        const response = await fetch(`http://localhost:5000/api/auth/employees/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();

        if (response.ok && data.success) {
          // Remove employee from local state after successful deletion
          setEmployees(employees.filter(emp => emp.id !== id));
        } else {
          console.error('Failed to delete employee:', data.message);
          alert('Failed to delete employee: ' + data.message);
        }
      } catch (error) {
        console.error('Error deleting employee:', error);
        alert('Error deleting employee. Please try again.');
      }
    }
  };

  const handleEditEmployee = (id: string) => {
    // Open edit dialog with employee ID
    setEditingEmployeeId(id);
    setOpenAddDialog(true);
  };

  // Get employee initials for avatar
  const getEmployeeInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Box sx={{ p: 1.5, pt: 1, backgroundColor: '#fafbfc', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5, pb: 1, borderBottom: '1px solid #e2e8f0' }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', fontSize: '1.1rem' }}>
            Employee Management
          </Typography>
        </Box>
        <Button
          variant="contained"
          size="small"
          startIcon={<AddIcon fontSize="small" />}
          onClick={handleAddEmployee}
          sx={{
            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            boxShadow: '0 1px 3px rgba(59, 130, 246, 0.3)',
            textTransform: 'none',
            px: 1.5,
            py: 0.5,
            fontSize: '0.75rem',
            fontWeight: 500,
            borderRadius: 1,
            '&:hover': {
              background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
              boxShadow: '0 2px 6px rgba(59, 130, 246, 0.4)',
              transform: 'translateY(-1px)',
            },
            transition: 'all 0.2s ease',
          }}
        >
          Add Employee
        </Button>
      </Box>

      {/* Employees Table */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 1,
          overflow: 'hidden',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        }}
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{
                backgroundColor: '#f8fafc',
                borderBottom: '1px solid #e2e8f0',
              }}>
                <TableCell sx={{ fontWeight: 600, color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px', py: 1 }}>
                  <TableSortLabel
                    active={sortField === 'name'}
                    direction={sortDirection}
                    onClick={() => handleSort('name')}
                  >
                    Employee
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px', py: 1 }}>
                  <TableSortLabel
                    active={sortField === 'status'}
                    direction={sortDirection}
                    onClick={() => handleSort('status')}
                  >
                    Status
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px', py: 1 }}>
                  <TableSortLabel
                    active={sortField === 'allMeetings'}
                    direction={sortDirection}
                    onClick={() => handleSort('allMeetings')}
                  >
                    Meetings
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px', py: 1 }}>
                  <TableSortLabel
                    active={sortField === 'mostVisitedCategory'}
                    direction={sortDirection}
                    onClick={() => handleSort('mostVisitedCategory')}
                  >
                    Category
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px', py: 1 }}>
                  <TableSortLabel
                    active={sortField === 'phone'}
                    direction={sortDirection}
                    onClick={() => handleSort('phone')}
                  >
                    Contact
                  </TableSortLabel>
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 600, color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px', py: 1 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAndSortedEmployees.map((employee) => (
                <TableRow
                  key={employee.id}
                  sx={{
                    borderBottom: '1px solid #f1f5f9',
                    '&:hover': {
                      backgroundColor: '#f8fafc',
                      transition: 'background-color 0.2s ease',
                    },
                    '&:last-child': {
                      borderBottom: 'none',
                    },
                  }}
                >
                  <TableCell sx={{ py: 1 }}>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 500, color: '#1e293b', mb: 0.2, fontSize: '0.85rem' }}>
                        {employee.name}
                      </Typography>
                      <Box sx={{ lineHeight: 0.8 }}>
                        <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 0, fontSize: '0.7rem', lineHeight: 1 }}>
                          {employee.role}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.7rem', lineHeight: 1 }}>
                          Reports to: {employee.reportingTo}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ py: 1 }}>
                    <Chip
                      label={employee.status}
                      size="small"
                      sx={{
                        backgroundColor: employee.status === 'Active' ? '#dcfce7' : '#fef2f2',
                        color: employee.status === 'Active' ? '#166534' : '#991b1b',
                        fontWeight: 500,
                        fontSize: '0.7rem',
                        borderRadius: 1,
                        px: 1,
                        height: 20,
                        minHeight: 'auto',
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ py: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500, color: '#1e293b', fontSize: '0.8rem' }}>
                      {employee.allMeetings}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ py: 1 }}>
                    <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.8rem' }}>
                      {employee.mostVisitedCategory}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ py: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <PhoneIcon sx={{ fontSize: 14, color: '#94a3b8' }} />
                      <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.8rem' }}>
                        {employee.phone}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="center" sx={{ py: 1 }}>
                    <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                      <Tooltip title="Edit">
                        <IconButton
                          size="small"
                          onClick={() => handleEditEmployee(employee.id)}
                          sx={{
                            color: '#3b82f6',
                            backgroundColor: '#eff6ff',
                            '&:hover': {
                              backgroundColor: '#dbeafe',
                              transform: 'scale(1.05)',
                            },
                            transition: 'all 0.2s ease',
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteEmployee(employee.id)}
                          sx={{
                            color: '#ef4444',
                            backgroundColor: '#fef2f2',
                            '&:hover': {
                              backgroundColor: '#fee2e2',
                              transform: 'scale(1.05)',
                            },
                            transition: 'all 0.2s ease',
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        
        {filteredAndSortedEmployees.length === 0 && (
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <PersonIcon sx={{ fontSize: 48, color: '#94a3b8', mb: 1.5 }} />
            <Typography variant="subtitle2" sx={{ color: '#64748b', mb: 0.5 }}>
              No employees found
            </Typography>
            <Typography variant="body2" sx={{ color: '#94a3b8', fontSize: '0.8rem' }}>
              {searchTerm ? 'Try adjusting your search criteria' : 'Get started by adding your first employee'}
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Add/Edit Employee Dialog */}
      <Dialog
        open={openAddDialog}
        onClose={handleCloseAddDialog}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            maxHeight: '90vh',
            overflow: 'auto'
          }
        }}
      >
        <DialogTitle>{editingEmployeeId ? 'Edit Employee' : 'Add New Employee'}</DialogTitle>
        <DialogContent>
          <AddEmployeeForm
            onClose={handleCloseAddDialog}
            employeeId={editingEmployeeId}
            onSave={() => {
              // Refresh the employee list after adding/editing
              fetchEmployees();
            }}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Employees;