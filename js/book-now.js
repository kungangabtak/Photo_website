// JavaScript for Book Now page functionality

document.addEventListener('DOMContentLoaded', function() {
    // FAQ accordion functionality
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        // Initialize - hide all answers
        answer.style.display = 'none';
        
        question.addEventListener('click', () => {
            // Toggle active class
            const isActive = item.classList.toggle('active');
            
            // Toggle display of answer
            if (isActive) {
                answer.style.display = 'block';
                question.querySelector('i').classList.replace('fa-chevron-down', 'fa-chevron-up');
            } else {
                answer.style.display = 'none';
                question.querySelector('i').classList.replace('fa-chevron-up', 'fa-chevron-down');
            }
            
            // Close other open FAQ items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.faq-answer').style.display = 'none';
                    otherItem.querySelector('.faq-question i').classList.replace('fa-chevron-up', 'fa-chevron-down');
                }
            });
        });
    });
    
    // Open first FAQ item by default
    if (faqItems.length > 0) {
        faqItems[0].classList.add('active');
        faqItems[0].querySelector('.faq-answer').style.display = 'block';
        faqItems[0].querySelector('.faq-question i').classList.replace('fa-chevron-down', 'fa-chevron-up');
    }
    
    // Add animation to booking options on hover
    const bookingOptions = document.querySelectorAll('.booking-option');
    
    bookingOptions.forEach(option => {
        option.addEventListener('mouseover', () => {
            bookingOptions.forEach(other => {
                if (other !== option) {
                    other.style.opacity = '0.7';
                }
            });
        });
        
        option.addEventListener('mouseout', () => {
            bookingOptions.forEach(other => {
                other.style.opacity = '1';
            });
        });
    });
});