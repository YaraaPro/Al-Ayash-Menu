document.addEventListener('DOMContentLoaded', () => {

  /* -------------------- TABS -------------------- */
  const tabs = document.querySelectorAll('.tab');
  const cards = document.querySelectorAll('.card');
  const heroImg = document.querySelector('.category-hero img');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const category = tab.dataset.category;
      cards.forEach(card => {
        card.style.display =
          category === 'all' || card.dataset.category === category
            ? 'block'
            : 'none';
      });

     if (tab.dataset.hero) {
  heroImg.classList.add('fade-out');

  setTimeout(() => {
    heroImg.src = tab.dataset.hero;
    heroImg.alt = tab.dataset.alt || '';
    heroImg.classList.remove('fade-out');
  }, 300);
}

    });
  });

  /* 🔥 Force initial tab state (fixes All category image on load) */
  const activeTab = document.querySelector('.tab.active') || tabs[0];
  if (activeTab) activeTab.click();


  /* -------------------- CART LOGIC -------------------- */
  const cart = {};

  const cartCountEl = document.getElementById('cartCount');
  const cartTotalEl = document.getElementById('cartTotal');
  const checkoutBtn = document.getElementById('checkoutBtn');

  /* Overlay elements */
  const cartOverlay = document.querySelector('.cart-overlay');
  const cartItemsContainer = document.querySelector('.cart-items');
  const cartCloseBtn = document.querySelector('.cart-close');
  const cartCheckoutBtn = document.querySelector('.cart-checkout');
  const cartOverlayTotalEl = document.querySelector('.cart-total');

  /* -------------------- HELPERS -------------------- */
  function updateCartSummary() {
    let totalItems = 0;
    let totalPrice = 0;

    Object.values(cart).forEach(item => {
      totalItems += item.quantity;
      totalPrice += item.price * item.quantity;
    });

    if (cartCountEl) cartCountEl.textContent = totalItems;
    if (cartTotalEl) cartTotalEl.textContent = totalPrice.toLocaleString();
  }

  function updateCartOverlayTotal() {
    const total = Object.values(cart)
      .reduce((sum, i) => sum + i.price * i.quantity, 0);

    if (cartOverlayTotalEl) {
      cartOverlayTotalEl.textContent =
        `المجموع الحالي: ${total.toLocaleString()} د.ع`;
    }
  }

  function renderCartItems() {
    if (!cartItemsContainer) return;

    cartItemsContainer.innerHTML = '';

    Object.values(cart).forEach(item => {
      const itemEl = document.createElement('div');
      itemEl.className = 'cart-item';

      itemEl.innerHTML = `
        <img src="${item.image}" alt="${item.title}">
        <div class="cart-item-info">
          <div class="cart-item-title">${item.title}</div>
          <div class="cart-item-price">${item.price.toLocaleString()} د.ع</div>
          <div class="cart-item-qty">
            <button class="qty-minus">-</button>
            <span class="qty-value">${item.quantity}</span>
            <button class="qty-plus">+</button>
          </div>
        </div>
      `;

      const minusBtn = itemEl.querySelector('.qty-minus');
      const plusBtn = itemEl.querySelector('.qty-plus');
      const qtyValue = itemEl.querySelector('.qty-value');

      minusBtn.addEventListener('click', () => {
        if (item.quantity > 1) {
          item.quantity--;
          qtyValue.textContent = item.quantity;
        } else {
          delete cart[item.id];
          itemEl.remove();
        }
        updateCartOverlayTotal();
        updateCartSummary();
      });

      plusBtn.addEventListener('click', () => {
        item.quantity++;
        qtyValue.textContent = item.quantity;
        updateCartOverlayTotal();
        updateCartSummary();
      });

      cartItemsContainer.appendChild(itemEl);
    });

    updateCartOverlayTotal();
  }

  function openCartOverlay() {
    if (!cartOverlay) return;
    cartOverlay.classList.add('active');
    renderCartItems();
  }

  function closeCartOverlay() {
    if (!cartOverlay) return;
    cartOverlay.classList.remove('active');
  }

  /* -------------------- EVENTS -------------------- */
  if (cartCloseBtn) cartCloseBtn.addEventListener('click', closeCartOverlay);
  if (checkoutBtn) checkoutBtn.addEventListener('click', openCartOverlay);

  document.querySelectorAll('.card').forEach(card => {
    const plusBtn = card.querySelector('.qty-plus');
    const minusBtn = card.querySelector('.qty-minus');
    const qtyValue = card.querySelector('.qty-value');
    const addBtn = card.querySelector('.add-btn');

    const basePrice = Number(card.dataset.price);
    const id = card.dataset.id;
    const title = card.dataset.title;
    const image = card.querySelector('img')?.src || '';

    let quantity = Number(qtyValue.textContent) || 1;

    plusBtn.addEventListener('click', () => {
      quantity++;
      qtyValue.textContent = quantity;
    });

    minusBtn.addEventListener('click', () => {
      if (quantity > 0) {
        quantity--;
        qtyValue.textContent = quantity;
      }
    });

    addBtn.addEventListener('click', () => {
      if (quantity === 0) {
        delete cart[id];
      } else {
        cart[id] = { id, title, price: basePrice, image, quantity };
      }
      updateCartSummary();
    });
  });

  /* -------------------- WHATSAPP CHECKOUT -------------------- */
  if (cartCheckoutBtn) {
  cartCheckoutBtn.addEventListener('click', () => {
    if (Object.keys(cart).length === 0) {
      alert('سلة التسوق فارغة!');
      return;
    }

    let message = 'ملخص الطلب:\n\n';

    Object.values(cart).forEach(item => {
      message += `${item.title} × ${item.quantity} = ${(item.price * item.quantity).toLocaleString()} د.ع\n`;
    });

    const total = Object.values(cart)
      .reduce((sum, i) => sum + i.price * i.quantity, 0);

    message += `\nالمجموع الحالي: ${total.toLocaleString()} د.ع\n\n`;
    message += 'يرجى كتابة عنوانك هنا:';

    const encodedMessage = encodeURIComponent(message);
    const whatsappNumber = '9647750505595';

    // Open WhatsApp
    window.open(
      `https://wa.me/${whatsappNumber}?text=${encodedMessage}`,
      '_blank'
    );

    /* 🔥 CLEAR CART AFTER CHECKOUT */
    Object.keys(cart).forEach(key => delete cart[key]);

    updateCartSummary();
    renderCartItems();
    closeCartOverlay();
  });
}
  const locationBtn = document.getElementById('openLocation');
  const locationOverlay = document.getElementById('locationOverlay');
  const locationClose = document.querySelector('.location-close');

  if (locationBtn) {
    locationBtn.addEventListener('click', e => {
      e.preventDefault();
      locationOverlay.classList.add('active');
    });
  }

  if (locationClose) {
    locationClose.addEventListener('click', () => {
      locationOverlay.classList.remove('active');
    });
  }

  locationOverlay?.addEventListener('click', e => {
    if (e.target === locationOverlay) {
      locationOverlay.classList.remove('active');
    }
  });

});