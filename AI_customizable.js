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
    //fade-in effect
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

const generateBtn = document.getElementById("generateBtn");
const designPrompt = document.getElementById("designPrompt");
const generatedImage = document.getElementById("generatedImage");
const placeholder = document.getElementById("placeholder");
const downloadBtn = document.getElementById("downloadBtn");

generateBtn.addEventListener("click", async () => {
  const prompt = designPrompt.value.trim();
  if (!prompt) {
    alert("Please describe your design first!");
    return;
  }

  placeholder.innerHTML = "<p>✨ Generating your design... Please wait</p>";
  generatedImage.classList.add("hidden");
  downloadBtn.classList.add("hidden");

  // Your OpenAI API Key and endpoint details
  const apiKey = "";
  const apiUrl = "";

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        prompt: prompt,
        model: "dall-e-3",
        n: 1,
        size: "1024x1024",
        response_format: "url"
      })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API Error: ${response.status} - ${errorData.error.message}`);
    }

    const data = await response.json();
    const imageUrl = data.data[0].url;

    if (imageUrl) {
      generatedImage.src = imageUrl;
      generatedImage.classList.remove("hidden");
      downloadBtn.classList.remove("hidden");
      placeholder.style.display = "none";
    } else {
      placeholder.innerHTML = "<p>Could not generate design. Try again.</p>";
      downloadBtn.classList.add("hidden");
    }
  } catch (err) {
    console.error(err);
    placeholder.innerHTML = `<p>Error generating design: ${err.message}. Try again later.</p>`;
    downloadBtn.classList.add("hidden");
  }
});

// Download functionality
downloadBtn.addEventListener("click", () => {
  const imageUrl = generatedImage.src;
  const link = document.createElement('a');
  link.href = imageUrl;
  link.download = "AI-Design.png";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});

// Cart count logic
const cartCountSpan = document.getElementById("cart-count");
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountSpan.textContent = totalItems;
}

window.addEventListener('load', updateCartCount);