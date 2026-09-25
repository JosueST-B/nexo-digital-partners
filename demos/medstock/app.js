function escapeHtml(value){return String(value ?? "").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;", "'":"&#39;"}[c]));}
const STORAGE_KEY = "nexo-demo-medstock-v1";
const TAX_RATE = 0.12;

function uid() {
  if (window.crypto?.randomUUID) return window.crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

const seedData = {
  products: [
    {
      id: uid(),
      name: "Guantes nitrilo talla M",
      category: "Descartables",
      lot: "GN-M-2601",
      barcode: "786100000001",
      expiry: "2027-02-15",
      stock: 120,
      minStock: 30,
      maxStock: 180,
      cost: 3.8,
      price: 5.5,
      provider: "Suministros Andinos",
      location: "Bodega A"
    },
    {
      id: uid(),
      name: "Mascarilla quirurgica caja x50",
      category: "Bioseguridad",
      lot: "MQ-5019",
      barcode: "786100000002",
      expiry: "2026-08-10",
      stock: 18,
      minStock: 25,
      maxStock: 100,
      cost: 2.2,
      price: 3.75,
      provider: "MedGlobal",
      location: "Vitrina"
    },
    {
      id: uid(),
      name: "Gasas esteriles 10x10",
      category: "Curacion",
      lot: "GE-7782",
      barcode: "786100000003",
      expiry: "2026-07-05",
      stock: 42,
      minStock: 20,
      maxStock: 120,
      cost: 0.12,
      price: 0.25,
      provider: "Clinimed",
      location: "Bodega B"
    }
  ],
  sales: []
};

let state = loadState();
let cart = [];

const titles = {
  dashboard: "Panel principal",
  products: "Productos e inventario",
  sales: "Nueva venta",
  history: "Historial de ventas"
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

function loadState() {
  const saved = sessionStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : seedData;
}

function saveState() {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function money(value) {
  return new Intl.NumberFormat("es-EC", {
    style: "currency",
    currency: "USD"
  }).format(value || 0);
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function daysUntil(dateString) {
  const today = new Date(todayISO());
  const expiry = new Date(dateString);
  return Math.ceil((expiry - today) / 86400000);
}

function getProductStatus(product) {
  const days = daysUntil(product.expiry);
  if (product.stock <= 0 || days < 0) return { label: "Critico", className: "danger" };
  if (product.stock <= product.minStock || days <= 45) return { label: "Revisar", className: "warning" };
  return { label: "OK", className: "ok" };
}

function reorderUnits(product) {
  if (product.stock > product.minStock) return 0;
  const target = product.maxStock || product.minStock * 2;
  return Math.max(target - product.stock, 0);
}

function renderEmpty(tbody, colspan = 9) {
  tbody.innerHTML = `<tr><td colspan="${colspan}" class="empty-state">Todavia no hay datos para mostrar.</td></tr>`;
}

function switchView(view) {
  $$(".nav-button").forEach((button) => button.classList.toggle("active", button.dataset.view === view));
  $$(".view").forEach((section) => section.classList.remove("active"));
  $(`#${view}-view`).classList.add("active");
  $("#view-title").textContent = titles[view];
  renderAll();
}

function renderDashboard() {
  const lowStock = state.products.filter((product) => product.stock <= product.minStock).length;
  const expiring = state.products.filter((product) => daysUntil(product.expiry) <= 45).length;
  const inventoryValue = state.products.reduce((sum, product) => sum + product.stock * product.cost, 0);
  const riskValue = state.products
    .filter((product) => daysUntil(product.expiry) <= 45)
    .reduce((sum, product) => sum + product.stock * product.cost, 0);
  const todaySales = state.sales
    .filter((sale) => sale.date.slice(0, 10) === todayISO())
    .reduce((sum, sale) => sum + sale.total, 0);

  $("#stat-products").textContent = state.products.length;
  $("#stat-low-stock").textContent = lowStock;
  $("#stat-expiring").textContent = expiring;
  $("#stat-day-sales").textContent = money(todaySales);
  $("#stat-inventory-value").textContent = money(inventoryValue);
  $("#stat-risk-value").textContent = money(riskValue);

  const alerts = state.products
    .filter((product) => product.stock <= product.minStock || daysUntil(product.expiry) <= 45)
    .sort((a, b) => daysUntil(a.expiry) - daysUntil(b.expiry));
  const alertsTable = $("#alerts-table");

  if (!alerts.length) {
    renderEmpty(alertsTable, 5);
  } else {
    alertsTable.innerHTML = alerts
      .map((product) => {
        const status = getProductStatus(product);
        return `
          <tr>
            <td>${escapeHtml(product.name)}</td>
            <td>${escapeHtml(product.lot)}</td>
            <td>${product.stock}</td>
            <td>${escapeHtml(product.expiry)}</td>
            <td><span class="status ${status.className}">${status.label}</span></td>
          </tr>
        `;
      })
      .join("");
  }

  const recent = state.sales.slice(-5).reverse();
  $("#recent-sales").innerHTML = recent.length
    ? recent
        .map(
          (sale) => `
            <article class="sale-card">
              <div>
                <strong>${escapeHtml(sale.customer || "Consumidor final")}</strong>
                <span>${new Date(sale.date).toLocaleString("es-EC")} | ${sale.items.length} items</span>
              </div>
              <strong>${money(sale.total)}</strong>
            </article>
          `
        )
        .join("")
    : '<p class="empty-state">Todavia no hay ventas registradas.</p>';
}

function renderProducts() {
  const query = $("#product-search").value.trim().toLowerCase();
  const products = state.products.filter((product) => {
    const text = `${escapeHtml(product.name)} ${escapeHtml(product.lot)} ${product.barcode || ""} ${product.provider} ${escapeHtml(product.category)} ${product.location || ""}`.toLowerCase();
    return text.includes(query);
  });
  const tbody = $("#products-table");

  if (!products.length) {
    renderEmpty(tbody);
    return;
  }

  tbody.innerHTML = products
    .map((product) => {
      const status = getProductStatus(product);
      return `
        <tr>
          <td>
            <strong>${escapeHtml(product.name)}</strong><br>
            <span class="muted">${escapeHtml(product.provider || "Sin proveedor")} | ${escapeHtml(product.barcode || "Sin codigo")}</span>
          </td>
          <td>${escapeHtml(product.category)}</td>
          <td>${escapeHtml(product.lot)}</td>
          <td>${product.location || "Sin ubicacion"}</td>
          <td>${product.stock} / min. ${product.minStock}</td>
          <td>${escapeHtml(product.expiry)}<br><span class="status ${status.className}">${status.label}</span></td>
          <td>${money(product.price)}</td>
          <td>${reorderUnits(product) ? `${reorderUnits(product)} und.` : "No"}</td>
          <td>
            <div class="row-actions">
              <button class="icon-button" onclick="editProduct('${product.id}')">Editar</button>
              <button class="icon-button danger" onclick="deleteProduct('${product.id}')">Eliminar</button>
            </div>
          </td>
        </tr>
      `;
    })
    .join("");
}

function renderSaleProductOptions() {
  const available = state.products.filter((product) => product.stock > 0 && daysUntil(product.expiry) >= 0);
  $("#sale-product").innerHTML = available.length
    ? available
        .map((product) => `<option value="${product.id}">${escapeHtml(product.name)} | Lote ${escapeHtml(product.lot)} | Stock ${product.stock}</option>`)
        .join("")
    : '<option value="">No hay productos disponibles</option>';
}

function renderCart() {
  const tbody = $("#cart-table");
  if (!cart.length) {
    renderEmpty(tbody, 5);
  } else {
    tbody.innerHTML = cart
      .map(
        (item) => `
          <tr>
            <td>${escapeHtml(item.name)}<br><span class="muted">Lote ${escapeHtml(item.lot)}</span></td>
            <td>${item.quantity}</td>
            <td>${money(item.price)}</td>
            <td>${money(item.price * item.quantity)}</td>
            <td><button class="icon-button danger" onclick="removeCartItem('${item.productId}')">Quitar</button></td>
          </tr>
        `
      )
      .join("");
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * TAX_RATE;
  $("#subtotal").textContent = money(subtotal);
  $("#tax").textContent = money(tax);
  $("#total").textContent = money(subtotal + tax);
}

function renderHistory() {
  const tbody = $("#history-table");
  if (!state.sales.length) {
    renderEmpty(tbody, 5);
    return;
  }

  tbody.innerHTML = state.sales
    .slice()
    .reverse()
    .map(
      (sale) => `
        <tr>
          <td>${new Date(sale.date).toLocaleString("es-EC")}</td>
          <td>${escapeHtml(sale.customer || "Consumidor final")}</td>
          <td>${sale.items.length}</td>
          <td>${money(sale.total)}</td>
          <td><button class="icon-button" onclick="printReceipt('${sale.id}')">Imprimir</button></td>
        </tr>
      `
    )
    .join("");
}

function renderAll() {
  renderDashboard();
  renderProducts();
  renderSaleProductOptions();
  renderCart();
  renderHistory();
}

function resetProductForm() {
  $("#product-form").reset();
  $("#product-id").value = "";
  $("#product-expiry").value = todayISO();
}

function handleProductSubmit(event) {
  event.preventDefault();
  const product = {
    id: $("#product-id").value || uid(),
    name: $("#product-name").value.trim(),
    category: $("#product-category").value,
    lot: $("#product-lot").value.trim(),
    barcode: $("#product-barcode").value.trim(),
    expiry: $("#product-expiry").value,
    stock: Number($("#product-stock").value),
    minStock: Number($("#product-min-stock").value),
    maxStock: Number($("#product-max-stock").value),
    cost: Number($("#product-cost").value),
    price: Number($("#product-price").value),
    provider: $("#product-provider").value.trim(),
    location: $("#product-location").value.trim()
  };

  const existingIndex = state.products.findIndex((item) => item.id === product.id);
  if (existingIndex >= 0) {
    state.products[existingIndex] = product;
  } else {
    state.products.push(product);
  }

  saveState();
  resetProductForm();
  renderAll();
}

function editProduct(id) {
  const product = state.products.find((item) => item.id === id);
  if (!product) return;
  $("#product-id").value = product.id;
  $("#product-name").value = product.name;
  $("#product-category").value = product.category;
  $("#product-lot").value = product.lot;
  $("#product-barcode").value = product.barcode || "";
  $("#product-expiry").value = product.expiry;
  $("#product-stock").value = product.stock;
  $("#product-min-stock").value = product.minStock;
  $("#product-max-stock").value = product.maxStock || product.minStock * 2;
  $("#product-cost").value = product.cost;
  $("#product-price").value = product.price;
  $("#product-provider").value = product.provider;
  $("#product-location").value = product.location || "";
  switchView("products");
}

function deleteProduct(id) {
  const product = state.products.find((item) => item.id === id);
  if (!product || !confirm(`Eliminar ${escapeHtml(product.name)}?`)) return;
  state.products = state.products.filter((item) => item.id !== id);
  cart = cart.filter((item) => item.productId !== id);
  saveState();
  renderAll();
}

function handleAddToCart(event) {
  event.preventDefault();
  const product = state.products.find((item) => item.id === $("#sale-product").value);
  const quantity = Number($("#sale-quantity").value);
  if (!product || quantity <= 0) return;

  const existingQuantity = cart.find((item) => item.productId === product.id)?.quantity || 0;
  if (existingQuantity + quantity > product.stock) {
    alert(`Solo hay ${product.stock} unidades disponibles.`);
    return;
  }

  const existingItem = cart.find((item) => item.productId === product.id);
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({
      productId: product.id,
      name: product.name,
      lot: product.lot,
      quantity,
      price: product.price
    });
  }

  $("#sale-quantity").value = 1;
  renderCart();
}

function removeCartItem(productId) {
  cart = cart.filter((item) => item.productId !== productId);
  renderCart();
}

function finishSale() {
  if (!cart.length) {
    alert("Agrega al menos un producto a la venta.");
    return;
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * TAX_RATE;
  const sale = {
    id: uid(),
    date: new Date().toISOString(),
    customer: $("#customer-name").value.trim(),
    document: $("#customer-document").value.trim(),
    items: cart.map((item) => ({ ...item })),
    subtotal,
    tax,
    total: subtotal + tax
  };

  for (const item of cart) {
    const product = state.products.find((candidate) => candidate.id === item.productId);
    if (product) product.stock -= item.quantity;
  }

  state.sales.push(sale);
  cart = [];
  $("#customer-name").value = "";
  $("#customer-document").value = "";
  saveState();
  renderAll();
  printReceipt(sale.id);
}

function printReceipt(id) {
  const sale = state.sales.find((item) => item.id === id);
  if (!sale) return;
  const rows = sale.items
    .map(
      (item) => `
        <tr>
          <td>${escapeHtml(item.name)}<br>Lote ${escapeHtml(item.lot)}</td>
          <td>${item.quantity}</td>
          <td>${money(item.price)}</td>
          <td>${money(item.price * item.quantity)}</td>
        </tr>
      `
    )
    .join("");

  const popup = window.open("", "_blank", "width=780,height=900");
  popup.document.write(`
    <!doctype html>
    <html lang="es">
      <head>
        <title>Comprobante ${sale.id}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 32px; color: #182331; }
          h1 { margin-bottom: 4px; }
          table { width: 100%; border-collapse: collapse; margin-top: 24px; }
          th, td { border-bottom: 1px solid #d8e0ea; padding: 10px; text-align: left; }
          .totals { margin-top: 20px; margin-left: auto; width: 260px; }
          .totals div { display: flex; justify-content: space-between; padding: 6px 0; }
          .total { border-top: 1px solid #182331; font-weight: 700; font-size: 18px; }
        </style>
      </head>
      <body>
        <h1>MedStock</h1>
        <p>DEMO - Documento ficticio, sin validez comercial</p>
        <p><strong>Fecha:</strong> ${new Date(sale.date).toLocaleString("es-EC")}</p>
        <p><strong>Cliente:</strong> ${escapeHtml(sale.customer || "Consumidor final")}</p>
        <p><strong>Documento:</strong> ${escapeHtml(sale.document || "N/A")}</p>
        <table>
          <thead>
            <tr><th>Producto</th><th>Cantidad</th><th>Precio</th><th>Total</th></tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
        <section class="totals">
          <div><span>Subtotal</span><strong>${money(sale.subtotal)}</strong></div>
          <div><span>IVA 12%</span><strong>${money(sale.tax)}</strong></div>
          <div class="total"><span>Total</span><strong>${money(sale.total)}</strong></div>
        </section>
        <script>window.print();</script>
      </body>
    </html>
  `);
  popup.document.close();
}

function exportData() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `medstock-respaldo-${todayISO()}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

function importData(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const imported = JSON.parse(reader.result);
      if (!Array.isArray(imported.products) || !Array.isArray(imported.sales)) {
        throw new Error("Formato invalido");
      }
      state = imported;
      cart = [];
      saveState();
      renderAll();
      alert("Datos importados correctamente.");
    } catch (error) {
      alert("No se pudo importar el archivo. Verifica que sea un respaldo valido.");
    }
  };
  reader.readAsText(file);
}

$$(".nav-button").forEach((button) => {
  button.addEventListener("click", () => switchView(button.dataset.view));
});

$("#product-form").addEventListener("submit", handleProductSubmit);
$("#product-search").addEventListener("input", renderProducts);
$("#cancel-edit").addEventListener("click", resetProductForm);
$("#sale-item-form").addEventListener("submit", handleAddToCart);
$("#finish-sale").addEventListener("click", finishSale);
$("#clear-cart").addEventListener("click", () => {
  cart = [];
  renderCart();
});
$("#export-data").addEventListener("click", exportData);
$("#reset-demo").addEventListener("click", () => { sessionStorage.removeItem(STORAGE_KEY); location.reload(); });

resetProductForm();
renderAll();
