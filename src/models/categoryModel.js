/**
 * Category Model
 *
 * Handles all database operations related to categories.
 * This layer should ONLY contain data access logic - no business logic.
 *
 * DO NOT modify the structure of these functions.
 * Each function has a single responsibility: interact with the database.
 */

import { supabase } from '../services/supabaseClient';

/**
 * Fetch all categories from database
 * @returns {Promise<Array>} Array of category objects
 */
export const getAllCategories = async () => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name', { ascending: true });

  if (error) throw error;
  return data;
};

/**
 * Fetch a single category by ID
 * @param {string} id - Category ID
 * @returns {Promise<Object>} Category object
 */
export const getCategoryById = async (id) => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data;
};

/**
 * Create a new category
 * @param {Object} categoryData - Category data
 * @param {string} categoryData.name - Category name
 * @param {string} categoryData.description - Category description
 * @returns {Promise<Object>} Created category
 */
export const createCategory = async (categoryData) => {
  const { data, error } = await supabase
    .from('categories')
    .insert([categoryData])
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Update an existing category
 * @param {string} id - Category ID
 * @param {Object} categoryData - Updated category data
 * @returns {Promise<Object>} Updated category
 */
export const updateCategory = async (id, categoryData) => {
  const { data, error } = await supabase
    .from('categories')
    .update(categoryData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Delete a category
 * @param {string} id - Category ID
 * @returns {Promise<void>}
 */
export const deleteCategory = async (id) => {
  const { error } = await supabase.from('categories').delete().eq('id', id);

  if (error) throw error;
};
