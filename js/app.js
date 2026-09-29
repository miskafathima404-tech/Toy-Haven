/*
=========================================================
TOY HAVEN - MAIN JAVASCRIPT / VIVA ROADMAP
=========================================================

WHAT THIS FILE DOES
---------------------------------------------------------
This file contains the interactive behaviour used by the
six Toy Haven pages. Product information is kept separately
in js/products-data.js so the data can be reused.

1. LOCAL STORAGE
   The STORE object defines the browser storage keys used
   for the cart, wishlist/collection, feedback, newsletter
   and order history.

2. REUSABLE HELPERS
   get(), set(), money(), product(), toast(), total() and
   updateCartCount() are reusable functions. Reusing them
   avoids writing the same logic on every page.

3. HOME PAGE
   initHero() controls the auto-rotating promotional banner.
   initHome() displays featured products and the Product of
   the Day.

4. PRODUCT LISTING
   initProducts() reads the PRODUCTS array and provides:
   - product cards
   - search by product name
   - category filtering
   - Add to Cart
   - product modal / details

5. CART
   initCart() reads the saved cart, displays products,
   changes quantities, calculates subtotals, calculates the
   final total, clears the cart and links to checkout.

6. CHECKOUT
   initCheckout() validates the checkout form, shows the
   order summary, stores order history, clears the cart and
   displays a success message.

7. WISHLIST / COLLECTION
   initWishlist() reads saved products and lets the user
   store the assignment statuses:
   Interested, Owned and Not Interested.

8. SUPPORT
   initSupport() validates the feedback form, saves feedback
   to localStorage and controls the FAQ accordion.

9. NEWSLETTER
   initNewsletter() validates and stores the newsletter email
   in localStorage.

10. RESPONSIVE INTERACTION
    initNav() controls the mobile hamburger menu.
    initReveal() adds scroll-based reveal animation.

11. PAGE STARTUP
    DOMContentLoaded calls the setup functions. Each function
    first checks whether its page-specific elements exist, so
    one shared JavaScript file can be used across all pages.

VIVA SENTENCE:
"I separated reusable JavaScript logic from the HTML so the
same functions can support multiple pages and the user's
interactions can persist with localStorage."

=========================================================
*/
/*
=========================================================
TOY HAVEN - MAIN JAVASCRIPT
=========================================================

VIVA ROADMAP
---------------------------------------------------------
1. PRODUCT DATA     -> js/products-data.js
2. STORAGE KEYS     -> localStorage names
3. HELPER FUNCTIONS -> reusable functions
4. HOME PAGE        -> hero + Product of the Day
5. PRODUCTS PAGE    -> search + filters + modal
6. CART PAGE        -> quantity + totals
7. CHECKOUT PAGE    -> validation + order history
8. WISHLIST PAGE    -> collection statuses
9. SUPPORT PAGE     -> feedback + FAQ
10. STARTUP         -> runs everything on page load

IMPORTANT:
If you need to change a product, DO NOT search this file.
Go to:
    js/products-data.js

That file contains the product name, price, category,
description and image for every product.
=========================================================
*/

/* =====================================================
   2. LOCALSTORAGE KEYS
   ===================================================== */
const STORAGE = {
  cart:"playPocketCart",
  wishlist:"playPocketWishlist",
  feedback:"playPocketFeedback",
  newsletter:"playPocketNewsletter",
  orders:"playPocketOrders"
};

/* =====================================================
   3. REUSABLE STORAGE / FORMATTING HELPERS
   ===================================================== */
const getStore = (key, fallback) => {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
  catch { return fallback; }
};
const setStore = (key, value) => localStorage.setItem(key, JSON.stringify(value));
const money = value => `$${Number(value).toFixed(2)}`;
const productById = id => PRODUCTS.find(p => p.id === Number(id));
const escapeHTML = value => String(value).replace(/[&<>"']/g, char => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;" }[char]));

/* =====================================================
   4. REUSABLE TOAST NOTIFICATION
   ===================================================== */
function showToast(message) {
  const toast = document.querySelector("#toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2400);
}

/* =====================================================
   5. CART COUNT IN HEADER
   ===================================================== */
function updateCartCount() {
  const cart = getStore(STORAGE.cart, []);
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  document.querySelectorAll(".cart-count").forEach(el => el.textContent = count);
}

/* =====================================================
   6. ADD PRODUCT TO CART
   ===================================================== */
function addToCart(id) {
  const cart = getStore(STORAGE.cart, []);
  const existing = cart.find(item => item.id === Number(id));
  if (existing) existing.qty += 1;
  else cart.push({id:Number(id), qty:1});
  setStore(STORAGE.cart, cart);
  updateCartCount();
  showToast("Added to cart.");
}

/* =====================================================
   7. CALCULATE CART TOTAL
   ===================================================== */
function cartTotal(cart = getStore(STORAGE.cart, [])) {
  return cart.reduce((sum, item) => {
    const product = productById(item.id);
    return sum + (product ? product.price * item.qty : 0);
  }, 0);
}

/* =====================================================
   8. REUSABLE PRODUCT CARD
   One function creates cards on multiple pages.
   ===================================================== */
function productCard(product, options = {}) {
  const wishlist = getStore(STORAGE.wishlist, {});
  const savedStatus = wishlist[product.id] || "";
  const showWishlist = options.showWishlist !== false;
  return `
    <article class="product-card reveal visible" data-id="${product.id}">
      <button class="product-image" data-view-product="${product.id}" aria-label="View ${escapeHTML(product.name)}">
        <img src="${product.image}" alt="${escapeHTML(product.name)}">
      </button>
      <div class="product-info">
        <h3 class="product-name">${escapeHTML(product.name)}</h3>
        <p class="product-category">${escapeHTML(product.category)}</p>
        <p class="price">${money(product.price)}</p>
        <div class="card-actions">
          <button class="btn" data-add-cart="${product.id}">Add to Cart</button>
          ${showWishlist ? `<button class="icon-btn ${savedStatus && savedStatus !== "Not Interested" ? "saved" : ""}" data-view-product="${product.id}" aria-label="Save">${savedStatus && savedStatus !== "Not Interested" ? "♥" : "♡"}</button>` : ""}
        </div>
      </div>
    </article>`;
}

/* =====================================================
   9. HOME - PRODUCT OF THE DAY
   ===================================================== */
function renderFeatured() {
  const target = document.querySelector("#featured-product");
  if (!target) return;
  // Date-based Product of the Day: the same product is shown for everyone on a given day.
  const dayIndex = Math.floor(Date.now() / 86400000) % PRODUCTS.length;
  const product = PRODUCTS[dayIndex];
  target.innerHTML = productCard(product);
}

/* =====================================================
   HOME - FULL PRODUCT COLLECTION
   ===================================================== */
function renderHomeProducts() {
  const target = document.querySelector("#home-product-grid");
  if (!target) return;

  // PRODUCTS comes from js/products-data.js.
  // Changing products there automatically changes this section.
  target.innerHTML = PRODUCTS.map(product => productCard(product)).join("");
}

/* =====================================================
   10. HOME - HERO SLIDES
   ===================================================== */
const slides = [
  ["ferrari.jpg", "A NEW WAY TO PLAY", "Discover collectible figurines, toys, board games and diecast cars in one colourful Toy Haven."],
  ["batman.jpg", "COLLECT SOMETHING SPECIAL", "Meet fresh figurines and display pieces made for every kind of collector."],
  ["lego-city.jpg", "MAKE GAME NIGHT BRIGHTER", "Find board games and playful toys for family, friends and weekend fun."],
  ["bmw.jpg", "DETAILS WORTH DISPLAYING", "Browse miniature diecast cars and build a collection with character."]
];

function initHero() {
  const title = document.querySelector("#hero-title");
  const text = document.querySelector("#hero-text");
  const art = document.querySelector("#hero-art");
  const dots = document.querySelector("#hero-dots");
  if (!title || !text || !art || !dots) return;
  let index = 0;
  dots.innerHTML = slides.map((s,i) => `<button class="${i===0?"active":""}" data-slide="${i}" aria-label="Show promotion ${i+1}">0${i+1}</button>`).join("");
  const paint = () => {
    const slide = slides[index];
    title.textContent = slide[1];
    text.textContent = slide[2];
    art.querySelector(".hero-product img").src = `assets/${slide[0]}`;

    dots.querySelectorAll("button").forEach((b,i) => 
      b.classList.toggle("active", i === index)
    );
  };
  dots.addEventListener("click", e => {
    const button = e.target.closest("[data-slide]");
    if (!button) return;
    index = Number(button.dataset.slide);
    paint();
  });

  paint();

  setInterval(() => { 
    index = (index + 1) % slides.length; 
    paint(); 
  }, 4500);
}

/* =====================================================
   11. PRODUCTS - SEARCH + CATEGORY FILTERING
   ===================================================== */
function renderProducts() {
  const grid = document.querySelector("#product-grid");
  if (!grid) return;
  const search = document.querySelector("#product-search");
  const filters = document.querySelector("#category-filters");
  const params = new URLSearchParams(window.location.search);
  let category = params.get("category") || "All";

  // Keep category links from the Home page working when the Products page opens.
  const validCategories = ["All", "Figurines", "Toys", "Board Games", "Diecast Cars"];
  if (!validCategories.includes(category)) category = "All";

  const update = () => {
    const query = (search?.value || "").trim().toLowerCase();
    const filtered = PRODUCTS.filter(p =>
      (category === "All" || p.category === category) &&
      p.name.toLowerCase().includes(query)
    );
    grid.innerHTML = filtered.map(p => productCard(p)).join("");
    document.querySelector("#product-result-count").textContent = `${filtered.length} item${filtered.length === 1 ? "" : "s"}`;
    document.querySelector("#no-products").classList.toggle("hidden", filtered.length !== 0);
  };

  filters?.addEventListener("click", e => {
    const button = e.target.closest("[data-category]");
    if (!button) return;
    category = button.dataset.category;
    filters.querySelectorAll(".filter-btn").forEach(b => b.classList.toggle("active", b === button));
    update();
  });
  search?.addEventListener("input", update);
  if (filters && category !== "All") {
    filters.querySelectorAll(".filter-btn").forEach(button => {
      button.classList.toggle("active", button.dataset.category === category);
    });
  }
  update();
}

/* =====================================================
   12. PRODUCT MODAL
   ===================================================== */
function openProductModal(id) {
  const product = productById(id);
  const modal = document.querySelector("#product-modal");
  const content = document.querySelector("#modal-content");
  if (!product || !modal || !content) return;
  const wishlist = getStore(STORAGE.wishlist, {});
  const current = wishlist[product.id] || "Interested";
  content.innerHTML = `
    <div class="modal-product">
      <div class="product-image"><img src="${product.image}" alt="${escapeHTML(product.name)}"></div>
      <div>
        <p class="eyebrow">${escapeHTML(product.category)}</p>
        <h2 id="modal-title">${escapeHTML(product.name)}</h2>
        <p class="price">${money(product.price)}</p>
        <p class="muted">${escapeHTML(product.description)}</p>
        <div class="wishlist-select">
          <label for="modal-status">Collection status</label>
          <select id="modal-status">
            <option ${current==="Interested"?"selected":""}>Interested</option>
            <option ${current==="Owned"?"selected":""}>Owned</option>
            <option ${current==="Not Interested"?"selected":""}>Not Interested</option>
          </select>
        </div>
        <button class="btn full-width" data-add-cart="${product.id}">ADD TO CART</button>
        <button class="btn secondary full-width" data-save-wishlist="${product.id}">SAVE TO COLLECTION</button>
      </div>
    </div>`;
  modal.classList.remove("hidden");
  modal.dataset.productId = product.id;
}

function closeProductModal() {
  document.querySelector("#product-modal")?.classList.add("hidden");
}

/* =====================================================
   13. WISHLIST / COLLECTION
   ===================================================== */
function saveWishlist(id, status) {
  const wishlist = getStore(STORAGE.wishlist, {});
  wishlist[id] = status;
  setStore(STORAGE.wishlist, wishlist);

  document
    .querySelectorAll(`.icon-btn[data-view-product="${id}"]`)
    .forEach(button => {
      const isSaved = status !== "Not Interested";

      button.textContent = isSaved ? "♥" : "♡";
      button.classList.toggle("saved", isSaved);
    });

  showToast("Collection updated.");
}

function renderWishlist() {
  const grid = document.querySelector("#wishlist-grid");
  if (!grid) return;
  const filterBox = document.querySelector("#wishlist-filters");
  let status = "Interested";

  const update = () => {
    const wishlist = getStore(STORAGE.wishlist, {});
    const ids = Object.entries(wishlist).filter(([,s]) => s === status).map(([id]) => Number(id));
    const products = ids.map(productById).filter(Boolean);
    document.querySelector("#wishlist-title").textContent = status;
    document.querySelector("#wishlist-count").textContent = `${products.length} saved`;
    grid.innerHTML = products.map(p => productCard(p)).join("");
    document.querySelector("#wishlist-empty").classList.toggle("hidden", products.length !== 0);
  };

  filterBox?.addEventListener("click", e => {
    const button = e.target.closest("[data-status]");
    if (!button) return;
    status = button.dataset.status;
    filterBox.querySelectorAll(".filter-btn").forEach(b => b.classList.toggle("active", b === button));
    update();
  });
  update();
}

/* =====================================================
   14. CART PAGE
   ===================================================== */
function renderCart() {
  const list = document.querySelector("#cart-items");
  if (!list) return;
  const empty = document.querySelector("#empty-cart");
  const checkoutLink = document.querySelector("#checkout-link");

  const update = () => {
    const cart = getStore(STORAGE.cart, []);
    list.innerHTML = cart.map(item => {
      const p = productById(item.id);
      if (!p) return "";
      return `
        <article class="cart-item">
          <div class="cart-item-image"><img src="${p.image}" alt=""></div>
          <div><h3>${escapeHTML(p.name)}</h3><p>${escapeHTML(p.category)} · ${money(p.price)} each</p></div>
          <div class="qty-control" aria-label="Quantity controls for ${escapeHTML(p.name)}">
            <button data-qty="${p.id}" data-change="-1" aria-label="Decrease quantity">−</button>
            <strong>${item.qty}</strong>
            <button data-qty="${p.id}" data-change="1" aria-label="Increase quantity">+</button>
          </div>
          <div><strong>${money(p.price * item.qty)}</strong><br><button class="remove-btn" data-remove="${p.id}">Remove</button></div>
        </article>`;
    }).join("");
    const totalItems = cart.reduce((s,i) => s+i.qty,0);
    const total = cartTotal(cart);
    document.querySelector("#cart-item-count").textContent = totalItems;
    document.querySelector("#cart-subtotal").textContent = money(total);
    document.querySelector("#cart-total").textContent = money(total);
    empty.classList.toggle("hidden", cart.length !== 0);
    checkoutLink.classList.toggle("hidden", cart.length === 0);
  };
  list.addEventListener("click", e => {
    const qty = e.target.closest("[data-qty]");
    const remove = e.target.closest("[data-remove]");
    const cart = getStore(STORAGE.cart, []);
    if (qty) {
      const item = cart.find(i => i.id === Number(qty.dataset.qty));
      if (item) item.qty += Number(qty.dataset.change);
      const clean = cart.filter(i => i.qty > 0);
      setStore(STORAGE.cart, clean);
      updateCartCount(); update();
    }
    if (remove) {
      setStore(STORAGE.cart, cart.filter(i => i.id !== Number(remove.dataset.remove)));
      updateCartCount(); update(); showToast("Item removed.");
    }
  });
  document.querySelector("#clear-cart")?.addEventListener("click", () => {
    setStore(STORAGE.cart, []);
    updateCartCount(); update(); showToast("Cart cleared.");
  });
  update();
}

/* =====================================================
   15. CHECKOUT PAGE
   ===================================================== */
function renderCheckout() {
  const form = document.querySelector("#checkout-form");
  if (!form) return;
  const cart = getStore(STORAGE.cart, []);
  const items = document.querySelector("#checkout-items");
  items.innerHTML = cart.map(item => {
    const p = productById(item.id);
    return p ? `<div class="checkout-item"><span>${escapeHTML(p.name)} × ${item.qty}</span><strong>${money(p.price*item.qty)}</strong></div>` : "";
  }).join("") || `<p class="muted">Your cart is empty. <a class="text-link" href="products.html">Browse products</a></p>`;
  document.querySelector("#checkout-total").textContent = money(cartTotal(cart));

  form.addEventListener("submit", e => {
    e.preventDefault();
    const valid = validateForm(form, {
      "full-name":"Please enter your full name.",
      "email":"Please enter a valid email address.",
      "address":"Please enter your delivery address.",
      "payment":"Please choose a payment method."
    });
    if (!valid || cart.length === 0) {
      if (cart.length === 0) showToast("Add an item before checkout.");
      return;
    }
    const orders = getStore(STORAGE.orders, []);
    orders.push({date:new Date().toISOString(), customer:{
      name:form.fullName.value.trim(), email:form.email.value.trim(),
      address:form.address.value.trim(), payment:form.payment.value
    }, items:cart, total:cartTotal(cart)});
    setStore(STORAGE.orders, orders);
    setStore(STORAGE.cart, []);
    updateCartCount();
    document.querySelector("#checkout-success").classList.remove("hidden");
    form.reset();
    showToast("Order placed successfully.");
  });
}

/* =====================================================
   16. REUSABLE FORM VALIDATION
   Used by checkout and feedback.
   ===================================================== */
function validateForm(form, rules) {
  let valid = true;
  Object.entries(rules).forEach(([id,message]) => {
    const field = document.getElementById(id);
    const error = document.querySelector(`[data-error-for="${id}"]`);
    let fieldValid = field.value.trim() !== "";
    if (id.includes("email")) fieldValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim());
    if (error) error.textContent = fieldValid ? "" : message;
    field?.setAttribute("aria-invalid", String(!fieldValid));
    if (!fieldValid) valid = false;
  });
  return valid;
}

/* =====================================================
   17. SUPPORT - FEEDBACK + FAQ ACCORDION
   ===================================================== */
function initSupport() {
  const form = document.querySelector("#feedback-form");
  if (form) {
    form.addEventListener("submit", e => {
      e.preventDefault();
      const valid = validateForm(form, {
        "feedback-name":"Please enter your name.",
        "feedback-email":"Please enter a valid email address.",
        "feedback-message":"Please enter a message."
      });
      if (!valid) return;
      const feedback = getStore(STORAGE.feedback, []);
      feedback.push({date:new Date().toISOString(),name:form.name.value.trim(),email:form.email.value.trim(),message:form.message.value.trim()});
      setStore(STORAGE.feedback, feedback);
      form.reset();
      document.querySelector("#feedback-success").classList.remove("hidden");
      showToast("Feedback saved.");
    });
  }

  document.querySelectorAll(".faq-question").forEach(question => {
    question.addEventListener("click", () => {
      const answer = question.nextElementSibling;
      const open = question.getAttribute("aria-expanded") === "true";
      question.setAttribute("aria-expanded", String(!open));
      answer.classList.toggle("open", !open);
    });
  });
}

/* =====================================================
   18. NEWSLETTER
   ===================================================== */
function initNewsletter() {
  const form = document.querySelector("#newsletter-form");
  if (!form) return;
  form.addEventListener("submit", e => {
    e.preventDefault();
    const input = document.querySelector("#newsletter-email");
    if (!input.checkValidity()) {
      input.reportValidity();
      return;
    }
    setStore(STORAGE.newsletter, {email:input.value.trim(),subscribedAt:new Date().toISOString()});
    document.querySelector("#newsletter-message").textContent = "✓ You're subscribed.";
    form.reset();
  });
}

/* =====================================================
   19. MOBILE HAMBURGER NAVIGATION
   ===================================================== */
function initNavigation() {
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".site-nav");
  toggle?.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });
}

/* =====================================================
   20. GLOBAL CLICK HANDLER
   ===================================================== */
function initGlobalClicks() {
  document.addEventListener("click", e => {
    const add = e.target.closest("[data-add-cart]");
    if (add) {
      addToCart(add.dataset.addCart);
      return;
    }
    const view = e.target.closest("[data-view-product]");
    if (view) {
      openProductModal(view.dataset.viewProduct);
      return;
    }
    const save = e.target.closest("[data-save-wishlist]");
    if (save) {
      const status = document.querySelector("#modal-status")?.value || "Interested";
      saveWishlist(save.dataset.saveWishlist, status);
      return;
    }
    if (e.target.matches("[data-close-modal]")) closeProductModal();
  });
}

/* =====================================================
   21. SCROLL REVEAL ANIMATION
   ===================================================== */
function initReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    items.forEach(el => el.classList.add("visible"));
    return;
  }
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, {threshold:.12});
  items.forEach(el => observer.observe(el));
}

/* =====================================================
   22. PWA SERVICE WORKER
   ===================================================== */
async function registerPWA() {
  if ("serviceWorker" in navigator) {
    try { await navigator.serviceWorker.register("sw.js"); }
    catch (error) { console.info("PWA service worker unavailable in this environment.", error); }
  }
}

/* =====================================================
   23. STARTUP
   DOMContentLoaded waits until HTML has loaded, then
   starts only the functions needed by each page.
   ===================================================== */
document.addEventListener("DOMContentLoaded", () => {
  initNavigation();
  initGlobalClicks();
  updateCartCount();
  initHero();
  renderFeatured();
  renderHomeProducts();
  renderProducts();
  renderCart();
  renderCheckout();
  renderWishlist();
  initSupport();
  initNewsletter();
  initReveal();
  registerPWA();
});


window.addEventListener("pageshow", () => {
  document.querySelectorAll(".icon-btn[data-view-product]").forEach(button => {
    const id = Number(button.dataset.viewProduct);
    const wishlist = getStore(STORAGE.wishlist, {});
    const status = wishlist[id];

    const isSaved = status && status !== "Not Interested";

    button.textContent = isSaved ? "♥" : "♡";
    button.classList.toggle("saved", Boolean(isSaved));
  });
});