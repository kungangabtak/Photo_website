// Main JavaScript file for UIUC Grad Photos website

document.addEventListener('DOMContentLoaded', function() {
    // Set active navigation link based on current page
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        
        // Check if link href matches current page
        const linkPage = link.getAttribute('href');
        if (currentPage === linkPage || 
            // Handle index page edge cases
            (currentPage === '' && linkPage === 'index.html') ||
            (currentPage === '/' && linkPage === 'index.html')) {
            link.classList.add('active');
        }
    });
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    function initVerticalCarousel() {
        const slides = document.querySelectorAll('.carousel-slide');
        const indicators = document.querySelectorAll('.indicator');
        let currentIndex = 0;
        let interval;
        
        // Function to update carousel to show specific slide
        function updateCarousel(index) {
            // Remove active class from all slides and indicators
            slides.forEach(slide => slide.classList.remove('active'));
            indicators.forEach(dot => dot.classList.remove('active'));
            
            // Add active class to current slide and indicator
            slides[index].classList.add('active');
            indicators[index].classList.add('active');
            
            currentIndex = index;
        }
        
        // Function to advance to next slide
        function nextSlide() {
            currentIndex = (currentIndex + 1) % slides.length;
            updateCarousel(currentIndex);
        }
        
        // Set up auto rotation
        function startInterval() {
            interval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
        }
        
        // Reset timer when user interacts
        function resetInterval() {
            clearInterval(interval);
            startInterval();
        }
        
        // Set up click handler for indicators
        indicators.forEach(dot => {
            dot.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                updateCarousel(index);
                resetInterval();
            });
        });
        
        // Add swipe functionality for mobile
        const carousel = document.querySelector('.vertical-carousel');
        let startY, endY;
        
        carousel.addEventListener('touchstart', function(e) {
            startY = e.touches[0].clientY;
        }, false);
        
        carousel.addEventListener('touchend', function(e) {
            endY = e.changedTouches[0].clientY;
            handleSwipe();
        }, false);
        
        function handleSwipe() {
            // Calculate swipe distance
            const swipeDistance = startY - endY;
            
            // If sufficient swipe up, go to next slide
            if (swipeDistance > 50) {
                currentIndex = (currentIndex + 1) % slides.length;
                updateCarousel(currentIndex);
                resetInterval();
            }
            // If sufficient swipe down, go to previous slide
            else if (swipeDistance < -50) {
                currentIndex = (currentIndex - 1 + slides.length) % slides.length;
                updateCarousel(currentIndex);
                resetInterval();
            }
        }
        
        // Initialize first slide and start auto rotation
        updateCarousel(0);
        startInterval();
    }
    
    // Call the function if the carousel exists
    if (document.querySelector('.vertical-carousel')) {
        initVerticalCarousel();
    }
    
    // Feature Carousel functionality
    const carouselContainer = document.querySelector('.carousel-container');
    const carouselIndicators = document.querySelector('.carousel-indicators');
    const carouselPrev = document.querySelector('.carousel-prev');
    const carouselNext = document.querySelector('.carousel-next');

    if (carouselContainer && carouselIndicators) {
        const cardWidth = 330; // Card width + margin
        let currentIndex = 0;
        const totalCards = document.querySelectorAll('.carousel-container .feature-card').length;
        
        // Function to determine visible cards based on screen width
        function getVisibleCards() {
            if (window.innerWidth < 768) {
                return 1; // Mobile shows 1 card
            } else if (window.innerWidth < 992) {
                return 2; // Tablet shows 2 cards
            } else {
                return 3; // Desktop shows 3 cards
            }
        }
        
        let visibleCards = getVisibleCards();
        let maxIndex = Math.max(0, totalCards - visibleCards);
        
        // Create the correct number of dots
        function setupIndicators() {
            // Clear existing dots
            carouselIndicators.innerHTML = '';
            
            // Calculate how many pages we need
            const pageCount = Math.ceil(totalCards / visibleCards);
            
            // Create a dot for each page
            for (let i = 0; i < pageCount; i++) {
                const dot = document.createElement('div');
                dot.className = 'carousel-dot';
                if (i === 0) dot.classList.add('active');
                
                // Add click event to each dot
                dot.addEventListener('click', () => {
                    currentIndex = i * visibleCards;
                    if (currentIndex > maxIndex) currentIndex = maxIndex;
                    updateCarousel();
                    resetTimer();
                });
                
                carouselIndicators.appendChild(dot);
            }
        }
        
        // Update on window resize
        window.addEventListener('resize', () => {
            visibleCards = getVisibleCards();
            maxIndex = Math.max(0, totalCards - visibleCards);
            setupIndicators(); // Recreate indicators when screen size changes
            updateCarousel();
        });
        
        // Function to update carousel position
        function updateCarousel() {
            carouselContainer.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
            
            // Update active dot
            const carouselDots = document.querySelectorAll('.carousel-dot');
            if (carouselDots.length) {
                const activeDotIndex = Math.floor(currentIndex / visibleCards);
                carouselDots.forEach((dot, index) => {
                    dot.classList.toggle('active', index === activeDotIndex);
                });
            }
        }
        
        // Set up automatic rotation
        let autoRotate = setInterval(() => {
            if (currentIndex >= maxIndex) {
                currentIndex = 0;
            } else {
                currentIndex++;
            }
            updateCarousel();
        }, 4000);
        
        // Reset timer when user interacts
        function resetTimer() {
            clearInterval(autoRotate);
            autoRotate = setInterval(() => {
                if (currentIndex >= maxIndex) {
                    currentIndex = 0;
                } else {
                    currentIndex++;
                }
                updateCarousel();
            }, 4000);
        }
        
        // Navigation buttons
        if (carouselPrev) {
            carouselPrev.addEventListener('click', () => {
                currentIndex = Math.max(0, currentIndex - 1);
                updateCarousel();
                resetTimer();
            });
        }
        
        if (carouselNext) {
            carouselNext.addEventListener('click', () => {
                currentIndex = Math.min(maxIndex, currentIndex + 1);
                updateCarousel();
                resetTimer();
            });
        }
        
        // Initialize
        setupIndicators();
        updateCarousel();
    }
    
    // Add animations to elements as they come into view
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.testimonial-card, .info-card');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (elementPosition < screenPosition) {
                element.classList.add('animated');
            }
        });
    };
    
    // Run animation check on load and scroll
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Run once on load
    
    // Form validation for booking form
    const bookingForm = document.getElementById('booking-form');

    if (bookingForm) {
        // Initialize form validation state tracking
        const formState = {
            isSubmitting: false,
            fieldStatus: {}
        };
        
        // Add input event listeners to provide real-time validation feedback
        const inputFields = bookingForm.querySelectorAll('input, select, textarea');
        inputFields.forEach(field => {
            // Skip checkboxes for the real-time validation
            if (field.type === 'checkbox') return;
            
            field.addEventListener('input', function() {
                validateField(this);
            });
            
            field.addEventListener('blur', function() {
                validateField(this, true);
            });
        });
        
        // Function to validate a single field
        function validateField(field, showError = false) {
            const fieldName = field.name;
            let isValid = true;
            let errorMessage = '';
            
            // Clear existing error
            clearFieldError(field);
            
            // Required field validation
            if (field.hasAttribute('required') && !field.value.trim()) {
                isValid = false;
                errorMessage = 'This field is required';
            }
            
            // Email validation
            if (fieldName === 'email' && field.value.trim()) {
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailPattern.test(field.value.trim())) {
                    isValid = false;
                    errorMessage = 'Please enter a valid email address';
                }
            }
            
            // Phone validation
            if (fieldName === 'phone' && field.value.trim()) {
                const phonePattern = /^[0-9()\-\s+]{10,15}$/;
                if (!phonePattern.test(field.value.replace(/\s/g, ''))) {
                    isValid = false;
                    errorMessage = 'Please enter a valid phone number';
                }
            }
            
            // Date validation for future dates only
            if ((fieldName === 'session-date' || fieldName === 'graduation-date') && field.value) {
                const selectedDate = new Date(field.value);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                
                if (selectedDate < today) {
                    isValid = false;
                    errorMessage = 'Please select a future date';
                }
            }
            
            // Update form state
            formState.fieldStatus[fieldName] = isValid;
            
            // Show error if requested and field is invalid
            if (showError && !isValid) {
                displayFieldError(field, errorMessage);
            }
            
            return isValid;
        }
        
        // Function to clear field error
        function clearFieldError(field) {
            field.classList.remove('error');
            
            // Remove any existing error message
            const errorElement = field.parentNode.querySelector('.field-error');
            if (errorElement) {
                errorElement.remove();
            }
        }
        
        // Function to display field error
        function displayFieldError(field, message) {
            field.classList.add('error');
            
            // Add error message
            const errorElement = document.createElement('p');
            errorElement.className = 'field-error';
            errorElement.textContent = message;
            field.parentNode.appendChild(errorElement);
        }
        
        // Function to check if all required fields are valid
        function isFormValid() {
            let isValid = true;
            const requiredFields = bookingForm.querySelectorAll('[required]');
            
            requiredFields.forEach(field => {
                if (!validateField(field, true)) {
                    isValid = false;
                }
            });
            
            return isValid;
        }
        
        // Form submission handler
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Prevent double submission
            if (formState.isSubmitting) return;
            
            // Clear any previous form error
            const existingErrorMessage = bookingForm.querySelector('.form-error-message');
            if (existingErrorMessage) {
                existingErrorMessage.remove();
            }
            
            // Validate all fields
            if (!isFormValid()) {
                // Show form error message
                const errorMessage = document.createElement('div');
                errorMessage.className = 'form-error-message';
                errorMessage.innerHTML = 'Please correct the errors in the form before submitting.';
                bookingForm.prepend(errorMessage);
                
                // Scroll to the top of the form
                errorMessage.scrollIntoView({ behavior: 'smooth', block: 'start' });
                return;
            }
            
            // Set submitting state
            formState.isSubmitting = true;
            
            // Show loading state
            const submitButton = bookingForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
            submitButton.disabled = true;
            
            // Collect form data
            const formData = new FormData(bookingForm);
            const formDataObj = Object.fromEntries(formData.entries());
            
            // In a real implementation, you would send this data to a server
            // For this demo, we'll simulate a server request with a timeout
            setTimeout(() => {
                // Reset submitting state
                formState.isSubmitting = false;
                
                // For demo purposes, show success message
                const formContainer = document.querySelector('.form-container');
                formContainer.innerHTML = `
                    <div class="success-message">
                        <div class="success-icon">
                            <i class="fas fa-check-circle"></i>
                        </div>
                        <h2>Booking Request Received!</h2>
                        <p>Thank you for scheduling your photography session. We'll send a confirmation email within 24 hours.</p>
                        <p>If you have any questions, feel free to contact us at <strong>contact@uiucgradphotos.com</strong>.</p>
                        <a href="index.html" class="btn primary-btn">Return to Home</a>
                        <a href="javascript:void(0)" id="new-booking" class="btn secondary-btn">Book Another Session</a>
                    </div>
                `;
                
                // Add listener for the "Book Another Session" button
                const newBookingBtn = document.getElementById('new-booking');
                if (newBookingBtn) {
                    newBookingBtn.addEventListener('click', function() {
                        // Reload the page to reset the form
                        window.location.reload();
                    });
                }
                
                // Scroll to the top of the success message
                formContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 1500);
        });
    }
    
    // Show/hide graduation date field based on event type
    const eventTypeField = document.getElementById('event-type');
    const graduationDateGroup = document.getElementById('graduation-date-group');
    
    if (eventTypeField && graduationDateGroup) {
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
});