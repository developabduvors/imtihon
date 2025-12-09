const booksContainer = document.querySelector("#books");
const cartList = document.getElementById("cart-list");
const form = document.getElementById("form");
const input = document.getElementById("input");
const sortSelect = document.getElementById("sort");

let allBooks = [];
let cart = [];

// Fetch books from API
async function fetchBooks() {
  try {
    const res = await fetch("http://localhost:3002/books");
    allBooks = await res.json();
    renderBooks(allBooks);
  } catch (err) {
    console.error("Xatolik:", err);
  }
}

// Render books
function renderBooks(bookArray) {
  booksContainer.innerHTML = "";
  bookArray.forEach((book, index) => {
    const li = document.createElement("li");
    li.className = "bg-white shadow-md rounded-lg p-4 w-60 flex flex-col items-center";

    li.innerHTML = `
      <img class="w-40 h-56 object-cover rounded mb-2" src="${book.imageLink || ''}" alt="${book.title}">
      <h3 class="font-semibold text-lg text-center mb-1">${book.title || "Noma'lum"}</h3>
      <p class="text-gray-500 text-sm mb-1">Til: ${book.language || "Noma'lum"}</p>
      <p class="text-gray-500 text-sm">Yil: ${book.year || "Noma'lum"}</p>
      <button class="btn btn-primary mt-2">Sotib olish</button>
    `;

    li.querySelector("button").addEventListener("click", () => {
      cart.push(book);
      updateCart();
    });

    booksContainer.appendChild(li);
  });
}

// Update Drawer / Cart
function updateCart() {
  cartList.innerHTML = "";
  cart.forEach((book, index) => {
    const li = document.createElement("li");
    li.className = "flex justify-between items-center bg-white rounded p-2";
    li.innerHTML = `
      <span>${book.title}</span>
            <img class="w-40 h-56 object-cover rounded mb-2" src="${book.imageLink || ''}" alt="${book.title}">
      <button class="btn btn-sm btn-error">❌</button>
    `;
    li.querySelector("button").addEventListener("click", () => {
      cart.splice(index, 1);
      updateCart();
    });
    cartList.appendChild(li);
  });
}

// Filter & Sort
function filterAndSortBooks() {
  const searchTerm = input.value.toLowerCase();
  let filteredBooks = allBooks.filter(book => book.title.toLowerCase().includes(searchTerm));

  if (sortSelect.value === "A-Z") {
    filteredBooks.sort((a, b) => a.title.localeCompare(b.title));
  } else {
    filteredBooks.sort((a, b) => b.title.localeCompare(a.title));
  }

  renderBooks(filteredBooks);
}

// Event listeners
form.addEventListener("submit", (e) => {
  e.preventDefault();
  filterAndSortBooks();
});

input.addEventListener("input", filterAndSortBooks);
sortSelect.addEventListener("change", filterAndSortBooks);

// Initial fetch
fetchBooks();

