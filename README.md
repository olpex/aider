# Claude Code Tracker

Автономний трекер для відстеження можливостей отримати Claude Code безкоштовно.

## Функції

- 🤖 **Автоматичний моніторинг**: Щоденна перевірка джерел (Anthropic блог, Reddit, GitHub)
- 🔔 **Push-сповіщення**: Миттєві сповіщення про нові пропозиції
- 📱 **PWA**: Встановлюваний веб-додаток
- ⚡ **Serverless**: Розгортається на Vercel з cron-завданнями

## Розгортання на Vercel

1. Встановіть Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Залогіньтесь:
   ```bash
   vercel login
   ```

3. Розгорніть:
   ```bash
   vercel --prod
   ```

4. Налаштуйте змінні оточення (для сповіщень):
   ```bash
   vercel env add VAPID_PUBLIC_KEY
   vercel env add VAPID_PRIVATE_KEY
   ```

## Налаштування Push-сповіщень

1. Згенеруйте VAPID ключі:
   ```bash
   npx web-push generate-vapid-keys
   ```

2. Додайте їх у `js/app.js` та `api/notify.js`

3. Оновіть `vercel.json` з вашими налаштуваннями

## Структура

- `/api/check-updates.js` - API для перевірки оновлень (cron щоденно о 9:00)
- `/api/subscribe.js` - Керування підписками на сповіщення
- `/api/notify.js` - Відправка push-сповіщень
- `/js/app.js` - Логіка фронтенду
- `/sw.js` - Service Worker для фонової роботи

## Ліцензія

MIT
