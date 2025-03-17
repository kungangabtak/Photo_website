// JavaScript for the pricing page

document.addEventListener('DOMContentLoaded', function() {
    // FAQ accordion functionality with accessibility
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const icon = question.querySelector('i');
        
        // Generate unique IDs for ARIA attributes
        const questionId = 'faq-question-' + Math.random().toString(36).substr(2, 9);
        const answerId = 'faq-answer-' + Math.random().toString(36).substr(2, 9);
        
        // Set ARIA attributes
        question.setAttribute('role', 'button');
        question.setAttribute('aria-expanded', 'false');
        question.setAttribute('aria-controls', answerId);
        question.setAttribute('id', questionId);
        question.setAttribute('tabindex', '0');
        
        answer.setAttribute('role', 'region');
        answer.setAttribute('aria-labelledby', questionId);
        answer.setAttribute('id', answerId);
        answer.setAttribute('aria-hidden', 'true');
        
        // Add click handler
        question.addEventListener('click', () => {
            // Toggle the active class
            const isActive = item.classList.toggle('active');
            
            // Update ARIA attributes
            question.setAttribute('aria-expanded', isActive);
            answer.setAttribute('aria-hidden', !isActive);
            
            // Animate the answer height for smooth transition
            if (isActive) {
                const answerHeight = answer.scrollHeight;
                answer.style.maxHeight = answerHeight + 'px';
            } else {
                answer.style.maxHeight = '0';
            }
            
            // Close other open FAQ items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    const otherQuestion = otherItem.querySelector('.faq-question');
                    const otherAnswer = otherItem.querySelector('.faq-answer');
                    
                    // Update classes
                    otherItem.classList.remove('active');
                    
                    // Update ARIA attributes
                    otherQuestion.setAttribute('aria-expanded', 'false');
                    otherAnswer.setAttribute('aria-hidden', 'true');
                    
                    // Reset max-height
                    otherAnswer.style.maxHeight = '0';
                }
            });
        });
        
        // Add keyboard accessibility
        question.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                question.click();
            }
        });
    });
    
    // Optional: Auto-open first FAQ item
    if (faqItems.length > 0) {
        const firstQuestion = faqItems[0].querySelector('.faq-question');
        const firstAnswer = faqItems[0].querySelector('.faq-answer');
        
        // Update classes
        faqItems[0].classList.add('active');
        
        // Update ARIA attributes
        firstQuestion.setAttribute('aria-expanded', 'true');
        firstAnswer.setAttribute('aria-hidden', 'false');
        
        // Set initial max-height
        firstAnswer.style.maxHeight = firstAnswer.scrollHeight + 'px';
    }
    
    // Pricing card hover effect enhancement
    const pricingCards = document.querySelectorAll('.pricing-card');
    
    pricingCards.forEach(card => {
        card.addEventListener('mouseover', () => {
            pricingCards.forEach(otherCard => {
                if (otherCard !== card) {
                    otherCard.style.opacity = '0.8';
                }
            });
        });
        
        card.addEventListener('mouseout', () => {
            pricingCards.forEach(otherCard => {
                otherCard.style.opacity = '1';
            });
        });
    });
    
    // Smooth scroll for CTA button
    const ctaButton = document.querySelector('.booking-cta .btn');
    
    if (ctaButton) {
        ctaButton.addEventListener('click', function(e) {
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    }
    
    // Animation on scroll for pricing cards and event cards
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.pricing-card, .event-card, .add-on-card');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.2;
            
            if (elementPosition < screenPosition) {
                element.classList.add('animated');
            }
        });
    };
    
    // Run animation check on load and scroll
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Run once on load
});