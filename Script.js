// Simple "database" using localStorage
let items = JSON.parse(localStorage.getItem('items')) || [];

// Display items on home page
function displayItems() {
    const container = document.getElementById('items-container');
    if (container) {
        container.innerHTML = '';

        items.forEach((item, index) => {
            const itemCard = document.createElement('div');
            itemCard.className = 'item-card';
            itemCard.innerHTML = `
                <img src="${item.image}" class="item-image" alt="${item.name}">
                <div class="item-details">
                    <h3>${item.name}</h3>
                    <p>Price: ₹${item.price}</p>
                    ${item.sold ? '<div class="sold-badge">Sold</div>' : ''}
                    <a href="https://t.me/${item.telegram}" class="contact-btn" target="_blank">
                        Contact Owner
                    </a>
                </div>
            `;
            container.appendChild(itemCard);
        });
    }
}

// Display items for admin
function displayAdminItems() {
    const container = document.getElementById('admin-items-container');
    if (container) {
        container.innerHTML = '';

        items.forEach((item, index) => {
            const adminItemCard = document.createElement('div');
            adminItemCard.className = 'admin-item-card';
            adminItemCard.innerHTML = `
                <img src="${item.image}" class="item-image" alt="${item.name}">
                ${item.sold ? '<div class="sold-badge">Sold</div>' : ''}
                <div class="item-details">
                    <h3>${item.name}</h3>
                    <p>Price: $${item.price}</p>
                    <div class="item-actions">
                        <button class="edit-btn" onclick="editItem(${index})">Edit</button>
                        <button class="delete-btn" onclick="deleteItem(${index})">Delete</button>
                       
                    </div>
                </div>
            `;
            container.appendChild(adminItemCard);
        });
    }
}

// Handle admin form submission
const itemForm = document.getElementById('item-form');
if (itemForm) {
    itemForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const itemName = document.getElementById('item-name').value;
        const itemPrice = document.getElementById('item-price').value;
        const itemTelegram = document.getElementById('item-telegram').value;
        const itemImage = document.getElementById('item-image').files[0];

        if (itemImage) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const newItem = {
                    name: itemName,
                    price: itemPrice,
                    image: e.target.result,
                    telegram: itemTelegram,
                    sold: false
                };

                items.push(newItem);
                localStorage.setItem('items', JSON.stringify(items));

                // Clear form
                itemForm.reset();
                alert('Item added successfully!');
                displayAdminItems();
            };
            reader.readAsDataURL(itemImage);
        }
    });
}

// Edit Item
function editItem(index) {
    const item = items[index];
    const newName = prompt('Enter new name:', item.name);
    const newPrice = prompt('Enter new price:', item.price);
    const newTelegram = prompt('Enter new Telegram username:', item.telegram);

    if (newName && newPrice && newTelegram) {
        items[index] = {
            ...item,
            name: newName,
            price: newPrice,
            telegram: newTelegram
        };
        localStorage.setItem('items', JSON.stringify(items));
        displayAdminItems();
        displayItems();
    }
}

// Delete Item
function deleteItem(index) {
    if (confirm('Are you sure you want to delete this item?')) {
        items.splice(index, 1);
        localStorage.setItem('items', JSON.stringify(items));
        displayAdminItems();
        displayItems();
    }
}

// Mark as Sold
function markAsSold(index) {
    items[index].sold = !items[index].sold;
    localStorage.setItem('items', JSON.stringify(items));
    displayAdminItems();
    displayItems();
}

document.addEventListener("DOMContentLoaded", function () {
    const ADMIN_PASSWORD = "villainx123"; // Set your admin password here
    const loginForm = document.getElementById("admin-login-form");
    const adminPanel = document.getElementById("admin-panel");
    const itemsContainer = document.getElementById("admin-items-container");
    const loginContainer = document.getElementById("admin-login-container");
    const logoutBtn = document.getElementById("logout-btn");

    // Check if the user is already logged in
    if (localStorage.getItem("isAdmin") === "true") {
        showAdminPanel();
    }

    // Admin Login Event
    if (loginForm) {
        loginForm.addEventListener("submit", function (event) {
            event.preventDefault();
            const enteredPassword = document.getElementById("admin-password").value;

            if (enteredPassword === ADMIN_PASSWORD) {
                localStorage.setItem("isAdmin", "true");
                showAdminPanel();
            } else {
                alert("Incorrect Password! Access Denied.");
            }
        });
    }

    // Logout Event
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function () {
            localStorage.removeItem("isAdmin");
            location.reload();
        });
    }

    // Hide Admin Button If Not Logged In
    const adminLink = document.getElementById("admin-link");
    if (localStorage.getItem("isAdmin") !== "true") {
        adminLink.style.display = "none";
    } else {
        logoutBtn.style.display = "block";
    }

    function showAdminPanel() {
        loginContainer.style.display = "none";
        adminPanel.style.display = "block";
        itemsContainer.style.display = "block";
        logoutBtn.style.display = "block";
    }
});

// Initial display of items
displayItems();
displayAdminItems();