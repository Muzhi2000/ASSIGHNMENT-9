// Product Array
const products = [
  { id: 1, name: "Laptop", price: 1000 },
  { id: 2, name: "Phone", price: 500 },
  { id: 3, name: "Headphones", price: 200 },
  { id: 4, name: "Keyboard", price: 150 },
];

// Initial cart from localStorage or empty
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// DOM Elements
const productList = document.getElementById("product-list");
const cartContainer = document.getElementById("cart");
const totalPriceEl = document.getElementById("total-price");
const successMessage = document.getElementById("success-message");
const searchInput = document.getElementById("search");

// Display Products
const displayProducts = (filteredProducts = products) => {
  productList.innerHTML = "";
  filteredProducts.forEach(product => {
    const div = document.createElement("div");
    div.className = "product";
    div.innerHTML = `
      <span>${product.name} - $${product.price}</span>
      <button onclick="addToCart(${product.id})">Add to Cart</button>
    `;
    productList.appendChild(div);
  });
};

// Display Cart
const displayCart = () => {
  cartContainer.innerHTML = "";
  cart.forEach(item => {
    const div = document.createElement("div");
    div.className = "cart-item";
    const subtotal = item.price * item.quantity;
    div.innerHTML = `
      <span>${item.name} - $${item.price} × ${item.quantity} = $${subtotal}</span>
      <div>
        <button onclick="updateQuantity(${item.id}, -1)">-</button>
        <button onclick="updateQuantity(${item.id}, 1)">+</button>
        <button onclick="removeFromCart(${item.id})">Remove</button>
      </div>
    `;
    cartContainer.appendChild(div);
  });
  calculateTotal();
  saveCart();
};

// Add to Cart
const addToCart = (id) => {
  const product = products.find(p => p.id === id);
  const existing = cart.find(item => item.id === id);
  if (existing) {
    existing.quantity++;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  displayCart();
  showSuccess(`${product.name} added to cart.`);
};

// Update Quantity
const updateQuantity = (id, change) => {
  const item = cart.find(p => p.id === id);
  if (!item) return;
  item.quantity += change;
  if (item.quantity <= 0) {
    removeFromCart(id);
  }
  displayCart();
};

// Remove from Cart
const removeFromCart = (id) => {
  cart = cart.filter(item => item.id !== id);
  displayCart();
};

// Calculate Total
const calculateTotal = () => {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  totalPriceEl.textContent = total;
};

// Show Success Message
const showSuccess = (msg) => {
  successMessage.textContent = msg;
  setTimeout(() => successMessage.textContent = "", 2000);
};

// Save Cart to localStorage
const saveCart = () => {
  localStorage.setItem('cart', JSON.stringify(cart));
};

// Search Filter
searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase();
  const filtered = products.filter(p => p.name.toLowerCase().includes(query));
  displayProducts(filtered);
});

// Initial Load
displayProducts();
displayCart();
