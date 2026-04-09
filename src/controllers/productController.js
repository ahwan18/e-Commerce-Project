/**
 * Product Controller
 *
 * Handles business logic for product-related operations.
 * This layer coordinates between the Model and View.
 *
 * You CAN modify these functions to add new business logic,
 * but maintain the single responsibility principle.
 */

import * as ProductModel from '../models/productModel';
import * as CategoryModel from '../models/categoryModel';

/**
 * Get all products with category information
 * @returns {Promise<Array>} Formatted products
 */
export const fetchAllProducts = async () => {
  try {
    const products = await ProductModel.getAllProducts();
    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw new Error('Failed to load products');
  }
};

/**
 * Get products filtered by category (old taxonomy)
 * @param {string} categoryId - Category ID to filter by
 * @returns {Promise<Array>} Filtered products
 */
export const fetchProductsByCategory = async (categoryId) => {
  try {
    if (!categoryId || categoryId === 'all') {
      return await fetchAllProducts();
    }
    const products = await ProductModel.getProductsByCategory(categoryId);
    return products;
  } catch (error) {
    console.error('Error fetching products by category:', error);
    throw new Error('Failed to load products');
  }
};

/**
 * Get products filtered by parent category (new hybrid taxonomy)
 * @param {string} parentCategory - Parent category name
 * @returns {Promise<Array>} Filtered products
 */
export const fetchProductsByParentCategory = async (parentCategory) => {
  try {
    if (!parentCategory || parentCategory === 'all') {
      return await fetchAllProducts();
    }
    const products = await ProductModel.getProductsByParentCategory(parentCategory);
    return products;
  } catch (error) {
    console.error('Error fetching products by parent category:', error);
    throw new Error('Failed to load products');
  }
};

/**
 * Get products with advanced filtering
 * @param {Object} filters - Filter criteria
 * @returns {Promise<Array>} Filtered products
 */
export const fetchProductsByFilters = async (filters = {}) => {
  try {
    const products = await ProductModel.getProductsByFilters(filters);
    return products;
  } catch (error) {
    console.error('Error fetching filtered products:', error);
    throw new Error('Failed to load products');
  }
};

/**
 * Get filter options for UI dropdowns
 * @param {string} attribute - Filter attribute name
 * @returns {Promise<Array>} Available filter options
 */
export const getFilterOptions = async (attribute) => {
  try {
    const options = await ProductModel.getFilterOptions(attribute);
    return options;
  } catch (error) {
    console.error('Error fetching filter options:', error);
    throw new Error('Failed to load filter options');
  }
};

/**
 * Get a single product with full details
 * @param {string} productId - Product ID
 * @returns {Promise<Object>} Product details
 */
export const fetchProductDetails = async (productId) => {
  try {
    const product = await ProductModel.getProductById(productId);
    if (!product) {
      throw new Error('Product not found');
    }
    return product;
  } catch (error) {
    console.error('Error fetching product details:', error);
    throw error;
  }
};

/**
 * Create a new product (Admin only)
 * @param {Object} productData - Product information
 * @returns {Promise<Object>} Created product
 */
export const addProduct = async (productData) => {
  try {
    if (!productData.name || !productData.price) {
      throw new Error('Product name and price are required');
    }

    if (productData.price < 0) {
      throw new Error('Price cannot be negative');
    }

    if (productData.stock < 0) {
      throw new Error('Stock cannot be negative');
    }

    const newProduct = await ProductModel.createProduct({
      name: productData.name,
      description: productData.description || '',
      price: parseFloat(productData.price),
      stock: parseInt(productData.stock) || 0,
      image_url: productData.image_url || null,
      category_id: productData.category_id || null,
      parent_category: productData.parent_category || null,
      material: productData.material || '',
      gender_theme: productData.gender_theme || 'unisex',
      movement_type: productData.movement_type || 'manual',
      size: productData.size || 'sedang',
      tags: productData.tags || '',
    });

    return newProduct;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

/**
 * Update an existing product (Admin only)
 * @param {string} productId - Product ID
 * @param {Object} productData - Updated product data
 * @returns {Promise<Object>} Updated product
 */
export const editProduct = async (productId, productData) => {
  try {
    if (productData.price && productData.price < 0) {
      throw new Error('Price cannot be negative');
    }

    if (productData.stock && productData.stock < 0) {
      throw new Error('Stock cannot be negative');
    }

    const updateData = {};
    if (productData.name !== undefined) updateData.name = productData.name;
    if (productData.description !== undefined)
      updateData.description = productData.description;
    if (productData.price !== undefined)
      updateData.price = parseFloat(productData.price);
    if (productData.stock !== undefined)
      updateData.stock = parseInt(productData.stock);
    if (productData.image_url !== undefined)
      updateData.image_url = productData.image_url;
    if (productData.category_id !== undefined)
      updateData.category_id = productData.category_id;
    if (productData.parent_category !== undefined)
      updateData.parent_category = productData.parent_category;
    if (productData.material !== undefined)
      updateData.material = productData.material;
    if (productData.gender_theme !== undefined)
      updateData.gender_theme = productData.gender_theme;
    if (productData.movement_type !== undefined)
      updateData.movement_type = productData.movement_type;
    if (productData.size !== undefined)
      updateData.size = productData.size;
    if (productData.tags !== undefined)
      updateData.tags = productData.tags;

    const updatedProduct = await ProductModel.updateProduct(
      productId,
      updateData
    );
    return updatedProduct;
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

/**
 * Delete a product (Admin only)
 * @param {string} productId - Product ID
 * @returns {Promise<void>}
 */
export const removeProduct = async (productId) => {
  try {
    await ProductModel.deleteProduct(productId);
  } catch (error) {
    console.error('Error deleting product:', error);
    throw new Error('Failed to delete product');
  }
};

/**
 * Get all categories
 * @returns {Promise<Array>} Categories
 */
export const fetchCategories = async () => {
  try {
    const categories = await CategoryModel.getAllCategories();
    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw new Error('Failed to load categories');
  }
};

/**
 * Create a new category (Admin only)
 * @param {Object} categoryData - Category data
 * @returns {Promise<Object>} Created category
 */
export const addCategory = async (categoryData) => {
  try {
    if (!categoryData.name) {
      throw new Error('Category name is required');
    }

    const newCategory = await CategoryModel.createCategory({
      name: categoryData.name,
      description: categoryData.description || '',
    });

    return newCategory;
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
};

/**
 * Update a category (Admin only)
 * @param {string} categoryId - Category ID
 * @param {Object} categoryData - Updated category data
 * @returns {Promise<Object>} Updated category
 */
export const editCategory = async (categoryId, categoryData) => {
  try {
    const updatedCategory = await CategoryModel.updateCategory(
      categoryId,
      categoryData
    );
    return updatedCategory;
  } catch (error) {
    console.error('Error updating category:', error);
    throw error;
  }
};

/**
 * Delete a category (Admin only)
 * @param {string} categoryId - Category ID
 * @returns {Promise<void>}
 */
export const removeCategory = async (categoryId) => {
  try {
    await CategoryModel.deleteCategory(categoryId);
  } catch (error) {
    console.error('Error deleting category:', error);
    throw new Error('Failed to delete category');
  }
};
