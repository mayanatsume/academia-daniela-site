document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initTestimonialSlider();
    initAccordions();
    initStickyHeader();
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