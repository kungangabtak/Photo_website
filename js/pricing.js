// JavaScript for the pricing page

document.addEventListener('DOMContentLoaded', function() {
    // FAQ accordion functionality
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Toggle the active class on the clicked item
            item.classList.toggle('active');
            
            // Close other open FAQ items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
        });
    });
    
    // Optional: Auto-open first FAQ item
    if (faqItems.length > 0) {
        faqItems[0].classList.add('active');
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