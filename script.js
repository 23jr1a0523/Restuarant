
const filterButtons = document.querySelectorAll(".filter");
const foodCards = document.querySelectorAll(".food-card");

const cart = {};

const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const clearCartButton = document.getElementById("clearCart");
const toast = document.getElementById("toast");

let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}

// Filter menu items by category
filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const category = button.dataset.category;

    filterButtons.forEach((item) => {
      item.classList.remove("active");
    });

    button.classList.add("active");

    foodCards.forEach((card) => {
      const matches =
        category === "All" ||
        card.dataset.category === category;

      card.style.display = matches ? "" : "none";
    });
  });
});

// Add food items to cart
document.querySelectorAll(".add-btn").forEach((button) => {
  button.addEventListener("click", () => {
    const name = button.dataset.name;
    const price = Number(button.dataset.price);

    if (!cart[name]) {
      cart[name] = {
        price: price,
        quantity: 0
      };
    }

    cart[name].quantity++;

    updateCart();
    showToast(`${name} added to your cart!`);
  });
});

// Update cart count and price
function updateCart() {
  let totalItems = 0;
  let totalPrice = 0;
  const items = [];

  Object.entries(cart).forEach(([name, item]) => {
    totalItems += item.quantity;
    totalPrice += item.price * item.quantity;

    items.push(
      `${name} × ${item.quantity} — ₹${item.price * item.quantity}`
    );
  });

  cartCount.textContent =
    `${totalItems} ${totalItems === 1 ? "item" : "items"}`;

  cartTotal.textContent =
    `₹${totalPrice.toLocaleString("en-IN")}`;

  cartItems.textContent =
    items.length > 0
      ? items.join(" | ")
      : "No items added yet.";
}

// Clear cart
clearCartButton.addEventListener("click", () => {
  Object.keys(cart).forEach((name) => {
    delete cart[name];
  });

  updateCart();
  showToast("Your cart has been cleared.");
});

// Set the minimum booking date to today
const bookingDate = document.getElementById("bookingDate");

const today = new Date();
const localToday = [
  today.getFullYear(),
  String(today.getMonth() + 1).padStart(2, "0"),
  String(today.getDate()).padStart(2, "0")
].join("-");

bookingDate.min = localToday;
bookingDate.value = localToday;

// Handle reservation form
const reservationForm =
  document.getElementById("reservationForm");

const reservationMessage =
  document.getElementById("reservationMessage");

reservationForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (bookingDate.value < localToday) {
    reservationMessage.textContent =
      "Please select today or a future date.";
    reservationMessage.style.color = "#c62828";
    return;
  }

  const name =
    document.getElementById("customerName").value.trim();

  const time =
    document.getElementById("bookingTime").value;

  const guests =
    document.getElementById("guests").value;

  reservationMessage.textContent =
    `Thank you, ${name}! Your reservation request for ` +
    `${guests} guest(s) at ${time} has been received in this demo.`;

  reservationMessage.style.color = "#237a3b";

  showToast("Reservation form submitted!");

  reservationForm.reset();
  bookingDate.value = localToday;
});

updateCart();
