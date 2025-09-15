import { useState, useEffect, useCallback } from 'react';
import { apiUtils } from '../services/api';

// Custom hook for API calls with loading and error states
export const useApi = (apiFunction, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiFunction(...args);
      setData(result);
      return result;
    } catch (err) {
      const errorMessage = apiUtils.handleError(err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, dependencies);

  return { data, loading, error, execute };
};

// Hook for managing request state
export const useRequest = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (apiFunction, ...args) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiFunction(...args);
      return result;
    } catch (err) {
      const errorMessage = apiUtils.handleError(err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, execute };
};

// Hook for managing pagination
export const usePagination = (apiFunction, initialParams = {}) => {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [params, setParams] = useState(initialParams);

  const fetchData = useCallback(async (page = 1, newParams = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const queryParams = {
        ...params,
        ...newParams,
        page,
      };
      
      const result = await apiFunction(queryParams);
      setData(result.data);
      setPagination({
        current_page: result.current_page,
        last_page: result.last_page,
        per_page: result.per_page,
        total: result.total,
      });
      setParams(queryParams);
    } catch (err) {
      const errorMessage = apiUtils.handleError(err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [apiFunction, params]);

  const nextPage = useCallback(() => {
    if (pagination.current_page < pagination.last_page) {
      fetchData(pagination.current_page + 1);
    }
  }, [fetchData, pagination.current_page, pagination.last_page]);

  const prevPage = useCallback(() => {
    if (pagination.current_page > 1) {
      fetchData(pagination.current_page - 1);
    }
  }, [fetchData, pagination.current_page]);

  const goToPage = useCallback((page) => {
    if (page >= 1 && page <= pagination.last_page) {
      fetchData(page);
    }
  }, [fetchData, pagination.last_page]);

  const refresh = useCallback(() => {
    fetchData(pagination.current_page);
  }, [fetchData, pagination.current_page]);

  const updateParams = useCallback((newParams) => {
    fetchData(1, newParams);
  }, [fetchData]);

  useEffect(() => {
    fetchData();
  }, []);

  return {
    data,
    pagination,
    loading,
    error,
    nextPage,
    prevPage,
    goToPage,
    refresh,
    updateParams,
  };
};

// Hook for managing form state
export const useForm = (initialValues = {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = useCallback((name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  }, [errors]);

  const handleBlur = useCallback((name) => {
    setTouched(prev => ({ ...prev, [name]: true }));
  }, []);

  const setValue = useCallback((name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
  }, []);

  const setError = useCallback((name, error) => {
    setErrors(prev => ({ ...prev, [name]: error }));
  }, []);

  const setFieldError = useCallback((name, error) => {
    setErrors(prev => ({ ...prev, [name]: error }));
    setTouched(prev => ({ ...prev, [name]: true }));
  }, []);

  const reset = useCallback((newValues = initialValues) => {
    setValues(newValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  const validate = useCallback((validationRules) => {
    const newErrors = {};
    
    Object.keys(validationRules).forEach(field => {
      const rules = validationRules[field];
      const value = values[field];
      
      if (rules.required && (!value || value.toString().trim() === '')) {
        newErrors[field] = `${field} is required`;
      } else if (rules.minLength && value && value.length < rules.minLength) {
        newErrors[field] = `${field} must be at least ${rules.minLength} characters`;
      } else if (rules.maxLength && value && value.length > rules.maxLength) {
        newErrors[field] = `${field} must be no more than ${rules.maxLength} characters`;
      } else if (rules.email && value && !/\S+@\S+\.\S+/.test(value)) {
        newErrors[field] = `${field} must be a valid email`;
      } else if (rules.pattern && value && !rules.pattern.test(value)) {
        newErrors[field] = `${field} format is invalid`;
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [values]);

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    setValue,
    setError,
    setFieldError,
    reset,
    validate,
  };
};

// Hook for managing authentication state
export const useAuth = () => {
  const [user, setUser] = useState(() => apiUtils.getCurrentUser());
  const [isAuthenticated, setIsAuthenticated] = useState(() => apiUtils.isAuthenticated());

  const login = useCallback((userData, token) => {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const updateUser = useCallback((userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  }, []);

  const hasRole = useCallback((role) => {
    return user?.role?.name === role;
  }, [user]);

  const hasPermission = useCallback((permission) => {
    return user?.role?.permissions?.includes(permission);
  }, [user]);

  return {
    user,
    isAuthenticated,
    login,
    logout,
    updateUser,
    hasRole,
    hasPermission,
  };
};
