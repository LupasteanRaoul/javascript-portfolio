/**
 * Sweet Delights - Shopping Cart Application
 * Full Stack Developer Project
 * 
 * Features:
 * - Product catalog with filtering
 * - Shopping cart with add/remove functionality
 * - Real-time cart calculations
 * - Search functionality
 * - Responsive design
 * - Toast notifications
 * - Local storage persistence
 */

// DOM Elements
const cartContainer = document.getElementById("cart-container");
const productsContainer = document.getElementById("products-container");
const dessertCards = document.getElementById("dessert-card-container");
const cartBtn = document.getElementById("cart-btn");
const closeCartBtn = document.getElementById("close-cart-btn");
const clearCartBtn = document.getElementById("clear-cart-btn");
const checkoutBtn = document.getElementById("checkout-btn");
const totalNumberOfItems = document.getElementById("total-items");
const cartSubTotal = document.getElementById("subtotal");
const cartTaxes = document.getElementById("taxes");
const cartTotal = document.getElementById("total");
const showHideCartSpan = document.getElementById("show-hide-cart");
const cartCount = document.getElementById("cart-count");
const searchInput = document.getElementById("search-input");
const filterBtns = document.querySelectorAll(".filter-btn");
const loadMoreBtn = document.getElementById("load-more-btn");
const toast = document.getElementById("toast");

// State variables
let isCartShowing = false;
let currentFilter = "all";
let currentSearch = "";
let displayedProducts = 8;

// Product data
const products = [
  {
    id: 1,
    name: "Vanilla Cupcakes (6 Pack)",
    price: 12.99,
    category: "Cupcake",
    icon: "fas fa-cupcake",
    badge: "Popular",
    description: "Classic vanilla cupcakes with creamy frosting"
  },
  {
    id: 2,
    name: "French Macaron",
    price: 3.99,
    category: "Macaron",
    icon: "fas fa-cloud",
    badge: "French",
    description: "Delicate almond meringue cookies with ganache"
  },
  {
    id: 3,
    name: "Pumpkin Cupcake",
    price: 3.99,
    category: "Cupcake",
    icon: "fas fa-cupcake",
    badge: "Seasonal",
    description: "Spiced pumpkin cupcakes with cream cheese frosting"
  },
  {
    id: 4,
    name: "Chocolate Cupcake",
    price: 5.99,
    category: "Cupcake",
    icon: "fas fa-cupcake",
    badge: "Best Seller",
    description: "Rich chocolate cupcakes with chocolate ganache"
  },
  {
    id: 5,
    name: "Chocolate Pretzels (4 Pack)",
    price: 10.99,
    category: "Pretzel",
    icon: "fas fa-pretzel",
    badge: "New",
    description: "Salted pretzels dipped in premium chocolate"
  },
  {
    id: 6,
    name: "Strawberry Ice Cream",
    price: 2.99,
    category: "Ice Cream",
    icon: "fas fa-ice-cream",
    badge: null,
    description: "Creamy strawberry ice cream with real fruit"
  },
  {
    id: 7,
    name: "Chocolate Macarons (4 Pack)",
    price: 9.99,
    category: "Macaron",
    icon: "fas fa-cloud",
    badge: "French",
    description: "Chocolate macarons with dark chocolate filling"
  },
  {
    id: 8,
    name: "Strawberry Pretzel",
    price: 4.99,
    category: "Pretzel",
    icon: "fas fa-pretzel",
    badge: null,
    description: "Sweet and salty pretzel with strawberry drizzle"
  },
  {
    id: 9,
    name: "Butter Pecan Ice Cream",
    price: 2.99,
    category: "Ice Cream",
    icon: "fas fa-ice-cream",
    badge: "Classic",
    description: "Buttery ice cream with roasted pecans"
  },
  {
    id: 10,
    name: "Rocky Road Ice Cream",
    price: 2.99,
    category: "Ice Cream",
    icon: "fas fa-ice-cream",
    badge: null,
    description: "Chocolate ice cream with marshmallows and nuts"
  },
  {
    id: 11,
    name: "Vanilla Macarons (5 Pack)",
    price: 11.99,
    category: "Macaron",
    icon: "fas fa-cloud",
    badge: "French",
    description: "Vanilla bean macarons with buttercream filling"
  },
  {
    id: 12,
    name: "Lemon Cupcakes (4 Pack)",
    price: 12.99,
    category: "Cupcake",
    icon: "fas fa-cupcake",
    badge: "Citrus",
    description: "Zesty lemon cupcakes with lemon glaze"
  },
  {
    id: 13,
    name: "Red Velvet Cupcake",
    price: 4.99,
    category: "Cupcake",
    icon: "fas fa-cupcake",
    badge: "Classic",
    description: "Moist red velvet cupcake with cream cheese frosting"
  },
  {
    id: 14,
    name: "Salted Caramel Pretzel",
    price: 3.99,
    category: "Pretzel",
    icon: "fas fa-pretzel",
    badge: "Popular",
    description: "Pretzel rods with salted caramel coating"
  },
  {
    id: 15,
    name: "Matcha Ice Cream",
    price: 3.99,
    category: "Ice Cream",
    icon: "fas fa-ice-cream",
    badge: "Trending",
    description: "Japanese green tea ice cream"
  },
  {
    id: 16,
    name: "Raspberry Macaron",
    price: 4.99,
    category: "Macaron",
    icon: "fas fa-cloud",
    badge: "French",
    description: "Raspberry macarons with fruit filling"
  }
];

// Shopping Cart Class
class ShoppingCart {
  constructor() {
    this.items = [];
    this.total = 0;
    this.taxRate = 8.25;
    this.loadCartFromStorage();
  }

  // Add item to cart
  addItem(id, products) {
    const product = products.find((item) => item.id === id);
    
    if (!product) return;

    // Check if product already exists in cart
    const existingItemIndex = this.items.findIndex(item => item.id === id);
    
    if (existingItemIndex > -1) {
      // Increment quantity if item already exists
      this.items[existingItemIndex].quantity += 1;
    } else {
      // Add new item with quantity 1
      this.items.push({
        ...product,
        quantity: 1
      });
    }

    // Update UI
    this.updateCartDisplay();
    this.saveCartToStorage();
    
    // Show success notification
    showToast(`${product.name} added to cart!`);
  }

  // Remove item from cart
  removeItem(id) {
    const itemIndex = this.items.findIndex(item => item.id === id);
    
    if (itemIndex > -1) {
      if (this.items[itemIndex].quantity > 1) {
        // Decrease quantity if more than 1
        this.items[itemIndex].quantity -= 1;
      } else {
        // Remove item if quantity is 1
        this.items.splice(itemIndex, 1);
      }
      
      this.updateCartDisplay();
      this.saveCartToStorage();
    }
  }

  // Remove all of a specific item
  removeAllOfItem(id) {
    this.items = this.items.filter(item => item.id !== id);
    this.updateCartDisplay();
    this.saveCartToStorage();
  }

  // Get total number of items in cart
  getCounts() {
    return this.items.reduce((total, item) => total + item.quantity, 0);
  }

  // Clear entire cart
  clearCart() {
    if (!this.items.length) {
      showToast("Your shopping cart is already empty", "info");
      return;
    }

    const isCartCleared = confirm(
      "Are you sure you want to clear all items from your shopping cart?"
    );

    if (isCartCleared) {
      this.items = [];
      this.total = 0;
      this.updateCartDisplay();
      this.saveCartToStorage();
      showToast("Cart cleared successfully", "info");
    }
  }

  // Calculate taxes
  calculateTaxes(amount) {
    return parseFloat(((this.taxRate / 100) * amount).toFixed(2));
  }

  // Calculate total including taxes
  calculateTotal() {
    const subTotal = this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    const tax = this.calculateTaxes(subTotal);
    this.total = subTotal + tax;
    
    return {
      subTotal: subTotal.toFixed(2),
      tax: tax.toFixed(2),
      total: this.total.toFixed(2)
    };
  }

  // Update cart display
  updateCartDisplay() {
    // Clear current cart items
    productsContainer.innerHTML = '';
    
    if (this.items.length === 0) {
      // Show empty cart message
      productsContainer.innerHTML = `
        <div class="empty-cart-message">
          <i class="fas fa-shopping-cart"></i>
          <p>Your cart is empty</p>
          <p class="empty-cart-subtext">Add some delicious desserts!</p>
        </div>
      `;
    } else {
      // Render cart items
      this.items.forEach(item => {
        const productElement = document.createElement('div');
        productElement.className = 'product';
        productElement.innerHTML = `
          <div class="product-info">
            <div class="product-name">${item.name}</div>
            <div class="product-category">${item.category}</div>
          </div>
          <div class="product-controls">
            <div class="quantity-control">
              <button class="quantity-btn decrease-btn" data-id="${item.id}">-</button>
              <span class="product-quantity">${item.quantity}</span>
              <button class="quantity-btn increase-btn" data-id="${item.id}">+</button>
            </div>
            <div class="product-price">$${(item.price * item.quantity).toFixed(2)}</div>
            <div class="remove-product" data-id="${item.id}" title="Remove all">
              <i class="fas fa-trash"></i>
            </div>
          </div>
        `;
        productsContainer.appendChild(productElement);
      });

      // Add event listeners to quantity buttons
      document.querySelectorAll('.decrease-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const id = parseInt(e.target.dataset.id);
          this.removeItem(id);
        });
      });

      document.querySelectorAll('.increase-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const id = parseInt(e.target.dataset.id);
          this.addItem(id, products);
        });
      });

      document.querySelectorAll('.remove-product').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const id = parseInt(e.target.closest('.remove-product').dataset.id);
          this.removeAllOfItem(id);
        });
      });
    }

    // Update cart summary
    const totals = this.calculateTotal();
    cartSubTotal.textContent = `$${totals.subTotal}`;
    cartTaxes.textContent = `$${totals.tax}`;
    cartTotal.textContent = `$${totals.total}`;
    totalNumberOfItems.textContent = this.getCounts();
    
    // Update cart count badge
    cartCount.textContent = this.getCounts();
    cartCount.style.display = this.getCounts() > 0 ? 'flex' : 'none';
  }

  // Save cart to localStorage
  saveCartToStorage() {
    localStorage.setItem('shoppingCart', JSON.stringify(this.items));
  }

  // Load cart from localStorage
  loadCartFromStorage() {
    const savedCart = localStorage.getItem('shoppingCart');
    if (savedCart) {
      this.items = JSON.parse(savedCart);
      this.updateCartDisplay();
    }
  }
}

// Initialize Shopping Cart
const cart = new ShoppingCart();

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
  renderProducts();
  setupEventListeners();
});

// Render products to the page
function renderProducts() {
  dessertCards.innerHTML = '';
  
  // Filter products based on current filter and search
  const filteredProducts = products.filter(product => {
    const matchesCategory = currentFilter === 'all' || product.category === currentFilter;
    const matchesSearch = product.name.toLowerCase().includes(currentSearch.toLowerCase()) ||
                         product.description.toLowerCase().includes(currentSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  
  // Display limited number of products
  const productsToShow = filteredProducts.slice(0, displayedProducts);
  
  if (productsToShow.length === 0) {
    dessertCards.innerHTML = `
      <div class="no-results">
        <i class="fas fa-search"></i>
        <h3>No desserts found</h3>
        <p>Try adjusting your search or filter</p>
      </div>
    `;
    return;
  }
  
  // Render product cards
  productsToShow.forEach(({ name, id, price, category, icon, badge, description }) => {
    const card = document.createElement('div');
    card.className = 'dessert-card';
    card.innerHTML = `
      <div class="dessert-card-image">
        <i class="${icon}"></i>
        ${badge ? `<div class="dessert-card-badge">${badge}</div>` : ''}
      </div>
      <div class="dessert-card-content">
        <h3>${name}</h3>
        <div class="dessert-card-category">
          <i class="fas fa-tag"></i> ${category}
        </div>
        <p class="dessert-description">${description}</p>
        <div class="dessert-price">$${price.toFixed(2)}</div>
        <div class="dessert-card-actions">
          <button id="${id}" class="btn btn-primary add-to-cart-btn">
            <i class="fas fa-cart-plus"></i> Add to Cart
          </button>
        </div>
      </div>
    `;
    dessertCards.appendChild(card);
  });
  
  // Update load more button visibility
  loadMoreBtn.style.display = displayedProducts >= filteredProducts.length ? 'none' : 'block';
}

// Setup event listeners
function setupEventListeners() {
  // Cart toggle button
  cartBtn.addEventListener("click", () => {
    isCartShowing = true;
    cartContainer.classList.add('show');
    showHideCartSpan.textContent = "Hide";
  });
  
  // Close cart button
  closeCartBtn.addEventListener("click", () => {
    isCartShowing = false;
    cartContainer.classList.remove('show');
    showHideCartSpan.textContent = "Show";
  });
  
  // Clear cart button
  clearCartBtn.addEventListener('click', () => cart.clearCart());
  
  // Checkout button
  checkoutBtn.addEventListener('click', () => {
    if (cart.getCounts() === 0) {
      showToast("Your cart is empty!", "info");
      return;
    }
    
    const totals = cart.calculateTotal();
    alert(`Thank you for your order!\n\nTotal: $${totals.total}\n\nYour desserts will be ready soon!`);
    cart.clearCart();
  });
  
  // Search functionality
  searchInput.addEventListener('input', (e) => {
    currentSearch = e.target.value;
    displayedProducts = 8; // Reset to initial display count
    renderProducts();
  });
  
  // Filter buttons
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from all buttons
      filterBtns.forEach(b => b.classList.remove('active'));
      // Add active class to clicked button
      btn.classList.add('active');
      // Update current filter
      currentFilter = btn.dataset.category;
      displayedProducts = 8; // Reset to initial display count
      renderProducts();
    });
  });
  
  // Load more button
  loadMoreBtn.addEventListener('click', () => {
    displayedProducts += 4;
    renderProducts();
  });
  
  // Add to cart buttons (using event delegation)
  dessertCards.addEventListener('click', (e) => {
    if (e.target.classList.contains('add-to-cart-btn') || 
        e.target.closest('.add-to-cart-btn')) {
      const button = e.target.classList.contains('add-to-cart-btn') ? 
                     e.target : e.target.closest('.add-to-cart-btn');
      const id = parseInt(button.id);
      cart.addItem(id, products);
    }
  });
  
  // Close cart when clicking outside
  document.addEventListener('click', (e) => {
    if (isCartShowing && 
        !cartContainer.contains(e.target) && 
        !cartBtn.contains(e.target) &&
        e.target !== cartBtn) {
      isCartShowing = false;
      cartContainer.classList.remove('show');
      showHideCartSpan.textContent = "Show";
    }
  });
}

// Show toast notification
function showToast(message, type = "success") {
  const toastMessage = toast.querySelector('.toast-message');
  const toastIcon = toast.querySelector('i');
  
  // Set icon based on type
  if (type === "success") {
    toastIcon.className = "fas fa-check-circle";
    toast.style.backgroundColor = "var(--success-color)";
  } else if (type === "info") {
    toastIcon.className = "fas fa-info-circle";
    toast.style.backgroundColor = "var(--secondary-color)";
  }
  
  toastMessage.textContent = message;
  toast.classList.add('show');
  
  // Hide toast after 3 seconds
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// Add some CSS for the no-results message
const style = document.createElement('style');
style.textContent = `
  .no-results {
    grid-column: 1 / -1;
    text-align: center;
    padding: var(--spacing-xxl) var(--spacing-md);
    color: var(--gray-dark);
  }
  
  .no-results i {
    font-size: 64px;
    margin-bottom: var(--spacing-md);
    opacity: 0.3;
  }
  
  .no-results h3 {
    font-size: var(--font-size-lg);
    margin-bottom: var(--spacing-sm);
    color: var(--dark-color);
  }
  
  .dessert-description {
    color: var(--gray-dark);
    font-size: var(--font-size-sm);
    margin-bottom: var(--spacing-md);
    height: 40px;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
`;
document.head.appendChild(style);