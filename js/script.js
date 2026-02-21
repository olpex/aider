document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navList = document.getElementById('navList');
    
    if (mobileMenuBtn && navList) {
        mobileMenuBtn.addEventListener('click', function() {
            navList.classList.toggle('active');
            this.textContent = navList.classList.contains('active') ? '✕' : '☰';
        });
        
        // Close menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navList.classList.remove('active');
                mobileMenuBtn.textContent = '☰';
            });
        });
    }
    
    // Tabs functionality
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Remove active class from all buttons and contents
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to current button and content
            this.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // Checklist score calculation
    const checkboxes = document.querySelectorAll('.check-input');
    const scoreValue = document.getElementById('scoreValue');
    const progressFill = document.getElementById('progressFill');
    const scoreMessage = document.getElementById('scoreMessage');
    
    const messages = {
        low: 'Почніть з базових налаштувань безпеки. Ваші пристрої вразливі!',
        medium: 'Непогано, але є ще над чим працювати. Перевірте пункти вище.',
        high: 'Чудно! Ваші пристрої мають гарний рівень захисту.',
        perfect: 'Відмінно! Ви дотримуєтесь усіх правил кібергігієни.'
    };
    
    function updateScore() {
        const checked = document.querySelectorAll('.check-input:checked').length;
        const total = checkboxes.length;
        const percentage = Math.round((checked / total) * 100);
        
        scoreValue.textContent = percentage + '%';
        progressFill.style.width = percentage + '%';
        
        let message;
        if (percentage === 0) message = 'Почніть виконувати пункти чекліста вище';
        else if (percentage < 40) message = messages.low;
        else if (percentage < 70) message = messages.medium;
        else if (percentage < 100) message = messages.high;
        else message = messages.perfect;
        
        scoreMessage.textContent = message;
        
        // Change color based on score
        if (percentage < 40) {
            progressFill.style.background = 'linear-gradient(90deg, #ef4444, #f59e0b)';
        } else if (percentage < 70) {
            progressFill.style.background = 'linear-gradient(90deg, #f59e0b, #eab308)';
        } else {
            progressFill.style.background = 'linear-gradient(90deg, #10b981, #2563eb)';
        }
    }
    
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateScore);
    });
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe cards and protection items
    document.querySelectorAll('.card, .protection-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Security tip of the day (random)
    const tips = [
        'Ніколи не використовуйте один і той самий пароль на різних сайтах!',
        'Перевіряйте адресну строку браузера перед введенням паролів.',
        'Вимикайте автопідключення до Wi-Fi мереж.',
        'Регулярно перевіряйте список активних сесій у соціальних мережах.',
        'Не відкривайте вкладення в листах від невідомих відправників.'
    ];
    
    console.log('💡 Порада дня: ' + tips[Math.floor(Math.random() * tips.length)]);
});
