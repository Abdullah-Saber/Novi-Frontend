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


/*New Auth Modal Logic */

const authModal = document.getElementById('auth-modal');
const closeBtn = document.querySelector('.close-btn');
const showSigninLink = document.getElementById('show-signin');
const showSignupLink = document.getElementById('show-signup');
const signinForm = document.getElementById('signin-form');
const signupForm = document.getElementById('signup-form');
const otpForm = document.getElementById('otp-form');
const modalTitle = document.getElementById('modal-title');
const loadingSpinner = document.getElementById('loading-spinner');
const resendOtpBtn = document.getElementById('resend-otp');

// Function to open the modal
function openAuthModal() {
    authModal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

// Function to close the modal
function closeAuthModal() {
    authModal.classList.remove('show');
    document.body.style.overflow = 'auto';
    setTimeout(resetForms, 300);
}

// Function to switch between forms
function switchForm(targetForm) {
    const forms = document.querySelectorAll('.auth-form');
    forms.forEach(form => form.classList.remove('active-form'));
    
    if (targetForm === 'signup') {
        signupForm.classList.add('active-form');
        modalTitle.textContent = 'Sign Up';
    } else if (targetForm === 'otp') {
        otpForm.classList.add('active-form');
        modalTitle.textContent = 'Verify Email';
    } else {
        signinForm.classList.add('active-form');
        modalTitle.textContent = 'Sign In';
    }
}

// Function to reset all form states
function resetForms() {
    signinForm.reset();
    signupForm.reset();
    otpForm.reset();
    loadingSpinner.style.display = 'none';
    switchForm('signin');
}

// Event listeners for form switching
showSigninLink.addEventListener('click', (e) => {
    e.preventDefault();
    switchForm('signin');
});

showSignupLink.addEventListener('click', (e) => {
    e.preventDefault();
    switchForm('signup');
});

// Close modal when close button is clicked
closeBtn.addEventListener('click', closeAuthModal);

// Close modal when clicking outside of the content
window.addEventListener('click', (e) => {
    if (e.target === authModal) {
        closeAuthModal();
    }
});

// Handle Sign Up form submission
signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('signup-username').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value.trim();

    if (!username || !email || !password) {
        alert('Please fill in all fields.');
        return;
    }

    // Save user data temporarily before OTP verification
    localStorage.setItem('tempUserData', JSON.stringify({ username: username, email: email }));

    loadingSpinner.style.display = 'block';
    await new Promise(resolve => setTimeout(resolve, 2000));
    loadingSpinner.style.display = 'none';
    switchForm('otp');
    console.log('User signed up. Now awaiting OTP verification.');
});

// Handle OTP form submission
otpForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const otpInputs = document.querySelectorAll('.otp-input');
    const otp = Array.from(otpInputs).map(input => input.value).join('');

    if (otp.length !== 6) {
        alert('Please enter a full 6-digit code.');
        return;
    }

    loadingSpinner.style.display = 'block';
    await new Promise(resolve => setTimeout(resolve, 1500));
    loadingSpinner.style.display = 'none';

    if (otp === '123456') { // This is the example OTP
        alert('Verification successful! You are now logged in.');
        
        // Retrieve and store final user data
        const tempUserData = JSON.parse(localStorage.getItem('tempUserData'));
        if (tempUserData) {
            localStorage.setItem('userData', JSON.stringify(tempUserData));
            localStorage.removeItem('tempUserData'); // Clean up temporary data
        }

        localStorage.setItem('isLoggedIn', 'true');
        window.location.href = 'profile.html'; // Redirect to the profile page
    } else {
        alert('Invalid OTP. Please try again.');
        otpInputs.forEach(input => input.value = '');
    }
});

// OTP input auto-focus logic
const otpInputs = document.querySelectorAll('.otp-input');
otpInputs.forEach((input, index) => {
    input.addEventListener('input', () => {
        if (input.value.length === 1 && index < otpInputs.length - 1) {
            otpInputs[index + 1].focus();
        }
    });

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && input.value === '' && index > 0) {
            otpInputs[index - 1].focus();
        }
    });
});

// Handle "Resend OTP" logic
resendOtpBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    loadingSpinner.style.display = 'block';
    await new Promise(resolve => setTimeout(resolve, 2000));
    loadingSpinner.style.display = 'none';
    alert('A new OTP has been sent to your email.');
    console.log('Resending OTP...');
});

// Handle Sign In form submission
signinForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('signin-email').value.trim();
    const password = document.getElementById('signin-password').value.trim();

    if (!email || !password) {
        alert('Please fill in all fields.');
        return;
    }

    loadingSpinner.style.display = 'block';
    await new Promise(resolve => setTimeout(resolve, 2000));
    loadingSpinner.style.display = 'none';

    if (email === 'test@example.com' && password === 'password123') { // Example credentials
        alert('Sign In successful!');
        
        // Store user data and login status
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userData', JSON.stringify({ username: 'TestUser', email: email }));
        
        window.location.href = 'profile.html'; // Redirect to the profile page
    } else {
        alert('Invalid email or password.');
    }
});

/* Automatically open the modal on page load after a delay */
window.addEventListener('load', () => {
    setTimeout(() => {
        openAuthModal();
    }, 1500); // 1.5-second delay
});

// Cart count logic
const cartCountSpan = document.getElementById("cart-count");
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountSpan.textContent = totalItems;
}

window.addEventListener('load', updateCartCount);