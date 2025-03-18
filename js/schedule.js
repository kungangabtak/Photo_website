// JavaScript for the schedule pages
// Save as js/schedule.js

document.addEventListener('DOMContentLoaded', function() {
    // Make sure all toggle sections start collapsed
    const allToggleContents = document.querySelectorAll('.toggle-content');
    allToggleContents.forEach(content => {
        content.style.display = 'none';
    });
    
    // Toggle functionality for sidebar sections
    const toggleHeaders = document.querySelectorAll('.toggle-header');
    
    toggleHeaders.forEach(header => {
        const sectionId = header.getAttribute('data-section');
        const contentSection = document.getElementById(`${sectionId}-content`);
        
        // Add click event
        header.addEventListener('click', () => {
            // Toggle active class
            header.classList.toggle('active');
            
            // Toggle content visibility with animation
            if (contentSection.style.display === 'block') {
                // Slide up
                contentSection.style.maxHeight = contentSection.scrollHeight + 'px';
                setTimeout(() => {
                    contentSection.style.maxHeight = '0';
                    setTimeout(() => {
                        contentSection.style.display = 'none';
                    }, 300);
                }, 10);
                
                // Change icon to plus
                const icon = header.querySelector('.toggle-icon i');
                icon.classList.remove('fa-minus');
                icon.classList.add('fa-plus');
            } else {
                // Slide down
                contentSection.style.display = 'block';
                contentSection.style.maxHeight = '0';
                setTimeout(() => {
                    contentSection.style.maxHeight = contentSection.scrollHeight + 'px';
                    contentSection.style.overflow = 'visible';
                }, 10);
                
                // Change icon to minus
                const icon = header.querySelector('.toggle-icon i');
                icon.classList.remove('fa-plus');
                icon.classList.add('fa-minus');
            }
        });
    });
    
    // Interest form submission handler
    const interestForm = document.getElementById('interest-form');
    if (interestForm) {
        interestForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simple validation
            const requiredInputs = interestForm.querySelectorAll('[required]');
            let isValid = true;
            
            requiredInputs.forEach(input => {
                if (input.type === 'checkbox') {
                    if (!input.checked) {
                        isValid = false;
                        input.parentNode.classList.add('error');
                    } else {
                        input.parentNode.classList.remove('error');
                    }
                } else if (!input.value.trim()) {
                    isValid = false;
                    input.classList.add('error');
                } else {
                    input.classList.remove('error');
                }
            });
            
            if (!isValid) {
                // Show error message
                let errorMsg = document.getElementById('form-error-message');
                if (!errorMsg) {
                    errorMsg = document.createElement('div');
                    errorMsg.id = 'form-error-message';
                    errorMsg.className = 'error-message';
                    errorMsg.textContent = 'Please fill in all required fields.';
                    interestForm.prepend(errorMsg);
                }
                return false;
            }
            
            // Disable submit button and show loading state
            const submitBtn = interestForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            
            // Simulate form submission (would be an actual AJAX request in production)
            setTimeout(() => {
                // Get the form container
                const formContainer = interestForm.closest('.form-container');
                
                // Replace with success message
                formContainer.innerHTML = `
                    <div class="success-message">
                        <div class="success-icon">
                            <i class="fas fa-check-circle"></i>
                        </div>
                        <h2>Request Sent Successfully!</h2>
                        <p>Thanks for your interest in our photography services.</p>
                        <p>We'll be in touch within 24 hours to discuss your session and confirm details.</p>
                        <p>Check your email for a confirmation message.</p>
                    </div>
                `;
                
                // Scroll to success message
                formContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 1500);
        });
    }
    
    // Detailed booking form submission handler
    const detailedForm = document.getElementById('detailed-booking-form');
    if (detailedForm) {
        // Handle conditional fields
        const eventTypeField = document.getElementById('event-type');
        const graduationDateGroup = document.getElementById('graduation-date-group');
        
        if (eventTypeField && graduationDateGroup) {
            // Hide graduation date field initially
            graduationDateGroup.style.display = 'none';
            
            eventTypeField.addEventListener('change', function() {
                if (this.value === 'graduation') {
                    graduationDateGroup.style.display = 'block';
                    document.getElementById('graduation-date').setAttribute('required', 'required');
                } else {
                    graduationDateGroup.style.display = 'none';
                    document.getElementById('graduation-date').removeAttribute('required');
                }
            });
        }
        
        // Form submission
        detailedForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validation
            const requiredInputs = detailedForm.querySelectorAll('[required]');
            let isValid = true;
            
            requiredInputs.forEach(input => {
                if (input.type === 'checkbox') {
                    if (!input.checked) {
                        isValid = false;
                        input.parentNode.classList.add('error');
                    } else {
                        input.parentNode.classList.remove('error');
                    }
                } else if (!input.value.trim()) {
                    isValid = false;
                    input.classList.add('error');
                } else {
                    input.classList.remove('error');
                }
            });
            
            if (!isValid) {
                // Show error message
                let errorMsg = document.getElementById('form-error-message');
                if (!errorMsg) {
                    errorMsg = document.createElement('div');
                    errorMsg.id = 'form-error-message';
                    errorMsg.className = 'error-message';
                    errorMsg.textContent = 'Please fill in all required fields.';
                    detailedForm.prepend(errorMsg);
                }
                return false;
            }
            
            // Disable submit button and show loading state
            const submitBtn = detailedForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Booking...';
            
            // Simulate form submission
            setTimeout(() => {
                // Get the form container
                const formContainer = detailedForm.closest('.form-container');
                
                // Replace with success message
                formContainer.innerHTML = `
                    <div class="success-message">
                        <div class="success-icon">
                            <i class="fas fa-check-circle"></i>
                        </div>
                        <h2>Booking Confirmed!</h2>
                        <p>Your photography session has been scheduled successfully.</p>
                        <p>We've sent a confirmation email with all the details to your inbox.</p>
                        <p>If you need to make any changes, please contact us at (217) 555-1234.</p>
                    </div>
                `;
                
                // Scroll to success message
                formContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 1500);
        });
    }
    
    // Error handling for form fields
    const allInputs = document.querySelectorAll('input, select, textarea');
    allInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.classList.remove('error');
            
            // Remove error message if clicking in any field
            const errorMsg = document.getElementById('form-error-message');
            if (errorMsg) {
                errorMsg.remove();
            }
        });
    });
    
    // Date validation for future dates only
    const dateInputs = document.querySelectorAll('input[type="date"]');
    dateInputs.forEach(input => {
        input.addEventListener('change', function() {
            if (this.value) {
                const selectedDate = new Date(this.value);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                
                if (selectedDate < today) {
                    this.classList.add('error');
                    
                    // Show inline error
                    let errorSpan = this.nextElementSibling;
                    if (!errorSpan || !errorSpan.classList.contains('date-error')) {
                        errorSpan = document.createElement('span');
                        errorSpan.className = 'date-error';
                        errorSpan.textContent = 'Please select a future date';
                        this.parentNode.insertBefore(errorSpan, this.nextSibling);
                    }
                } else {
                    this.classList.remove('error');
                    
                    // Remove error message if exists
                    const errorSpan = this.nextElementSibling;
                    if (errorSpan && errorSpan.classList.contains('date-error')) {
                        errorSpan.remove();
                    }
                }
            }
        });
    });
});