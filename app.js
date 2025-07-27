// DOM Elements
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');
const navbar = document.getElementById('navbar');
const contactForm = document.getElementById('contactForm');

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    console.log('Portfolio website loaded');
    initMobileNavigation();
    initSmoothScrolling();
    initScrollEffects();
    initContactForm();
    initScrollAnimations();
    initScrollToTop();
    initLinkedInButtons();
    
    // Set initial active nav link
    updateActiveNavLink();
});

// Mobile Navigation
function initMobileNavigation() {
    if (!hamburger || !navMenu) return;
    
    hamburger.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.classList.toggle('nav-open');
        console.log('Mobile menu toggled');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('nav-open');
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navbar.contains(e.target) && navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('nav-open');
        }
    });
}

// Initialize LinkedIn Buttons
function initLinkedInButtons() {
    const linkedInButtons = document.querySelectorAll('a[href*="linkedin.com"]');
    
    linkedInButtons.forEach(button => {
        // Ensure the button has the correct href and target attributes
        const href = button.getAttribute('href');
        if (href && !href.startsWith('http')) {
            button.setAttribute('href', 'https://linkedin.com/in/dasarathan-selvaraj');
        }
        button.setAttribute('target', '_blank');
        button.setAttribute('rel', 'noopener noreferrer');
        
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const url = 'https://linkedin.com/in/dasarathan-selvaraj';
            window.open(url, '_blank', 'noopener,noreferrer');
            console.log('LinkedIn profile opened');
        });
    });
    
    console.log(`Initialized ${linkedInButtons.length} LinkedIn buttons`);
}

// Smooth Scrolling Navigation
function initSmoothScrolling() {
    console.log('Initializing smooth scrolling for', navLinks.length, 'nav links');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const targetId = link.getAttribute('href');
            console.log('Clicking nav link:', targetId);
            
            if (targetId && targetId.startsWith('#')) {
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar height
                    console.log('Scrolling to section:', targetId, 'at position:', offsetTop);
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                    
                    // Update active nav link immediately
                    navLinks.forEach(navLink => navLink.classList.remove('active'));
                    link.classList.add('active');
                } else {
                    console.warn('Target section not found:', targetId);
                }
            }
        });
    });

    // Handle all internal anchor links on the page
    document.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') {
            const href = e.target.getAttribute('href');
            if (href && href.startsWith('#') && !href.includes('linkedin')) {
                e.preventDefault();
                const targetSection = document.querySelector(href);
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        }
    });
}

// Scroll Effects and Active Navigation
function initScrollEffects() {
    let lastScrollTop = 0;

    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Navbar background effect on scroll
        if (scrollTop > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.backdropFilter = 'blur(15px)';
            navbar.style.boxShadow = '0 4px 20px rgba(135, 206, 235, 0.15)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
            navbar.style.boxShadow = '0 2px 10px rgba(135, 206, 235, 0.1)';
        }
        
        // Update active navigation link
        updateActiveNavLink();
        
        lastScrollTop = scrollTop;
    });
}

// Update Active Navigation Link
function updateActiveNavLink() {
    let current = 'home'; // Default to home
    const scrollTop = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 150;
        const sectionHeight = section.clientHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollTop >= sectionTop && scrollTop < sectionTop + sectionHeight) {
            current = sectionId;
        }
    });
    
    // Update active nav link
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// Contact Form Handling
function initContactForm() {
    if (!contactForm) return;
    
    console.log('Initializing contact form');
    
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        console.log('Contact form submitted');
        
        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const subject = formData.get('subject');
        const message = formData.get('message');
        
        console.log('Form data:', { name, email, subject, message });
        
        // Validate form data
        if (!name || !email || !subject || !message) {
            showNotification('Please fill in all fields.', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showNotification('Please enter a valid email address.', 'error');
            return;
        }
        
        // Create mailto link
        const mailtoSubject = `Portfolio Contact: ${subject}`;
        const mailtoBody = `Hello Dasarathan,

My name is ${name} and I would like to get in touch with you.

Message:
${message}

Best regards,
${name}
Email: ${email}`;
        
        const mailtoLink = `mailto:sdasarathan@gmail.com?subject=${encodeURIComponent(mailtoSubject)}&body=${encodeURIComponent(mailtoBody)}`;
        
        console.log('Opening email client with:', mailtoLink);
        
        // Open default email client
        try {
            window.location.href = mailtoLink;
            
            // Show success message
            showNotification('Thank you! Your email client should open with the message. I\'ll get back to you soon!', 'success');
            
            // Reset form after a short delay
            setTimeout(() => {
                contactForm.reset();
            }, 1000);
            
            // Add form submission animation
            contactForm.style.transform = 'scale(0.98)';
            setTimeout(() => {
                contactForm.style.transform = 'scale(1)';
            }, 200);
        } catch (error) {
            console.error('Error opening email client:', error);
            showNotification('Unable to open email client. Please send an email directly to sdasarathan@gmail.com', 'error');
        }
    });
}

// Email validation helper
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification System
function showNotification(message, type = 'info') {
    console.log('Showing notification:', message, type);
    
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    
    const iconMap = {
        'success': '✓',
        'error': '✗',
        'info': 'ℹ'
    };
    
    const colorMap = {
        'success': '#87CEEB',
        'error': '#FF6B6B',
        'info': '#87CEEB'
    };
    
    notification.innerHTML = `
        <div class="notification-content">
            <div class="notification-icon">${iconMap[type] || iconMap.info}</div>
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    // Add styles for notification
    const notificationStyles = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: white;
        border: 2px solid ${colorMap[type] || colorMap.info};
        border-radius: 12px;
        padding: 16px 20px;
        box-shadow: 0 10px 30px rgba(135, 206, 235, 0.2);
        z-index: 1001;
        max-width: 400px;
        min-width: 300px;
        animation: slideInRight 0.4s ease-out;
        transform: translateX(0);
    `;
    
    notification.style.cssText = notificationStyles;
    
    // Add CSS for notification animations if not already present
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
            .notification-content {
                display: flex;
                align-items: center;
                gap: 12px;
            }
            .notification-icon {
                width: 24px;
                height: 24px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                font-size: 14px;
                color: white;
                background: #87CEEB;
            }
            .notification-message {
                color: #2C3E50;
                font-size: 14px;
                line-height: 1.4;
                flex: 1;
            }
            .notification-close {
                background: none;
                border: none;
                font-size: 18px;
                color: #5D6D7E;
                cursor: pointer;
                padding: 0;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                transition: all 0.2s ease;
            }
            .notification-close:hover {
                background: rgba(135, 206, 235, 0.1);
                color: #2C3E50;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOutRight 0.4s ease-in';
            setTimeout(() => notification.remove(), 400);
        }
    }, 5000);
}

// Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Add fade-in class and observe elements
    const animatedElements = document.querySelectorAll('.timeline-item, .skill-category, .highlight-item, .education-item, .card');
    
    animatedElements.forEach((el, index) => {
        el.classList.add('fade-in');
        el.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(el);
    });

    // Skills animation
    initSkillsAnimation();
    
    // Timeline animation
    initTimelineAnimation();
}

// Skills Section Animation
function initSkillsAnimation() {
    const skillTags = document.querySelectorAll('.skill-tag');
    
    const skillsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillTag = entry.target;
                const skillCategory = skillTag.closest('.skill-category');
                const allTagsInCategory = skillCategory.querySelectorAll('.skill-tag');
                const tagIndex = Array.from(allTagsInCategory).indexOf(skillTag);
                
                setTimeout(() => {
                    skillTag.style.opacity = '1';
                    skillTag.style.transform = 'translateY(0) scale(1)';
                }, tagIndex * 50);
            }
        });
    }, { threshold: 0.5 });
    
    skillTags.forEach(tag => {
        tag.style.opacity = '0';
        tag.style.transform = 'translateY(10px) scale(0.95)';
        tag.style.transition = 'opacity 0.3s ease-out, transform 0.3s ease-out';
        skillsObserver.observe(tag);
    });
}

// Timeline Animation
function initTimelineAnimation() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, { threshold: 0.2 });
    
    // Add CSS for timeline animation
    const timelineStyle = document.createElement('style');
    timelineStyle.textContent = `
        .timeline-item {
            opacity: 0;
            transform: translateX(-30px);
            transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }
        .timeline-item.animate-in {
            opacity: 1;
            transform: translateX(0);
        }
    `;
    document.head.appendChild(timelineStyle);
    
    timelineItems.forEach((item, index) => {
        item.style.transitionDelay = `${index * 0.1}s`;
        timelineObserver.observe(item);
    });
}

// Scroll to Top Button
function initScrollToTop() {
    const scrollButton = document.createElement('button');
    scrollButton.innerHTML = '↑';
    scrollButton.className = 'scroll-to-top';
    scrollButton.onclick = scrollToTop;
    scrollButton.setAttribute('aria-label', 'Scroll to top');
    
    document.body.appendChild(scrollButton);
    
    // Show/hide scroll button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 400) {
            scrollButton.classList.add('visible');
        } else {
            scrollButton.classList.remove('visible');
        }
    });
}

// Scroll to Top Function
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Typing Effect for Hero Section
function initTypingEffect() {
    const subtitle = document.querySelector('.hero-subtitle');
    if (!subtitle) return;
    
    const text = subtitle.textContent;
    subtitle.textContent = '';
    subtitle.style.borderRight = '2px solid #87CEEB';
    
    let i = 0;
    const typeSpeed = 80;
    
    function typeWriter() {
        if (i < text.length) {
            subtitle.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, typeSpeed);
        } else {
            // Remove cursor after typing is complete
            setTimeout(() => {
                subtitle.style.borderRight = 'none';
            }, 1000);
        }
    }
    
    // Start typing effect after a short delay
    setTimeout(typeWriter, 800);
}

// Enhanced hover effects
function initHoverEffects() {
    // Enhanced button hover effects
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px) scale(1.02)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Card hover effects
    const cards = document.querySelectorAll('.card, .skill-category, .highlight-item');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// Handle window resize
window.addEventListener('resize', () => {
    // Close mobile menu on resize to larger screen
    if (window.innerWidth > 768) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.classList.remove('nav-open');
    }
});

// Initialize additional effects when DOM is fully loaded
window.addEventListener('load', () => {
    initTypingEffect();
    initHoverEffects();
    
    // Add loaded class to body for any CSS animations
    document.body.classList.add('loaded');
    
    console.log('Portfolio website fully loaded and initialized');
});

// Add focus management for accessibility
document.addEventListener('keydown', (e) => {
    // Close mobile menu with Escape key
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.classList.remove('nav-open');
    }
});

// Error handling for any JavaScript errors
window.addEventListener('error', (e) => {
    console.warn('Portfolio website error:', e.error);
});

// Make sure LinkedIn buttons work even if clicked before full initialization
document.addEventListener('click', (e) => {
    if (e.target.matches('a[href*="linkedin.com"], .nav-linkedin, .btn[href*="linkedin"]') || 
        e.target.closest('a[href*="linkedin.com"]')) {
        e.preventDefault();
        e.stopPropagation();
        window.open('https://linkedin.com/in/dasarathan-selvaraj', '_blank', 'noopener,noreferrer');
        console.log('LinkedIn clicked via fallback handler');
    }
});

console.log('Portfolio JavaScript loaded successfully');