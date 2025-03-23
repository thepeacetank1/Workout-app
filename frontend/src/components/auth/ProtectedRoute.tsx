import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { fetchUserProfile } from '../../store/slices/authSlice';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectPath?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  redirectPath = '/login',
}) => {
  const { isAuthenticated, token, user, isLoading } = useSelector(
    (state: RootState) => state.auth
  );
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    // If we have a token but no user data, fetch the profile
    if (token && !user && !isLoading) {
      dispatch(fetchUserProfile());
    }
  }, [token, user, isLoading, dispatch]);

  // Show loading state while verifying user
  if (isLoading) {
    return <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      flexDirection: 'column',
      gap: '16px'
    }}>
      <div>Loading your dashboard...</div>
      <div>Please wait while we retrieve your data</div>
    </div>;
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  // If authenticated, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;