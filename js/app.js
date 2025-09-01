// Aplicação principal
class BarberExpressApp {
    constructor() {
        this.authSystem = new AuthSystem();
        this.bookingSystem = new BookingSystem(this.authSystem);
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.loadContent();
        this.setupSmoothScrolling();
    }
    
    bindEvents() {
        // Navigation
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleNavigation(e.target);
            });
        });
        
        // Hamburger menu
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('navMenu');
        
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
        
        // Service cards click to book
        document.addEventListener('click', (e) => {
            if (e.target.closest('.service-card')) {
                this.bookingSystem.openBookingModal();
            }
        });
        
        // Barber cards click to book
        document.addEventListener('click', (e) => {
            if (e.target.closest('.barber-card')) {
                this.bookingSystem.openBookingModal();
            }
        });
    }
    
    handleNavigation(link) {
        // Update active link
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        
        // Smooth scroll to section
        const targetId = link.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);
        
        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
    
    setupSmoothScrolling() {
        // Update active nav link on scroll
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        const updateActiveLink = () => {
            const scrollPos = window.scrollY + 100;
            
            sections.forEach(section => {
                const top = section.offsetTop;
                const bottom = top + section.offsetHeight;
                const id = section.getAttribute('id');
                
                if (scrollPos >= top && scrollPos <= bottom) {
                    navLinks.forEach(link => link.classList.remove('active'));
                    const activeLink = document.querySelector(`.nav-link[href="#${id}"]`);
                    if (activeLink) {
                        activeLink.classList.add('active');
                    }
                }
            });
        };
        
        window.addEventListener('scroll', updateActiveLink);
    }
    
    loadContent() {
        this.loadServices();
        this.loadBarbers();
    }
    
    loadServices() {
        const services = getServices();
        const container = document.getElementById('servicesGrid');
        
        container.innerHTML = services.map(service => `
            <div class="service-card" data-service-id="${service.id}">
                <h3>${service.name}</h3>
                <p>${service.description}</p>
                <div class="service-price">${formatCurrency(service.price)}</div>
                <div class="service-duration">${formatDuration(service.duration)}</div>
            </div>
        `).join('');
    }
    
    loadBarbers() {
        const barbers = getBarbers();
        const container = document.getElementById('barbersGrid');
        
        container.innerHTML = barbers.map(barber => `
            <div class="barber-card" data-barber-id="${barber.id}">
                <img src="${barber.image}" alt="${barber.name}" class="barber-image">
                <div class="barber-info">
                    <h3 class="barber-name">${barber.name}</h3>
                    <p class="barber-specialty">${barber.specialty}</p>
                    <div class="barber-rating">
                        <span>⭐ ${barber.rating}</span>
                        <span>•</span>
                        <span>${barber.experience}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.authSystem = new AuthSystem();
    window.bookingSystem = new BookingSystem(window.authSystem);
    window.app = new BarberExpressApp();
});

// Add mobile navigation styles
const mobileNavStyle = document.createElement('style');
mobileNavStyle.textContent = `
    @media (max-width: 768px) {
        .nav-menu {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: var(--primary-900);
            flex-direction: column;
            padding: var(--space-4);
            transform: translateY(-100%);
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        }
        
        .nav-menu.active {
            transform: translateY(0);
            opacity: 1;
            visibility: visible;
            display: flex;
        }
        
        .hamburger.active span:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
        }
        
        .hamburger.active span:nth-child(2) {
            opacity: 0;
        }
        
        .hamburger.active span:nth-child(3) {
            transform: rotate(-45deg) translate(7px, -6px);
        }
    }
`;
document.head.appendChild(mobileNavStyle);