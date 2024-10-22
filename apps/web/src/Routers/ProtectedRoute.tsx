import React, { useEffect } from "react";
import { AppState, useAppDispatch, useAppSelector } from "@/store/store";
import { Navigate, useLocation } from "react-router";
import { logoutUser, whoAmI } from "@/store/actions/authActions";
import {
  setIsAuthenticated,
  setIsAuthenticating,
  setUser,
} from "@/store/reducers/authReducer";
import toast from "react-hot-toast";
import cookieStorage from "@/utils/cookieStorage";
import { Loading } from "@/components/common/Loading";

type Props = {
  component: React.ComponentType<any>;
  [x: string]: any; // Any additional props
};

const ProtectedRoute: React.FC<Props> = ({ component: Component, ...rest }) => {
  const location = useLocation();
  const dispatch = useAppDispatch();

  const { isAuthenticated, isAuthenticating, user } = useAppSelector(
    (state: AppState) => state.auth
  );

  // Helper to check the current user's session
  const checkCurrentUser = async () => {
    const accessToken = cookieStorage.getItem("accessToken");

    if (!accessToken) {
      // No access token, user is unauthenticated, redirect to login
      return false;
    }

    try {
      // Dispatch the whoAmI thunk only if the user isn't set yet
      const resultAction = await dispatch(whoAmI());

      // Handle rejected login (401, etc.)
      if (whoAmI.rejected.match(resultAction)) {
        // toast.error(resultAction.payload as string);
        return false; // Not authenticated
      }

      return true; // Successfully authenticated
    } catch (error) {
      console.error("Failed to authenticate: ", error);
      return false;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      // Only check authentication if user is null and we're not already authenticating
      if (isAuthenticated && !user && !isAuthenticating) {
        const success = await checkCurrentUser();

        if (!success) {
          // Redirect to login if authentication fails
          dispatch(setIsAuthenticated(false));
          dispatch(logoutUser());
        } else {
          dispatch(setIsAuthenticating(false));
        }
      }
    };

    initializeAuth();
  }, [isAuthenticated, user, dispatch]);

  // Handle loading state
  if (isAuthenticating) {
    return (
      
          <div className="w-full h-screen flex items-center gap-[20px] justify-center">
    <Loading color="fill-blue-600"/> loading
          </div>
      
    );
  }

  // Redirect to login page if not authenticated
  if (!isAuthenticated && !isAuthenticating) {
    return <Navigate to="/auth/login" state={{ from: location }} />;
  }

  // If authenticated, render the protected component
  return <Component {...rest} />;
};

export default ProtectedRoute;
