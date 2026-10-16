
/* =========================================
   ROSÉVELLE — WEBSITE JAVASCRIPT
   ========================================= */

document.addEventListener("DOMContentLoaded", function () {
  // ---------- MOBILE NAVIGATION ----------
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", function () {
      const isOpen = navLinks.classList.toggle("active");

      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Close navigation menu" : "Open navigation menu"
      );
    });

    // Close the menu after selecting a navigation link.
    navLinks.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navLinks.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation menu");
      });
    });
  }

  // ---------- SAFE LOCAL STORAGE ----------
  function readStorage(key, fallback) {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : fallback;
    } catch (error) {
      return fallback;
    }
  }

  function saveStorage(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      // The website can still work if storage is unavailable.
    }
  }

  // ---------- SHOPPING BAG ----------
  let cart = readStorage("rosevelleCart", []);

  if (!Array.isArray(cart)) {
    cart = [];
  }

  const cartLink = document.querySelector(
    '.nav-actions a[aria-label="Shopping cart"]'
  );

  function updateCartCount() {
    const countElement = cartLink
      ? cartLink.querySelector(".count")
      : null;

    const totalItems = cart.reduce(function (total, item) {
      return total + (Number(item.quantity) || 0);
    }, 0);

    if (countElement) {
      countElement.textContent = totalItems;
    }
  }

  document.querySelectorAll(".add-to-cart").forEach(function (button) {
    button.addEventListener("click", function () {
      const productCard = button.closest(".product-card");
      const productId = button.dataset.productId;

      if (!productId) {
        alert("This product needs a product ID before it can be added.");
        return;
      }

      const productNameElement = productCard
        ? productCard.querySelector("h3")
        : null;

      const productPriceElement = productCard
        ? productCard.querySelector(".price")
        : null;

      const productName = productNameElement
        ? productNameElement.textContent.trim()
        : "Product " + productId;

      const priceText = productPriceElement
        ? productPriceElement.textContent.trim()
        : "";

      const existingItem = cart.find(function (item) {
        return item.id === productId;
      });

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({
          id: productId,
          name: productName,
          price: priceText,
          quantity: 1
        });
      }

      saveStorage("rosevelleCart", cart);
      updateCartCount();

      const originalText = button.textContent;
      button.textContent = "Added to Bag ✓";
      button.disabled = true;

      setTimeout(function () {
        button.textContent = originalText;
        button.disabled = false;
      }, 1200);
    });
  });

  updateCartCount();

  // ---------- WISHLIST ----------
  let wishlist = readStorage("rosevelleWishlist", []);

  if (!Array.isArray(wishlist)) {
    wishlist = [];
  }

  document.querySelectorAll(".wishlist-btn").forEach(function (button) {
    const productCard = button.closest(".product-card");
    const productId = button.dataset.productId ||
      (productCard && productCard.querySelector(".add-to-cart")
        ? productCard.querySelector(".add-to-cart").dataset.productId
        : null);

    if (!productId) {
      return;
    }

    const icon = button.querySelector("i");

    function updateWishlistButton() {
      const isSaved = wishlist.includes(productId);

      if (icon) {
        icon.classList.toggle("fa-solid", isSaved);
        icon.classList.toggle("fa-regular", !isSaved);
      }

      button.setAttribute(
        "aria-label",
        isSaved ? "Remove from wishlist" : "Add to wishlist"
      );

      button.setAttribute("aria-pressed", String(isSaved));
    }

    updateWishlistButton();

    button.addEventListener("click", function () {
      if (wishlist.includes(productId)) {
        wishlist = wishlist.filter(function (id) {
          return id !== productId;
        });
      } else {
        wishlist.push(productId);
      }

      saveStorage("rosevelleWishlist", wishlist);
      updateWishlistButton();
    });
  });

  // ---------- NEWSLETTER ----------
  const newsletterForm = document.getElementById("newsletterForm");
  const newsletterEmail = document.getElementById("newsletterEmail");
  const newsletterMessage = document.getElementById("newsletterMessage");

  if (newsletterForm && newsletterEmail && newsletterMessage) {
    newsletterForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const email = newsletterEmail.value.trim();

      if (!email || !newsletterEmail.checkValidity()) {
        newsletterMessage.textContent =
          "Please enter a valid email address.";
        newsletterEmail.focus();
        return;
      }

      newsletterMessage.textContent =
        "Thank you for your interest in Rosévelle! Newsletter signup is a demo until a backend is connected.";

      newsletterForm.reset();
    });
  }

  // ---------- CURRENT YEAR ----------
  const yearElement = document.getElementById("currentYear");

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
});
