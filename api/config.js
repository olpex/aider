export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Повертаємо тільки публічний ключ — приватний ключ не видаємо
  const publicKey = process.env.VAPID_PUBLIC_KEY || null;

  return res.status(200).json({ VAPID_PUBLIC_KEY: publicKey });
}
