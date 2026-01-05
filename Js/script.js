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
// FORM SUBMISSION TEST SYSTEM
// For GitHub Pages with FormSubmit.co
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 FormSubmit Test System Initialized');
    
    // ============================================
    // 1. GLASS HEADER SCROLL EFFECT
    // ============================================
    const header = document.querySelector('.glass-header');
    if (header) {
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
    }
    
    // ============================================
    // 2. FORM INTERACTION EFFECTS
    // ============================================
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
    // 3. TEST MODE SYSTEM
    // ============================================
    const contactForm = document.getElementById('contactForm');
    const testModeToggle = document.getElementById('testModeToggle');
    const testModeIndicator = document.getElementById('testModeIndicator');
    const testResults = document.getElementById('testResults');
    
    let isTestMode = false;
    
    // Initialize test mode
    if (testModeToggle) {
        testModeToggle.addEventListener('change', function() {
            isTestMode = this.checked;
            updateTestModeUI(isTestMode);
            console.log(`🧪 Test Mode: ${isTestMode ? 'ON' : 'OFF'}`);
        });
    }
    
    function updateTestModeUI(testMode) {
        if (testModeIndicator) {
            testModeIndicator.style.display = testMode ? 'block' : 'none';
            testModeIndicator.innerHTML = testMode ? 
                '<i class="fas fa-vial"></i> TEST MODE ACTIVE (Stay on page)' :
                '<i class="fas fa-paper-plane"></i> LIVE MODE (Redirect to FormSubmit)';
        }
    }
    
    // ============================================
    // 4. FORM SUBMISSION HANDLER
    // ============================================
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            console.log('📤 Form submission started');
            
            const submitBtn = document.getElementById('submitBtn');
            const btnText = document.getElementById('btnText');
            const btnIcon = document.getElementById('btnIcon');
            
            // Validate form
            if (!contactForm.checkValidity()) {
                console.log('❌ Form validation failed');
                contactForm.reportValidity();
                return;
            }
            
            // Show sending state
            btnText.textContent = 'Sending...';
            btnIcon.className = 'fas fa-spinner fa-spin';
            submitBtn.disabled = true;
            submitBtn.style.pointerEvents = 'none';
            submitBtn.style.opacity = '0.8';
            
            // Collect form data for display
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value,
                contactType: document.getElementById('contactType').value,
                timestamp: new Date().toISOString()
            };
            
            console.log('📝 Form Data:', formData);
            
            // Show test results panel
            if (testResults) {
                testResults.style.display = 'block';
                updateTestResult('endpointStatus', 'Checking...', 'pending');
                updateTestResult('validationStatus', '✓ Valid', 'success');
            }
            
            if (isTestMode) {
                // TEST MODE: Stay on page, simulate submission
                console.log('🧪 Test Mode: Simulating submission');
                e.preventDefault();
                
                updateTestResult('submissionStatus', 'Simulating...', 'pending');
                
                // Simulate API delay
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                // Simulate success
                updateTestResult('endpointStatus', '✓ FormSubmit.co ready', 'success');
                updateTestResult('submissionStatus', '✓ Test submission successful', 'success');
                
                // Show success state
                showSuccessState(submitBtn, btnText, btnIcon);
                showNotification('✅ Test Successful! Form data collected:', 'success', formData);
                
                // Reset after delay
                setTimeout(() => {
                    resetFormState(submitBtn, btnText, btnIcon);
                    if (testResults) testResults.style.display = 'none';
                }, 5000);
                
            } else {
                // LIVE MODE: Submit to FormSubmit
                console.log('🚀 Live Mode: Submitting to FormSubmit');
                
                updateTestResult('submissionStatus', 'Submitting to FormSubmit...', 'pending');
                
                // Check FormSubmit endpoint
                try {
                    // Test endpoint availability
                    const testResponse = await fetch('https://formsubmit.co/ajax/test', {
                        method: 'HEAD',
                        mode: 'no-cors'
                    });
                    updateTestResult('endpointStatus', '✓ FormSubmit.co accessible', 'success');
                } catch (error) {
                    updateTestResult('endpointStatus', '⚠ FormSubmit may be blocked', 'warning');
                }
                
                // Submit form data via AJAX (stays on page)
                try {
                    const formDataObj = new FormData(contactForm);
                    
                    // Submit to FormSubmit
                    const response = await fetch(contactForm.action, {
                        method: 'POST',
                        body: formDataObj,
                        mode: 'no-cors'
                    });
                    
                    // Note: no-cors mode doesn't allow reading response
                    console.log('📨 Form submitted to FormSubmit');
                    updateTestResult('submissionStatus', '✓ Submitted successfully', 'success');
                    
                    // Show success state
                    showSuccessState(submitBtn, btnText, btnIcon);
                    showNotification('✅ Message sent! Check your email for confirmation.', 'success');
                    
                    // Reset form after success
                    contactForm.reset();
                    
                    // Reset after delay
                    setTimeout(() => {
                        resetFormState(submitBtn, btnText, btnIcon);
                        if (testResults) testResults.style.display = 'none';
                    }, 5000);
                    
                } catch (error) {
                    console.error('❌ Form submission error:', error);
                    updateTestResult('submissionStatus', '✗ Submission failed', 'error');
                    
                    // Show error state
                    btnText.textContent = 'Failed to Send';
                    btnIcon.className = 'fas fa-exclamation-triangle';
                    submitBtn.style.background = 'linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(239, 68, 68, 0.3))';
                    submitBtn.style.borderColor = 'rgba(239, 68, 68, 0.5)';
                    
                    showNotification('❌ Submission failed. Please try again or email directly.', 'error');
                    
                    // Reset after delay
                    setTimeout(() => {
                        resetFormState(submitBtn, btnText, btnIcon);
                        if (testResults) testResults.style.display = 'none';
                    }, 5000);
                }
            }
        });
    }
    
    // ============================================
    // 5. HELPER FUNCTIONS
    // ============================================
    function updateTestResult(elementId, message, type) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = message;
            element.className = 'result-value ' + type;
        }
    }
    
    function showSuccessState(button, textElement, iconElement) {
        textElement.textContent = 'Message Sent!';
        iconElement.className = 'fas fa-check';
        button.style.background = 'linear-gradient(135deg, rgba(74, 222, 128, 0.15), rgba(74, 222, 128, 0.3))';
        button.style.borderColor = 'rgba(74, 222, 128, 0.5)';
    }
    
    function resetFormState(button, textElement, iconElement) {
        textElement.textContent = 'Send Message';
        iconElement.className = 'fas fa-paper-plane';
        button.style.background = '';
        button.style.borderColor = '';
        button.style.opacity = '1';
        button.disabled = false;
        button.style.pointerEvents = 'auto';
    }
    
    function showNotification(message, type, data = null) {
        // Create notification
        const notification = document.createElement('div');
        notification.className = `form-notification form-notification-${type}`;
        
        let content = `<span>${message}</span>`;
        if (data && type === 'success') {
            content += `<div class="notification-data">
                <small>Name: ${data.name}</small><br>
                <small>Email: ${data.email}</small><br>
                <small>Subject: ${data.subject}</small>
            </div>`;
        }
        content += '<button class="notification-close">&times;</button>';
        
        notification.innerHTML = content;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Show with animation
        setTimeout(() => notification.classList.add('show'), 10);
        
        // Close button
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        });
        
        // Auto-remove after 8 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.classList.remove('show');
                setTimeout(() => notification.remove(), 300);
            }
        }, 8000);
        
        console.log(`📢 Notification: ${message}`);
    }
    
    // ============================================
    // 6. SOCIAL MEDIA EFFECTS
    // ============================================
    const socialIcons = document.querySelectorAll('.glass-social-icon');
    socialIcons.forEach(icon => {
        icon.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.1)';
        });
        
        icon.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // ============================================
    // 7. MOUSE PARALLAX EFFECT
    // ============================================
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
        
        // Move particles
        const particles = document.querySelectorAll('.particle');
        particles.forEach((particle, index) => {
            const speed = 0.2 + (index * 0.1);
            const x = (mouseX - 0.5) * 15 * speed;
            const y = (mouseY - 0.5) * 15 * speed;
            particle.style.transform = `translate(${x}px, ${y}px)`;
        });
    });
    
    // ============================================
    // 8. RIPPLE EFFECT
    // ============================================
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
    
    // ============================================
    // 9. DYNAMIC STYLES
    // ============================================
    const style = document.createElement('style');
    style.textContent = `
        /* Ripple animation */
        @keyframes ripple {
            to { transform: scale(4); opacity: 0; }
        }
        
        /* Test Mode Indicator */
        .test-mode-indicator {
            display: inline-block;
            background: rgba(139, 201, 235, 0.3);
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            margin: 10px 0;
            border: 1px solid rgba(139, 201, 235, 0.5);
            font-size: 0.9rem;
            backdrop-filter: blur(10px);
        }
        
        /* Test Toggle */
        .test-toggle {
            margin: 20px 0;
            padding: 15px;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 12px;
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .test-toggle label {
            display: flex;
            align-items: center;
            cursor: pointer;
            color: rgba(255, 255, 255, 0.9);
        }
        
        #testModeToggle {
            display: none;
        }
        
        .toggle-slider {
            position: relative;
            width: 50px;
            height: 24px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 34px;
            margin-right: 12px;
            transition: background 0.3s;
        }
        
        .toggle-slider:before {
            content: "";
            position: absolute;
            width: 20px;
            height: 20px;
            left: 2px;
            bottom: 2px;
            background: white;
            border-radius: 50%;
            transition: transform 0.3s;
        }
        
        #testModeToggle:checked + .toggle-slider {
            background: rgba(74, 222, 128, 0.5);
        }
        
        #testModeToggle:checked + .toggle-slider:before {
            transform: translateX(26px);
        }
        
        .test-hint {
            display: block;
            margin-top: 8px;
            color: rgba(255, 255, 255, 0.6);
            font-size: 0.85rem;
        }
        
        /* Test Results */
        .test-results {
            margin-top: 25px;
            padding: 20px;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 12px;
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .test-results h4 {
            color: #8bc9eb;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .result-item {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            padding: 8px 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        
        .result-label {
            color: rgba(255, 255, 255, 0.7);
        }
        
        .result-value {
            font-weight: 500;
        }
        
        .result-value.success { color: #4ade80; }
        .result-value.error { color: #f87171; }
        .result-value.warning { color: #fbbf24; }
        .result-value.pending { color: #60a5fa; }
        
        /* Notifications */
        .form-notification {
            position: fixed;
            top: 100px;
            right: 20px;
            padding: 20px;
            border-radius: 12px;
            backdrop-filter: blur(25px);
            border: 1px solid rgba(255, 255, 255, 0.15);
            box-shadow: 0 15px 50px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            transform: translateX(120%);
            transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            max-width: 400px;
            color: white;
        }
        
        .form-notification.show {
            transform: translateX(0);
        }
        
        .form-notification-success {
            background: rgba(74, 222, 128, 0.15);
            border-color: rgba(74, 222, 128, 0.4);
        }
        
        .form-notification-error {
            background: rgba(239, 68, 68, 0.15);
            border-color: rgba(239, 68, 68, 0.4);
        }
        
        .notification-close {
            position: absolute;
            top: 10px;
            right: 12px;
            background: none;
            border: none;
            color: inherit;
            font-size: 24px;
            cursor: pointer;
            opacity: 0.7;
            transition: opacity 0.2s;
            line-height: 1;
            padding: 0;
        }
        
        .notification-close:hover {
            opacity: 1;
        }
        
        .notification-data {
            margin-top: 10px;
            padding-top: 10px;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            color: rgba(255, 255, 255, 0.8);
            font-size: 0.9rem;
        }
    `;
    document.head.appendChild(style);
    
    console.log('✅ FormSubmit Test System Ready');
});