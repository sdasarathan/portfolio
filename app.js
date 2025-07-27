// DOM Elements
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');
const navbar = document.getElementById('navbar');
const contactForm = document.getElementById('contactForm');

// Mobile Navigation Toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 70; // Account for fixed navbar height
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar scroll effect and active link highlighting
let lastScrollTop = 0;

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Navbar background opacity on scroll
    if (scrollTop > 100) {
        navbar.style.background = 'rgba(19, 52, 59, 0.98)';
        navbar.style.backdropFilter = 'blur(15px)';
    } else {
        navbar.style.background = 'rgba(19, 52, 59, 0.95)';
        navbar.style.backdropFilter = 'blur(10px)';
    }
    
    // Active section highlighting
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        
        if (scrollTop >= sectionTop && scrollTop < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    // Update active nav link
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
    
    lastScrollTop = scrollTop;
});

// Contact Form Handling
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const name = formData.get('name');
    const email = formData.get('email');
    const subject = formData.get('subject');
    const message = formData.get('message');
    
    // Create mailto link
    const mailtoLink = `mailto:sdasarathan@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`From: ${name} (${email})\n\n${message}`)}`;
    
    // Open default email client
    window.location.href = mailtoLink;
    
    // Show success message
    showNotification('Thank you! Your default email client should open with the message.', 'success');
    
    // Reset form
    contactForm.reset();
});

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    // Add styles for notification
    notification.style.cssText = `
        position: fixed;
        top: 90px;
        right: 20px;
        background: var(--color-surface);
        border: 1px solid var(--color-card-border);
        border-radius: var(--radius-base);
        padding: var(--space-16);
        box-shadow: var(--shadow-lg);
        z-index: 1001;
        max-width: 400px;
        animation: slideIn 0.3s ease-out;
    `;
    
    // Add notification-specific styles
    if (type === 'success') {
        notification.style.borderColor = 'var(--color-success)';
        notification.style.background = 'rgba(var(--color-success-rgb), 0.1)';
    } else if (type === 'error') {
        notification.style.borderColor = 'var(--color-error)';
        notification.style.background = 'rgba(var(--color-error-rgb), 0.1)';
    }
    
    // Add CSS for slide-in animation
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            .notification-content {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: var(--space-12);
            }
            .notification-message {
                color: var(--color-text);
                font-size: var(--font-size-sm);
                line-height: 1.5;
            }
            .notification-close {
                background: none;
                border: none;
                font-size: var(--font-size-lg);
                color: var(--color-text-secondary);
                cursor: pointer;
                padding: 0;
                width: 20px;
                height: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: var(--radius-sm);
                transition: background-color var(--duration-fast) var(--ease-standard);
            }
            .notification-close:hover {
                background: var(--color-secondary);
                color: var(--color-text);
            }
        `;
        document.head.appendChild(style);
    }
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
    
    // Add slide-out animation
    if (!document.querySelector('#slideout-animation')) {
        const slideOutStyle = document.createElement('style');
        slideOutStyle.id = 'slideout-animation';
        slideOutStyle.textContent = `
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(slideOutStyle);
    }
}

// Scroll animations for elements
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Initialize scroll animations
function initScrollAnimations() {
    // Add initial styles and observe elements
    const animatedElements = document.querySelectorAll('.timeline-item, .skill-category, .highlight-item, .education-item, .card');
    
    animatedElements.forEach((el, index) => {
        // Set initial state
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.6s ease-out ${index * 0.1}s, transform 0.6s ease-out ${index * 0.1}s`;
        
        // Observe for intersection
        observer.observe(el);
    });
}

// Hero section typing effect for subtitle
function initTypingEffect() {
    const subtitle = document.querySelector('.hero-subtitle');
    const text = subtitle.textContent;
    subtitle.textContent = '';
    
    let i = 0;
    const typeSpeed = 100;
    
    function typeWriter() {
        if (i < text.length) {
            subtitle.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, typeSpeed);
        }
    }
    
    // Start typing effect after a short delay
    setTimeout(typeWriter, 1000);
}

// Parallax effect for hero section
function initParallaxEffect() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        const heroHeight = hero.offsetHeight;
        
        if (scrolled < heroHeight) {
            const parallaxSpeed = scrolled * 0.3;
            hero.style.transform = `translateY(${parallaxSpeed}px)`;
        }
    });
}

// Skills section animation on scroll
function initSkillsAnimation() {
    const skillTags = document.querySelectorAll('.skill-tag');
    
    const skillsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillTag = entry.target;
                const delay = Array.from(skillTag.parentElement.children).indexOf(skillTag) * 50;
                
                setTimeout(() => {
                    skillTag.style.opacity = '1';
                    skillTag.style.transform = 'translateY(0) scale(1)';
                }, delay);
            }
        });
    }, { threshold: 0.5 });
    
    skillTags.forEach(tag => {
        tag.style.opacity = '0';
        tag.style.transform = 'translateY(20px) scale(0.9)';
        tag.style.transition = 'opacity 0.4s ease-out, transform 0.4s ease-out';
        skillsObserver.observe(tag);
    });
}

// Timeline animation
function initTimelineAnimation() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, { threshold: 0.3 });
    
    // Add CSS for timeline animation
    const timelineStyle = document.createElement('style');
    timelineStyle.textContent = `
        .timeline-item {
            opacity: 0;
            transform: translateX(-50px);
            transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }
        .timeline-item.animate-in {
            opacity: 1;
            transform: translateX(0);
        }
        .timeline-item:nth-child(even) {
            transform: translateX(50px);
        }
        .timeline-item:nth-child(even).animate-in {
            transform: translateX(0);
        }
    `;
    document.head.appendChild(timelineStyle);
    
    timelineItems.forEach(item => {
        timelineObserver.observe(item);
    });
}

// Initialize all features when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initScrollAnimations();
    initTypingEffect();
    initParallaxEffect();
    initSkillsAnimation();
    initTimelineAnimation();
    
    // Set initial active nav link
    if (window.location.hash) {
        const targetLink = document.querySelector(`a[href="${window.location.hash}"]`);
        if (targetLink) {
            navLinks.forEach(link => link.classList.remove('active'));
            targetLink.classList.add('active');
        }
    } else {
        // Default to home if no hash
        const homeLink = document.querySelector('a[href="#home"]');
        if (homeLink) homeLink.classList.add('active');
    }
});

// Handle window resize
window.addEventListener('resize', () => {
    // Close mobile menu on resize to larger screen
    if (window.innerWidth > 768) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// Smooth scroll to top functionality
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Add scroll to top button
function initScrollToTop() {
    const scrollButton = document.createElement('button');
    scrollButton.innerHTML = '↑';
    scrollButton.className = 'scroll-to-top';
    scrollButton.onclick = scrollToTop;
    scrollButton.setAttribute('aria-label', 'Scroll to top');
    
    // Add styles for scroll to top button
    const scrollButtonStyle = document.createElement('style');
    scrollButtonStyle.textContent = `
        .scroll-to-top {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 50px;
            height: 50px;
            background: var(--color-primary);
            color: var(--color-btn-primary-text);
            border: none;
            border-radius: 50%;
            font-size: var(--font-size-xl);
            cursor: pointer;
            opacity: 0;
            visibility: hidden;
            transition: all var(--duration-normal) var(--ease-standard);
            z-index: 1000;
            box-shadow: var(--shadow-lg);
        }
        .scroll-to-top:hover {
            background: var(--color-primary-hover);
            transform: translateY(-2px);
        }
        .scroll-to-top.visible {
            opacity: 1;
            visibility: visible;
        }
        @media (max-width: 768px) {
            .scroll-to-top {
                bottom: 20px;
                right: 20px;
                width: 45px;
                height: 45px;
            }
        }
    `;
    document.head.appendChild(scrollButtonStyle);
    document.body.appendChild(scrollButton);
    
    // Show/hide scroll button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollButton.classList.add('visible');
        } else {
            scrollButton.classList.remove('visible');
        }
    });
}

// Initialize scroll to top button
initScrollToTop();