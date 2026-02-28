document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initTestimonialSlider();
    initAccordions();
    initStickyHeader();
});

/**
 * Mobile Menu Toggle
 */
function initMobileMenu() {
    const toggle = document.querySelector('.menu-toggle');
    const body = document.body;
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');

    if (!toggle) return;

    toggle.addEventListener('click', () => {
        body.classList.toggle('menu-open');
    });

    // Close menu when clicking a link
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            body.classList.remove('menu-open');
        });
    });

    // Mobile Submenu Toggle (tap to expand)
    const mobileSubmenuParents = document.querySelectorAll('.mobile-item.has-dropdown > a');
    mobileSubmenuParents.forEach(parent => {
        parent.addEventListener('click', (e) => {
            e.preventDefault();
            const item = parent.parentElement;
            item.classList.toggle('active');
        });
    });
}

/**
 * Testimonial Slider
 */
function initTestimonialSlider() {
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.dot');
    
    if (slides.length === 0 || dots.length === 0) return;

    let currentSlide = 0;

    function showSlide(index) {
        slides.forEach(s => s.classList.remove('active'));
        dots.forEach(d => d.classList.remove('active'));
        
        slides[index].classList.add('active');
        dots[index].classList.add('active');
        currentSlide = index;
    }

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
        });
    });

    // Optional: Auto slide every 5 seconds
    setInterval(() => {
        let next = (currentSlide + 1) % slides.length;
        showSlide(next);
    }, 5000);
}

/**
 * Accordion Logic
 */
function initAccordions() {
    const accordions = document.querySelectorAll('.accordion-item');

    accordions.forEach(item => {
        const header = item.querySelector('.accordion-header');
        
        if (!header) return;

        header.addEventListener('click', () => {
            const isOpen = item.classList.contains('active');
            
            // Close all other items
            accordions.forEach(otherItem => {
                otherItem.classList.remove('active');
                otherItem.querySelector('.accordion-header').setAttribute('aria-expanded', 'false');
            });

            // Toggle current item
            if (!isOpen) {
                item.classList.add('active');
                header.setAttribute('aria-expanded', 'true');
            }
        });

        // Keyboard support
        header.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                header.click();
            }
        });
    });
}

/**
 * Sticky Header Scroll State
 */
function initStickyHeader() {
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}
