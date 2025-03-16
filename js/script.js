// Main JavaScript file for UIUC Grad Photos website

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }
    
    // Close mobile menu when a link is clicked
    const navItems = document.querySelectorAll('.nav-links a');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            if (hamburger.classList.contains('active')) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });
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
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic validation
            let isValid = true;
            const requiredFields = bookingForm.querySelectorAll('[required]');
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                } else {
                    field.classList.remove('error');
                }
            });
            
            // Email validation
            const emailField = document.getElementById('email');
            if (emailField && emailField.value) {
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailPattern.test(emailField.value)) {
                    isValid = false;
                    emailField.classList.add('error');
                }
            }
            
            if (isValid) {
                // In a real implementation, you would submit the form data to a server
                // For this demo, we'll show a success message
                const formContainer = document.querySelector('.form-container');
                formContainer.innerHTML = `
                    <div class="success-message">
                        <div class="success-icon">
                            <i class="fas fa-check-circle"></i>
                        </div>
                        <h2>Booking Request Received!</h2>
                        <p>Thank you for scheduling your graduation photoshoot. We'll send a confirmation email within 24 hours.</p>
                        <p>If you have any questions, feel free to contact us at <strong>contact@uiucgradphotos.com</strong>.</p>
                        <a href="index.html" class="btn primary-btn">Return to Home</a>
                    </div>
                `;
            } else {
                // Show error message
                let errorMessage = document.querySelector('.error-message');
                if (!errorMessage) {
                    errorMessage = document.createElement('div');
                    errorMessage.className = 'error-message';
                    errorMessage.innerHTML = 'Please fill out all required fields correctly.';
                    bookingForm.prepend(errorMessage);
                }
            }
        });
    }
    
    // Current date for graduation date field minimum
    const graduationDateField = document.getElementById('graduation-date');
    const sessionDateField = document.getElementById('session-date');
    
    if (graduationDateField && sessionDateField) {
        const today = new Date();
        const todayFormatted = today.toISOString().split('T')[0];
        
        graduationDateField.setAttribute('min', todayFormatted);
        sessionDateField.setAttribute('min', todayFormatted);
    }
    
    // Dynamic session time based on date (example: adjust golden hour)
    if (sessionDateField) {
        sessionDateField.addEventListener('change', function() {
            const sessionTimeField = document.getElementById('session-time');
            if (!sessionTimeField) return;
            
            const selectedDate = new Date(this.value);
            const month = selectedDate.getMonth();
            
            // Update golden hour option text based on season
            const options = sessionTimeField.options;
            for (let i = 0; i < options.length; i++) {
                if (options[i].value === 'golden-hour') {
                    // Winter (Dec-Feb)
                    if (month >= 11 || month <= 1) {
                        options[i].text = 'Golden Hour (4:00 PM - 5:00 PM)';
                    }
                    // Spring (Mar-May)
                    else if (month >= 2 && month <= 4) {
                        options[i].text = 'Golden Hour (6:30 PM - 7:30 PM)';
                    }
                    // Summer (Jun-Aug)
                    else if (month >= 5 && month <= 7) {
                        options[i].text = 'Golden Hour (7:30 PM - 8:30 PM)';
                    }
                    // Fall (Sep-Nov)
                    else {
                        options[i].text = 'Golden Hour (5:30 PM - 6:30 PM)';
                    }
                    break;
                }
            }
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