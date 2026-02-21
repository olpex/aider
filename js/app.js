// Service Worker реєстрація для push-сповіщень
let swRegistration = null;

document.addEventListener('DOMContentLoaded', () => {
  // Оновлення часу в футері
  document.getElementById('footerTime').textContent = new Date().toLocaleString('uk-UA');
  
  // Реєстрація Service Worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('SW registered:', registration);
        swRegistration = registration;
      })
      .catch(error => {
        console.log('SW registration failed:', error);
      });
  }
  
  // Завантаження останніх даних
  loadUpdates();
  
  // Автоматичне оновлення кожні 5 хвилин
  setInterval(loadUpdates, 300000);
});

// Функція підписки на сповіщення
async function subscribeToNotifications() {
  if (!('Notification' in window)) {
    showToast('Ваш браузер не підтримує сповіщення');
    return;
  }
  
  if (!('serviceWorker' in navigator)) {
    showToast('Service Worker не підтримується');
    return;
  }
  
  try {
    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
      // Генерація ключів для push (у реальному проєкті - з сервера)
      const subscription = await swRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          'BEl62iMfZ7f6G0K0g8Jg8g8g8g8g8g8g8g8g8g8g8g8g8g8g8g8g8g8g8g8g8g' // Замініть на реальний VAPID ключ
        )
      });
      
      // Відправка підписки на сервер
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscription, type: 'subscribe' })
      });
      
      if (response.ok) {
        showToast('✅ Ви підписані на щоденні оновлення!');
        document.getElementById('subscribeBtn').textContent = 'Активно ✓';
        document.getElementById('subscribeBtn').disabled = true;
      }
    } else {
      showToast('Дозвольте сповіщення в налаштуваннях браузера');
    }
  } catch (error) {
    console.error('Subscription error:', error);
    showToast('Помилка підписки: ' + error.message);
  }
}

// Завантаження оновлень з API
async function loadUpdates() {
  try {
    const response = await fetch('/api/check-updates');
    const data = await response.json();
    
    if (data.success) {
      updateUI(data.data);
    }
  } catch (error) {
    console.error('Failed to load updates:', error);
  }
}

// Оновлення інтерфейсу
function updateUI(data) {
  // Оновлення часу останньої перевірки
  const lastCheck = new Date(data.timestamp);
  document.getElementById('lastCheck').textContent = 
    lastCheck.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' });
  
  // Оновлення кількості пропозицій
  document.getElementById('activeOffers').textContent = data.foundOffers.length;
  
  // Додавання в лог
  const logContainer = document.getElementById('updateLog');
  const newLogItem = document.createElement('div');
  newLogItem.className = 'log-item';
  newLogItem.innerHTML = `
    <div class="log-time">${lastCheck.toLocaleString('uk-UA')}</div>
    <div class="log-content">Автоматична перевірка: ${data.sourcesChecked.reduce((acc, s) => acc + (s.newPosts || 0), 0)} нових записів</div>
  `;
  logContainer.insertBefore(newLogItem, logContainer.firstChild);
}

// Перевірка API Credits (імітація)
function checkApiCredits() {
  showToast('Перевірка доступності API Credits...');
  setTimeout(() => {
    showToast('✅ Доступно! Перейдіть на console.anthropic.com');
  }, 1500);
}

// Утиліта для конвертації ключа
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');
  
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// Показ toast-повідомлення
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// Симуляція отримання push-сповіщення (для демо)
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('message', event => {
    if (event.data && event.data.type === 'PUSH_NOTIFICATION') {
      showToast(`🔔 ${event.data.title}: ${event.data.body}`);
    }
  });
}
