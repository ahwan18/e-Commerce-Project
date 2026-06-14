/**
 * Auth Context
 *
 * Provides authentication state management for admin users.
 * Uses React Context API with Supabase Auth.
 *
 * DO NOT modify the core auth flow.
 * You CAN add additional auth-related state if needed.
 */

import { createContext, useContext, useState, useEffect } from 'react';
import * as AuthController from '../controllers/authController';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkUser();

    const subscription = AuthController.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        const nextUser = session?.user ?? null;
        setUser(nextUser);
        setIsAdmin(await AuthController.isCurrentUserAdmin(nextUser));
        setLoading(false);
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const checkUser = async () => {
    try {
      const currentSession = await AuthController.getSession();
      setSession(currentSession);
      const currentUser = currentSession?.user ?? null;
      setUser(currentUser);
      setIsAdmin(await AuthController.isCurrentUserAdmin(currentUser));
    } catch (error) {
      console.error('Error checking user:', error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email, password) => {
    try {
      setLoading(true);
      const data = await AuthController.login(email, password);
      const nextIsAdmin = await AuthController.isCurrentUserAdmin(data.user);
      setSession(data.session);
      setUser(data.user);
      setIsAdmin(nextIsAdmin);
      return { success: true, isAdmin: nextIsAdmin };
    } catch (error) {
      console.error('Sign in error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email, password) => {
    try {
      setLoading(true);
      const data = await AuthController.register(email, password);
      if (data.session) {
        setSession(data.session);
        setUser(data.user);
        setIsAdmin(await AuthController.isCurrentUserAdmin(data.user));
      }
      return { success: true, message: data.session ? null : 'Check your email for confirmation link' };
    } catch (error) {
      console.error('Sign up error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      const data = await AuthController.loginWithGoogle();
      return { success: true, url: data?.url };
    } catch (error) {
      console.error('Google sign in error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await AuthController.logout();
      sessionStorage.removeItem('auth_login_surface');
      setSession(null);
      setUser(null);
      setIsAdmin(false);
      return { success: true };
    } catch (error) {
      console.error('Sign out error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    isAuthenticated: !!user,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
