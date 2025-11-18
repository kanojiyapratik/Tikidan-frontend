import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Typography,
  Paper,
} from '@mui/material';
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';

const REPORTING_OPTIONS = [
  { value: 'self', label: 'Self' },
  { value: 'manager', label: 'Manager' },
  { value: 'supervisor', label: 'Supervisor' },
  { value: 'director', label: 'Director' },
];

const DEPARTMENT_OPTIONS = [
  { value: 'sales', label: 'Sales' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'hr', label: 'Human Resources' },
  { value: 'finance', label: 'Finance' },
  { value: 'it', label: 'Information Technology' },
  { value: 'operations', label: 'Operations' },
  { value: 'specifications', label: 'Specifications' },
  { value: 'business_development', label: 'Business Development' },
  { value: 'accounts', label: 'Accounts' },
  { value: 'technical', label: 'Technical' },
  { value: 'testing', label: 'Testing' },
  { value: 'territory', label: 'Territory' },
  { value: 'general_management', label: 'General Management' },
  { value: 'head_office', label: 'Head Office' },
  { value: '', label: 'No Department' },
];

const ROLE_OPTIONS = [
  { value: 'deputy_manager', label: 'Deputy Manager' },
  { value: 'assistant_manager', label: 'Assistant Manager' },
  { value: 'manager', label: 'Manager' },
  { value: 'senior_manager', label: 'Senior Manager' },
  { value: 'sales_manager', label: 'Sales Manager' },
  { value: 'president', label: 'President' },
  { value: 'marketing_coordinator', label: 'Marketing Coordinator' },
  { value: 'agm', label: 'AGM' },
  { value: 'executive', label: 'Executive' },
  { value: 'accounts_executive', label: 'Accounts Executive' },
  { value: 'zonal_manager', label: 'Zonal Manager' },
  { value: 'technical_head', label: 'Technical Head' },
  { value: 'tester', label: 'Tester' },
  { value: 'territory_manager', label: 'Territory Manager' },
  { value: 'sr_general_manager', label: 'Sr. General Manager' },
  { value: 'business_head', label: 'Business Head' },
  { value: 'admin', label: 'Administrator' },
  { value: 'user', label: 'User' },
];

interface EmployeeFormData {
  reporting: string;
  department: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  designation: string;
  email: string;
  mobile: string;
  password: string;
  role: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  country: string;
}

const AddEmployeeForm: React.FC<{ onClose: () => void; onSave?: (data: EmployeeFormData) => void }> = ({ 
  onClose, 
  onSave 
}) => {
  const [formData, setFormData] = useState<EmployeeFormData>({
    reporting: '',
    department: '',
    employeeId: 'EMP' + Math.floor(Math.random() * 10000),
    firstName: '',
    lastName: '',
    designation: '',
    email: '',
    mobile: '',
    password: '',
    role: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    country: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof EmployeeFormData) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [field]: event.target.value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const handleSelectChange = (field: keyof EmployeeFormData) => (
    event: any
  ) => {
    setFormData({ ...formData, [field]: event.target.value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    // Only validate essential fields for testing
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (!formData.role) newErrors.role = 'Role is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Call the backend API to register employee
      const response = await fetch('http://localhost:5000/api/auth/register-employee', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          employeeId: formData.employeeId,
          designation: formData.designation,
          mobile: formData.mobile,
          department: formData.department,
          reporting: formData.reporting,
          addressLine1: formData.addressLine1,
          addressLine2: formData.addressLine2,
          city: formData.city,
          state: formData.state,
          country: formData.country,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create employee');
      }

      console.log('Employee created successfully:', data);
      alert(`Employee created successfully! They can now login with email: ${formData.email}`);
      
      if (onSave) {
        onSave(formData);
      }
      
      onClose();
    } catch (error: any) {
      console.error('Error saving employee:', error);
      alert(error.message || 'Failed to create employee. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
        Add New Employee
      </Typography>

      <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
          {/* Left Column */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Reporting */}
            <FormControl fullWidth error={!!errors.reporting}>
              <InputLabel>Reporting</InputLabel>
              <Select
                value={formData.reporting}
                onChange={handleSelectChange('reporting')}
                label="Reporting"
              >
                {REPORTING_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
              {errors.reporting && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                  {errors.reporting}
                </Typography>
              )}
            </FormControl>

            {/* Department */}
            <FormControl fullWidth error={!!errors.department}>
              <InputLabel>Department</InputLabel>
              <Select
                value={formData.department}
                onChange={handleSelectChange('department')}
                label="Department"
              >
                {DEPARTMENT_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
              {errors.department && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                  {errors.department}
                </Typography>
              )}
            </FormControl>

            {/* Employee ID */}
            <TextField
              fullWidth
              label="Employee ID"
              value={formData.employeeId}
              onChange={handleInputChange('employeeId')}
              error={!!errors.employeeId}
              helperText={errors.employeeId}
              disabled
            />

            {/* First Name */}
            <TextField
              fullWidth
              label="First Name"
              value={formData.firstName}
              onChange={handleInputChange('firstName')}
              error={!!errors.firstName}
              helperText={errors.firstName}
              placeholder="Enter first name"
            />

            {/* Last Name */}
            <TextField
              fullWidth
              label="Last Name"
              value={formData.lastName}
              onChange={handleInputChange('lastName')}
              error={!!errors.lastName}
              helperText={errors.lastName}
              placeholder="Enter last name"
            />

            {/* Designation */}
            <TextField
              fullWidth
              label="Designation"
              value={formData.designation}
              onChange={handleInputChange('designation')}
              error={!!errors.designation}
              helperText={errors.designation}
              placeholder="Enter designation"
            />

            {/* Email */}
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={handleInputChange('email')}
              error={!!errors.email}
              helperText={errors.email}
              placeholder="Enter email address"
            />

            {/* Mobile */}
            <TextField
              fullWidth
              label="Mobile Number"
              type="tel"
              value={formData.mobile}
              onChange={handleInputChange('mobile')}
              error={!!errors.mobile}
              helperText={errors.mobile}
              placeholder="Enter mobile number"
            />

            {/* Password */}
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={formData.password}
              onChange={handleInputChange('password')}
              error={!!errors.password}
              helperText={errors.password}
              placeholder="Enter password"
            />

            {/* Role */}
            <FormControl fullWidth error={!!errors.role}>
              <InputLabel>Role</InputLabel>
              <Select
                value={formData.role}
                onChange={handleSelectChange('role')}
                label="Role"
              >
                {ROLE_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
              {errors.role && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                  {errors.role}
                </Typography>
              )}
            </FormControl>
          </Box>

          {/* Right Column */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Address Line 1 */}
            <TextField
              fullWidth
              label="Address Line 1"
              value={formData.addressLine1}
              onChange={handleInputChange('addressLine1')}
              error={!!errors.addressLine1}
              helperText={errors.addressLine1}
              placeholder="Enter address line 1"
            />

            {/* Address Line 2 */}
            <TextField
              fullWidth
              label="Address Line 2"
              value={formData.addressLine2}
              onChange={handleInputChange('addressLine2')}
              placeholder="Enter address line 2 (optional)"
            />

            {/* City */}
            <TextField
              fullWidth
              label="City"
              value={formData.city}
              onChange={handleInputChange('city')}
              error={!!errors.city}
              helperText={errors.city}
              placeholder="Enter city"
            />

            {/* State */}
            <TextField
              fullWidth
              label="State"
              value={formData.state}
              onChange={handleInputChange('state')}
              error={!!errors.state}
              helperText={errors.state}
              placeholder="Enter state"
            />

            {/* Country */}
            <TextField
              fullWidth
              label="Country"
              value={formData.country}
              onChange={handleInputChange('country')}
              error={!!errors.country}
              helperText={errors.country}
              placeholder="Enter country"
            />
          </Box>
        </Box>
      </Paper>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button
          variant="outlined"
          onClick={onClose}
          startIcon={<CancelIcon />}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          startIcon={<SaveIcon />}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Save Employee'}
        </Button>
      </Box>
    </Box>
  );
};

export default AddEmployeeForm;