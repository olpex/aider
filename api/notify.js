// Ендпоінт для відправки сповіщень (викликається cron або вручну)
import webpush from 'web-push';

// Налаштування ключів (у продакшені використовуйте env variables)
const VAPID_PUBLIC_KEY = 'BEl62iM...'; // Замініть на реальні ключі
const VAPID_PRIVATE_KEY = 'your-private-key';
const VAPID_SUBJECT = 'mailto:admin@example.com';

webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { title, body, url } = req.body;
    
    // Тут логіка відправки всім підписникам
    // Для демо просто повертаємо success
    
    return res.status(200).json({
      success: true,
      message: `Сповіщення "${title}" поставлено в чергу`,
      sent: 0 // кількість відправлених
    });
    
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
