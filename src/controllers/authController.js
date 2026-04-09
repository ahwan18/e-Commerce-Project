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
