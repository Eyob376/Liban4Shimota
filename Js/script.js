document.addEventListener('DOMContentLoaded', function() {
        // Glass Header Scroll Effect
        const header = document.querySelector('.glass-header');
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            if (scrolled > 10) {
                header.style.backdropFilter = 'blur(25px) saturate(200%)';
                header.style.background = 'rgba(13, 71, 161, 0.85)';
            } else {
                header.style.backdropFilter = 'blur(20px) saturate(180%)';
                header.style.background = 'rgba(13, 71, 161, 0.75)';
            }
        });
        
        // Form Interaction Effects
        const inputs = document.querySelectorAll('.glass-input-container input, .glass-input-container textarea, .glass-input-container select');
        inputs.forEach(input => {
            const container = input.parentElement;
            const glow = container.querySelector('.input-glow');
            
            input.addEventListener('focus', function() {
                container.style.transform = 'translateY(-3px)';
                if (glow) glow.style.opacity = '1';
            });
            
            input.addEventListener('blur', function() {
                container.style.transform = 'translateY(0)';
                if (glow) glow.style.opacity = '0.5';
            });
        });
        
// ============================================
// FORM SUBMISSION TEST WITH FORMSUBMIT.CO
// ============================================
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        // Don't prevent default on first test
        // Let's test if FormSubmit works normally first
        // e.preventDefault(); // COMMENTED OUT FOR TEST
        
        const submitBtn = contactForm.querySelector('.glass-submit-btn');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnIcon = submitBtn.querySelector('.btn-icon');
        
        // Validate form
        if (!contactForm.checkValidity()) {
            contactForm.reportValidity();
            return;
        }
        
        // Show sending state
        btnText.textContent = 'Sending...';
        btnIcon.className = 'fas fa-spinner fa-spin';
        submitBtn.disabled = true;
        submitBtn.style.pointerEvents = 'none';
        submitBtn.style.opacity = '0.8';
        
        // TEST: For now, let the form submit normally to FormSubmit
        // The page will redirect to _next URL
        
        // If you want to test without redirect, uncomment below:
        /*
        e.preventDefault(); // Uncomment this line
        
        try {
            // Create form data
            const formData = new FormData(contactForm);
            
            // Send to FormSubmit
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                mode: 'no-cors' // Important for FormSubmit
            });
            
            // Since we use no-cors, we can't read the response
            // But we can assume success if no error
            console.log('Form submitted to FormSubmit');
            
            // Show success state
            btnText.textContent = 'Message Sent!';
            btnIcon.className = 'fas fa-check';
            submitBtn.style.background = 'linear-gradient(135deg, rgba(74, 222, 128, 0.15), rgba(74, 222, 128, 0.3))';
            submitBtn.style.borderColor = 'rgba(74, 222, 128, 0.5)';
            
            // Reset form
            contactForm.reset();
            
            // Show success message
            showTestNotification('✓ Test successful! Form submitted to FormSubmit. Check your email!', 'success');
            
            // Reset button after 5 seconds
            setTimeout(() => {
                resetSubmitButton(submitBtn, btnText, btnIcon);
            }, 5000);
            
        } catch (error) {
            console.error('Form submission error:', error);
            
            // Show error state
            btnText.textContent = 'Failed to Send';
            btnIcon.className = 'fas fa-exclamation-triangle';
            submitBtn.style.background = 'linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(239, 68, 68, 0.3))';
            submitBtn.style.borderColor = 'rgba(239, 68, 68, 0.5)';
            
            // Show error message
            showTestNotification('✗ Test failed. Please try again or email us directly.', 'error');
            
            // Reset button after 5 seconds
            setTimeout(() => {
                resetSubmitButton(submitBtn, btnText, btnIcon);
            }, 5000);
        }
        */
    });
}

// Helper function to reset submit button
function resetSubmitButton(button, textElement, iconElement) {
    textElement.textContent = 'Send Message';
    iconElement.className = 'fas fa-paper-plane';
    button.style.background = '';
    button.style.borderColor = '';
    button.style.opacity = '1';
    button.disabled = false;
    button.style.pointerEvents = 'auto';
}

// Test notification function
function showTestNotification(message, type) {
    // Remove existing notification
    const existingNotification = document.querySelector('.test-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `test-notification test-notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="test-notification-close">&times;</button>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Close button
    notification.querySelector('.test-notification-close').addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto-remove after 10 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }
    }, 10000);
}

// Add test notification styles
const testStyle = document.createElement('style');
testStyle.textContent = `
    .test-notification {
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 12px;
        backdrop-filter: blur(25px);
        border: 1px solid rgba(255, 255, 255, 0.15);
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        transform: translateX(120%);
        transition: transform 0.4s ease;
        max-width: 400px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-weight: 500;
        color: white;
    }
    
    .test-notification.show {
        transform: translateX(0);
    }
    
    .test-notification-success {
        background: rgba(74, 222, 128, 0.2);
        border-color: rgba(74, 222, 128, 0.4);
    }
    
    .test-notification-error {
        background: rgba(239, 68, 68, 0.2);
        border-color: rgba(239, 68, 68, 0.4);
    }
    
    .test-notification-close {
        background: none;
        border: none;
        color: inherit;
        font-size: 22px;
        cursor: pointer;
        margin-left: 15px;
        opacity: 0.8;
        transition: opacity 0.2s;
        line-height: 1;
    }
    
    .test-notification-close:hover {
        opacity: 1;
    }
`;
document.head.appendChild(testStyle);


}
        
        // Social Media Icon Hover Effects
        const socialIcons = document.querySelectorAll('.glass-social-icon');
        socialIcons.forEach(icon => {
            icon.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-5px) scale(1.1)';
            });
            
            icon.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });
        
        // Mouse Move Parallax Effect
        document.addEventListener('mousemove', function(e) {
            const mouseX = e.clientX / window.innerWidth;
            const mouseY = e.clientY / window.innerHeight;
            
            // Move highlights
            const highlights = document.querySelectorAll('.glass-highlight, .form-highlight');
            highlights.forEach(highlight => {
                const x = (mouseX - 0.5) * 30;
                const y = (mouseY - 0.5) * 30;
                highlight.style.transform = `translate(${x}px, ${y}px)`;
            });
            
            // Move particles slightly
            const particles = document.querySelectorAll('.particle');
            particles.forEach((particle, index) => {
                const speed = 0.2 + (index * 0.1);
                const x = (mouseX - 0.5) * 15 * speed;
                const y = (mouseY - 0.5) * 15 * speed;
                particle.style.transform = `translate(${x}px, ${y}px)`;
            });
        });
        
        // Ripple Effect for Cards and Buttons
        const glassElements = document.querySelectorAll('.glass-card, .glass-submit-btn, .glass-social-icon');
        glassElements.forEach(element => {
            element.addEventListener('click', function(e) {
                const rect = element.getBoundingClientRect();
                const ripple = document.createElement('span');
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.cssText = `
                    position: absolute;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.3);
                    transform: scale(0);
                    animation: ripple 0.6s linear;
                    width: ${size}px;
                    height: ${size}px;
                    top: ${y}px;
                    left: ${x}px;
                    pointer-events: none;
                `;
                
                element.style.position = 'relative';
                element.style.overflow = 'hidden';
                element.appendChild(ripple);
                
                setTimeout(() => ripple.remove(), 600);
            });
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
    });
	
	// --------------------------------------------------------------------------------------------------------------------
	
	// NAVIGATION ACTIVE STATE MANAGEMENT
// ============================================

// Function to set active navigation based on current page
function setActiveNavigation() {
    // Get current page filename
    const currentPage = window.location.pathname.split('/').pop();
    
    // Get all navigation items
    const navItems = document.querySelectorAll('.glass-nav li');
    const navLinks = document.querySelectorAll('.glass-nav a');
    
    // Remove active states first
    navItems.forEach(item => {
        item.classList.remove('active');
    });
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    // Determine which page is active
    let activeIndex = 0; // Default to Home
    
    if (currentPage === '' || currentPage === 'index.html' || currentPage.includes('index')) {
        activeIndex = 0; // Home
    } else if (currentPage.includes('about')) {
        activeIndex = 1; // About
    } else if (currentPage.includes('tours')) {
        activeIndex = 2; // Tours
    } else if (currentPage.includes('weledo')) {
        activeIndex = 3; // Weledo
    } else if (currentPage.includes('contact')) {
        activeIndex = 4; // Contact
    }
    
    // Add active state to correct item
    if (navItems[activeIndex]) {
        navItems[activeIndex].classList.add('active');
        navLinks[activeIndex].classList.add('active');
    }
    
    // Log for debugging (remove in production)
    console.log('Current page:', currentPage, 'Active index:', activeIndex);
}

// Call the function when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    setActiveNavigation();
    
    // Also update on page navigation (if using SPA or AJAX)
    // Add this if you have dynamic page loading
    window.addEventListener('popstate', setActiveNavigation);
});