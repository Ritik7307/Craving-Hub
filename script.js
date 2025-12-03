// Menu items data
const menuItems = [
  {
    id: 1,
    name: "Double Cheese Blast Burger",
    price: 249,
    image: "https://www.crazycheesy.com/wp-content/uploads/2023/01/CRISPY-CHEESE-BLAST-BURGER1.jpg"
  },
  {
    id: 2,
    name: "Overloaded Cheese Pizza",
    price: 329,
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 3,
    name: "Peri-Peri Crunch Fries",
    price: 179,
    image: "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 4,
    name: "Classic Veggie Burger",
    price: 189,
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 5,
    name: "Spicy Paneer Tikka Burger",
    price: 229,
    image: "https://images.unsplash.com/photo-1550317138-10000687a72b?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 6,
    name: "BBQ Chicken Crunch Burger",
    price: 259,
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 7,
    name: "Loaded Veg Wrap",
    price: 199,
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 8,
    name: "Cheese Bucket Fries",
    price: 199,
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 9,
    name: "Fully Loaded Nachos",
    price: 219,
    image: "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 10,
    name: "Crispy Chicken Wings",
    price: 249,
    image: "https://images.unsplash.com/photo-1527477396000-e27163b481c2?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 11,
    name: "Margherita Pizza",
    price: 259,
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 12,
    name: "Veg Supreme Pizza",
    price: 349,
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 13,
    name: "Oreo Overdose Shake",
    price: 199,
    image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 14,
    name: "Classic Chocolate Shake",
    price: 189,
    image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 15,
    name: "Brownie with Ice Cream",
    price: 219,
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=1200&q=80"
  }
];

// Cart state
let cart = [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  initializeNav();
  initializeCarousel();
  initializeCart();
  updateCartBadge();
  checkServerStatus();
});

// Check if server is running
async function checkServerStatus() {
  const apiUrl = window.location.origin.includes('localhost') || window.location.origin.includes('127.0.0.1')
    ? `${window.location.protocol}//${window.location.hostname}:3000/api/orders`
    : `${window.location.origin}/api/orders`;
  
  // Only check if we're on localhost
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    try {
      const response = await fetch(apiUrl.replace('/api/orders', ''), { 
        method: 'HEAD',
        mode: 'no-cors' 
      });
      // If we get here, server might be running (no-cors doesn't throw)
    } catch (error) {
      // Server might not be running, but we can't reliably detect with no-cors
      // So we'll just show a helpful message in console
      console.log('Note: Make sure the server is running. Start it with: npm start');
    }
  }
}

// Navigation
function initializeNav() {
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");

  if (navToggle) {
    navToggle.addEventListener("click", () => {
      navLinks.classList.toggle("show");
    });
  }

  // Close nav on link click (mobile)
  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("show");
    });
  });

  // Set current year in footer
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

// Carousel
function initializeCarousel() {
  const carousel = document.querySelector('.menu-carousel');
  if (!carousel) return;

  // Clear existing content
  carousel.innerHTML = '';

  // Add items twice for seamless loop
  const itemsToShow = [...menuItems, ...menuItems];
  
  itemsToShow.forEach(item => {
    const card = document.createElement('div');
    card.className = 'menu-item-card';
    card.innerHTML = `
      <div class="menu-item-img">
        <img src="${item.image}" alt="${item.name}" />
      </div>
      <div class="menu-item-info">
        <div class="menu-item-name">${item.name}</div>
        <div class="menu-item-price">₹${item.price}</div>
        <button class="add-to-cart-btn" onclick="addToCart(${item.id})">
          Add to Cart
        </button>
      </div>
    `;
    carousel.appendChild(card);
  });
}

// Cart functions
function initializeCart() {
  // Load cart from localStorage
  const savedCart = localStorage.getItem('cart');
  if (savedCart) {
    cart = JSON.parse(savedCart);
    renderCart();
  }
}

function addToCart(itemId) {
  const item = menuItems.find(i => i.id === itemId);
  if (!item) return;

  const existingItem = cart.find(i => i.id === itemId);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...item, quantity: 1 });
  }

  updateCartBadge();
  renderCart();
  saveCart();
  
  // Show feedback
  showNotification(`${item.name} added to cart!`);
}

function removeFromCart(itemId) {
  cart = cart.filter(item => item.id !== itemId);
  updateCartBadge();
  renderCart();
  saveCart();
}

function updateQuantity(itemId, change) {
  const item = cart.find(i => i.id === itemId);
  if (!item) return;

  item.quantity += change;
  if (item.quantity <= 0) {
    removeFromCart(itemId);
  } else {
    updateCartBadge();
    renderCart();
    saveCart();
  }
}

function getCartTotal() {
  return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function updateCartBadge() {
  const badge = document.querySelector('.cart-badge');
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  if (badge) {
    if (totalItems > 0) {
      badge.textContent = totalItems;
      badge.style.display = 'flex';
    } else {
      badge.style.display = 'none';
    }
  }
}

function renderCart() {
  const cartItems = document.querySelector('.cart-items');
  const cartTotal = document.querySelector('.cart-total span:last-child');
  const checkoutBtn = document.querySelector('.checkout-btn');
  const emptyCart = document.querySelector('.empty-cart');

  if (!cartItems) return;

  if (cart.length === 0) {
    cartItems.innerHTML = '';
    if (emptyCart) emptyCart.style.display = 'block';
    if (checkoutBtn) checkoutBtn.disabled = true;
    return;
  }

  if (emptyCart) emptyCart.style.display = 'none';
  if (checkoutBtn) checkoutBtn.disabled = false;

  cartItems.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-img">
        <img src="${item.image}" alt="${item.name}" />
      </div>
      <div class="cart-item-details">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">₹${item.price} × ${item.quantity} = ₹${item.price * item.quantity}</div>
      </div>
      <div class="cart-item-controls">
        <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
        <span class="quantity">${item.quantity}</span>
        <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
        <button class="remove-item" onclick="removeFromCart(${item.id})">Remove</button>
      </div>
    </div>
  `).join('');

  if (cartTotal) {
    cartTotal.textContent = `₹${getCartTotal()}`;
  }
}

function openCart() {
  const modal = document.querySelector('.cart-modal');
  if (modal) {
    modal.classList.add('active');
    renderCart();
  }
}

function closeCart() {
  const modal = document.querySelector('.cart-modal');
  if (modal) {
    modal.classList.remove('active');
  }
}

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Checkout
function checkout() {
  if (cart.length === 0) return;
  
  closeCart();
  openOrderForm();
}

function openOrderForm() {
  const modal = document.querySelector('.order-form-modal');
  if (modal) {
    modal.classList.add('active');
  }
}

function closeOrderForm() {
  const modal = document.querySelector('.order-form-modal');
  if (modal) {
    modal.classList.remove('active');
  }
}

async function submitOrder(event) {
  event.preventDefault();
  
  const formData = new FormData(event.target);
  const orderData = {
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    address: formData.get('address'),
    items: cart,
    total: getCartTotal()
  };

  // Get API URL - use current origin if available, otherwise default to localhost:3000
  const apiUrl = window.location.origin.includes('localhost') || window.location.origin.includes('127.0.0.1')
    ? `${window.location.protocol}//${window.location.hostname}:3000/api/orders`
    : `${window.location.origin}/api/orders`;

  // Show loading state
  const submitBtn = event.target.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = 'Processing...';

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderData)
    });

    const result = await response.json();

    if (response.ok) {
      showNotification('Order placed successfully! Confirmation email sent.');
      cart = [];
      updateCartBadge();
      saveCart();
      closeOrderForm();
      renderCart();
      event.target.reset();
    } else {
      showNotification(result.error || 'Error placing order. Please try again.', 'error');
    }
  } catch (error) {
    console.error('Error:', error);
    let errorMessage = 'Error connecting to server. ';
    
    // Check if it's a network error
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      errorMessage += 'Please make sure the server is running. Start it with: npm start';
    } else {
      errorMessage += 'Please try again.';
    }
    
    showNotification(errorMessage, 'error');
  } finally {
    // Restore button state
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
  }
}

// Notification
function showNotification(message, type = 'success') {
  // Remove existing notification
  const existing = document.querySelector('.notification');
  if (existing) existing.remove();

  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'error' ? '#ef4444' : '#22c55e'};
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    z-index: 10000;
    animation: slideIn 0.3s ease-out;
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease-out';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Close modals on outside click
document.addEventListener('click', (e) => {
  const cartModal = document.querySelector('.cart-modal');
  const orderModal = document.querySelector('.order-form-modal');
  
  if (cartModal && e.target === cartModal) {
    closeCart();
  }
  
  if (orderModal && e.target === orderModal) {
    closeOrderForm();
  }
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// Google Maps Integration
let map;
let marker;
// Restaurant location - Update these coordinates with your actual restaurant location
const restaurantLocation = {
  lat: 28.7041,  // Update with your latitude
  lng: 77.1025   // Update with your longitude
};

// Initialize Google Map
function initMap() {
  // Check if API key is set
  if (typeof google === 'undefined' || !google.maps) {
    console.warn('Google Maps API not loaded. Please add your API key.');
    const mapContainer = document.getElementById('map');
    if (mapContainer) {
      mapContainer.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: center; height: 100%; 
                    background: rgba(15, 23, 42, 0.8); color: #9ca3af; padding: 2rem; text-align: center;">
          <div>
            <p style="margin-bottom: 1rem;">Google Maps not available</p>
            <p style="font-size: 0.85rem;">Please add your Google Maps API key in index.html</p>
            <p style="font-size: 0.75rem; margin-top: 0.5rem; color: #6b7280;">
              Replace YOUR_API_KEY with your actual API key
            </p>
          </div>
        </div>
      `;
    }
    return;
  }

  const mapContainer = document.getElementById('map');
  if (!mapContainer) return;

  // Create map with dark theme
  map = new google.maps.Map(mapContainer, {
    center: restaurantLocation,
    zoom: 15,
    styles: [
      {
        featureType: 'all',
        elementType: 'geometry',
        stylers: [{ color: '#1f2937' }]
      },
      {
        featureType: 'all',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#9ca3af' }]
      },
      {
        featureType: 'all',
        elementType: 'labels.text.stroke',
        stylers: [{ color: '#0b1120' }]
      },
      {
        featureType: 'poi',
        elementType: 'geometry',
        stylers: [{ color: '#111827' }]
      },
      {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [{ color: '#374151' }]
      },
      {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{ color: '#0f172a' }]
      }
    ],
    mapTypeControl: false,
    fullscreenControl: true,
    streetViewControl: false
  });

  // Create marker
  marker = new google.maps.Marker({
    position: restaurantLocation,
    map: map,
    title: 'Craving Hub Restaurant',
    animation: google.maps.Animation.DROP,
    icon: {
      url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
        <svg width="40" height="50" viewBox="0 0 40 50" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 0C9 0 0 9 0 20c0 15 20 30 20 30s20-15 20-30C40 9 31 0 20 0z" fill="#ff4d4d"/>
          <circle cx="20" cy="20" r="8" fill="#ffffff"/>
        </svg>
      `),
      scaledSize: new google.maps.Size(40, 50),
      anchor: new google.maps.Point(20, 50)
    }
  });

  // Info window
  const infoWindow = new google.maps.InfoWindow({
    content: `
      <div style="color: #1f2933; padding: 0.5rem;">
        <h3 style="margin: 0 0 0.5rem 0; font-size: 1rem; color: #ff4d4d;">Craving Hub</h3>
        <p style="margin: 0; font-size: 0.85rem;">Your city • Area / Landmark</p>
        <p style="margin: 0.3rem 0 0 0; font-size: 0.8rem; color: #6b7280;">Phone: 7307255940</p>
      </div>
    `
  });

  marker.addListener('click', () => {
    infoWindow.open(map, marker);
  });
}

// Open directions in Google Maps
function openDirections() {
  const url = `https://www.google.com/maps/dir/?api=1&destination=${restaurantLocation.lat},${restaurantLocation.lng}`;
  window.open(url, '_blank');
}

// Make initMap available globally for Google Maps callback
window.initMap = initMap;
window.openDirections = openDirections;

