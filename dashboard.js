// Data storage (using in-memory for Claude.ai compatibility)

let transactions = [];
let settings = {
  expenseCap: 1000,
  eurRate: 1.1,
  rwfRate: 0.00079,
  currentCurrency: "USD",
};
let currentSort = { field: null, direction: "asc" };
let editingId = null;
let deletingId = null;
let recordCounter = 1;

// Regex patterns
const descriptionRegex = /^\S(?:.*\S)?$/;
const duplicateWordRegex = /\b(\w+)\s+\1\b/i;
const amountRegex = /^(0|[1-9]\d*)(\.\d{1,2})?$/;
const dateRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
const categoryRegex = /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/;

// Initialize
loadFromStorage();
setTodayDate();
updateUI();

function deleteTransaction(id) {
  deletingId = id;
  const transaction = transactions.find((t) => t.id === id);
  const modal = document.getElementById("deleteModal");

  if (transaction) {
    // Update modal text to show which transaction will be deleted
    modal.querySelector("p").textContent = `Are you sure you want to delete "${
      transaction.description
    }" (${formatCurrency(transaction.amount)})?`;
  }

  modal.classList.add("show");
}

function closeDelete() {
  deletingId = null;
  const modal = document.getElementById("deleteModal");
  modal.classList.remove("show");
  // Reset modal text
  modal.querySelector("p").textContent =
    "Are you sure you want to delete this transaction?";
}

function confirmDelete() {
  if (!deletingId) {
    closeDelete();
    return;
  }

  const index = transactions.findIndex((t) => t.id === deletingId);

  if (index !== -1) {
    const deleted = transactions[index];
    console.log("Deleting transaction:", deleted);

    transactions.splice(index, 1);
    console.log("Remaining transactions:", transactions.length);

    saveToStorage();
    updateUI();
  } else {
    console.error("Transaction not found:", deletingId);
  }

  closeDelete();
}

function setTodayDate() {
  const today = new Date().toISOString().split("T")[0];
  document.getElementById("date").value = today;
}

function loadFromStorage() {
  // Note: localStorage would be used in a real environment
  // For Claude.ai, we use in-memory storage
  const stored = localStorage.getItem("financeData");
  if (stored) {
    try {
      const data = JSON.parse(stored);
      if (validateImportData(data)) {
        transactions = data.transactions || [];
        settings = { ...settings, ...data.settings };
        recordCounter = data.recordCounter || 1;
      }
    } catch (e) {
      console.error("Failed to load data:", e);
    }
  }
}

// Edit Transaction Functions
function editTransaction(id) {
  const transaction = transactions.find((t) => t.id === id);
  if (!transaction) return;

  editingId = id;
  document.getElementById("editDescription").value = transaction.description;
  document.getElementById("editAmount").value = transaction.amount;
  document.getElementById("editCategory").value = transaction.category;
  document.getElementById("editDate").value = transaction.date;
  document.getElementById("editType").value = transaction.type;

  document.getElementById("editModal").classList.add("show");
}

function closeEdit() {
  editingId = null;
  document.getElementById("editModal").classList.remove("show");
  document.getElementById("editForm").reset();
}

// Edit Form Submit Handler
document.getElementById("editForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const description = document.getElementById("editDescription").value;
  const amount = document.getElementById("editAmount").value;
  const category = document.getElementById("editCategory").value;
  const date = document.getElementById("editDate").value;
  const type = document.getElementById("editType").value;

  // Validate all fields
  let isValid = true;
  let errors = [];

  if (!validateDescription(description)) {
    errors.push("Invalid description format");
    isValid = false;
  }

  if (!validateAmount(amount)) {
    errors.push("Invalid amount format");
    isValid = false;
  }

  if (!validateCategory(category)) {
    errors.push("Invalid category format");
    isValid = false;
  }

  if (!validateDate(date)) {
    errors.push("Invalid date format (use YYYY-MM-DD)");
    isValid = false;
  }

  if (!isValid) {
    alert("Please fix the following errors:\n" + errors.join("\n"));
    return;
  }

  // Find and update the transaction
  const index = transactions.findIndex((t) => t.id === editingId);
  if (index === -1) {
    alert("Transaction not found");
    closeEdit();
    return;
  }

  console.log("Updating transaction:", editingId);

  transactions[index] = {
    ...transactions[index],
    description: description.trim(),
    amount: parseFloat(amount),
    category: category.trim(),
    date: date,
    type: type,
    updatedAt: new Date().toISOString(),
  };

  console.log("Updated transaction:", transactions[index]);

  saveToStorage();
  updateUI();
  closeEdit();
});

// Optional: Close modal when clicking outside
document.getElementById("editModal").addEventListener("click", function (e) {
  if (e.target === this) {
    closeEdit();
  }
});

function saveToStorage() {
  const data = {
    transactions,
    settings,
    recordCounter,
  };
  localStorage.setItem("financeData", JSON.stringify(data));
}

function validateImportData(data) {
  if (!data || typeof data !== "object") return false;
  if (!Array.isArray(data.transactions)) return false;

  for (const t of data.transactions) {
    if (!t.id || !t.description || t.amount === undefined || !t.date) {
      return false;
    }
  }
  return true;
}

const form = document.getElementById("transactionForm");
const descInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const categoryInput = document.getElementById("category");
const dateInput = document.getElementById("date");

function validateDescription(value) {
  const trimmed = value.trim();
  return descriptionRegex.test(trimmed) && !duplicateWordRegex.test(trimmed);
}

function validateAmount(value) {
  return amountRegex.test(value);
}

function validateDate(value) {
  return dateRegex.test(value);
}

function validateCategory(value) {
  return categoryRegex.test(value.trim());
}

function showError(input, errorEl) {
  input.classList.add("error");
  errorEl.classList.add("show");
}

function hideError(input, errorEl) {
  input.classList.remove("error");
  errorEl.classList.remove("show");
}

descInput.addEventListener("blur", function () {
  const errorEl = document.getElementById("descError");
  if (!validateDescription(this.value)) {
    showError(this, errorEl);
  } else {
    hideError(this, errorEl);
  }
});

amountInput.addEventListener("blur", function () {
  const errorEl = document.getElementById("amountError");
  if (!validateAmount(this.value)) {
    showError(this, errorEl);
  } else {
    hideError(this, errorEl);
  }
});

categoryInput.addEventListener("blur", function () {
  const errorEl = document.getElementById("categoryError");
  if (!validateCategory(this.value)) {
    showError(this, errorEl);
  } else {
    hideError(this, errorEl);
  }
});

dateInput.addEventListener("blur", function () {
  const errorEl = document.getElementById("dateError");
  if (!validateDate(this.value)) {
    showError(this, errorEl);
  } else {
    hideError(this, errorEl);
  }
});

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const description = descInput.value;
  const amount = amountInput.value;
  const category = categoryInput.value;
  const date = dateInput.value;
  const type = document.getElementById("type").value;

  let isValid = true;

  if (!validateDescription(description)) {
    showError(descInput, document.getElementById("descError"));
    isValid = false;
  }

  if (!validateAmount(amount)) {
    showError(amountInput, document.getElementById("amountError"));
    isValid = false;
  }

  if (!validateCategory(category)) {
    showError(categoryInput, document.getElementById("categoryError"));
    isValid = false;
  }

  if (!validateDate(date)) {
    showError(dateInput, document.getElementById("dateError"));
    isValid = false;
  }

  if (!isValid) return;

  const now = new Date().toISOString();
  const transaction = {
    id: `rec_${String(recordCounter++).padStart(4, "0")}`,
    description: description.trim(),
    amount: parseFloat(amount),
    category: category.trim(),
    date: date,
    type: type,
    createdAt: now,
    updatedAt: now,
  };

  transactions.unshift(transaction);
  saveToStorage();
  updateUI();
  form.reset();
  setTodayDate();
});

function formatCurrency(amount) {
  const curr = settings.currentCurrency;
  let value = amount;
  let symbol = "$";

  if (curr === "EUR") {
    value = amount * settings.eurRate;
    symbol = "€";
  } else if (curr === "RWF") {
    value = amount / settings.rwfRate;
    symbol = "FRw";
  }

  return `${symbol}${value.toFixed(2)}`;
}

function changeCurrency(currency) {
  settings.currentCurrency = currency;
  document.querySelectorAll(".currency-btn").forEach((btn) => {
    btn.classList.remove("active");
  });
  event.target.classList.add("active");
  saveToStorage();
  updateUI();
}

function updateUI() {
  // Calculate stats
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  const expenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
  const balance = income - expenses;

  document.getElementById("totalIncome").textContent = formatCurrency(income);
  document.getElementById("totalExpenses").textContent =
    formatCurrency(expenses);
  document.getElementById("balance").textContent = formatCurrency(balance);
  document.getElementById("totalRecords").textContent = transactions.length;

  // Top category
  const categoryCount = {};
  transactions.forEach((t) => {
    categoryCount[t.category] = (categoryCount[t.category] || 0) + 1;
  });
  const topCat = Object.keys(categoryCount).reduce(
    (a, b) => (categoryCount[a] > categoryCount[b] ? a : b),
    "-"
  );
  document.getElementById("topCategory").textContent = topCat;

  // Cap status
  const capStatus = document.getElementById("capStatus");
  const remaining = settings.expenseCap - expenses;
  if (expenses > settings.expenseCap) {
    capStatus.className = "cap-status exceeded";
    capStatus.setAttribute("aria-live", "assertive");
    capStatus.textContent = `⚠️ Over budget by ${formatCurrency(
      Math.abs(remaining)
    )}`;
  } else {
    capStatus.className = "cap-status";
    capStatus.setAttribute("aria-live", "polite");
    capStatus.textContent = `✓ ${formatCurrency(
      remaining
    )} remaining of ${formatCurrency(settings.expenseCap)} budget`;
  }

  // Last 7 days trend
  const last7Days = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];
    const dayExpenses = transactions
      .filter((t) => t.date === dateStr && t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);
    last7Days.push({ date: dateStr, amount: dayExpenses });
  }

  const maxAmount = Math.max(...last7Days.map((d) => d.amount), 1);
  const chartHTML = last7Days
    .map((d) => {
      const height = (d.amount / maxAmount) * 100;
      return `
                    <div style="flex: 1;">
                        <div class="chart-bar" style="height: ${height}%" title="${formatCurrency(
        d.amount
      )}"></div>
                        <div class="chart-label">${d.date.slice(5)}</div>
                    </div>
                `;
    })
    .join("");
  document.getElementById("trendChart").innerHTML = chartHTML;

  renderTable();
}

function renderTable() {
  const tbody = document.getElementById("transactionsBody");

  if (transactions.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="6" class="empty-state">No transactions yet</td></tr>';
    return;
  }

  let filtered = applySearchFilter([...transactions]);

  if (currentSort.field) {
    filtered.sort((a, b) => {
      let aVal = a[currentSort.field];
      let bVal = b[currentSort.field];

      if (currentSort.field === "amount") {
        aVal = parseFloat(aVal);
        bVal = parseFloat(bVal);
      } else if (
        currentSort.field === "description" ||
        currentSort.field === "category"
      ) {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (currentSort.direction === "asc") {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });
  }

  tbody.innerHTML = filtered
    .map(
      (t) => `
                <tr>
                    <td>${highlightMatch(t.description)}</td>
                    <td>${formatCurrency(t.amount)}</td>
                    <td>${highlightMatch(t.category)}</td>
                    <td>${t.date}</td>
                    <td><span style="color: ${
                      t.type === "income" ? "#34c759" : "#ff3b30"
                    }">${t.type}</span></td>
                    <td class="actions">
                        <button class="btn-small" onclick="editTransaction('${
                          t.id
                        }')">Edit</button>
                        <button class="btn-small btn-delete" onclick="deleteTransaction('${
                          t.id
                        }')">Delete</button>
                    </td>
                </tr>
            `
    )
    .join("");
}

function sortTable(field) {
  if (currentSort.field === field) {
    currentSort.direction = currentSort.direction === "asc" ? "desc" : "asc";
  } else {
    currentSort.field = field;
    currentSort.direction = "asc";
  }

  document.querySelectorAll("th").forEach((th) => {
    th.classList.remove("sort-asc", "sort-desc");
  });

  const th = event.target;
  th.classList.add(`sort-${currentSort.direction}`);

  renderTable();
}

function applySearch() {
  renderTable();
}

function applySearchFilter(data) {
  const pattern = document.getElementById("searchPattern").value;
  if (!pattern) return data;

  try {
    const flags = document.getElementById("caseInsensitive").checked
      ? "gi"
      : "g";
    const regex = new RegExp(pattern, flags);
    return data.filter(
      (t) => regex.test(t.description) || regex.test(t.category)
    );
  } catch (e) {
    return data;
  }
}

function highlightMatch(text) {
  const pattern = document.getElementById("searchPattern").value;
  if (!pattern) return text;

  try {
    const flags = document.getElementById("caseInsensitive").checked
      ? "gi"
      : "g";
    const regex = new RegExp(pattern, flags);
    return text.replace(regex, (match) => `<mark>${match}</mark>`);
  } catch (e) {
    return text;
  }
}

function editTransaction(id) {
  const transaction = transactions.find((t) => t.id === id);
  if (!transaction) return;
}
