// ====================================
// INITIALISE ALL SITE SCRIPTS
// ====================================

function initSiteScripts() {
    // ------------------------------
    // MOBILE NAVIGATION TOGGLE
    // ------------------------------
    const hamburger = document.querySelector('.hamburger');
    const navbar = document.querySelector('.navbar');

    if (hamburger && navbar) {
        // Avoid duplicating listeners if initSiteScripts is called again
        if (!hamburger.dataset.bound) {
            hamburger.addEventListener('click', function() {
                navbar.classList.toggle('active');

                // Animate hamburger icon
                const spans = hamburger.querySelectorAll('span');
                if (navbar.classList.contains('active')) {
                    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                    spans[1].style.opacity = '0';
                    spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
                } else {
                    spans[0].style.transform = 'none';
                    spans[1].style.opacity = '1';
                    spans[2].style.transform = 'none';
                }
            });

            // Close menu when clicking outside
            document.addEventListener('click', function(event) {
                if (!hamburger.contains(event.target) && !navbar.contains(event.target)) {
                    navbar.classList.remove('active');
                    const spans = hamburger.querySelectorAll('span');
                    spans[0].style.transform = 'none';
                    spans[1].style.opacity = '1';
                    spans[2].style.transform = 'none';
                }
            });

            // Close menu when clicking on a nav link
            const navItems = navbar.querySelectorAll('a');
            navItems.forEach(item => {
                item.addEventListener('click', function() {
                    navbar.classList.remove('active');
                    const spans = hamburger.querySelectorAll('span');
                    spans[0].style.transform = 'none';
                    spans[1].style.opacity = '1';
                    spans[2].style.transform = 'none';
                });
            });

            hamburger.dataset.bound = 'true';
        }
    }

    // ------------------------------
    // HEADER SCROLL EFFECT
    // ------------------------------
    const header = document.querySelector('.header');
    if (header && !header.dataset.bound) {
        let lastScroll = 0;

        window.addEventListener('scroll', function() {
            const currentScroll = window.pageYOffset;

            if (currentScroll > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            lastScroll = currentScroll;
        });

        header.dataset.bound = 'true';
    }

    // ------------------------------
    // FADE-IN ON SCROLL
    // ------------------------------
    const fadeElements = document.querySelectorAll('.section, .card');
    if (fadeElements.length) {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('section-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        fadeElements.forEach(element => {
            element.classList.add('fade-in');
            observer.observe(element);
        });
    }


    // ------------------------------
    // PRODUCT STACK SCROLLING CARDS
    // ------------------------------
    const section = document.querySelector('.product-stack');
    if (section && window.innerWidth > 768) {
        const cards = Array.from(section.querySelectorAll('.product-card'));
        const tabsContainer = section.querySelector('.product-stack__tabs');

        if (cards.length && tabsContainer) {
            // Set initial states
            cards.forEach((card, i) => {
                card.classList.add(i === 0 ? 'is-active' : 'is-future');
            });

            const steps = cards.length;

            function updateProductStack() {
                const rect = section.getBoundingClientRect();
                const viewportHeight = window.innerHeight;
                const sectionTop = section.offsetTop;
                const scrollY = window.scrollY;

                // Calculate how far we've scrolled into the section
                const scrollIntoSection = scrollY - sectionTop + viewportHeight;

                // Define card transition thresholds (in pixels from section start)
                // Card 1 stays until 2100px, then each card gets 700px (40% increase)
                let activeIndex = 0;
                if (scrollIntoSection >= 3500) {
                    activeIndex = 3; // Lifestyle
                } else if (scrollIntoSection >= 2800) {
                    activeIndex = 2; // Relationships
                } else if (scrollIntoSection >= 2100) {
                    activeIndex = 1; // Money
                } else {
                    activeIndex = 0; // PlateWorth
                }

                // Update card states - simple fade in/out
                cards.forEach((card, i) => {
                    card.classList.remove('is-active', 'is-past', 'is-future');
                    if (i < activeIndex) {
                        card.classList.add('is-past');
                    } else if (i === activeIndex) {
                        card.classList.add('is-active');
                    } else {
                        card.classList.add('is-future');
                    }
                });
            }

            // Initial state
            updateProductStack();

            // Smooth scroll handling with requestAnimationFrame
            let ticking = false;
            window.addEventListener('scroll', () => {
                if (!ticking) {
                    window.requestAnimationFrame(() => {
                        updateProductStack();
                        ticking = false;
                    });
                    ticking = true;
                }
            }, { passive: true });

            // Handle resize
            window.addEventListener('resize', () => {
                if (window.innerWidth > 768) {
                    updateProductStack();
                }
            });
        }
    }


    // ------------------------------
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ------------------------------
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        if (!link.dataset.bound) {
            link.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                if (targetId !== '#' && targetId !== '') {
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        e.preventDefault();
                        targetElement.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }
            });
            link.dataset.bound = 'true';
        }
    });


}

// Run once for normal static pages
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSiteScripts);
} else {
    initSiteScripts();
}

// Expose so we can call it again after loading header/footer via JS
window.initSiteScripts = initSiteScripts;
