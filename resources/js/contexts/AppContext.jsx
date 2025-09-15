import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authService, apiUtils } from '../services/api';

// Initial state
const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null,
  notifications: [],
};

// Action types
const ActionTypes = {
  SET_LOADING: 'SET_LOADING',
  SET_USER: 'SET_USER',
  SET_AUTHENTICATED: 'SET_AUTHENTICATED',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  REMOVE_NOTIFICATION: 'REMOVE_NOTIFICATION',
  LOGOUT: 'LOGOUT',
};

// Reducer
const appReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.SET_LOADING:
      return { ...state, loading: action.payload };
    
    case ActionTypes.SET_USER:
      return { ...state, user: action.payload };
    
    case ActionTypes.SET_AUTHENTICATED:
      return { ...state, isAuthenticated: action.payload };
    
    case ActionTypes.SET_ERROR:
      return { ...state, error: action.payload };
    
    case ActionTypes.CLEAR_ERROR:
      return { ...state, error: null };
    
    case ActionTypes.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [...state.notifications, { ...action.payload, id: Date.now() }],
      };
    
    case ActionTypes.REMOVE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload),
      };
    
    case ActionTypes.LOGOUT:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        error: null,
        notifications: [],
      };
    
    default:
      return state;
  }
};

// Context
const AppContext = createContext();

// Provider component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Initialize authentication state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        dispatch({ type: ActionTypes.SET_LOADING, payload: true });
        
        const token = localStorage.getItem('auth_token');
        if (token) {
          try {
            const response = await authService.getCurrentUser();
            dispatch({ type: ActionTypes.SET_USER, payload: response.data });
            dispatch({ type: ActionTypes.SET_AUTHENTICATED, payload: true });
          } catch (error) {
            // Token is invalid, clear it
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');
          }
        }
      } catch (error) {
        dispatch({ type: ActionTypes.SET_ERROR, payload: 'Failed to initialize authentication' });
      } finally {
        dispatch({ type: ActionTypes.SET_LOADING, payload: false });
      }
    };

    initializeAuth();
  }, []);

  // Actions
  const login = async (credentials) => {
    try {
      dispatch({ type: ActionTypes.SET_LOADING, payload: true });
      dispatch({ type: ActionTypes.CLEAR_ERROR });
      
      const response = await authService.login(credentials);
      dispatch({ type: ActionTypes.SET_USER, payload: response.data.user });
      dispatch({ type: ActionTypes.SET_AUTHENTICATED, payload: true });
      
      addNotification({
        type: 'success',
        message: 'Login successful!',
      });
      
      return response;
    } catch (error) {
      const errorMessage = apiUtils.handleError(error);
      dispatch({ type: ActionTypes.SET_ERROR, payload: errorMessage });
      throw error;
    } finally {
      dispatch({ type: ActionTypes.SET_LOADING, payload: false });
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      dispatch({ type: ActionTypes.LOGOUT });
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
    }
  };

  const updateUser = (userData) => {
    dispatch({ type: ActionTypes.SET_USER, payload: userData });
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const setError = (error) => {
    dispatch({ type: ActionTypes.SET_ERROR, payload: error });
  };

  const clearError = () => {
    dispatch({ type: ActionTypes.CLEAR_ERROR });
  };

  const addNotification = (notification) => {
    dispatch({ type: ActionTypes.ADD_NOTIFICATION, payload: notification });
    
    // Auto-remove notification after 5 seconds
    setTimeout(() => {
      removeNotification(notification.id || Date.now());
    }, 5000);
  };

  const removeNotification = (id) => {
    dispatch({ type: ActionTypes.REMOVE_NOTIFICATION, payload: id });
  };

  const hasRole = (role) => {
    return state.user?.role?.name === role;
  };

  const hasPermission = (permission) => {
    return state.user?.role?.permissions?.includes(permission);
  };

  const hasAnyRole = (roles) => {
    return roles.includes(state.user?.role?.name);
  };

  const hasAnyPermission = (permissions) => {
    return permissions.some(permission => 
      state.user?.role?.permissions?.includes(permission)
    );
  };

  const value = {
    // State
    ...state,
    
    // Actions
    login,
    logout,
    updateUser,
    setError,
    clearError,
    addNotification,
    removeNotification,
    
    // Utilities
    hasRole,
    hasPermission,
    hasAnyRole,
    hasAnyPermission,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the context
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

// Higher-order component for role-based access control
export const withRole = (Component, requiredRoles) => {
  return function RoleProtectedComponent(props) {
    const { hasAnyRole, isAuthenticated } = useApp();
    
    if (!isAuthenticated) {
      return <div>Please log in to access this page.</div>;
    }
    
    if (!hasAnyRole(requiredRoles)) {
      return <div>You don't have permission to access this page.</div>;
    }
    
    return <Component {...props} />;
  };
};

// Higher-order component for permission-based access control
export const withPermission = (Component, requiredPermissions) => {
  return function PermissionProtectedComponent(props) {
    const { hasAnyPermission, isAuthenticated } = useApp();
    
    if (!isAuthenticated) {
      return <div>Please log in to access this page.</div>;
    }
    
    if (!hasAnyPermission(requiredPermissions)) {
      return <div>You don't have permission to access this page.</div>;
    }
    
    return <Component {...props} />;
  };
};
