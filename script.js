// Replace this placeholder with the restaurant's WhatsApp number in international format.
// Example format: 919876543210 (digits only; do not include +, spaces, or dashes).
const WHATSAPP_NUMBER = "918099101343";

document.getElementById("year").textContent = new Date().getFullYear();

const toggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".main-nav");
toggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  toggle.setAttribute("aria-expanded", String(isOpen));
  toggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
});
nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  nav.classList.remove("open");
  toggle.setAttribute("aria-expanded", "false");
  toggle.setAttribute("aria-label", "Open menu");
}));

const toast = document.querySelector(".toast");
let toastTimer;
document.querySelectorAll(".whatsapp-link").forEach(link => link.addEventListener("click", event => {
  if (/^\d{8,15}$/.test(WHATSAPP_NUMBER)) {
    event.preventDefault();
    const message = encodeURIComponent("Hi! I'd like to know more.");
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank", "noopener,noreferrer");
  } else {
    event.preventDefault();
    toast.textContent = "Demo button: add the restaurant's WhatsApp number in script.js to activate it.";
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 3600);
  }
}));

const menuData = window.restaurantMenuData || [];
const menuSearch = document.getElementById("menu-search");
const menuCategory = document.getElementById("menu-category");
const menuResults = document.getElementById("menu-results");
const menuCount = document.getElementById("menu-count");

menuData.forEach(category => {
  const option = document.createElement("option");
  option.value = category.name;
  option.textContent = category.name;
  menuCategory.append(option);
});

function displayPrice(price) {
  if (price.startsWith("H ")) return price.replace(/H (\d+)/, "H ₹$1").replace(/F (\d+)/, "F ₹$1");
  if (price.includes("/")) return price.split("/").map(value => `₹${value.trim()}`).join(" / ");
  return `₹${price}`;
}

function renderMenu() {
  const query = menuSearch.value.trim().toLocaleLowerCase();
  const selected = menuCategory.value;
  const groups = menuData
    .filter(category => !selected || category.name === selected)
    .map(category => ({
      ...category,
      items: category.items.filter(item => !query || `${item.name} ${category.name}`.toLocaleLowerCase().includes(query))
    }))
    .filter(category => category.items.length);
  const total = groups.reduce((sum, group) => sum + group.items.length, 0);
  menuCount.textContent = `${total} ${total === 1 ? "item" : "items"}`;
  menuResults.replaceChildren();
  if (!total) {
    const empty = document.createElement("p");
    empty.className = "menu-empty";
    empty.textContent = "No dishes match that search. Try another name or choose a different category.";
    menuResults.append(empty);
    return;
  }
  groups.forEach((group, index) => {
    const section = document.createElement("details");
    section.className = "menu-category-block";
    section.open = Boolean(query || selected || index === 0);
    const summary = document.createElement("summary");
    const title = document.createElement("span");
    title.textContent = group.name;
    const count = document.createElement("span");
    count.className = "category-count";
    count.textContent = `${group.items.length} ${group.items.length === 1 ? "dish" : "dishes"}`;
    summary.append(title, count);
    const list = document.createElement("div");
    list.className = "menu-items-grid";
    group.items.forEach(item => {
      const row = document.createElement("div");
      row.className = "menu-item";
      const name = document.createElement("span");
      name.className = "menu-item-name";
      name.textContent = item.name;
      const price = document.createElement("strong");
      price.className = "menu-item-price";
      price.textContent = displayPrice(item.price);
      row.append(name, price);
      list.append(row);
    });
    section.append(summary, list);
    menuResults.append(section);
  });
}

menuSearch.addEventListener("input", renderMenu);
menuCategory.addEventListener("change", renderMenu);
renderMenu();
