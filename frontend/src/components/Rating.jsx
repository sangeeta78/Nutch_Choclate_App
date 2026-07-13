import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

// Renders 5 stars for a given rating value (0-5)
export default function Rating({ value = 0, count, size = 'text-sm' }) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (value >= i) stars.push(<FaStar key={i} />);
    else if (value >= i - 0.5) stars.push(<FaStarHalfAlt key={i} />);
    else stars.push(<FaRegStar key={i} />);
  }
  return (
    <div className={`flex items-center gap-1 text-gold ${size}`}>
      {stars}
      {count !== undefined && (
        <span className="ml-1 text-chocolate-light dark:text-cream/60">({count})</span>
      )}
    </div>
  );
}
