// Permission service for fetching and managing user permissions

export interface UserPermissions {
  permissions: string[];
  role: string;
  displayName: string;
}

export interface MenuItemConfig {
  text: string;
  permission: string;
  path: string;
  color: string;
}

// Menu route mapping - connects backend menuAccess to frontend routes
export const MENU_ROUTE_MAPPING: Record<string, string> = {
  'dashboard': '/reports',
  'projects': '/projects',
  'clients': '/clients',
  'meetings': '/meetings',
  'expenses': '/expenses',
  'profile': '/profile',
  'my_leaves': '/my-leave',
  'team': '/team',
  'company': '/company',
  'attendance': '/attendance',
  'employees': '/employees',
  'categories': '/categories',
  'department': '/department',
  'branches': '/branches',
  'holiday': '/holiday',
  'billing': '/billing'
};

// Menu item configurations
export const MENU_CONFIGURATIONS: Record<string, MenuItemConfig[]> = {
  mainMenu: [
    { text: 'Reports', permission: 'dashboard', path: '/reports', color: '#2196f3' },
    { text: 'Projects', permission: 'projects', path: '/projects', color: '#2196f3' },
    { text: 'Clients', permission: 'clients', path: '/clients', color: '#2196f3' },
    { text: 'Meetings', permission: 'meetings', path: '/meetings', color: '#2196f3' },
    { text: 'Team', permission: 'team', path: '/team', color: '#2196f3' }
  ],
  expensesMenu: [
    { text: 'Expenses', permission: 'expenses', path: '/expenses', color: '#2196f3' },
    { text: 'Review Expenses', permission: 'expenses', path: '/review-expenses', color: '#2196f3' },
    { text: 'Approved Expenses', permission: 'expenses', path: '/approved-expenses', color: '#2196f3' },
    { text: 'Rejected Expenses', permission: 'expenses', path: '/rejected-expenses', color: '#2196f3' },
    { text: 'Expenses Report', permission: 'expenses', path: '/expenses-report', color: '#2196f3' },
    { text: 'Payment Pending', permission: 'expenses', path: '/payment-pending', color: '#2196f3' },
    { text: 'Expense Paid', permission: 'expenses', path: '/expense-paid', color: '#2196f3' },
    { text: 'Manage Categories', permission: 'categories', path: '/manage-categories', color: '#2196f3' },
    { text: 'Expense Settings', permission: 'expenses', path: '/expense-settings', color: '#2196f3' }
  ],
  accountMenu: [
    { text: 'Profile', permission: 'profile', path: '/profile', color: '#2196f3' },
    { text: 'My Leave', permission: 'my_leaves', path: '/my-leave', color: '#2196f3' },
    { text: 'Team Leave', permission: 'team_leave', path: '/team-leave', color: '#2196f3' },
    { text: 'Leave Settings', permission: 'leave_settings', path: '/leave-settings', color: '#2196f3' }
  ],
  companyMenu: [
    { text: 'Company', permission: 'company', path: '/company', color: '#2196f3' },
    { text: 'Attendance', permission: 'attendance', path: '/attendance', color: '#2196f3' },
    { text: 'Employees', permission: 'employees', path: '/employees', color: '#2196f3' },
    { text: 'Categories', permission: 'categories', path: '/categories', color: '#2196f3' },
    { text: 'Department', permission: 'department', path: '/department', color: '#2196f3' },
    { text: 'Branches', permission: 'branches', path: '/branches', color: '#2196f3' },
    { text: 'Holiday', permission: 'holiday', path: '/holiday', color: '#2196f3' },
    { text: 'Billing', permission: 'billing', path: '/billing', color: '#2196f3' },
    { text: 'Company Profile', permission: 'company', path: '/company-profile', color: '#2196f3' }
  ]
};

// Fetch user permissions from backend
export const fetchUserPermissions = async (): Promise<UserPermissions | null> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return null;

    const response = await fetch('http://localhost:5000/api/auth/user-permissions', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    }
    return null;
  } catch (error) {
    console.error('Error fetching user permissions:', error);
    return null;
  }
};

// Generate menu items based on user permissions
export const generateMenuItems = (permissions: string[]) => {
  const hasFullAccess = permissions.includes('*');
  
  // Helper function to filter and map menu items
  const filterAndMapMenuItems = (menuConfigs: MenuItemConfig[]) => {
    return menuConfigs.filter(config => {
      if (hasFullAccess) return true;
      
      // Special handling for expenses menu items
      if (config.permission === 'expenses') {
        // If user has expenses permission, show all expense-related menu items
        return permissions.includes('expenses');
      }
      
      // Special handling for categories menu items (includes manage-categories)
      if (config.permission === 'categories') {
        // If user has categories permission, show both categories and manage-categories
        return permissions.includes('categories');
      }
      
      // Special handling for my_leaves menu items
      if (config.permission === 'my_leaves') {
        // If user has my_leaves permission, show all leave-related menu items
        return permissions.includes('my_leaves');
      }
      
      // Regular permission check
      return permissions.includes(config.permission);
    });
  };

  return {
    mainMenu: filterAndMapMenuItems(MENU_CONFIGURATIONS.mainMenu),
    expensesMenu: filterAndMapMenuItems(MENU_CONFIGURATIONS.expensesMenu),
    accountMenu: filterAndMapMenuItems(MENU_CONFIGURATIONS.accountMenu),
    companyMenu: filterAndMapMenuItems(MENU_CONFIGURATIONS.companyMenu)
  };
};

// Check if user has access to specific route
export const hasRouteAccess = (route: string, permissions: string[]): boolean => {
  if (permissions.includes('*')) return true;
  
  // Find the permission required for this route
  const requiredPermission = Object.entries(MENU_ROUTE_MAPPING)
    .find(([_, path]) => path === route)?.[0];
  
  if (!requiredPermission) return false;
  
  return permissions.includes(requiredPermission);
};