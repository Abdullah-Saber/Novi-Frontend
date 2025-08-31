// Mobile menu toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Scroll reveal animation
const reveals = document.querySelectorAll('.reveal');

const revealOnScroll = () => {
    reveals.forEach(reveal => {
        const windowHeight = window.innerHeight;
        const revealTop = reveal.getBoundingClientRect().top;
        const revealPoint = 150;

        if (revealTop < windowHeight - revealPoint) {
            reveal.classList.add('active');
        }
    });
};

window.addEventListener('scroll', revealOnScroll);

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add cursor effects for 3D card interactions
document.addEventListener('mousemove', (e) => {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        } else {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
        }
    });
});

// Initialize animations on load
window.addEventListener('load', () => {
    revealOnScroll();
});

// loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.3s ease-in-out';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// parallax effect to floating elements
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.floating-element');
    
    parallaxElements.forEach((element, index) => {
        const speed = 0.5 + (index * 0.1);
        const yPos = -(scrolled * speed);
        element.style.transform = `translateY(${yPos}px) rotate(${scrolled * 0.1}deg)`;
    });
});

/* ✨ New and Enhanced Logic ✨ */

// Cart and Quantity Management
const cartCountSpan = document.getElementById("cart-count");
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Function to update the cart counter
function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountSpan.textContent = totalItems;
}

// Quantity buttons functionality
document.querySelectorAll('.card').forEach(card => {
    const minusBtn = card.querySelector('.minus-btn');
    const plusBtn = card.querySelector('.plus-btn');
    const quantityInput = card.querySelector('.quantity-input');
    const maxQuantity = parseInt(card.dataset.stock);

    minusBtn.addEventListener('click', () => {
        let currentValue = parseInt(quantityInput.value);
        if (currentValue > 1) {
            quantityInput.value = currentValue - 1;
        }
    });

    plusBtn.addEventListener('click', () => {
        let currentValue = parseInt(quantityInput.value);
        if (currentValue < maxQuantity) {
            quantityInput.value = currentValue + 1;
        }
    });

    // Ensure input field only accepts numbers and does not exceed stock
    quantityInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/[^0-9]/g, '');
        let currentValue = parseInt(e.target.value);
        if (isNaN(currentValue) || currentValue === 0) {
            e.target.value = 1;
        } else if (currentValue > maxQuantity) {
            e.target.value = maxQuantity;
        }
    });
});

// Add to Cart button logic
document.querySelectorAll(".add-to-cart").forEach(button => {
    button.addEventListener("click", (e) => {
        const card = e.target.closest('.card');
        const quantityInput = card.querySelector('.quantity-input');
        const quantity = parseInt(quantityInput.value);
        const productName = card.querySelector('h3').textContent;
        const productPrice = parseFloat(card.querySelector('.price').textContent.replace(' EP', ''));
        const productImage = card.dataset.image;
        const productStock = parseInt(card.dataset.stock);

        const existingItem = cart.find(item => item.name === productName);

        if (existingItem) {
            existingItem.quantity = Math.min(existingItem.quantity + quantity, productStock);
        } else {
            cart.push({
                name: productName,
                price: productPrice,
                quantity: Math.min(quantity, productStock),
                image: productImage,
                stock: productStock
            });
        }

        // Save cart to local storage
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();

        // Small animation effect
        cartCountSpan.style.transform = "scale(1.3)";
        setTimeout(() => {
            cartCountSpan.style.transform = "scale(1)";
        }, 200);

        // Reset quantity input to 1 after adding to cart
        quantityInput.value = 1;
    });
});

// Initialize cart count on page load
window.addEventListener('load', updateCartCount);