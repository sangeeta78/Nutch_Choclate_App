import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios.js';
import ProductCard from '../components/ProductCard.jsx';
import Loader from '../components/Loader.jsx';

const CATEGORIES = ['All', 'Homemade Chocolates', 'Dry Fruits', 'Nuts', 'Gift Boxes'];
const SORTS = [
  { value: '', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
];

export default function ProductList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);

  const keyword = searchParams.get('keyword') || '';
  const category = searchParams.get('category') || 'All';
  const sort = searchParams.get('sort') || '';
  const page = Number(searchParams.get('page') || 1);

  // Update a single query param while resetting to page 1 (except for page itself)
  const setParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    if (key !== 'page') next.set('page', '1');
    setSearchParams(next);
  };

  useEffect(() => {
    setLoading(true);
    const params = { page, limit: 12 };
    if (keyword) params.keyword = keyword;
    if (category && category !== 'All') params.category = category;
    if (sort) params.sort = sort;

    api
      .get('/products', { params })
      .then(({ data }) => {
        setProducts(data.products);
        setPages(data.pages);
        setTotal(data.total);
      })
      .finally(() => setLoading(false));
  }, [keyword, category, sort, page]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-2 font-serif text-3xl font-bold">
        {keyword ? `Results for "${keyword}"` : category === 'All' ? 'All Products' : category}
      </h1>
      <p className="mb-6 text-chocolate-light dark:text-cream/60">{total} products found</p>

      {/* Filters + sort */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setParam('category', c === 'All' ? '' : c)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                category === c
                  ? 'bg-chocolate text-cream dark:bg-gold dark:text-chocolate-dark'
                  : 'bg-white text-chocolate hover:bg-cream dark:bg-chocolate dark:text-cream'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <select
          value={sort}
          onChange={(e) => setParam('sort', e.target.value)}
          className="input md:w-56"
        >
          {SORTS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <Loader />
      ) : products.length === 0 ? (
        <p className="py-20 text-center text-chocolate-light dark:text-cream/60">
          No products match your search.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>

          {/* Pagination */}
          {pages > 1 && (
            <div className="mt-10 flex justify-center gap-2">
              {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setParam('page', String(p))}
                  className={`h-10 w-10 rounded-full font-medium transition ${
                    page === p
                      ? 'bg-gold text-chocolate-dark'
                      : 'bg-white text-chocolate hover:bg-cream dark:bg-chocolate dark:text-cream'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
