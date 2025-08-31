document.addEventListener('DOMContentLoaded', () => {
    const profileUsername = document.getElementById('profile-username');
    const profileEmail = document.getElementById('profile-email');
    const logoutBtn = document.getElementById('logout-btn');
    const passwordChangeForm = document.getElementById('password-change-form');

    // Cart count logic
const cartCountSpan = document.getElementById("cart-count");
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountSpan.textContent = totalItems;
}

window.addEventListener('load', updateCartCount);

    // Check if the user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
        // If not logged in, redirect to the home page
        window.location.href = 'index.html';
        return;
    }

    // Load and display user data
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData) {
        profileUsername.textContent = userData.username;
        profileEmail.textContent = userData.email;
    }

    // Handle logout button click
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userData');
        window.location.href = 'index.html'; // Redirect to index page
    });

    // Handle password change form submission
    passwordChangeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const currentPassword = document.getElementById('current-password').value;
        const newPassword = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        if (newPassword !== confirmPassword) {
            alert('New passwords do not match!');
            return;
        }

        // In a real application, you would send this data to a backend for verification
        // and password change. For this example, we'll just show an alert.
        alert('Password change request submitted successfully!');
        passwordChangeForm.reset();
    });
});
