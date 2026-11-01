const products = [
  {
    id: 1,
    name: 'Atelier Silk Dress',
    category: 'women',
    price: 268,
    oldPrice: 340,
    rating: 4.9,
    tag: 'New',
    onSale: false,
    image:
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 2,
    name: 'London Wool Blazer',
    category: 'men',
    price: 420,
    oldPrice: 480,
    rating: 4.8,
    tag: 'New',
    onSale: false,
    image:
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 3,
    name: 'Verona Leather Tote',
    category: 'accessories',
    price: 330,
    oldPrice: 390,
    rating: 4.7,
    tag: 'Sale',
    onSale: true,
    image:
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 4,
    name: 'Monsoon Trench Coat',
    category: 'women',
    price: 560,
    oldPrice: 620,
    rating: 5,
    tag: 'New',
    onSale: false,
    image:
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 5,
    name: 'Kairo Leather Loafers',
    category: 'men',
    price: 290,
    oldPrice: 345,
    rating: 4.8,
    tag: 'Sale',
    onSale: true,
    image:
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 6,
    name: 'Aster Statement Heels',
    category: 'women',
    price: 240,
    oldPrice: 280,
    rating: 4.6,
    tag: 'New',
    onSale: false,
    image:
      'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 7,
    name: 'Solstice Sunglasses',
    category: 'accessories',
    price: 160,
    oldPrice: 210,
    rating: 4.7,
    tag: 'Sale',
    onSale: true,
    image:
      'https://images.unsplash.com/photo-1577803947579-9fa9a223f0d5?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 8,
    name: 'Noir Knit Set',
    category: 'women',
    price: 310,
    oldPrice: 360,
    rating: 4.9,
    tag: 'New',
    onSale: false,
    image:
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 9,
    name: 'Marin Tailored Trouser',
    category: 'men',
    price: 260,
    oldPrice: 290,
    rating: 4.7,
    tag: 'Sale',
    onSale: true,
    image:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 10,
    name: 'Aurelia Silk Scarf',
    category: 'accessories',
    price: 118,
    oldPrice: 150,
    rating: 4.8,
    tag: 'New',
    onSale: false,
    image:
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80',
  },
];

const STORAGE_KEY = 'luxora-cart';
const sortSelect = document.getElementById('sortSelect');
const productGrid = document.getElementById('productGrid');
const productSearch = document.getElementById('productSearch');
const newArrivalsFilter = document.getElementById('newArrivalsFilter');
const saleFilter = document.getElementById('saleFilter');
const cartItemsContainer = document.getElementById('cartItems');
const cartSubtotal = document.getElementById('cartSubtotal');
const cartTotal = document.getElementById('cartTotal');
const cartCount = document.getElementById('cartCount');
const cartDrawer = document.getElementById('cartDrawer');
const cartOverlay = document.getElementById('cartOverlay');
const newsletterForm = document.getElementById('newsletterForm');
const newsletterEmail = document.getElementById('newsletterEmail');
const formMessage = document.getElementById('formMessage');

const state = {
  category: 'all',
  query: '',
  sort: 'featured',
  newOnly: false,
  saleOnly: false,
};

let cart = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
}

function getStarMarkup(rating) {
  const fullStars = Math.round(rating);
  return Array.from({ length: 5 }, (_, index) => {
    const filled = index < fullStars;
    return `<i class="${filled ? 'fa-solid fa-star' : 'fa-regular fa-star'}"></i>`;
  }).join('');
}

function getFilteredProducts() {
  let filtered = [...products];

  if (state.query) {
    const search = state.query.toLowerCase();
    filtered = filtered.filter(
      (product) =>
        product.name.toLowerCase().includes(search) ||
        product.category.toLowerCase().includes(search)
    );
  }

  if (state.category !== 'all') {
    filtered = filtered.filter((product) => product.category === state.category);
  }

  if (state.newOnly) {
    filtered = filtered.filter((product) => product.tag === 'New');
  }

  if (state.saleOnly) {
    filtered = filtered.filter((product) => product.onSale);
  }

  if (state.sort === 'low-high') {
    filtered.sort((a, b) => a.price - b.price);
  }

  if (state.sort === 'high-low') {
    filtered.sort((a, b) => b.price - a.price);
  }

  return filtered;
}

function renderProducts() {
  const filteredProducts = getFilteredProducts();

  if (!filteredProducts.length) {
    productGrid.innerHTML = `
      <div class="empty-cart" style="grid-column: 1 / -1; min-height: 240px;">
        <i class="fa-solid fa-magnifying-glass"></i>
        <h3 style="margin: 0.25rem 0; color: var(--plum);">No products found</h3>
        <p>Try another keyword or reset your filters.</p>
      </div>
    `;
    return;
  }

  productGrid.innerHTML = filteredProducts
    .map(
      (product) => `
        <article class="product-card reveal">
          <div class="product-media">
            <img src="${product.image}" alt="${product.name}" loading="lazy" />
            <span class="product-badge ${product.onSale ? 'sale' : 'new'}">${product.onSale ? 'Sale' : product.tag}</span>
            <button class="wishlist-btn" type="button" aria-label="Add ${product.name} to wishlist" data-product-id="${product.id}">
              <i class="fa-regular fa-heart"></i>
            </button>
          </div>
          <div class="product-info">
            <span class="product-category">${product.category}</span>
            <h3>${product.name}</h3>
            <div class="rating" aria-label="Rated ${product.rating} out of 5 stars">
              <span>${getStarMarkup(product.rating)}</span>
              <span>(${product.rating})</span>
            </div>
            <div class="price-row">
              <strong>${formatCurrency(product.price)}</strong>
              ${product.oldPrice ? `<span>${formatCurrency(product.oldPrice)}</span>` : ''}
            </div>
          </div>
          <button class="add-to-cart" type="button" data-product-id="${product.id}">Add to Cart</button>
        </article>
      `
    )
    .join('');

  revealItems();
}

function revealItems() {
  const items = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  items.forEach((item) => observer.observe(item));
}

function saveCart() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
}

function updateCartBadge() {
  const count = cart.reduce((total, item) => total + item.quantity, 0);
  cartCount.textContent = count;
}

function getCartTotal() {
  return cart.reduce((total, item) => {
    const product = products.find((productItem) => productItem.id === item.id);
    return total + (product ? product.price * item.quantity : 0);
  }, 0);
}

function renderCart() {
  if (!cart.length) {
    cartItemsContainer.innerHTML = `
      <div class="empty-cart">
        <i class="fa-solid fa-bag-shopping"></i>
        <h3>Your bag is empty</h3>
        <p>Add a few pieces to continue your edit.</p>
      </div>
    `;
  } else {
    cartItemsContainer.innerHTML = cart
      .map((item) => {
        const product = products.find((productItem) => productItem.id === item.id);
        if (!product) return '';

        return `
          <div class="cart-item">
            <img src="${product.image}" alt="${product.name}" />
            <div class="cart-item-info">
              <h4>${product.name}</h4>
              <p>${product.category}</p>
              <div class="cart-item-actions">
                <div class="quantity-controls">
                  <button class="quantity-btn" type="button" data-action="decrease" data-product-id="${product.id}" aria-label="Decrease quantity">
                    <i class="fa-solid fa-minus"></i>
                  </button>
                  <span class="quantity-value">${item.quantity}</span>
                  <button class="quantity-btn" type="button" data-action="increase" data-product-id="${product.id}" aria-label="Increase quantity">
                    <i class="fa-solid fa-plus"></i>
                  </button>
                </div>
                <button class="remove-item" type="button" data-action="remove" data-product-id="${product.id}">Remove</button>
              </div>
            </div>
            <div class="item-price">${formatCurrency(product.price * item.quantity)}</div>
          </div>
        `;
      })
      .join('');
  }

  const subtotal = getCartTotal();
  cartSubtotal.textContent = formatCurrency(subtotal);
  cartTotal.textContent = formatCurrency(subtotal);
  updateCartBadge();
}

function addToCart(productId) {
  const existingItem = cart.find((item) => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ id: productId, quantity: 1 });
  }

  saveCart();
  renderCart();
  openCart();
}

function updateCartQuantity(productId, change) {
  const item = cart.find((item) => item.id === productId);
  if (!item) return;

  item.quantity += change;

  if (item.quantity <= 0) {
    cart = cart.filter((productItem) => productItem.id !== productId);
  }

  saveCart();
  renderCart();
}

function openCart() {
  cartDrawer.classList.add('is-open');
  cartOverlay.classList.add('is-visible');
}

function closeCart() {
  cartDrawer.classList.remove('is-open');
  cartOverlay.classList.remove('is-visible');
}

function handleProductSearch(event) {
  state.query = event.target.value.trim();
  renderProducts();
}

function handleFilterClick(event) {
  const button = event.target.closest('.filter-btn');
  if (!button) return;

  state.category = button.dataset.category || 'all';
  document.querySelectorAll('.filter-btn').forEach((item) => item.classList.toggle('active', item === button));
  renderProducts();
}

function handleNewsletterSubmit(event) {
  event.preventDefault();

  const email = newsletterEmail.value.trim();
  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (!isValid) {
    formMessage.textContent = 'Please enter a valid email address.';
    formMessage.style.color = '#a1454f';
    newsletterEmail.focus();
    return;
  }

  formMessage.textContent = 'Thank you for subscribing to the LUXORA edit.';
  formMessage.style.color = '#23543f';
  newsletterForm.reset();
}

function bindStaticEvents() {
  productSearch.addEventListener('input', handleProductSearch);
  document.querySelectorAll('.filter-btn').forEach((button) => {
    button.addEventListener('click', handleFilterClick);
  });

  sortSelect.addEventListener('change', (event) => {
    state.sort = event.target.value;
    renderProducts();
  });

  newArrivalsFilter.addEventListener('change', (event) => {
    state.newOnly = event.target.checked;
    renderProducts();
  });

  saleFilter.addEventListener('change', (event) => {
    state.saleOnly = event.target.checked;
    renderProducts();
  });

  document.addEventListener('click', (event) => {
    const addToCartButton = event.target.closest('.add-to-cart');
    const wishlistButton = event.target.closest('.wishlist-btn');
    const quantityButton = event.target.closest('.quantity-btn');
    const removeButton = event.target.closest('.remove-item');
    const cartOpenButton = event.target.closest('.cart-trigger');
    const cartCloseButton = event.target.closest('.close-cart');
    const cartMask = event.target.closest('#cartOverlay');
    const searchTrigger = event.target.closest('.search-trigger');
    const mobileToggle = event.target.closest('.mobile-toggle');
    const mobileLink = event.target.closest('.mobile-nav a');

    if (addToCartButton) {
      addToCart(Number(addToCartButton.dataset.productId));
    }

    if (wishlistButton) {
      wishlistButton.classList.toggle('active');
      const heart = wishlistButton.querySelector('i');
      heart.classList.toggle('fa-regular');
      heart.classList.toggle('fa-solid');
    }

    if (quantityButton) {
      const action = quantityButton.dataset.action;
      const productId = Number(quantityButton.dataset.productId);
      if (action === 'increase') updateCartQuantity(productId, 1);
      if (action === 'decrease') updateCartQuantity(productId, -1);
    }

    if (removeButton) {
      const productId = Number(removeButton.dataset.productId);
      cart = cart.filter((item) => item.id !== productId);
      saveCart();
      renderCart();
    }

    if (cartOpenButton) {
      openCart();
    }

    if (cartCloseButton || cartMask) {
      closeCart();
    }

    if (searchTrigger) {
      productSearch.focus();
      productSearch.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    if (mobileToggle) {
      document.querySelector('.mobile-menu').classList.toggle('is-open');
    }

    if (mobileLink) {
      document.querySelector('.mobile-menu').classList.remove('is-open');
    }
  });

  document.querySelector('.checkout-btn').addEventListener('click', () => {
    if (!cart.length) {
      formMessage.textContent = 'Your bag is empty. Add a few pieces before checkout.';
      formMessage.style.color = '#a1454f';
      return;
    }

    alert('Checkout is ready — thank you for shopping with LUXORA.');
  });
}

function initRevealOnLoad() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
}

newsletterForm.addEventListener('submit', handleNewsletterSubmit);
bindStaticEvents();
renderProducts();
renderCart();
initRevealOnLoad();
