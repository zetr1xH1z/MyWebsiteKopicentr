let touchStartX = 0;
let touchEndX = 0;

function initMobileReviews() {
    const carousel = document.getElementById('reviewsCarousel');
    const thumb = document.getElementById('reviewSliderThumb');
    if (!carousel) return;

    carousel.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    }, {passive: true});

    carousel.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, {passive: true});

    carousel.addEventListener('click', e => {
        const rect = carousel.getBoundingClientRect();
        const x = e.clientX - rect.left;
        if (x < rect.width * 0.3) {
            const newIndex = (currentReviewIndex - 1 + reviewsData.length) % reviewsData.length;
            moveToCenter(newIndex);
        } else if (x > rect.width * 0.7) {
            const newIndex = (currentReviewIndex + 1) % reviewsData.length;
            moveToCenter(newIndex);
        }
    });
}

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            const newIndex = (currentReviewIndex + 1) % reviewsData.length;
            moveToCenter(newIndex);
        } else {
            const newIndex = (currentReviewIndex - 1 + reviewsData.length) % reviewsData.length;
            moveToCenter(newIndex);
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    initMobileReviews();
    
    const thumb = document.getElementById('reviewSliderThumb');
    if (thumb) {
        const step = 100 / reviewsData.length;
        thumb.style.width = step + '%';
        thumb.style.left = (step * currentReviewIndex) + '%';
    }
});

function toggleReviews() {
    const box = document.getElementById('reviews-box');
    const arrow = document.getElementById('reviews-arrow');
    const header = document.querySelector('.section-header3');
    
    box.classList.toggle('open');
    header.classList.toggle('active');
    
    if (box.classList.contains('open')) {
        arrow.style.transform = 'rotate(180deg)';
    } else {
        arrow.style.transform = 'rotate(0deg)';
    }
}

const reviewsData = [
    {
        name: "Алина Потапова",
        stars: 5,
        text: "Отличный сервис и качество печати!",
        date: "20.03.2026",
        half: false
    },
    {
        name: "Кирилл Токарев",
        stars: 5,
        text: "Хочу выразить огромную благодарность сотрудникам за безупречное обслуживание и профессионализм терпения.",
        date: "05.03.2026",
        half: false
    },
    {
        name: "Петр Васильев",
        stars: 4,
        text: "Хорошее качество и быстрое выполнение заказа.",
        date: "30.11.2025",
        half: false
    }
];

let currentReviewIndex = 1;

function moveToCenter(index) {
    currentReviewIndex = index;
    const carousel = document.getElementById('reviewsCarousel');
    const thumb = document.getElementById('reviewSliderThumb');
    const total = reviewsData.length;

    carousel.innerHTML = '';

    const leftIndex = (index - 1 + total) % total;
    const rightIndex = (index + 1) % total;
    const indices = [leftIndex, index, rightIndex];
    const classes = ['review-side', 'review-center', 'review-side'];

    indices.forEach((idx, i) => {
        const r = reviewsData[idx];
        
        let starsStr = '★'.repeat(r.stars) + '☆'.repeat(5 - r.stars);
        
        const div = document.createElement('div');
        div.className = classes[i];
        
        if (i !== 1) {
            div.style.cursor = 'pointer';
            div.onclick = () => moveToCenter(idx);
        }

        div.innerHTML = `
            <div class="reviewer-name"><strong>${r.name}</strong></div>
            <div class="stars">${starsStr}</div>
            <div class="review-text">${r.text}</div>
            <div class="review-date">${r.date}</div>
        `;
        carousel.appendChild(div);
    });

    if (thumb) {
        const step = 100 / total;
        thumb.style.width = step + '%';
        thumb.style.left = (step * index) + '%';
    }
}

const priceConfig = {
    base: {
        'A3': 33,
        'A4': 40,
        'A5': 15
    },
    colorMultiplier: {
        'color': 3.0,
        'bw': 1.0
    },
    paperAdd: {
        'matte': 0,
        'glossy': 15,
        'beige': 5,
        'blue': 5,
        'yellow': 5,
        'green': 5
    },
    quantityDiscount: {
        '1': 1.0,
        '2-5': 1.0,
        '6-10': 0.95,
        '11-20': 0.90,
        '21-50': 0.85,
        '51-100': 0.80,
        '101+': 0.75
    }
};

function calculatePrice(format, color, paper, quantity) {
    const base = priceConfig.base[format] || 0;
    const colorMult = priceConfig.colorMultiplier[color] || 1;
    const paperAdd = priceConfig.paperAdd[paper] || 0;
    const discount = priceConfig.quantityDiscount[quantity] || 1;

    const price = (base + paperAdd) * colorMult * discount;
    return Math.round(price);
}

document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.service-card');

    cards.forEach(card => {
        const format = card.dataset.format;
        if (!format) return;

        const selects = card.querySelectorAll('select');
        const priceDisplay = card.querySelector('.price-value');

        if (!priceDisplay) return;

        function updatePrice() {
            const color = card.querySelector('.select-color')?.value || 'color';
            const paper = card.querySelector('.select-paper')?.value || 'matte';
            const qty = card.querySelector('.select-qty')?.value || '1';

            const price = calculatePrice(format, color, paper, qty);
            priceDisplay.textContent = price + '₽ за 1 шт.';

            priceDisplay.style.transform = 'scale(1.1)';
            priceDisplay.style.transition = 'transform 0.2s ease';
            setTimeout(() => {
                priceDisplay.style.transform = 'scale(1)';
            }, 200);
        }

        selects.forEach(select => {
            select.addEventListener('change', updatePrice);
        });

        updatePrice();
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
});
