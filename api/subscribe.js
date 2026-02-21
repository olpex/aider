// Тимчасове сховище підписок (у продакшені використовуйте Vercel KV або базу даних)
let subscriptions = [];

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    try {
      const { subscription, type } = req.body;
      
      if (type === 'subscribe') {
        // Зберігаємо підписку
        subscriptions.push({
          ...subscription,
          createdAt: new Date().toISOString()
        });
        
        console.log('New subscription:', subscription.endpoint);
        
        return res.status(200).json({ 
          success: true, 
          message: 'Підписку активовано' 
        });
      }
      
      if (type === 'unsubscribe') {
        subscriptions = subscriptions.filter(
          sub => sub.endpoint !== subscription.endpoint
        );
        return res.status(200).json({ 
          success: true, 
          message: 'Підписку деактивовано' 
        });
      }

    } catch (error) {
      return res.status(500).json({ 
        success: false, 
        error: error.message 
      });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
