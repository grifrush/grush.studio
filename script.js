// Apply saved theme immediately on page load (before DOM is ready to prevent flash)
(function() {
    const savedTheme = localStorage.getItem('theme');
    console.log('Applying saved theme on load:', savedTheme);
    if (savedTheme === 'technical') {
        document.documentElement.classList.add('technical-theme');
        if (document.body) {
            document.body.classList.add('technical-theme');
        }
    }
})();

// Theme Toggle Functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing theme toggle');
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;

    if (!themeToggle) {
        console.error('Theme toggle element not found!');
        return;
    }

    console.log('Theme toggle element found:', themeToggle);

    // Check for saved theme preference or default to 'creative'
    const currentTheme = localStorage.getItem('theme') || 'creative';
    console.log('Current theme:', currentTheme);
    
    if (currentTheme === 'technical') {
        body.classList.add('technical-theme');
        console.log('Applied technical theme to body');
    }

    // Add click handler
    themeToggle.addEventListener('click', (e) => {
        console.log('Toggle clicked!', e);
        body.classList.toggle('technical-theme');
        
        if (body.classList.contains('technical-theme')) {
            console.log('Switching to technical theme');
            localStorage.setItem('theme', 'technical');
        } else {
            console.log('Switching to creative theme');
            localStorage.setItem('theme', 'creative');
        }
        
        // Force a visual update
        themeToggle.style.pointerEvents = 'none';
        setTimeout(() => {
            themeToggle.style.pointerEvents = 'auto';
        }, 100);
    });

    console.log('Theme toggle event listener attached');

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
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

    // Add scroll-triggered animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for scroll animations
    document.querySelectorAll('.experience-card, .gallery-item, .stat-item, .highlight-item, .project-card').forEach(el => {
        observer.observe(el);
    });
});

// Carousel Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all carousels
    const carousels = document.querySelectorAll('.carousel-track');
    
    carousels.forEach(carousel => {
        const carouselName = carousel.getAttribute('data-carousel');
        const slides = carousel.querySelectorAll('.carousel-slide');
        const prevBtn = document.querySelector(`.carousel-prev[data-carousel="${carouselName}"]`);
        const nextBtn = document.querySelector(`.carousel-next[data-carousel="${carouselName}"]`);
        const dotsContainer = document.querySelector(`.carousel-dots[data-carousel="${carouselName}"]`);
        const dots = dotsContainer ? dotsContainer.querySelectorAll('.carousel-dot') : [];
        
        let currentSlide = 0;
        const totalSlides = slides.length;
        
        function updateCarousel() {
            carousel.style.transform = `translateX(-${currentSlide * 100}%)`;
            
            // Update dots
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentSlide);
            });
        }
        
        function nextSlide() {
            currentSlide = (currentSlide + 1) % totalSlides;
            updateCarousel();
        }
        
        function prevSlide() {
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            updateCarousel();
        }
        
        function goToSlide(index) {
            currentSlide = index;
            updateCarousel();
        }
        
        // Event listeners
        if (nextBtn) {
            nextBtn.addEventListener('click', nextSlide);
        }
        
        if (prevBtn) {
            prevBtn.addEventListener('click', prevSlide);
        }
        
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => goToSlide(index));
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') prevSlide();
            if (e.key === 'ArrowRight') nextSlide();
        });
        
        // Touch/Swipe support
        let touchStartX = 0;
        let touchEndX = 0;
        
        carousel.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        carousel.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });
        
        function handleSwipe() {
            if (touchEndX < touchStartX - 50) nextSlide();
            if (touchEndX > touchStartX + 50) prevSlide();
        }
    });
});

// Smooth Scroll for "Back to Gallery" buttons
document.querySelectorAll('.btn-back').forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});

// Smooth scroll for internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href.length > 1) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// Masonry Grid Auto-Packing
function resizeGridItems() {
    const grid = document.querySelector('.image-grid');
    if (!grid) return;
    
    const rowGap = parseInt(window.getComputedStyle(grid).getPropertyValue('gap'));
    const rowHeight = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-auto-rows'));
    
    const gridItems = document.querySelectorAll('.grid-item');
    
    gridItems.forEach(item => {
        const img = item.querySelector('img');
        if (!img) return;
        
        // Wait for image to load
        if (img.complete) {
            setRowSpan(item, img, rowHeight, rowGap);
        } else {
            img.addEventListener('load', () => {
                setRowSpan(item, img, rowHeight, rowGap);
            });
        }
    });
}

function setRowSpan(item, img, rowHeight, rowGap) {
    const contentHeight = img.getBoundingClientRect().height;
    const rowSpan = Math.ceil((contentHeight + rowGap) / (rowHeight + rowGap));
    item.style.gridRowEnd = 'span ' + rowSpan;
}

// Run on load and resize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', resizeGridItems);
} else {
    resizeGridItems();
}

window.addEventListener('resize', resizeGridItems);

// Re-run when images load (for late-loading images)
window.addEventListener('load', () => {
    setTimeout(resizeGridItems, 100);
});

// ========================================
// CAROUSEL FUNCTIONALITY
// ========================================

function initCarousels() {
    const carousels = document.querySelectorAll('[data-carousel]');
    
    carousels.forEach(carouselName => {
        const name = carouselName.getAttribute('data-carousel');
        if (carouselName.classList.contains('carousel-track')) {
            initCarousel(name);
        }
    });
}

function initCarousel(carouselName) {
    const track = document.querySelector(`.carousel-track[data-carousel="${carouselName}"]`);
    const slides = Array.from(track.children);
    const prevBtn = document.querySelector(`.carousel-prev[data-carousel="${carouselName}"]`);
    const nextBtn = document.querySelector(`.carousel-next[data-carousel="${carouselName}"]`);
    const indicatorsContainer = document.querySelector(`.carousel-indicators[data-carousel="${carouselName}"]`);
    
    if (!track || slides.length === 0) return;
    
    let currentIndex = 0;
    
    // Create indicators
    slides.forEach((_, index) => {
        const indicator = document.createElement('div');
        indicator.classList.add('carousel-indicator');
        if (index === 0) indicator.classList.add('active');
        indicator.addEventListener('click', () => goToSlide(index));
        indicatorsContainer.appendChild(indicator);
    });
    
    const indicators = Array.from(indicatorsContainer.children);
    
    function updateCarousel() {
        const slideWidth = slides[0].getBoundingClientRect().width;
        track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
        
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentIndex);
        });
    }
    
    function goToSlide(index) {
        currentIndex = index;
        updateCarousel();
    }
    
    function nextSlide() {
        currentIndex = (currentIndex + 1) % slides.length;
        updateCarousel();
    }
    
    function prevSlide() {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        updateCarousel();
    }
    
    // Event listeners
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    
    // Touch support
    let touchStartX = 0;
    let touchEndX = 0;
    
    track.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    track.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        if (touchEndX < touchStartX - 50) nextSlide();
        if (touchEndX > touchStartX + 50) prevSlide();
    }
    
    // Keyboard support
    document.addEventListener('keydown', e => {
        if (e.key === 'ArrowLeft') prevSlide();
        if (e.key === 'ArrowRight') nextSlide();
    });
    
    // Update on window resize
    window.addEventListener('resize', updateCarousel);
}

// Initialize carousels when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCarousels);
} else {
    initCarousels();
}
