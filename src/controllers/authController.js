/**
 * Auth Controller
 *
 * Handles authentication logic using Supabase Auth.
 * Only admin users can login - customers don't need authentication.
 *
 * DO NOT modify the core authentication flow.
 * You CAN add additional auth-related features if needed.
 */

import { supabase } from '../services/supabaseClient';

const getConfiguredAdminEmails = () =>
  (import.meta.env.VITE_ADMIN_EMAILS || '')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

/**
 * Login with email and password (Admin only)
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} Auth session
 */
export const login = async (email, password) => {
  try {
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

/**
 * Register a new user (Customer)
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} Auth session
 */
export const register = async (email, password) => {
  try {
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

/**
 * Login or Register with Google OAuth
 * @returns {Promise<Object>}
 */
export const loginWithGoogle = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/catalog',
        skipBrowserRedirect: true,
      }
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Google OAuth error:', error);
    throw error;
  }
};

/**
 * Logout current user
 * @returns {Promise<void>}
 */
export const logout = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

/**
 * Get current authenticated user
 * @returns {Promise<Object|null>} Current user or null
 */
export const getCurrentUser = async () => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

/**
 * Check whether the current authenticated user is allowed to access admin features.
 * Uses the database role function when available, with an env email allowlist fallback
 * for local MVP demos before migrations are applied.
 *
 * @param {Object|null} user - Supabase auth user
 * @returns {Promise<boolean>} True when the user is an admin
 */
export const isCurrentUserAdmin = async (user) => {
  if (!user?.email) {
    return false;
  }

  const configuredAdminEmails = getConfiguredAdminEmails();
  if (configuredAdminEmails.includes(user.email.toLowerCase())) {
    return true;
  }

  try {
    const { data, error } = await supabase.rpc('is_admin');
    if (error) throw error;
    return data === true;
  } catch (error) {
    console.error('Admin role check error:', error);
    return false;
  }
};

/**
 * Get current session
 * @returns {Promise<Object|null>} Current session or null
 */
export const getSession = async () => {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session;
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
};

/**
 * Check if user is authenticated
 * @returns {Promise<boolean>} True if authenticated
 */
export const isAuthenticated = async () => {
  try {
    const session = await getSession();
    return session !== null;
  } catch (error) {
    console.error('Error checking authentication:', error);
    return false;
  }
};

/**
 * Listen to auth state changes
 * @param {Function} callback - Callback function to handle auth changes
 * @returns {Object} Subscription object
 */
export const onAuthStateChange = (callback) => {
  const { data } = supabase.auth.onAuthStateChange((event, session) => {
    (async () => {
      callback(event, session);
    })();
  });

  return data.subscription;
};
