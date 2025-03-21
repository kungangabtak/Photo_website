// JavaScript for the schedule pages
// Save as js/schedule.js

document.addEventListener('DOMContentLoaded', function() {
    // Make sure all toggle sections start collapsed
    const allToggleContents = document.querySelectorAll('.toggle-content');
    allToggleContents.forEach(content => {
        content.style.display = 'none';
        // Set initial styles for smooth transitions
        content.style.overflow = 'hidden';
        content.style.maxHeight = '0';
        content.style.transition = 'max-height 0.3s ease-out';
    });
    
    // Toggle functionality for sidebar sections
    const toggleHeaders = document.querySelectorAll('.toggle-header');
    
    // Function to close a specific toggle section
    function closeToggleSection(header) {
        header.classList.remove('active');
        const sectionId = header.getAttribute('data-section');
        const contentSection = document.getElementById(`${sectionId}-content`);
        
        // Collapse
        contentSection.style.maxHeight = '0';
        
        // Add event listener for transition end to hide element completely
        const transitionEnd = () => {
            if (contentSection.style.maxHeight === '0px') {
                contentSection.style.display = 'none';
            }
            contentSection.removeEventListener('transitionend', transitionEnd);
        };
        contentSection.addEventListener('transitionend', transitionEnd);
        
        // Change icon to plus
        const icon = header.querySelector('.toggle-icon i');
        icon.classList.remove('fa-minus');
        icon.classList.add('fa-plus');
    }
    
    // Function to close all toggle sections
    function closeAllToggleSections() {
        toggleHeaders.forEach(header => {
            closeToggleSection(header);
        });
    }
    
    toggleHeaders.forEach(header => {
        const sectionId = header.getAttribute('data-section');
        const contentSection = document.getElementById(`${sectionId}-content`);
        
        // Add click event
        header.addEventListener('click', () => {
            // Check if this section is already active
            const isActive = header.classList.contains('active');
            
            // Close all sections first
            closeAllToggleSections();
            
            // If this section wasn't active before, open it
            if (!isActive) {
                // Toggle active class
                header.classList.add('active');
                
                // Expand
                contentSection.style.display = 'block';
                // Force browser to calculate scrollHeight by accessing the property
                const height = contentSection.scrollHeight;
                contentSection.style.maxHeight = height + 'px';
                
                // Change icon to minus
                const icon = header.querySelector('.toggle-icon i');
                icon.classList.remove('fa-plus');
                icon.classList.add('fa-minus');
            }
        });
    });

    // Terms and Conditions Modal Functionality
    const termsLink = document.getElementById('terms-link');
    const termsModal = document.getElementById('terms-modal');
    const closeModal = document.querySelector('.close-modal');
    
    if (termsLink && termsModal) {
        // Open modal when terms link is clicked
        termsLink.addEventListener('click', function(e) {
            e.preventDefault();
            termsModal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling behind modal
        });
        
        // Close modal when X is clicked
        if (closeModal) {
            closeModal.addEventListener('click', function() {
                termsModal.classList.remove('active');
                document.body.style.overflow = ''; // Restore scrolling
            });
        }
        
        // Close modal when clicking outside content
        termsModal.addEventListener('click', function(e) {
            if (e.target === termsModal) {
                termsModal.classList.remove('active');
                document.body.style.overflow = ''; // Restore scrolling
            }
        });
        
        // Close modal with Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && termsModal.classList.contains('active')) {
                termsModal.classList.remove('active');
                document.body.style.overflow = ''; // Restore scrolling
            }
        });
    }
    
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
            
            // Get the form data
            const formData = new FormData(interestForm);

            // Send the AJAX request to your server
            fetch('process-interest-form.php', {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                // Handle successful response
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
            })
            .catch(error => {
                // Handle errors
                console.error('Error submitting form:', error);
                
                // Re-enable the submit button
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Check Availability <i class="fas fa-arrow-right"></i>';
                
                // Show error message
                let errorMsg = document.getElementById('form-error-message');
                if (!errorMsg) {
                    errorMsg = document.createElement('div');
                    errorMsg.id = 'form-error-message';
                    errorMsg.className = 'error-message';
                    errorMsg.textContent = 'There was a problem submitting your form. Please try again.';
                    interestForm.prepend(errorMsg);
                }
            });
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
            // Get the form data
            const formData = new FormData(detailedForm);

            // Send the AJAX request to your server
            fetch('process-booking-form.php', {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                // Handle successful response
                const formContainer = detailedForm.closest('.form-container');
                
                // Replace with success message
                formContainer.innerHTML = `
                    <div class="success-message">
                        <div class="success-icon">
                            <i class="fas fa-check-circle"></i>
                        </div>
                        <h2>Booking Successful!</h2>
                        <p>Thanks for booking your photography session with us.</p>
                        <p>We'll send a confirmation email with all the details shortly.</p>
                        <p>If you have any questions, please contact us.</p>
                    </div>
                `;
                
                // Scroll to success message
                formContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
            })
            .catch(error => {
                // Handle errors
                console.error('Error submitting form:', error);
                
                // Re-enable the submit button
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
                
                // Show error message
                let errorMsg = document.getElementById('form-error-message');
                if (!errorMsg) {
                    errorMsg = document.createElement('div');
                    errorMsg.id = 'form-error-message';
                    errorMsg.className = 'error-message';
                    errorMsg.textContent = 'There was a problem submitting your form. Please try again.';
                    detailedForm.prepend(errorMsg);
                }
            });
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