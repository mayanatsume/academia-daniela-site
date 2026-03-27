document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initTestimonialSlider();
    initAccordions();
    initStickyHeader();
    initCourseSlider();
});

/**
 * Mobile Menu Toggle (Versão Upgraded)
 * Trava scroll em iOS/Android e limpa submenus ao fechar
 */
function initMobileMenu() {
    const toggle = document.querySelector('.menu-toggle');
    const body = document.body;
    const html = document.documentElement;
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');

    if (!toggle) return;

    // Função auxiliar para travar/liberar o scroll em todos os sistemas
    function setScrollLock(locked) {
        body.style.overflow = locked ? 'hidden' : '';
        html.style.overflow = locked ? 'hidden' : '';
    }

    toggle.addEventListener('click', () => {
        const isOpen = body.classList.toggle('menu-open');
        setScrollLock(isOpen);
    });

    // Fecha o menu ao clicar num link
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            body.classList.remove('menu-open');
            setScrollLock(false);

            // Fecha submenus ativos para não aparecerem abertos na próxima vez
            document.querySelectorAll('.mobile-item.active').forEach(item => {
                item.classList.remove('active');
            });
        });
    });

    // Submenu toggle (Tap to expand)
    const mobileSubmenuParents = document.querySelectorAll('.mobile-item.has-dropdown > a');
    mobileSubmenuParents.forEach(parent => {
        parent.addEventListener('click', (e) => {
            e.preventDefault();
            parent.parentElement.classList.toggle('active');
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

    // Auto-slide a cada 5 segundos
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

            // Fecha todos os outros itens (Single Open)
            accordions.forEach(otherItem => {
                otherItem.classList.remove('active');
                const otherHeader = otherItem.querySelector('.accordion-header');
                if (otherHeader) otherHeader.setAttribute('aria-expanded', 'false');
            });

            // Alterna o estado do item clicado
            if (!isOpen) {
                item.classList.add('active');
                header.setAttribute('aria-expanded', 'true');
            }
        });

        // Acessibilidade por teclado
        header.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                header.click();
            }
        });
    });
}

/**
 * Sticky Header (Auto-hide inteligente)
 * Ignora o scroll se o menu mobile estiver aberto
 */
function initStickyHeader() {
    const header = document.querySelector('.header');
    if (!header) return;

    let lastY = window.scrollY;

    window.addEventListener('scroll', () => {
        // Se o menu mobile estiver aberto, interrompe a lógica de esconder o header
        if (document.body.classList.contains('menu-open')) return;

        const y = window.scrollY;

        // No topo da página: sempre mostra
        if (y < 10) {
            header.classList.remove('is-hidden');
            lastY = y;
            return;
        }

        // Lógica de direção: desce esconde, sobe mostra
        if (y > lastY) {
            header.classList.add('is-hidden');
        } else {
            header.classList.remove('is-hidden');
        }

        lastY = y;
    }, { passive: true });
}

/**
 * Homepage Course Slider (Horizontal Scroll)
 */
function initCourseSlider() {
    const grid = document.querySelector('.services-grid');
    const prevBtn = document.querySelector('.slider-arrow.prev');
    const nextBtn = document.querySelector('.slider-arrow.next');
    const dotsContainer = document.querySelector('.courses-dots');

    if (!grid || !prevBtn || !nextBtn || !dotsContainer) return;

    const cards = grid.querySelectorAll('.service-card');
    let autoplayInterval;
    let isUserInteracting = false;
    let interactionTimeout;

    // Limpar dots existentes (prevenção)
    dotsContainer.innerHTML = '';

    // Criar dots dinamicamente (1 para cada card)
    cards.forEach((_, i) => {
        const span = document.createElement('span');
        span.classList.add('dot');
        if (i === 0) span.classList.add('active');
        span.addEventListener('click', () => {
            scrollToCard(i);
            stopAutoplay();
            startAutoplayDelay();
        });
        dotsContainer.appendChild(span);
    });

    const dots = dotsContainer.querySelectorAll('.dot');

    function scrollToCard(index) {
        const firstCard = cards[0];
        const style = window.getComputedStyle(grid);
        const gap = parseInt(style.gap) || 30;
        const cardWidth = firstCard.offsetWidth + gap;
        grid.scrollTo({ left: index * cardWidth, behavior: 'smooth' });
    }

    function updateActiveDot() {
        const firstCard = cards[0];
        if (!firstCard) return;
        const style = window.getComputedStyle(grid);
        const gap = parseInt(style.gap) || 30;
        const cardWidth = firstCard.offsetWidth + gap;
        const index = Math.round(grid.scrollLeft / cardWidth);
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }

    const getScrollAmount = () => {
        const firstCard = cards[0];
        if (!firstCard) return 320;
        const style = window.getComputedStyle(grid);
        const gap = parseInt(style.gap) || 30;
        return firstCard.offsetWidth + gap;
    };

    prevBtn.addEventListener('click', () => {
        grid.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
    });

    nextBtn.addEventListener('click', () => {
        grid.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
    });

    // Autoplay Suave (Mobile Only)
    function startAutoplay() {
        if (window.innerWidth >= 1024) return;
        stopAutoplay();
        autoplayInterval = setInterval(() => {
            if (isUserInteracting) return;
            const scrollAmount = getScrollAmount();
            let nextScroll = grid.scrollLeft + scrollAmount;

            if (nextScroll >= grid.scrollWidth - 10) {
                grid.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                grid.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }
        }, 5000);
    }

    function stopAutoplay() {
        clearInterval(autoplayInterval);
    }

    function startAutoplayDelay() {
        clearTimeout(interactionTimeout);
        interactionTimeout = setTimeout(() => {
            isUserInteracting = false;
            startAutoplay();
        }, 8000);
    }

    grid.addEventListener('touchstart', () => {
        isUserInteracting = true;
        stopAutoplay();
    }, { passive: true });

    grid.addEventListener('touchend', () => {
        startAutoplayDelay();
    }, { passive: true });

    grid.addEventListener('scroll', () => {
        updateActiveDot();

        const isAtStart = grid.scrollLeft <= 5;
        const isAtEnd = grid.scrollLeft + grid.clientWidth >= grid.scrollWidth - 5;
        prevBtn.style.opacity = isAtStart ? '0.3' : '1';
        prevBtn.style.pointerEvents = isAtStart ? 'none' : 'auto';
        nextBtn.style.opacity = isAtEnd ? '0.3' : '1';
        nextBtn.style.pointerEvents = isAtEnd ? 'none' : 'auto';
    }, { passive: true });

    const toggleControls = () => {
        const hasOverflow = grid.scrollWidth > grid.clientWidth;
        const isDesktop = window.innerWidth >= 1024;

        prevBtn.style.display = (hasOverflow && isDesktop) ? 'flex' : 'none';
        nextBtn.style.display = (hasOverflow && isDesktop) ? 'flex' : 'none';
        dotsContainer.style.display = (hasOverflow && !isDesktop) ? 'flex' : 'none';

        if (isDesktop) stopAutoplay();
        else startAutoplay();
    };

    window.addEventListener('resize', toggleControls);
    toggleControls();
}

// FIX mobile submenu: impedir que clique em "Formação" feche o menu
(function () {
    const submenuTriggers = document.querySelectorAll('.mobile-item.has-dropdown > .mobile-nav-link');

    submenuTriggers.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation(); // <- ESSENCIAL (para não disparar o "fecha menu")
            const item = link.closest('.mobile-item');
            item.classList.toggle('active');
        }, true); // captura primeiro
    });
})();