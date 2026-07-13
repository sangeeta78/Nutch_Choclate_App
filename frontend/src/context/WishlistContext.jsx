import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axios.js';
import { useAuth } from './AuthContext.jsx';

const WishlistContext = createContext();
export const useWishlist = () => useContext(WishlistContext);

export function WishlistProvider({ children }) {
  const { user } = useAuth();
  const [ids, setIds] = useState([]); // array of product ids
  const [products, setProducts] = useState([]);

  const refresh = useCallback(async () => {
    if (!user) {
      setIds([]);
      setProducts([]);
      return;
    }
    try {
      const { data } = await api.get('/users/wishlist');
      setProducts(data.wishlist);
      setIds(data.wishlist.map((p) => p._id));
    } catch {
      /* ignore */
    }
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const toggle = async (product) => {
    if (!user) {
      toast.error('Please log in to use your wishlist');
      return;
    }
    try {
      const { data } = await api.post(`/users/wishlist/${product._id}`);
      setIds(data.wishlist);
      toast.success(data.added ? 'Added to wishlist' : 'Removed from wishlist');
      refresh();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const isWishlisted = (id) => ids.includes(id);

  return (
    <WishlistContext.Provider value={{ products, ids, toggle, isWishlisted, refresh }}>
      {children}
    </WishlistContext.Provider>
  );
}
