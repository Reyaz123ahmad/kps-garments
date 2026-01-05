import { useCart } from '../contexts/CartContext';

export const useCartHook = () => {
  return useCart();
};

export default useCartHook;