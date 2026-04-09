/**
 * Product Model
 *
 * Handles all database operations related to products.
 * This layer should ONLY contain data access logic - no business logic.
 *
 * DO NOT modify the structure of these functions.
 * Each function has a single responsibility: interact with the database.
 */

import { supabase } from '../services/supabaseClient';

/**
 * Fetch all products with their category information
 * @returns {Promise<Array>} Array of product objects with category data
 */
export const getAllProducts = async () => {
  const { data, error } = await supabase
    .from('products')
    .select(
      `
      *,
      category:categories(id, name)
    `
    )
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

/**
 * Fetch products by category (supports both old and new taxonomy)
 * @param {string} categoryId - Category ID (old taxonomy)
 * @returns {Promise<Array>} Array of products in the category
 */
export const getProductsByCategory = async (categoryId) => {
  const { data, error } = await supabase
    .from('products')
    .select(
      `
      *,
      category:categories(id, name)
    `
    )
    .eq('category_id', categoryId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

/**
 * Fetch products by parent category (new hybrid taxonomy)
 * @param {string} parentCategory - Parent category name
 * @returns {Promise<Array>} Array of products in the parent category
 */
export const getProductsByParentCategory = async (parentCategory) => {
  const { data, error } = await supabase
    .from('products')
    .select(
      `
      *,
      category:categories(id, name)
    `
    )
    .eq('parent_category', parentCategory)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

/**
 * Advanced filtering with multiple attributes
 * @param {Object} filters - Filter object
 * @param {string} filters.parentCategory - Parent category name
 * @param {string} filters.material - Product material
 * @param {string} filters.genderTheme - Gender theme (laki-laki, perempuan, unisex)
 * @param {string} filters.movementType - Movement type
 * @param {string} filters.size - Product size
 * @param {number} filters.minPrice - Minimum price
 * @param {number} filters.maxPrice - Maximum price
 * @param {string} filters.tags - Comma-separated tags to search
 * @returns {Promise<Array>} Filtered products
 */
export const getProductsByFilters = async (filters = {}) => {
  let query = supabase
    .from('products')
    .select(
      `
      *,
      category:categories(id, name)
    `
    )
    .gt('stock', 0);

  if (filters.parentCategory) {
    query = query.eq('parent_category', filters.parentCategory);
  }

  if (filters.material) {
    query = query.eq('material', filters.material);
  }

  if (filters.genderTheme) {
    query = query.eq('gender_theme', filters.genderTheme);
  }

  if (filters.movementType) {
    query = query.eq('movement_type', filters.movementType);
  }

  if (filters.size) {
    query = query.eq('size', filters.size);
  }

  if (filters.minPrice !== undefined) {
    query = query.gte('price', filters.minPrice);
  }

  if (filters.maxPrice !== undefined) {
    query = query.lte('price', filters.maxPrice);
  }

  if (filters.tags) {
    const tagArray = filters.tags.split(',').map(t => t.trim().toLowerCase());
    query = query.overlaps('tags', tagArray);
  }

  query = query.order('created_at', { ascending: false });

  const { data, error } = await query;
  if (error) throw error;
  return data;
};

/**
 * Get distinct values for filter attributes (for UI dropdowns)
 * @param {string} attribute - Attribute name (material, gender_theme, movement_type, size, parent_category)
 * @returns {Promise<Array>} Distinct values
 */
export const getFilterOptions = async (attribute) => {
  const columnMap = {
    material: 'material',
    gender_theme: 'gender_theme',
    movement_type: 'movement_type',
    size: 'size',
    parent_category: 'parent_category',
  };

  const column = columnMap[attribute];
  if (!column) throw new Error('Invalid attribute');

  const { data, error } = await supabase
    .from('products')
    .select(column)
    .neq(column, '')
    .neq(column, null);

  if (error) throw error;

  const uniqueValues = [...new Set(data.map(item => item[column]))].filter(Boolean);
  return uniqueValues;
};

/**
 * Fetch a single product by ID
 * @param {string} id - Product ID
 * @returns {Promise<Object>} Product object with category data
 */
export const getProductById = async (id) => {
  const { data, error } = await supabase
    .from('products')
    .select(
      `
      *,
      category:categories(id, name)
    `
    )
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data;
};

/**
 * Create a new product
 * @param {Object} productData - Product data
 * @returns {Promise<Object>} Created product
 */
export const createProduct = async (productData) => {
  const { data, error } = await supabase
    .from('products')
    .insert([productData])
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Update an existing product
 * @param {string} id - Product ID
 * @param {Object} productData - Updated product data
 * @returns {Promise<Object>} Updated product
 */
export const updateProduct = async (id, productData) => {
  const { data, error } = await supabase
    .from('products')
    .update(productData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Delete a product
 * @param {string} id - Product ID
 * @returns {Promise<void>}
 */
export const deleteProduct = async (id) => {
  const { error } = await supabase.from('products').delete().eq('id', id);

  if (error) throw error;
};

/**
 * Update product stock
 * @param {string} id - Product ID
 * @param {number} quantity - Quantity to add (positive) or subtract (negative)
 * @returns {Promise<Object>} Updated product
 */
export const updateProductStock = async (id, quantity) => {
  const { data, error } = await supabase.rpc('update_product_stock', {
    product_id: id,
    quantity_change: quantity,
  });

  if (error) {
    const product = await getProductById(id);
    const newStock = product.stock + quantity;

    if (newStock < 0) {
      throw new Error('Insufficient stock');
    }

    return await updateProduct(id, { stock: newStock });
  }

  return data;
};
