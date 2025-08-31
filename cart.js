// cart.js
// Mobile menu toggle (copied)
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Navbar scroll effect (copied)
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Cart Management
const cartItemsContainer = document.querySelector('.cart-items');
const cartTotalSpan = document.getElementById('cart-total');
const cartCountSpan = document.getElementById('cart-count');
const confirmOrderBtn = document.getElementById('confirm-order');
const clearCartBtn = document.getElementById('clear-cart');

let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Function to render cart items
function renderCart() {
    cartItemsContainer.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        const subtotal = item.price * item.quantity;
        total += subtotal;

        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="item-image">
            <div class="item-details">
                <h3 class="item-name">${item.name}</h3>
                <p class="item-price">${item.price} EP</p>
                <p class="item-subtotal">Subtotal: ${subtotal} EP</p>
            </div>
            <div class="quantity-container">
                <button class="quantity-btn minus-btn">-</button>
                <input type="text" class="quantity-input" value="${item.quantity}">
                <button class="quantity-btn plus-btn">+</button>
            </div>
            <button class="remove-btn">Remove</button>
        `;

        // Quantity buttons
        const minusBtn = cartItem.querySelector('.minus-btn');
        const plusBtn = cartItem.querySelector('.plus-btn');
        const quantityInput = cartItem.querySelector('.quantity-input');

        minusBtn.addEventListener('click', () => {
            if (item.quantity > 1) {
                item.quantity--;
                quantityInput.value = item.quantity;
                updateCart();
                renderCart();
            }
        });

        plusBtn.addEventListener('click', () => {
            if (item.quantity < item.stock) {
                item.quantity++;
                quantityInput.value = item.quantity;
                updateCart();
                renderCart();
            }
        });

        quantityInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/[^0-9]/g, '');
            let newValue = parseInt(e.target.value);
            if (isNaN(newValue) || newValue === 0) {
                newValue = 1;
            }
            if (newValue > item.stock) {
                newValue = item.stock;
            }
            item.quantity = newValue;
            e.target.value = item.quantity;
            updateCart();
            renderCart();
        });

        // Remove button
        const removeBtn = cartItem.querySelector('.remove-btn');
        removeBtn.addEventListener('click', () => {
            cart.splice(index, 1);
            updateCart();
            renderCart();
        });

        cartItemsContainer.appendChild(cartItem);
    });

    cartTotalSpan.textContent = `${total} EP`;
    updateCartCount();
}

// Function to update cart count
function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountSpan.textContent = totalItems;
}

// Function to update localStorage
function updateCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Confirm Order
confirmOrderBtn.addEventListener('click', () => {
    if (cart.length > 0) {
        alert('Order confirmed! Thank you for your purchase.');
        cart = [];
        updateCart();
        renderCart();
        setTimeout(() => {
            window.location.href = 'ready-design.html';
        }, 500);
    } else {
        alert('Your cart is empty.');
    }
});

// Clear Cart (decline)
clearCartBtn.addEventListener('click', () => {
    if (cart.length > 0) {
        if (confirm('Are you sure you want to clear the cart?')) {
            cart = [];
            updateCart();
            renderCart();
            setTimeout(() => {
                window.location.href = 'ready-design.html';
            }, 500);
        }
    } else {
        alert('Your cart is empty.');
    }
});

// Initialize
renderCart();