// ===== Products catalogue =====
const PRODUCTS = [
  {
    id: 1,
    name: 'Classic Garlic Bread',
    desc: 'Crispy baguette loaded with butter, fresh garlic, and parsley. A timeless favourite.',
    price: 4.99,
    emoji: '🥖',
  },
  {
    id: 2,
    name: 'Cheesy Garlic Pull-Apart',
    desc: 'Soft pull-apart rolls smothered in garlic butter and melted mozzarella.',
    price: 6.49,
    emoji: '🧀',
  },
  {
    id: 3,
    name: 'Roasted Garlic Focaccia',
    desc: 'Thick, pillowy focaccia with whole roasted garlic cloves and rosemary.',
    price: 5.99,
    emoji: '🌿',
  },
  {
    id: 4,
    name: 'Spicy Jalapeño Garlic Toast',
    desc: 'Garlic toast with a kick — jalapeños, chilli flakes, and pepper jack cheese.',
    price: 5.49,
    emoji: '🌶️',
  },
  {
    id: 5,
    name: 'Garlic Bread Pizza',
    desc: 'Thick garlic bread base topped with marinara, mozzarella, and basil.',
    price: 8.99,
    emoji: '🍕',
  },
  {
    id: 6,
    name: 'Garlic Knots (6-pack)',
    desc: 'Fluffy knots tossed in garlic butter, olive oil, and Parmesan. Addictive.',
    price: 7.49,
    emoji: '🥨',
  },
];

// ===== Cart state =====
let cart = [];

// ===== DOM helpers =====
const $ = id => document.getElementById(id);

function getCartItem(id) { return cart.find(i => i.id === id); }

function addToCart(id) {
  const product = PRODUCTS.find(p => p.id === id);
  const existing = getCartItem(id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  renderCart();
  openCart();
}

function changeQty(id, delta) {
  const item = getCartItem(id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter(i => i.id !== id);
  renderCart();
}

function renderCart() {
  const container = $('cart-items');
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  $('cart-count').textContent = cart.reduce((s, i) => s + i.qty, 0);
  $('cart-total-amount').textContent = `$${total.toFixed(2)}`;

  if (cart.length === 0) {
    container.innerHTML = '<p style="text-align:center;opacity:.5;padding:2rem 0">Your cart is empty 🛒</p>';
    return;
  }

  container.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-emoji">${item.emoji}</div>
      <div class="cart-item-info">
        <strong>${item.name}</strong>
        <span>$${item.price.toFixed(2)} each</span>
        <div class="qty-ctrl">
          <button data-dec="${item.id}" aria-label="Decrease quantity">−</button>
          <span>${item.qty}</span>
          <button data-inc="${item.id}" aria-label="Increase quantity">+</button>
        </div>
      </div>
      <strong>$${(item.price * item.qty).toFixed(2)}</strong>
    </div>
  `).join('');
}

// ===== Cart drawer =====
function openCart() {
  $('cart-drawer').classList.add('open');
  $('overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeCart() {
  $('cart-drawer').classList.remove('open');
  $('overlay').classList.remove('open');
  document.body.style.overflow = '';
}

// ===== Render products =====
function renderProducts() {
  const grid = $('products-grid');
  grid.innerHTML = PRODUCTS.map(p => `
    <div class="card">
      <div class="card-img">${p.emoji}</div>
      <div class="card-body">
        <h3>${p.name}</h3>
        <p>${p.desc}</p>
        <div class="card-footer">
          <span class="price">$${p.price.toFixed(2)}</span>
          <button class="btn btn-primary" data-add="${p.id}">Add to cart</button>
        </div>
      </div>
    </div>
  `).join('');
}

// ===== Toast notification =====
function showToast(msg) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('visible');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('visible'), 3000);
}

// ===== Checkout =====
function checkout() {
  if (cart.length === 0) return;
  showToast('🥖 Thanks for your order! Your garlic bread is on its way!');
  cart = [];
  renderCart();
  closeCart();
}

// ===== Init =====
document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
  renderCart();

  $('cart-btn').addEventListener('click', openCart);
  $('close-cart').addEventListener('click', closeCart);
  $('overlay').addEventListener('click', closeCart);
  $('checkout-btn').addEventListener('click', checkout);

  // Event delegation — product grid "Add to cart" buttons
  $('products-grid').addEventListener('click', e => {
    const btn = e.target.closest('[data-add]');
    if (btn) addToCart(Number(btn.dataset.add));
  });

  // Event delegation — cart quantity controls
  $('cart-items').addEventListener('click', e => {
    const inc = e.target.closest('[data-inc]');
    const dec = e.target.closest('[data-dec]');
    if (inc) changeQty(Number(inc.dataset.inc), 1);
    if (dec) changeQty(Number(dec.dataset.dec), -1);
  });
});
