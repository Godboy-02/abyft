// CUSTOM CURSOR
const customCursor = document.getElementById("custom-cursor");
document.addEventListener("mousemove", (e) => {
  customCursor.style.left = e.clientX + "px";
  customCursor.style.top = e.clientY + "px";
});

document.querySelectorAll("button, a, .product-card, .cart-icon").forEach(el => {
  el.addEventListener("mouseenter", () => {
    customCursor.style.transform = "translate(-50%, -50%) scale(1.4)";
    customCursor.style.background = "rgba(0,0,0,0.1)";
  });
  el.addEventListener("mouseleave", () => {
    customCursor.style.transform = "translate(-50%, -50%) scale(1)";
    customCursor.style.background = "transparent";
  });
});

// LOADING SCREEN
window.addEventListener("load", () => {
  const loading = document.getElementById("loading-screen");
  setTimeout(() => {
    loading.style.opacity = "0";
    loading.style.transition = "opacity 0.5s ease";
    setTimeout(() => loading.style.display = "none", 500);
  }, 700);
});

// SMOOTH SCROLL TO COLLECTION
document.querySelector(".shop-btn").addEventListener("click", () => {
  document.querySelector("#collection").scrollIntoView({ behavior: "smooth" });
});

// DARK MODE TOGGLE
const darkToggle = document.querySelector(".dark-toggle");
darkToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  darkToggle.textContent = document.body.classList.contains("dark-mode")
    ? "LIGHT MODE"
    : "DARK MODE";
});

// HAMBURGER MENU
const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");
hamburger.addEventListener("click", () => {
  navLinks.classList.toggle("open");
});

// BACK TO TOP
const backToTop = document.getElementById("back-to-top");
window.addEventListener("scroll", () => {
  backToTop.style.display = window.scrollY > 300 ? "block" : "none";
});
backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// CART SYSTEM WITH LOCALSTORAGE
let cart = JSON.parse(localStorage.getItem("abyft_cart") || "[]");
const cartCount = document.getElementById("cart-count");
const floatingCartCount = document.getElementById("floating-cart-count");
const cartItemsList = document.getElementById("cart-items");
const cartPanel = document.getElementById("cart-panel");
const closeCartBtn = document.getElementById("close-cart");
const cartIcon = document.querySelector(".cart-icon");
const floatingCart = document.querySelector(".floating-cart");

function saveCart() {
  localStorage.setItem("abyft_cart", JSON.stringify(cart));
}

function renderCart() {
  cartItemsList.innerHTML = "";
  cart.forEach((item, index) => {
    const li = document.createElement("li");

    const info = document.createElement("div");
    info.className = "cart-item-info";
    info.textContent = `${item.name} (${item.size || "ONE SIZE"}${item.color ? ", " + item.color : ""}) - $${item.price}`;

    const qty = document.createElement("div");
    qty.className = "cart-qty";
    const minus = document.createElement("button");
    minus.textContent = "-";
    const span = document.createElement("span");
    span.textContent = item.qty;
    const plus = document.createElement("button");
    plus.textContent = "+";

    minus.addEventListener("click", () => {
      if (item.qty > 1) {
        item.qty--;
      } else {
        cart.splice(index, 1);
      }
      saveCart();
      renderCart();
    });

    plus.addEventListener("click", () => {
      item.qty++;
      saveCart();
      renderCart();
    });

    qty.appendChild(minus);
    qty.appendChild(span);
    qty.appendChild(plus);

    const removeBtn = document.createElement("button");
    removeBtn.className = "cart-remove";
    removeBtn.textContent = "✕";
    removeBtn.addEventListener("click", () => {
      cart.splice(index, 1);
      saveCart();
      renderCart();
    });

    li.appendChild(info);
    li.appendChild(qty);
    li.appendChild(removeBtn);
    cartItemsList.appendChild(li);
  });
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  cartCount.textContent = totalItems;
  floatingCartCount.textContent = totalItems;
}

function addToCart(product) {
  const existing = cart.find(
    (i) => i.name === product.name && i.size === product.size && i.color === product.color
  );
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  saveCart();
  renderCart();
  cartIcon.classList.add("shake");
  setTimeout(() => cartIcon.classList.remove("shake"), 400);
}

renderCart();

document.querySelectorAll(".add-cart-btn").forEach(btn => {
  btn.addEventListener("click", (e) => {
    const card = e.target.closest(".product-card");
    const name = card.getAttribute("data-name");
    const price = card.getAttribute("data-price");
    addToCart({ name, price, size: "ONE SIZE", color: null });
  });
});

cartIcon.addEventListener("click", () => {
  cartPanel.classList.add("open");
});

floatingCart.addEventListener("click", () => {
  cartPanel.classList.add("open");
});

closeCartBtn.addEventListener("click", () => {
  cartPanel.classList.remove("open");
});

// NAVBAR SHRINK ON SCROLL + SCROLL ANIMATIONS
window.addEventListener("scroll", () => {
  const navbar = document.querySelector(".navbar");
  if (window.scrollY > 50) {
    navbar.classList.add("shrink");
  } else {
    navbar.classList.remove("shrink");
  }
});

// INTERSECTION OBSERVER FOR FADE-IN
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll(".fade-in").forEach(el => observer.observe(el));

// QUICK VIEW POPUP
const quickView = document.getElementById("quickView");
const qvImg = document.getElementById("qvImg");
const qvTitle = document.getElementById("qvTitle");
const qvPrice = document.getElementById("qvPrice");
const closeQuickView = document.getElementById("closeQuickView");

document.querySelectorAll(".quick-view-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const card = btn.closest(".product-card");
    qvImg.src = card.querySelector("img").src;
    qvTitle.textContent = card.querySelector("h3").textContent;
    qvPrice.textContent = card.querySelector("p").textContent;
    quickView.style.display = "flex";
  });
});

closeQuickView.addEventListener("click", () => {
  quickView.style.display = "none";
});

// PRODUCT DETAIL SECTION
const productDetailSection = document.getElementById("product-detail");
const detailImg = document.getElementById("detail-img");
const detailTitle = document.getElementById("detail-title");
const detailPrice = document.getElementById("detail-price");
const detailStock = document.getElementById("detail-stock");
const detailAddCart = document.getElementById("detail-add-cart");
const breadcrumbProduct = document.getElementById("breadcrumb-product");
const sizeSelector = document.getElementById("size-selector");
const colorSelector = document.getElementById("color-selector");
let currentDetailProduct = null;
let selectedSize = null;
let selectedColor = "BLACK";

function updateDetailAddButton() {
  if (selectedSize) {
    detailAddCart.disabled = false;
    detailAddCart.textContent = "ADD TO CART";
  } else {
    detailAddCart.disabled = true;
    detailAddCart.textContent = "SELECT SIZE TO ADD";
  }
}

sizeSelector.querySelectorAll("button").forEach(btn => {
  btn.addEventListener("click", () => {
    sizeSelector.querySelectorAll("button").forEach(b => b.classList.remove("selected"));
    btn.classList.add("selected");
    selectedSize = btn.dataset.size;
    updateDetailAddButton();
  });
});

colorSelector.querySelectorAll("button").forEach(btn => {
  btn.addEventListener("click", () => {
    colorSelector.querySelectorAll("button").forEach(b => b.classList.remove("selected"));
    btn.classList.add("selected");
    selectedColor = btn.dataset.color;
  });
});

// VIEW DETAILS BUTTONS
document.querySelectorAll(".view-detail-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const card = btn.closest(".product-card");
    const name = card.getAttribute("data-name");
    const price = card.getAttribute("data-price");
    const imgSrc = card.querySelector("img").src;

    currentDetailProduct = { name, price };
    selectedSize = null;
    selectedColor = "BLACK";
    sizeSelector.querySelectorAll("button").forEach(b => b.classList.remove("selected"));
    colorSelector.querySelectorAll("button").forEach(b => b.classList.remove("selected"));
    colorSelector.querySelector(".black").classList.add("selected");
    updateDetailAddButton();

    detailImg.src = imgSrc;
    detailTitle.textContent = name;
    detailPrice.textContent = `$${price}`;
    detailStock.textContent = "IN STOCK — LIMITED";
    breadcrumbProduct.textContent = name;

    productDetailSection.style.display = "block";
    productDetailSection.scrollIntoView({ behavior: "smooth" });

    addRecentlyViewed({ name, price, imgSrc });
  });
});

detailAddCart.addEventListener("click", () => {
  if (currentDetailProduct && selectedSize) {
    addToCart({
      name: currentDetailProduct.name,
      price: currentDetailProduct.price,
      size: selectedSize,
      color: selectedColor
    });
  }
});

// RECENTLY VIEWED + RECOMMENDATIONS
const recentlyViewedList = document.getElementById("recently-viewed-list");
const recommendationsList = document.getElementById("recommendations-list");
let recentlyViewed = [];

function addRecentlyViewed(product) {
  recentlyViewed = recentlyViewed.filter(p => p.name !== product.name);
  recentlyViewed.unshift(product);
  if (recentlyViewed.length > 3) recentlyViewed.pop();
  renderRecentlyViewed();
  renderRecommendations();
}

function createProductCard(name, price, imgSrc) {
  const card = document.createElement("div");
  card.className = "product-card";
  card.innerHTML = `
    <img src="${imgSrc}" alt="${name}">
    <h3>${name}</h3>
    <p>$${price}</p>
  `;
  return card;
}

function renderRecentlyViewed() {
  recentlyViewedList.innerHTML = "";
  recentlyViewed.forEach(p => {
    const card = createProductCard(p.name, p.price, p.imgSrc);
    recentlyViewedList.appendChild(card);
  });
}

function renderRecommendations() {
  recommendationsList.innerHTML = "";
  const allProducts = [
    {
      name: "ABYFT CAP",
      price: "24.99",
      imgSrc: "https://i.postimg.cc/TpY62Bcn/trucker-caps-abyft.jpg"
    },
    {
      name: "ABYFT T-SHIRT",
      price: "29.99",
      imgSrc: "https://i.postimg.cc/HVsgWFt5/unisex-oversized-boxy-tee-abyft.jpg"
    },
    {
      name: "ABYFT HOODIE",
      price: "59.99",
      imgSrc: "https://i.postimg.cc/TpY62Bcr/unisex-heavy-blend-hooded-sweatshirt-abyft.jpg"
    }
  ];
  allProducts.forEach(p => {
    if (!recentlyViewed.find(r => r.name === p.name)) {
      const card = createProductCard(p.name, p.price, p.imgSrc);
      recommendationsList.appendChild(card);
    }
  });
}

// CHECKOUT SECTION
const goCheckoutBtn = document.getElementById("go-checkout");
const checkoutItems = document.getElementById("checkout-items");
const checkoutTotal = document.getElementById("checkout-total");

goCheckoutBtn.addEventListener("click", () => {
  checkoutItems.innerHTML = "";
  let total = 0;
  cart.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = `${item.name} (${item.size || "ONE SIZE"}${item.color ? ", " + item.color : ""}) x${item.qty} - $${(item.price * item.qty).toFixed(2)}`;
    checkoutItems.appendChild(li);
    total += parseFloat(item.price) * item.qty;
  });
  checkoutTotal.textContent = `TOTAL: $${total.toFixed(2)}`;
  cartPanel.classList.remove("open");
  document.querySelector("#checkout").scrollIntoView({ behavior: "smooth" });
});

// PLACE ORDER
const placeOrderBtn = document.querySelector(".place-order-btn");
const checkoutSuccess = document.getElementById("checkout-success");
const backHomeBtn = document.getElementById("back-home");

placeOrderBtn.addEventListener("click", () => {
  checkoutSuccess.style.display = "flex";
  cart = [];
  saveCart();
  renderCart();
});

backHomeBtn.addEventListener("click", () => {
  checkoutSuccess.style.display = "none";
  document.querySelector("#home").scrollIntoView({ behavior: "smooth" });
});

// NAVBAR LINKS SMOOTH SCROLL
document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute("href"));
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
      navLinks.classList.remove("open");
    }
  });
});

// PARALLAX PRODUCT CARDS
document.addEventListener("mousemove", (e) => {
  document.querySelectorAll(".parallax-card").forEach(card => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    card.style.transform = `translateY(-8px) rotateX(${y / -80}deg) rotateY(${x / 80}deg)`;
  });
});

document.querySelectorAll(".parallax-card").forEach(card => {
  card.addEventListener("mouseleave", () => {
    card.style.transform = "translateY(-8px) rotateX(0) rotateY(0)";
  });
});