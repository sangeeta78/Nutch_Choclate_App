/**
 * Small shared helpers for IDs and mock email.
 */

// Generate a human-friendly order id like ORD-20260713-8F3A2
export const generateOrderId = () => {
  const date = new Date();
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `ORD-${y}${m}${d}-${rand}`;
};

// Generate a transaction id like TXN-1720865400000-4KD9
export const generateTransactionId = () => {
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `TXN-${Date.now()}-${rand}`;
};

// Turn a product name into a URL slug
export const slugify = (text) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

/**
 * Mock email sender. In production, swap this for nodemailer / an email API.
 * Here we simply log so the flow is observable during development.
 */
export const sendMockEmail = ({ to, subject, body }) => {
  console.log('\n📧 [MOCK EMAIL]');
  console.log(`   To: ${to}`);
  console.log(`   Subject: ${subject}`);
  console.log(`   Body: ${body}\n`);
  return Promise.resolve({ delivered: true });
};
