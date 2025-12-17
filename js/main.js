// Smooth Page Transitions with AJAX
document.addEventListener('DOMContentLoaded', function() {
    // Initialize logo loading
    initLogoLoading();
    initNavPersistence();
    // Initialize animations
    initAnimations();
    initSmoothScroll();
    initAJAXNavigation();
    initFormAnimations();
    initTableAnimations();
});

// Handle logo loading with fallback
function initLogoLoading() {
    const logoImages = document.querySelectorAll('.a-logo, .footer-logo');
    
    logoImages.forEach(img => {
        // Try multiple possible paths
        const possiblePaths = [
            'images/a-logo.png',
            './images/a-logo.png',
            'images/a-logo.svg',
            './images/a-logo.svg',
            '../images/a-logo.png',
            'images/a-logo.jpg',
            './images/a-logo.jpg',
            'images/logo.png',
            'images/logo.jpg'
        ];
        
        let currentPathIndex = 0;
        const originalSrc = img.src || img.getAttribute('src');
        
        // Function to try next path
        const tryNextPath = () => {
            if (currentPathIndex < possiblePaths.length) {
                img.src = possiblePaths[currentPathIndex];
                currentPathIndex++;
            } else {
                // All paths failed, show fallback
                img.style.display = 'none';
                if (img.closest('.navbar-brand')) {
                    img.closest('.navbar-brand').classList.add('logo-fallback');
                }
            }
        };
        
        // Check if image loads
        img.onerror = function() {
            tryNextPath();
        };
        
        img.onload = function() {
            // Image loaded successfully
            this.style.display = 'block';
            if (this.closest('.navbar-brand')) {
                this.closest('.navbar-brand').classList.remove('logo-fallback');
            }
        };
        
        // If no src or src is empty, try first path
        if (!originalSrc || originalSrc === '' || originalSrc.includes('undefined')) {
            tryNextPath();
        } else {
            // Verify the original path works
            const testImg = new Image();
            testImg.onerror = () => tryNextPath();
            testImg.onload = () => {
                img.src = originalSrc;
            };
            testImg.src = originalSrc;
        }
    });
}

// Smooth scroll for anchor links
function initSmoothScroll() {
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
}

// AJAX Navigation for smooth page transitions
function initAJAXNavigation() {
    const links = document.querySelectorAll('a[href$=".html"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Don't intercept if it's the same page or has special attributes
            if (href === window.location.pathname.split('/').pop() || 
                this.hasAttribute('data-no-ajax')) {
                return;
            }
            
            e.preventDefault();
            
            // Add loading state
            document.body.style.opacity = '0.7';
            document.body.style.transition = 'opacity 0.3s ease';
            
            // Load new page
            loadPage(href);
        });
    });
}

// Load page with AJAX
function loadPage(url) {
    fetch(url)
        .then(response => response.text())
        .then(html => {
            // Parse the HTML
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            // Fade out current content
            document.body.style.opacity = '0';
            
            setTimeout(() => {
                // Update page content
                document.querySelector('nav').outerHTML = doc.querySelector('nav').outerHTML;
                document.querySelector('.container-fluid, main, .container').innerHTML = 
                    doc.querySelector('.container-fluid, main, .container').innerHTML;
                
                // Update title
                document.title = doc.title;
                
                // Update URL without reload
                window.history.pushState({}, '', url);
                
                // Reinitialize scripts
                initAnimations();
                initNavPersistence();
                initAJAXNavigation();
                initFormAnimations();
                initTableAnimations();
                
                // Fade in new content
                setTimeout(() => {
                    document.body.style.opacity = '1';
                    window.scrollTo(0, 0);
                }, 100);
            }, 300);
        })
        .catch(error => {
            console.error('Error loading page:', error);
            // Fallback to normal navigation
            window.location.href = url;
        });
}

// Initialize animations on page load
function initAnimations() {
    // Animate cards on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all cards
    document.querySelectorAll('.card, .section-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
    
    // Animate stats cards
    animateNumbers();
}

// Animate numbers in stats cards
function animateNumbers() {
    document.querySelectorAll('.card h2, .card h3').forEach(element => {
        const text = element.textContent;
        const number = parseInt(text.replace(/\D/g, ''));
        
        if (number && !isNaN(number)) {
            const duration = 2000;
            const increment = number / (duration / 16);
            let current = 0;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= number) {
                    element.textContent = text.replace(/\d+/, number);
                    clearInterval(timer);
                } else {
                    element.textContent = text.replace(/\d+/, Math.floor(current));
                }
            }, 16);
        }
    });
}

// Form animations
function initFormAnimations() {
    const inputs = document.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        // Add focus animation
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'scale(1.02)';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'scale(1)';
        });
        
        // Floating label effect
        if (input.value) {
            input.classList.add('has-value');
        }
        
        input.addEventListener('input', function() {
            if (this.value) {
                this.classList.add('has-value');
            } else {
                this.classList.remove('has-value');
            }
        });
    });
}

// Table row animations
function initTableAnimations() {
    const tableRows = document.querySelectorAll('tbody tr');
    
    tableRows.forEach((row, index) => {
        row.style.opacity = '0';
        row.style.transform = 'translateX(-20px)';
        row.style.transition = `opacity 0.3s ease ${index * 0.05}s, transform 0.3s ease ${index * 0.05}s`;
        
        setTimeout(() => {
            row.style.opacity = '1';
            row.style.transform = 'translateX(0)';
        }, 100);
    });
}

// Button click animations
document.addEventListener('click', function(e) {
    if (e.target.matches('button, .btn, a.btn')) {
        const button = e.target.closest('button, .btn');
        if (button) {
            // Ripple effect
            const ripple = document.createElement('span');
            ripple.style.position = 'absolute';
            ripple.style.borderRadius = '50%';
            ripple.style.background = 'rgba(255, 255, 255, 0.6)';
            ripple.style.width = '10px';
            ripple.style.height = '10px';
            ripple.style.transform = 'scale(0)';
            ripple.style.animation = 'ripple 0.6s ease-out';
            ripple.style.left = e.offsetX + 'px';
            ripple.style.top = e.offsetY + 'px';
            
            button.style.position = 'relative';
            button.style.overflow = 'hidden';
            button.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        }
    }
});

// Add ripple animation CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Handle browser back/forward buttons
window.addEventListener('popstate', function(e) {
    loadPage(window.location.pathname);
});

// Loading screen (optional)
window.addEventListener('load', function() {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// Smooth hover effects for icons
document.querySelectorAll('.feature-icon, .bi, i[class*="bi-"]').forEach(icon => {
    // Skip if icon is inside a button or link (they have their own hover)
    if (icon.closest('button') || icon.closest('a')) {
        return;
    }
    
    icon.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.15) rotate(5deg)';
        this.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
    });
    
    icon.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1) rotate(0deg)';
    });
});

// Improve icon rendering in buttons and nav links
document.querySelectorAll('.btn .bi, .nav-link .bi').forEach(icon => {
    icon.style.willChange = 'transform';
    icon.style.backfaceVisibility = 'hidden';
});

// Smooth icon animations on page load
window.addEventListener('load', function() {
    document.querySelectorAll('.feature-icon, .bi').forEach((icon, index) => {
        icon.style.opacity = '0';
        icon.style.transform = 'scale(0.8)';
        
        setTimeout(() => {
            icon.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            icon.style.opacity = '1';
            icon.style.transform = 'scale(1)';
        }, index * 50);
    });
});

// Search functionality with smooth results
document.querySelectorAll('.search-box input').forEach(searchInput => {
    let searchTimeout;
    
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        
        searchTimeout = setTimeout(() => {
            const searchTerm = this.value.toLowerCase();
            const table = this.closest('.card-body, .card')?.querySelector('table tbody');
            
            if (table) {
                const rows = table.querySelectorAll('tr');
                rows.forEach((row, index) => {
                    const text = row.textContent.toLowerCase();
                    if (text.includes(searchTerm)) {
                        row.style.display = '';
                        row.style.opacity = '0';
                        row.style.transform = 'translateX(-20px)';
                        setTimeout(() => {
                            row.style.transition = 'all 0.3s ease';
                            row.style.opacity = '1';
                            row.style.transform = 'translateX(0)';
                        }, index * 50);
                    } else {
                        row.style.opacity = '0';
                        row.style.transform = 'translateX(20px)';
                        setTimeout(() => {
                            row.style.display = 'none';
                        }, 300);
                    }
                });
            }
        }, 300);
    });
});

// Persist active navigation across reloads and sessions
function initNavPersistence() {
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const savedPage = localStorage.getItem('activeNav');

    function setActive(link) {
        navLinks.forEach(l => l.classList.remove('active'));
        if (link) {
            link.classList.add('active');
        }
    }

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            const href = link.getAttribute('href');
            if (href) {
                localStorage.setItem('activeNav', href);
            }
        });
    });

    const match = Array.from(navLinks).find(link => {
        const href = link.getAttribute('href');
        return href === currentPage || href === savedPage;
    });

    setActive(match);
}

// Lightweight pagination utility (max 50 rows per page)
function createPaginatedTable({ data = [], tableBodySelector, paginationSelector, pageSize = 10, renderRow }) {
    const tbody = document.querySelector(tableBodySelector);
    const pager = document.querySelector(paginationSelector);
    if (!tbody || !pager || typeof renderRow !== 'function') {
        return;
    }

    const size = Math.min(Math.max(pageSize, 1), 50);
    let currentPage = 1;
    const totalPages = Math.max(1, Math.ceil(data.length / size));

    function renderPage() {
        const start = (currentPage - 1) * size;
        const end = start + size;
        const slice = data.slice(start, end);
        tbody.innerHTML = slice.map(renderRow).join('');
        renderPager();
    }

    function renderPager() {
        const buttons = [];
        const addButton = (label, targetPage, disabled = false, active = false) => {
            buttons.push(`
                <li class="page-item ${disabled ? 'disabled' : ''} ${active ? 'active' : ''}">
                    <a class="page-link" href="#" data-page="${targetPage}">${label}</a>
                </li>
            `);
        };

        addButton('&laquo;', currentPage - 1, currentPage === 1);

        const range = Array.from({ length: totalPages }, (_, i) => i + 1).filter(p => {
            if (totalPages <= 7) return true;
            if (p === 1 || p === totalPages) return true;
            return Math.abs(p - currentPage) <= 2;
        });

        let last = 0;
        range.forEach(p => {
            if (p - last > 1) {
                buttons.push('<li class="page-item disabled"><span class="page-link">...</span></li>');
            }
            addButton(p, p, false, p === currentPage);
            last = p;
        });

        addButton('&raquo;', currentPage + 1, currentPage === totalPages);
        pager.innerHTML = `<ul class="pagination pagination-sm mb-0 justify-content-end">${buttons.join('')}</ul>`;

        pager.querySelectorAll('.page-link').forEach(link => {
            link.addEventListener('click', e => {
                e.preventDefault();
                const target = parseInt(link.getAttribute('data-page'));
                if (!isNaN(target) && target >= 1 && target <= totalPages && target !== currentPage) {
                    currentPage = target;
                    renderPage();
                }
            });
        });
    }

    renderPage();
    return {
        refresh(newData) {
            data = newData || data;
            currentPage = 1;
            renderPage();
        }
    };
}

// Expose pagination globally for inline scripts
window.createPaginatedTable = createPaginatedTable;

