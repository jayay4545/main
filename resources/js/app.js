import React from 'react';
import { createRoot } from 'react-dom/client';
import Employee from './Employee.jsx';
import EmployeePage from './EmployeePage.jsx';
import SuperAdmin from './SuperAdmin.jsx';
import SuperAdminFallback from './SuperAdminFallback.jsx';
import SimpleEmployee from './SimpleEmployee';
import ViewRequest from './ViewRequest';
import ViewApproved from './ViewApproved.jsx';
import HomePage from './Home.jsx';
import Equipment from './Equipment.jsx';
import AddStocks from './AddStocks.jsx';
import RoleManagementPage from './RoleManagementPage.jsx';
import UsersPage from './UsersPage.jsx';

// Make React, ReactDOM, and components available globally for fallback mechanisms
window.React = React;

// Properly expose ReactDOM with createRoot method
window.ReactDOM = {};
window.ReactDOM.createRoot = createRoot;

// Ensure ReactDOM is properly exposed with all necessary methods
try {
  if (typeof window.ReactDOM.createRoot !== 'function') {
    console.error('createRoot is not properly exposed, attempting to fix');
    window.ReactDOM.createRoot = createRoot;
  }
} catch (error) {
  console.error('Error setting up ReactDOM:', error);
}

// Expose components globally
window.SuperAdmin = SuperAdmin;
window.SuperAdminFallback = SuperAdminFallback;
window.ViewApproved = ViewApproved;
window.ViewRequest = ViewRequest;
window.Equipment = Equipment;
window.AddStocks = AddStocks;
window.EmployeePage = EmployeePage;
window.RoleManagementPage = RoleManagementPage;
window.UsersPage = UsersPage;

// Double check components are properly exposed
console.log('SuperAdmin component:', SuperAdmin);
console.log('SuperAdminFallback component:', SuperAdminFallback);
console.log('ViewApproved component:', ViewApproved);
console.log('ViewRequest component:', ViewRequest);
console.log('Equipment component:', Equipment);
console.log('AddStocks component:', AddStocks);
console.log('EmployeePage component:', EmployeePage);

// Force expose components if they're not properly set
if (!window.SuperAdmin) {
  console.warn('SuperAdmin not properly exposed, forcing exposure');
  window.SuperAdmin = SuperAdmin;
}

if (!window.SuperAdminFallback) {
  console.warn('SuperAdminFallback not properly exposed, forcing exposure');
  window.SuperAdminFallback = SuperAdminFallback;
}

if (!window.ViewApproved) {
  console.warn('ViewApproved not properly exposed, forcing exposure');
  window.ViewApproved = ViewApproved;
}

if (!window.ViewRequest) {
  console.warn('ViewRequest not properly exposed, forcing exposure');
  window.ViewRequest = ViewRequest;
}

if (!window.Equipment) {
  console.warn('Equipment not properly exposed, forcing exposure');
  window.Equipment = Equipment;
}

if (!window.AddStocks) {
  console.warn('AddStocks not properly exposed, forcing exposure');
  window.AddStocks = AddStocks;
}

// Log global objects to verify they're properly set
console.log('Global objects set:', {
  React: window.React,
  ReactDOM: window.ReactDOM,
  'ReactDOM.createRoot': typeof window.ReactDOM.createRoot === 'function',
  SuperAdmin: window.SuperAdmin,
  SuperAdminFallback: window.SuperAdminFallback,
  ViewApproved: window.ViewApproved
});

// Import CSS
import '../css/app.css';

// Initialize SuperAdmin component if on superadmin page
const superadminRoot = document.getElementById('superadmin-root');
if (superadminRoot) {
  // Add a small delay to ensure all resources are loaded
  setTimeout(() => {
    try {
      console.log('Initializing SuperAdmin component');
      // Make sure SuperAdmin is defined before using it
      if (typeof SuperAdmin === 'undefined') {
        console.error('SuperAdmin component is not defined');
        throw new Error('SuperAdmin component is not defined');
      }
      const root = createRoot(superadminRoot);
      root.render(React.createElement(SuperAdmin));
      console.log('SuperAdmin component rendered successfully');
    } catch (error) {
      console.error('Error rendering SuperAdmin component:', error);
      // Try to render the fallback component
      try {
        console.log('Attempting to render SuperAdminFallback component');
        // Create a new root since the previous one might be in an error state
        const fallbackRoot = createRoot(superadminRoot);
        fallbackRoot.render(React.createElement(SuperAdminFallback));
        console.log('SuperAdminFallback component rendered successfully');
      } catch (fallbackError) {
        console.error('Error rendering SuperAdminFallback component:', fallbackError);
        // Display error message in the UI if fallback also fails
        superadminRoot.innerHTML = `
          <div style="padding: 20px; background-color: #ffebee; border: 2px solid #f44336; border-radius: 5px; margin: 20px; text-align: center;">
            <h2 style="color: #2563EB; font-size: 24px; margin-bottom: 16px;">Super Admin Dashboard</h2>
            <p style="color: #4B5563; margin-bottom: 24px;">The dashboard is currently unavailable. Please try again later.</p>
            <button onclick="window.location.reload()" 
                    style="background-color: #2563EB; color: white; border: none; padding: 8px 16px; 
                           border-radius: 4px; cursor: pointer;">
                Reload Page
            </button>
          </div>
        `;
      }
    }
  }, 100); // Small delay to ensure DOM is ready
}

// Simple test component for debugging
const TestComponent = () => {
    return React.createElement('div', {
        style: {
            padding: '20px',
            backgroundColor: 'lightblue',
            border: '2px solid blue',
            borderRadius: '5px',
            margin: '20px',
            fontSize: '24px',
            textAlign: 'center'
        }
    }, 'Test Component Loaded Successfully');
};

// For debugging
console.log('App.js loaded');
console.log('React version:', React.version);

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, looking for containers');
    
    // Check for home-root first (for homepage/dashboard)
    const homeContainer = document.getElementById('home-root');
    console.log('home-root element found:', homeContainer);
    
    if (homeContainer) {
        try {
            console.log('Initializing Home component');
            const root = createRoot(homeContainer);
            root.render(React.createElement(HomePage));
            console.log('Home component rendered successfully');
        } catch (error) {
            console.error('Error rendering Home component:', error);
            // Display error message in the UI
            homeContainer.innerHTML = `
              <div style="padding: 20px; background-color: #ffebee; border: 2px solid #f44336; border-radius: 5px; margin: 20px; text-align: center;">
                <h2 style="color: #d32f2f;">Home Failed to Load</h2>
                <p>There was an error loading the Dashboard component. Please try reloading the page.</p>
                <button onclick="window.location.reload()" style="padding: 10px 20px; background-color: #2196f3; color: white; border: none; border-radius: 4px; cursor: pointer; margin-top: 10px;">
                  Reload Page
                </button>
              </div>
            `;
        }
    }
    
    // Check for employee-root (for employee page)
    const employeeContainer = document.getElementById('employee-root');
    console.log('employee-root element found:', employeeContainer);
    
    if (employeeContainer) {
        try {
            // Create a root for the container
            const root = createRoot(employeeContainer);
            
            // Define a function to render the fallback component
            const renderFallback = () => {
                console.log('Rendering SimpleEmployee as fallback');
                try {
                    root.render(React.createElement(SimpleEmployee));
                    console.log('SimpleEmployee fallback rendered successfully');
                } catch (fallbackError) {
                    console.error('Error rendering fallback component:', fallbackError);
                    // If even the fallback fails, show a basic message
                    employeeContainer.innerHTML = '<div style="padding: 20px; background-color: lightcoral; border: 2px solid red; border-radius: 5px; margin: 20px; font-size: 24px; text-align: center;">Fallback: React Component Failed to Load</div>';
                }
            };
            
            // Render Employee component directly on employee page
            try {
                console.log('Rendering Employee component on employee-root');
                root.render(React.createElement(Employee));
                console.log('Employee component rendered to employee-root');
            } catch (employeeError) {
                console.error('Error rendering Employee component:', employeeError);
                // Try to use the inline fallback component if available
                if (window.EmployeeFallback) {
                    console.log('Using inline EmployeeFallback component');
                    try {
                        root.render(React.createElement(window.EmployeeFallback));
                        console.log('EmployeeFallback rendered successfully');
                    } catch (fallbackError) {
                        console.error('Error rendering inline fallback:', fallbackError);
                        renderFallback();
                    }
                } else {
                    renderFallback();
                }
            }
        } catch (error) {
            console.error('Error creating root for employee-root:', error);
            // If we can't even create a root, show a basic message
            employeeContainer.innerHTML = '<div style="padding: 20px; background-color: lightcoral; border: 2px solid red; border-radius: 5px; margin: 20px; font-size: 24px; text-align: center;">Fallback: React Component Failed to Load</div>';
        }
    }
    
    // Check for role-management-root (for role management page)
    const roleManagementContainer = document.getElementById('role-management-root');
    console.log('role-management-root element found:', roleManagementContainer);
    
    if (roleManagementContainer) {
        try {
            console.log('Initializing RoleManagementPage component');
            const root = createRoot(roleManagementContainer);
            root.render(React.createElement(RoleManagementPage));
            console.log('RoleManagementPage component rendered successfully');
        } catch (error) {
            console.error('Error rendering RoleManagementPage component:', error);
            // Display error message in the UI
            roleManagementContainer.innerHTML = `
              <div style="padding: 20px; background-color: #ffebee; border: 2px solid #f44336; border-radius: 5px; margin: 20px; text-align: center;">
                <h2 style="color: #d32f2f;">Role Management Failed to Load</h2>
                <p>There was an error loading the Role Management component. Please try reloading the page.</p>
                <button onclick="window.location.reload()" style="padding: 10px 20px; background-color: #2196f3; color: white; border: none; border-radius: 4px; cursor: pointer; margin-top: 10px;">
                  Reload Page
                </button>
              </div>
            `;
        }
    }
    
    // Check for users-root (for users page)
    const usersContainer = document.getElementById('users-root');
    console.log('users-root element found:', usersContainer);
    
    if (usersContainer) {
        try {
            console.log('Initializing UsersPage component');
            console.log('UsersPage component available:', typeof UsersPage);
            
            // Test if UsersPage is properly imported
            if (typeof UsersPage === 'undefined') {
                console.error('UsersPage component is not defined');
                usersContainer.innerHTML = `
                  <div style="padding: 20px; background-color: #ffebee; border: 2px solid #f44336; border-radius: 5px; margin: 20px; text-align: center;">
                    <h2 style="color: #d32f2f;">UsersPage Component Not Found</h2>
                    <p>The UsersPage component is not properly imported or defined.</p>
                    <button onclick="window.location.reload()" style="padding: 10px 20px; background-color: #2196f3; color: white; border: none; border-radius: 4px; cursor: pointer; margin-top: 10px;">
                      Reload Page
                    </button>
                  </div>
                `;
                return;
            }
            
            const root = createRoot(usersContainer);
            root.render(React.createElement(UsersPage));
            console.log('UsersPage component rendered successfully');
        } catch (error) {
            console.error('Error rendering UsersPage component:', error);
            // Display error message in the UI
            usersContainer.innerHTML = `
              <div style="padding: 20px; background-color: #ffebee; border: 2px solid #f44336; border-radius: 5px; margin: 20px; text-align: center;">
                <h2 style="color: #d32f2f;">Users Failed to Load</h2>
                <p>There was an error loading the Users component. Please try reloading the page.</p>
                <p>Error: ${error.message}</p>
                <button onclick="window.location.reload()" style="padding: 10px 20px; background-color: #2196f3; color: white; border: none; border-radius: 4px; cursor: pointer; margin-top: 10px;">
                  Reload Page
                </button>
              </div>
            `;
        }
    }
    
    // Check for root element (for other pages)
    const rootContainer = document.getElementById('root');
    console.log('root element found:', rootContainer);
    
    if (rootContainer) {
        try {
            // Create a root for the container
            const root = createRoot(rootContainer);
            
            // Define a function to render the fallback component
            const renderFallback = () => {
                console.log('Rendering SimpleEmployee as fallback');
                try {
                    root.render(React.createElement(SimpleEmployee));
                    console.log('SimpleEmployee fallback rendered successfully');
                } catch (fallbackError) {
                    console.error('Error rendering fallback component:', fallbackError);
                    // If even the fallback fails, show a basic message
                    rootContainer.innerHTML = '<div style="padding: 20px; background-color: lightcoral; border: 2px solid red; border-radius: 5px; margin: 20px; font-size: 24px; text-align: center;">Fallback: React Component Failed to Load</div>';
                }
            };
            
            // Try to render the main component with error handling
            try {
                console.log('Attempting to render Employee component');
                root.render(React.createElement(Employee));
                console.log('Employee component rendered to root');
            } catch (employeeError) {
                console.error('Error rendering Employee component:', employeeError);
                // Try to use the inline fallback component if available
                if (window.EmployeeFallback) {
                    console.log('Using inline EmployeeFallback component');
                    try {
                        root.render(React.createElement(window.EmployeeFallback));
                        console.log('EmployeeFallback rendered successfully');
                    } catch (fallbackError) {
                        console.error('Error rendering inline fallback:', fallbackError);
                        renderFallback();
                    }
                } else {
                    renderFallback();
                }
            }
        } catch (error) {
            console.error('Error creating root for root:', error);
            // If we can't even create a root, show a basic message
            rootContainer.innerHTML = '<div style="padding: 20px; background-color: lightcoral; border: 2px solid red; border-radius: 5px; margin: 20px; font-size: 24px; text-align: center;">Fallback: React Component Failed to Load</div>';
        }
    }
});