// DOM Elements
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');
const navbar = document.getElementById('navbar');
const contactForm = document.getElementById('contactForm');

// State management
let isScrolling = false;
let scrollTimeout;

// Mobile Navigation Toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    
    // Prevent body scroll when menu is open
    if (navMenu.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target) && navMenu.classList.contains('active')) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Fixed smooth scrolling for navigation links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1); // Remove the # symbol
        const targetSection = document.getElementById(targetId);
        
        if (targetSection) {
            const navbarHeight = navbar.offsetHeight || 70;
            const offsetTop = targetSection.offsetTop - navbarHeight;
            
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar scroll effects and active link highlighting
let lastScrollTop = 0;

function handleScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Navbar background and scroll effects
    if (scrollTop > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Active section highlighting
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 150;
        const sectionHeight = section.clientHeight;
        
        if (scrollTop >= sectionTop && scrollTop < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    // Update active nav link
    navLinks.forEach(link => {
        link.classList.remove('active');
        const linkHref = link.getAttribute('href').substring(1); // Remove # symbol
        if (linkHref === current) {
            link.classList.add('active');
        }
    });
    
    // Show/hide scroll to top button
    const scrollButton = document.querySelector('.scroll-to-top');
    if (scrollButton) {
        if (scrollTop > 300) {
            scrollButton.classList.add('visible');
        } else {
            scrollButton.classList.remove('visible');
        }
    }
    
    lastScrollTop = scrollTop;
}

// Throttled scroll event
window.addEventListener('scroll', () => {
    if (!isScrolling) {
        window.requestAnimationFrame(() => {
            handleScroll();
            isScrolling = false;
        });
        isScrolling = true;
    }
});

// Fixed Contact Form Handling
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form elements
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');
    
    // Get values
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const subject = subjectInput.value.trim();
    const message = messageInput.value.trim();
    
    // Validate form data
    if (!name) {
        showNotification('Please enter your name.', 'error');
        nameInput.focus();
        return;
    }
    
    if (!email) {
        showNotification('Please enter your email address.', 'error');
        emailInput.focus();
        return;
    }
    
    if (!subject) {
        showNotification('Please enter a subject.', 'error');
        subjectInput.focus();
        return;
    }
    
    if (!message) {
        showNotification('Please enter your message.', 'error');
        messageInput.focus();
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showNotification('Please enter a valid email address.', 'error');
        emailInput.focus();
        return;
    }
    
    try {
        // Create mailto link
        const emailBody = `From: ${name} (${email})%0D%0A%0D%0A${message}`;
        const mailtoLink = `mailto:sdasarathan@gmail.com?subject=${encodeURIComponent(subject)}&body=${emailBody}`;
        
        // Open default email client
        window.open(mailtoLink, '_self');
        
        // Show success message
        showNotification('Thank you for your message! Your email client should open now.', 'success');
        
        // Reset form with animation
        contactForm.reset();
        contactForm.classList.add('form-submitted');
        setTimeout(() => {
            contactForm.classList.remove('form-submitted');
        }, 1000);
        
    } catch (error) {
        console.error('Email client error:', error);
        showNotification('Unable to open email client. Please contact me directly at sdasarathan@gmail.com', 'error');
    }
});

// Enhanced Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => {
        notification.style.animation = 'slideOut 0.3s ease-in forwards';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    
    // Icon based on type
    let icon = '';
    switch(type) {
        case 'success':
            icon = '✅';
            break;
        case 'error':
            icon = '❌';
            break;
        case 'warning':
            icon = '⚠️';
            break;
        default:
            icon = 'ℹ️';
    }
    
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${icon}</span>
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()" aria-label="Close notification">×</button>
        </div>
    `;
    
    // Add styles for notification if not already present
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 90px;
                right: 20px;
                background: var(--color-surface);
                border: 2px solid var(--color-border-light);
                border-radius: var(--radius-lg);
                padding: var(--space-16);
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
                z-index: 1001;
                max-width: 400px;
                min-width: 300px;
                animation: slideIn 0.4s ease-out;
                backdrop-filter: blur(10px);
            }
            
            .notification--success {
                border-color: var(--color-success);
                background: rgba(var(--color-success-rgb), 0.1);
            }
            
            .notification--error {
                border-color: var(--color-error);
                background: rgba(var(--color-error-rgb), 0.1);
            }
            
            .notification--warning {
                border-color: var(--color-warning);
                background: rgba(var(--color-warning-rgb), 0.1);
            }
            
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
            
            .notification-content {
                display: flex;
                align-items: center;
                gap: var(--space-12);
            }
            
            .notification-icon {
                font-size: var(--font-size-lg);
                flex-shrink: 0;
            }
            
            .notification-message {
                color: var(--color-text);
                font-size: var(--font-size-sm);
                line-height: 1.5;
                flex: 1;
            }
            
            .notification-close {
                background: none;
                border: none;
                font-size: var(--font-size-xl);
                color: var(--color-text-secondary);
                cursor: pointer;
                padding: var(--space-4);
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: var(--radius-sm);
                transition: all var(--duration-fast) var(--ease-standard);
                flex-shrink: 0;
            }
            
            .notification-close:hover {
                background: var(--color-secondary);
                color: var(--color-text);
                transform: scale(1.1);
            }
            
            .form-submitted {
                animation: formSuccess 0.6s ease-out;
            }
            
            @keyframes formSuccess {
                0% { transform: scale(1); }
                50% { transform: scale(1.02); }
                100% { transform: scale(1); }
            }
            
            @media (max-width: 768px) {
                .notification {
                    right: 10px;
                    left: 10px;
                    max-width: none;
                    min-width: auto;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOut 0.3s ease-in forwards';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Initialize scroll animations
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll(
        '.timeline-item, .skill-category, .highlight-item, .education-item, .card, .contact-item'
    );
    
    animatedElements.forEach((el, index) => {
        // Set initial state
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.8s ease-out ${index * 0.1}s, transform 0.8s ease-out ${index * 0.1}s`;
        
        // Observe for intersection
        observer.observe(el);
    });
}

// Hero section typing effect
function initTypingEffect() {
    const subtitle = document.querySelector('.hero-subtitle');
    if (!subtitle) return;
    
    const text = subtitle.textContent;
    subtitle.textContent = '';
    subtitle.style.borderRight = '2px solid rgba(255, 255, 255, 0.7)';
    
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
    setTimeout(typeWriter, 1500);
}

// Parallax effect for hero section
function initParallaxEffect() {
    const hero = document.querySelector('.hero');
    const heroBackground = document.querySelector('.hero-background');
    
    if (!hero || !heroBackground) return;
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroHeight = hero.offsetHeight;
        
        if (scrolled < heroHeight) {
            const parallaxSpeed = scrolled * 0.3;
            heroBackground.style.transform = `translateY(${parallaxSpeed}px)`;
        }
    });
}

// Skills section enhanced animation
function initSkillsAnimation() {
    const skillCategories = document.querySelectorAll('.skill-category');
    
    const skillsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const category = entry.target;
                const skillTags = category.querySelectorAll('.skill-tag');
                
                // Animate category first
                category.style.opacity = '1';
                category.style.transform = 'translateY(0)';
                
                // Then animate individual skill tags
                skillTags.forEach((tag, index) => {
                    setTimeout(() => {
                        tag.style.opacity = '1';
                        tag.style.transform = 'translateY(0) scale(1)';
                    }, index * 100);
                });
            }
        });
    }, { threshold: 0.3 });
    
    skillCategories.forEach(category => {
        const skillTags = category.querySelectorAll('.skill-tag');
        
        // Set initial state for skill tags
        skillTags.forEach(tag => {
            tag.style.opacity = '0';
            tag.style.transform = 'translateY(20px) scale(0.9)';
            tag.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
        });
        
        skillsObserver.observe(category);
    });
}

// Enhanced timeline animation
function initTimelineAnimation() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('timeline-animate');
            }
        });
    }, { threshold: 0.4 });
    
    // Add CSS for timeline animation
    const timelineStyle = document.createElement('style');
    timelineStyle.textContent = `
        .timeline-item {
            opacity: 0;
            transform: translateX(-50px);
            transition: opacity 0.8s ease-out, transform 0.8s ease-out;
        }
        
        .timeline-item.timeline-animate {
            opacity: 1;
            transform: translateX(0);
        }
        
        .timeline-item:nth-child(even) {
            transform: translateX(50px);
        }
        
        .timeline-item:nth-child(even).timeline-animate {
            transform: translateX(0);
        }
        
        @media (max-width: 768px) {
            .timeline-item {
                transform: translateY(30px);
            }
            
            .timeline-item.timeline-animate {
                transform: translateY(0);
            }
            
            .timeline-item:nth-child(even) {
                transform: translateY(30px);
            }
            
            .timeline-item:nth-child(even).timeline-animate {
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(timelineStyle);
    
    timelineItems.forEach(item => {
        timelineObserver.observe(item);
    });
}

// Scroll to top functionality
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Add scroll to top button
function initScrollToTop() {
    const scrollButton = document.createElement('button');
    scrollButton.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="18 15 12 9 6 15"></polyline>
        </svg>
    `;
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
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, var(--color-primary), var(--color-primary-hover));
            color: var(--color-text-on-primary);
            border: none;
            border-radius: 50%;
            cursor: pointer;
            opacity: 0;
            visibility: hidden;
            transition: all var(--duration-normal) var(--ease-standard);
            z-index: 1000;
            box-shadow: 0 8px 25px rgba(33, 150, 243, 0.3);
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .scroll-to-top:hover {
            background: linear-gradient(135deg, var(--color-primary-hover), var(--color-primary-active));
            transform: translateY(-5px);
            box-shadow: 0 12px 35px rgba(33, 150, 243, 0.4);
        }
        
        .scroll-to-top.visible {
            opacity: 1;
            visibility: visible;
        }
        
        @media (max-width: 768px) {
            .scroll-to-top {
                bottom: 20px;
                right: 20px;
                width: 50px;
                height: 50px;
            }
        }
    `;
    document.head.appendChild(scrollButtonStyle);
    document.body.appendChild(scrollButton);
}

// LinkedIn profile link functionality
function initLinkedInLink() {
    const linkedinBtn = document.querySelector('.linkedin-btn');
    if (linkedinBtn) {
        linkedinBtn.addEventListener('click', (e) => {
            // Add click animation
            linkedinBtn.style.transform = 'scale(0.95)';
            setTimeout(() => {
                linkedinBtn.style.transform = '';
            }, 150);
        });
    }
}

// Enhanced form validation
function initFormValidation() {
    const formInputs = document.querySelectorAll('.form-control');
    
    formInputs.forEach(input => {
        // Real-time validation feedback
        input.addEventListener('blur', () => {
            validateField(input);
        });
        
        input.addEventListener('input', () => {
            // Clear validation state when user starts typing
            input.classList.remove('invalid', 'valid');
        });
    });
}

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    
    // Basic validation
    if (!value) {
        isValid = false;
    }
    
    // Email specific validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        isValid = emailRegex.test(value);
    }
    
    // Add visual feedback
    if (isValid && value) {
        field.classList.add('valid');
        field.classList.remove('invalid');
    } else if (!isValid && value) {
        field.classList.add('invalid');
        field.classList.remove('valid');
    }
    
    return isValid;
}

// Add form validation styles
function addFormValidationStyles() {
    const validationStyle = document.createElement('style');
    validationStyle.textContent = `
        .form-control.valid {
            border-color: var(--color-success);
            box-shadow: 0 0 0 3px rgba(var(--color-success-rgb), 0.1);
        }
        
        .form-control.invalid {
            border-color: var(--color-error);
            box-shadow: 0 0 0 3px rgba(var(--color-error-rgb), 0.1);
        }
    `;
    document.head.appendChild(validationStyle);
}

// Initialize all features when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all animations and effects
    initScrollAnimations();
    initTypingEffect();
    initParallaxEffect();
    initSkillsAnimation();
    initTimelineAnimation();
    initScrollToTop();
    initLinkedInLink();
    initFormValidation();
    addFormValidationStyles();
    
    // Set initial active nav link based on current scroll position
    setTimeout(() => {
        handleScroll(); // This will set the correct active link
    }, 100);
    
    // Add loading animation to main elements
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
});

// Handle window resize
window.addEventListener('resize', () => {
    // Close mobile menu on resize to larger screen
    if (window.innerWidth > 768) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Handle focus management for accessibility
document.addEventListener('keydown', (e) => {
    // Close mobile menu with Escape key
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Performance optimization: Debounce resize events
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // Recalculate positions if needed
        handleScroll();
    }, 250);
});

// Add smooth reveal animation for page load
const pageLoadStyle = document.createElement('style');
pageLoadStyle.textContent = `
    body {
        opacity: 0;
        transition: opacity 0.5s ease-out;
    }
    
    body.loaded {
        opacity: 1;
    }
`;
document.head.appendChild(pageLoadStyle);