import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as ProductController from '../controllers/productController';

const STOCK_CHECK_ERROR = {
  message: 'Gagal memeriksa stok terbaru. Coba refresh halaman sebelum checkout.',
};

export const useCartStockValidation = (cart, validateCart) => {
  const [stockErrors, setStockErrors] = useState([]);
  const [validatingStock, setValidatingStock] = useState(false);
  const validateCartRef = useRef(validateCart);

  useEffect(() => {
    validateCartRef.current = validateCart;
  }, [validateCart]);

  const blockedItems = useMemo(
    () => cart.filter((item) => item.unavailable || item.stock <= 0),
    [cart]
  );

  const hasCheckoutBlocker = blockedItems.length > 0;

  const validateCurrentStock = useCallback(async () => {
    if (cart.length === 0) {
      setStockErrors([]);
      return { valid: true, errors: [] };
    }

    try {
      setValidatingStock(true);
      const products = await ProductController.fetchAllProducts();
      const validation = validateCartRef.current(products);
      setStockErrors(validation.errors || []);
      return validation;
    } catch (error) {
      setStockErrors([STOCK_CHECK_ERROR]);
      return { valid: false, errors: [STOCK_CHECK_ERROR] };
    } finally {
      setValidatingStock(false);
    }
  }, [cart.length]);

  const showBlockedItems = useCallback(() => {
    const errors = blockedItems.map((item) => ({
      productId: item.id,
      type: 'out_of_stock',
      message: `${item.name} sedang habis. Hapus produk ini dari keranjang untuk melanjutkan checkout.`,
    }));
    setStockErrors(errors);
    return errors;
  }, [blockedItems]);

  useEffect(() => {
    validateCurrentStock();
  }, [validateCurrentStock]);

  return {
    blockedItems,
    hasCheckoutBlocker,
    stockErrors,
    validatingStock,
    setStockErrors,
    showBlockedItems,
    validateCurrentStock,
  };
};
