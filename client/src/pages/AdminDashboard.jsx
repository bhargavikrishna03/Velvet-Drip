import { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const initialForm = {
  name: "",
  description: "",
  price: "",
  category: "Drinks",
  image: "",
  isVeg: true,
  available: true,
  isFeatured: false,
  isBestseller: false,
};

const orderStatuses = [
  "Pending",
  "Confirmed",
  "Preparing",
  "Ready",
  "Delivered",
  "Cancelled",
];

const currency = (amount) =>
  `₹${Number(amount || 0).toLocaleString("en-IN")}`;

function StatCard({ icon, label, value, note, tone = "brown" }) {
  const tones = {
    brown: "bg-[#f4e8dc] text-[#70452f]",
    green: "bg-emerald-50 text-emerald-700",
    orange: "bg-orange-50 text-orange-700",
    blue: "bg-sky-50 text-sky-700",
  };

  return (
    <div className="rounded-2xl border border-[#eee2d6] bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-[#8c7768]">{label}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-[#432c21]">
            {value}
          </p>
          {note && <p className="mt-1 text-xs text-[#9b887b]">{note}</p>}
        </div>
        <span className={`grid h-11 w-11 place-items-center rounded-xl text-xl ${tones[tone]}`}>
          {icon}
        </span>
      </div>
    </div>
  );
}

function SectionHeading({ eyebrow, title, description, action }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow && (
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-[#b47752]">
            {eyebrow}
          </p>
        )}
        <h2 className="text-2xl font-bold text-[#432c21] sm:text-3xl">
          {title}
        </h2>
        {description && (
          <p className="mt-1 text-sm text-[#8c7768]">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}

export default function AdminDashboard() {
  const token = localStorage.getItem("token");

  const [activeTab, setActiveTab] = useState("overview");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Menu state
  const [dishes, setDishes] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [dishSearch, setDishSearch] = useState("");

  // Combo state
  const [combos, setCombos] = useState([]);
  const [comboLoading, setComboLoading] = useState(false);
  const [comboSaving, setComboSaving] = useState(false);
  const [editingComboId, setEditingComboId] = useState(null);
  const [comboForm, setComboForm] = useState({
    name: "",
    description: "",
    image: "",
    dishes: [],
    offerPrice: "",
    active: true,
  });

  // Order state
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  // Shared state
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const loadDishes = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/menu`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to load dishes.");
      setDishes(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadCombos = async () => {
    try {
      setComboLoading(true);
      const response = await fetch(`${API_URL}/combos/admin`, { headers });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to load combos.");
      setCombos(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setComboLoading(false);
    }
  };

  const loadOrders = async () => {
    try {
      setOrdersLoading(true);
      const response = await fetch(`${API_URL}/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to load orders.");
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setOrdersLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadDishes();
      loadOrders();
      loadCombos();
    }
    // Initial dashboard load only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const orderValue = useMemo(
    () => orders.reduce((sum, order) => sum + Number(order.totalAmount || 0), 0),
    [orders]
  );

  const pendingOrders = orders.filter((order) => order.status === "Pending").length;
  const deliveredOrders = orders.filter((order) => order.status === "Delivered").length;
  const availableDishes = dishes.filter((dish) => dish.available).length;
  const soldOutDishes = dishes.length - availableDishes;

  const filteredDishes = dishes.filter((dish) => {
    const term = dishSearch.toLowerCase().trim();
    return (
      dish.name?.toLowerCase().includes(term) ||
      dish.category?.toLowerCase().includes(term)
    );
  });

  if (!token) return <Navigate to="/admin/login" replace />;

  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
    clearMessages();
  };

  const addDish = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      clearMessages();
      const response = await fetch(`${API_URL}/menu`, {
        method: "POST",
        headers,
        body: JSON.stringify({ ...form, price: Number(form.price) }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to add dish.");
      resetForm();
      setSuccess("Dish added successfully.");
      await loadDishes();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (dish) => {
    setEditingId(dish._id);
    setForm({
      name: dish.name || "",
      description: dish.description || "",
      price: dish.price ?? "",
      category: dish.category || "Drinks",
      image: dish.image || "",
      isVeg: dish.isVeg ?? true,
      available: dish.available ?? true,
      isFeatured: dish.isFeatured ?? false,
      isBestseller: dish.isBestseller ?? false,
    });
    clearMessages();
    setActiveTab("menu");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const saveEdit = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      clearMessages();
      const response = await fetch(`${API_URL}/menu/${editingId}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ ...form, price: Number(form.price) }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to update dish.");
      resetForm();
      setSuccess("Dish updated successfully.");
      await loadDishes();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const toggleAvailability = async (dish) => {
    try {
      clearMessages();
      const response = await fetch(`${API_URL}/menu/${dish._id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ available: !dish.available }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Availability update failed.");
      setSuccess("Dish availability updated.");
      await loadDishes();
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteDish = async (id) => {
    if (!window.confirm("Are you sure you want to delete this dish?")) return;
    try {
      clearMessages();
      const response = await fetch(`${API_URL}/menu/${id}`, {
        method: "DELETE",
        headers,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to delete dish.");
      if (editingId === id) resetForm();
      setSuccess("Dish deleted successfully.");
      await loadDishes();
    } catch (err) {
      setError(err.message);
    }
  };

  const resetComboForm = () => {
    setComboForm({
      name: "",
      description: "",
      image: "",
      dishes: [],
      offerPrice: "",
      active: true,
    });
    setEditingComboId(null);
  };

  const handleComboDishChange = (dishId) => {
    setComboForm((previous) => ({
      ...previous,
      dishes: previous.dishes.includes(dishId)
        ? previous.dishes.filter((id) => id !== dishId)
        : [...previous.dishes, dishId],
    }));
  };

  const saveCombo = async (event) => {
    event.preventDefault();
    try {
      setComboSaving(true);
      clearMessages();
      const url = editingComboId
        ? `${API_URL}/combos/${editingComboId}`
        : `${API_URL}/combos`;
      const response = await fetch(url, {
        method: editingComboId ? "PUT" : "POST",
        headers,
        body: JSON.stringify({
          ...comboForm,
          offerPrice: Number(comboForm.offerPrice),
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to save combo.");
      resetComboForm();
      setSuccess(data.message || "Combo saved successfully.");
      await loadCombos();
    } catch (err) {
      setError(err.message);
    } finally {
      setComboSaving(false);
    }
  };

  const editCombo = (combo) => {
    setEditingComboId(combo._id);
    setComboForm({
      name: combo.name || "",
      description: combo.description || "",
      image: combo.image || "",
      dishes: (combo.dishes || []).map((dish) => dish._id || dish),
      offerPrice: combo.offerPrice ?? "",
      active: combo.active ?? true,
    });
    clearMessages();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteCombo = async (comboId) => {
    if (!window.confirm("Are you sure you want to delete this combo?")) return;
    try {
      clearMessages();
      const response = await fetch(`${API_URL}/combos/${comboId}`, {
        method: "DELETE",
        headers,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to delete combo.");
      if (editingComboId === comboId) resetComboForm();
      setSuccess(data.message || "Combo deleted successfully.");
      await loadCombos();
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleComboActive = async (combo) => {
    try {
      clearMessages();
      const response = await fetch(`${API_URL}/combos/${combo._id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({
          name: combo.name,
          description: combo.description || "",
          image: combo.image || "",
          dishes: (combo.dishes || []).map((dish) => dish._id || dish),
          offerPrice: Number(combo.offerPrice),
          active: !combo.active,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to update combo status.");
      setSuccess(`Combo ${!combo.active ? "activated" : "deactivated"} successfully.`);
      await loadCombos();
    } catch (err) {
      setError(err.message);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      setUpdatingOrderId(orderId);
      clearMessages();
      const response = await fetch(`${API_URL}/orders/${orderId}/status`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Unable to update order status.");
      }
      setOrders((previous) =>
        previous.map((order) => (order._id === orderId ? data.order : order))
      );
      setSuccess("Order status updated successfully.");
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/admin/login";
  };

  const navItems = [
    { id: "overview", label: "Overview", icon: "▦" },
    { id: "menu", label: "Menu Management", icon: "☕" },
    { id: "combos", label: "Combo Offers", icon: "🎁" },
    { id: "orders", label: "Customer Orders", icon: "▤" },
  ];

  const changeTab = (tab) => {
    setActiveTab(tab);
    setMobileNavOpen(false);
    clearMessages();
  };

  const refreshButton = (onClick, busy, label) => (
    <button
      type="button"
      onClick={onClick}
      disabled={busy}
      className="rounded-xl border border-[#e8d9cb] bg-white px-4 py-2.5 text-sm font-semibold text-[#70452f] transition hover:bg-[#f7eee6] disabled:opacity-50"
    >
      {busy ? "Refreshing..." : `↻ ${label}`}
    </button>
  );

  return (
    <div className="min-h-screen bg-[#f8f5f0] text-[#432c21]">
      {/* Mobile top bar */}
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-[#eadfd2] bg-[#fffdf9] px-4 py-3 lg:hidden">
        <div>
          <p className="text-lg font-black tracking-tight">
            Velvet <span className="text-[#b47752]">Drip</span>
          </p>
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#9a8170]">
            Admin workspace
          </p>
        </div>
        <button
          type="button"
          onClick={() => setMobileNavOpen((open) => !open)}
          className="rounded-xl border border-[#eadfd2] px-3 py-2 text-sm font-semibold"
          aria-label="Toggle navigation"
        >
          {mobileNavOpen ? "Close ✕" : "☰ Menu"}
        </button>
      </div>

      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        {/* Sidebar */}
        <aside
          className={`${
            mobileNavOpen ? "block" : "hidden"
          } fixed inset-x-0 top-[61px] z-20 border-b border-[#eadfd2] bg-[#38251d] p-5 text-white lg:sticky lg:top-0 lg:block lg:h-screen lg:w-[260px] lg:shrink-0 lg:border-b-0 lg:border-r lg:border-[#51382c] lg:p-6`}
        >
          <div className="hidden lg:block">
            <p className="text-2xl font-black tracking-tight">
              Velvet <span className="text-[#d6a27e]">Drip</span>
            </p>
            <p className="mt-1 text-[10px] uppercase tracking-[0.25em] text-[#c6a995]">
              Cafe administration
            </p>
          </div>

          <div className="mt-2 rounded-2xl border border-white/10 bg-white/5 p-4 lg:mt-10">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-[#d6a27e] text-lg text-[#38251d]">
                ☕
              </div>
              <div>
                <p className="text-sm font-semibold">Cafe Admin</p>
                <p className="text-xs text-[#c6a995]">Management panel</p>
              </div>
            </div>
          </div>

          <p className="mb-3 mt-8 text-[10px] font-bold uppercase tracking-[0.22em] text-[#bda08d]">
            Workspace
          </p>
          <nav className="space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => changeTab(item.id)}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${
                  activeTab === item.id
                    ? "bg-[#d6a27e] text-[#38251d] shadow-lg"
                    : "text-[#eadbd0] hover:bg-white/10"
                }`}
              >
                <span className="w-5 text-center text-lg">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>

          <div className="mt-8 rounded-2xl bg-[#4a3328] p-4">
            <p className="text-sm font-semibold">Keep things brewing.</p>
            <p className="mt-1 text-xs leading-5 text-[#d5bbaa]">
              Manage your menu and keep customer orders moving.
            </p>
          </div>

          <button
            type="button"
            onClick={logout}
            className="mt-8 flex w-full items-center gap-3 rounded-xl border border-white/15 px-4 py-3 text-left text-sm font-semibold text-[#f1ded0] transition hover:bg-white/10"
          >
            <span>↪</span> Logout
          </button>
        </aside>

        {/* Main content */}
        <main className="min-w-0 flex-1 px-4 py-6 sm:px-7 sm:py-8 lg:px-10">
          <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#b47752]">
                Velvet Drip / {navItems.find((item) => item.id === activeTab)?.label}
              </p>
              <h1 className="mt-2 text-3xl font-black tracking-tight text-[#432c21] sm:text-4xl">
                {activeTab === "overview"
                  ? "Good day, Admin"
                  : activeTab === "menu"
                  ? "Menu Management"
                  : activeTab === "combos"
                  ? "Combo Offers"
                  : "Customer Orders"}
              </h1>
              <p className="mt-2 text-sm text-[#8c7768]">
                {activeTab === "overview"
                  ? "Here's what's happening at your cafe today."
                  : activeTab === "menu"
                  ? "Add dishes, update prices, and manage availability."
                  : activeTab === "combos"
                  ? "Create discounted bundles using dishes from your menu."
                  : "Review incoming orders and update their progress."}
              </p>
            </div>
            <div className="hidden items-center gap-2 rounded-full border border-[#eadfd2] bg-white px-4 py-2 text-xs font-semibold text-[#765640] sm:flex">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Admin session active
            </div>
          </header>

          {(error || success) && (
            <div
              role="status"
              className={`mb-6 rounded-xl border px-4 py-3 text-sm ${
                error
                  ? "border-red-200 bg-red-50 text-red-700"
                  : "border-emerald-200 bg-emerald-50 text-emerald-700"
              }`}
            >
              {error || success}
            </div>
          )}

          {/* Overview */}
          {activeTab === "overview" && (
            <>
              <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                  icon="☕"
                  label="Total Dishes"
                  value={dishes.length}
                  note="Items in your menu"
                />
                <StatCard
                  icon="✓"
                  label="Available Dishes"
                  value={availableDishes}
                  note={`${soldOutDishes} currently sold out`}
                  tone="green"
                />
                <StatCard
                  icon="▤"
                  label="Total Orders"
                  value={orders.length}
                  note={`${pendingOrders} awaiting action`}
                  tone="orange"
                />
                <StatCard
                  icon="₹"
                  label="Order Value"
                  value={currency(orderValue)}
                  note="Combined value of loaded orders"
                  tone="blue"
                />
              </div>

              <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
                <section className="rounded-2xl border border-[#eee2d6] bg-white p-5 shadow-sm sm:p-6">
                  <SectionHeading
                    eyebrow="Menu snapshot"
                    title="Your dishes"
                    description="A quick look at items customers can order."
                    action={
                      <button
                        onClick={() => changeTab("menu")}
                        className="text-sm font-bold text-[#a56845] hover:underline"
                      >
                        Manage menu →
                      </button>
                    }
                  />
                  {loading ? (
                    <p className="py-8 text-center text-sm text-[#8c7768]">Loading dishes...</p>
                  ) : dishes.length === 0 ? (
                    <p className="rounded-xl bg-[#faf6f1] p-6 text-center text-sm text-[#8c7768]">
                      No dishes yet. Add your first dish from Menu Management.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {dishes.slice(0, 5).map((dish) => (
                        <div key={dish._id} className="flex items-center gap-3 rounded-xl bg-[#fcfaf7] p-3">
                          <img
                            src={dish.image || "https://placehold.co/80x80?text=Food"}
                            alt={dish.name}
                            className="h-12 w-12 rounded-lg object-cover"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-bold">{dish.name}</p>
                            <p className="text-xs text-[#8c7768]">{dish.category}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold">{currency(dish.price)}</p>
                            <p className={`text-[11px] font-semibold ${dish.available ? "text-emerald-700" : "text-red-600"}`}>
                              {dish.available ? "Available" : "Sold out"}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>

                <section className="rounded-2xl border border-[#eee2d6] bg-white p-5 shadow-sm sm:p-6">
                  <SectionHeading
                    eyebrow="Order activity"
                    title="Latest orders"
                    description="Recently received customer orders."
                    action={
                      <button
                        onClick={() => changeTab("orders")}
                        className="text-sm font-bold text-[#a56845] hover:underline"
                      >
                        View all →
                      </button>
                    }
                  />
                  {ordersLoading ? (
                    <p className="py-8 text-center text-sm text-[#8c7768]">Loading orders...</p>
                  ) : orders.length === 0 ? (
                    <p className="rounded-xl bg-[#faf6f1] p-6 text-center text-sm text-[#8c7768]">
                      No customer orders have arrived yet.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {orders.slice(0, 5).map((order) => (
                        <div key={order._id} className="flex items-center justify-between gap-3 rounded-xl bg-[#fcfaf7] p-3">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold">{order.customerName}</p>
                            <p className="text-xs text-[#8c7768]">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold">{currency(order.totalAmount)}</p>
                            <span className="text-[11px] font-semibold text-[#a56845]">{order.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              </div>

              <section className="mt-6 rounded-2xl border border-[#eee2d6] bg-white p-5 shadow-sm sm:p-6">
                <SectionHeading
                  eyebrow="Quick actions"
                  title="Manage your cafe"
                  description="Jump directly to the tasks you do most often."
                />
                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    onClick={() => {
                      resetForm();
                      changeTab("menu");
                    }}
                    className="rounded-xl bg-[#f5ece3] p-5 text-left transition hover:bg-[#edddce]"
                  >
                    <span className="text-2xl">＋</span>
                    <p className="mt-3 font-bold">Add a new dish</p>
                    <p className="mt-1 text-xs text-[#8c7768]">Create a menu item with price and image.</p>
                  </button>
                  <button
                    onClick={() => changeTab("orders")}
                    className="rounded-xl bg-[#f5ece3] p-5 text-left transition hover:bg-[#edddce]"
                  >
                    <span className="text-2xl">▤</span>
                    <p className="mt-3 font-bold">Review customer orders</p>
                    <p className="mt-1 text-xs text-[#8c7768]">Check order details and update statuses.</p>
                  </button>
                </div>
              </section>
            </>
          )}

          {/* Menu management */}
          {activeTab === "menu" && (
            <>
              <section className="mb-7 rounded-2xl border border-[#eee2d6] bg-white p-5 shadow-sm sm:p-7">
                <SectionHeading
                  eyebrow={editingId ? "Update menu item" : "Menu builder"}
                  title={editingId ? "Edit dish details" : "Add a new dish"}
                  description="Keep your customer-facing menu fresh and accurate."
                  action={
                    editingId ? (
                      <button onClick={resetForm} className="text-sm font-semibold text-red-600 hover:underline">
                        Cancel editing
                      </button>
                    ) : null
                  }
                />
                <form onSubmit={editingId ? saveEdit : addDish} className="grid gap-4 sm:grid-cols-2">
                  <label className="text-sm font-semibold text-[#634735]">
                    Dish name
                    <input
                      required
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="e.g. Cappuccino"
                      className="mt-2 w-full rounded-xl border border-[#e8d9cb] bg-[#fffdfb] p-3 font-normal outline-none transition focus:border-[#a56845] focus:ring-2 focus:ring-[#a56845]/10"
                    />
                  </label>
                  <label className="text-sm font-semibold text-[#634735]">
                    Price (₹)
                    <input
                      required
                      min="0"
                      step="0.01"
                      type="number"
                      name="price"
                      value={form.price}
                      onChange={handleChange}
                      placeholder="e.g. 150"
                      className="mt-2 w-full rounded-xl border border-[#e8d9cb] bg-[#fffdfb] p-3 font-normal outline-none transition focus:border-[#a56845] focus:ring-2 focus:ring-[#a56845]/10"
                    />
                  </label>
                  <label className="text-sm font-semibold text-[#634735]">
                    Category
                    <select
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                      className="mt-2 w-full rounded-xl border border-[#e8d9cb] bg-white p-3 font-normal outline-none focus:border-[#a56845]"
                    >
                      <option>Drinks</option>
                      <option>Coffee</option>
                      <option>Tea</option>
                      <option>Snacks</option>
                      <option>Desserts</option>
                      <option>Fast Food</option>
                    </select>
                  </label>
                  <label className="text-sm font-semibold text-[#634735]">
                    Food type
                    <select
                      value={String(form.isVeg)}
                      onChange={(event) => setForm({ ...form, isVeg: event.target.value === "true" })}
                      className="mt-2 w-full rounded-xl border border-[#e8d9cb] bg-white p-3 font-normal outline-none focus:border-[#a56845]"
                    >
                      <option value="true">Vegetarian</option>
                      <option value="false">Non-vegetarian</option>
                    </select>
                  </label>
                  <label className="text-sm font-semibold text-[#634735] sm:col-span-2">
                    Image URL
                    <input
                      name="image"
                      value={form.image}
                      onChange={handleChange}
                      placeholder="Paste a dish image URL"
                      className="mt-2 w-full rounded-xl border border-[#e8d9cb] bg-[#fffdfb] p-3 font-normal outline-none focus:border-[#a56845]"
                    />
                  </label>
                  <label className="text-sm font-semibold text-[#634735] sm:col-span-2">
                    Description
                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      rows="3"
                      placeholder="Describe this dish..."
                      className="mt-2 w-full rounded-xl border border-[#e8d9cb] bg-[#fffdfb] p-3 font-normal outline-none focus:border-[#a56845]"
                    />
                  </label>
                  <div className="grid gap-3 sm:grid-cols-2 sm:col-span-2">
                    <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#eadfd2] bg-[#faf6f1] p-4 text-sm font-medium text-[#634735]">
                      <input
                        type="checkbox"
                        name="isFeatured"
                        checked={form.isFeatured}
                        onChange={handleChange}
                        className="h-4 w-4 accent-[#70452f]"
                      />
                      <span>
                        <span className="block font-bold">⭐ Featured Dish</span>
                        <span className="mt-1 block text-xs font-normal text-[#8c7768]">Show this dish in the Featured section.</span>
                      </span>
                    </label>

                    <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#eadfd2] bg-[#faf6f1] p-4 text-sm font-medium text-[#634735]">
                      <input
                        type="checkbox"
                        name="isBestseller"
                        checked={form.isBestseller}
                        onChange={handleChange}
                        className="h-4 w-4 accent-[#70452f]"
                      />
                      <span>
                        <span className="block font-bold">🔥 Bestseller</span>
                        <span className="mt-1 block text-xs font-normal text-[#8c7768]">Show a Bestseller badge on this dish.</span>
                      </span>
                    </label>
                  </div>

                  <label className="flex items-center gap-3 rounded-xl bg-[#faf6f1] p-3 text-sm font-medium text-[#634735] sm:col-span-2">
                    <input
                      type="checkbox"
                      name="available"
                      checked={form.available}
                      onChange={handleChange}
                      className="h-4 w-4 accent-[#70452f]"
                    />
                    Available for customers to order
                  </label>
                  <div className="flex flex-wrap gap-3 sm:col-span-2">
                    <button
                      type="submit"
                      disabled={saving}
                      className="rounded-xl bg-[#70452f] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#956347] disabled:opacity-60"
                    >
                      {saving ? "Saving..." : editingId ? "Save changes" : "+ Add dish"}
                    </button>
                    {editingId && (
                      <button
                        type="button"
                        onClick={resetForm}
                        className="rounded-xl border border-[#e8d9cb] px-6 py-3 text-sm font-semibold text-[#70452f] hover:bg-[#faf6f1]"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </section>

              <section className="rounded-2xl border border-[#eee2d6] bg-white p-5 shadow-sm sm:p-7">
                <SectionHeading
                  eyebrow="Your catalogue"
                  title="Manage menu items"
                  description={`${dishes.length} total dishes · ${availableDishes} available · ${soldOutDishes} sold out`}
                  action={refreshButton(loadDishes, loading, "Refresh")}
                />
                <input
                  value={dishSearch}
                  onChange={(event) => setDishSearch(event.target.value)}
                  placeholder="Search by dish name or category..."
                  className="mb-5 w-full rounded-xl border border-[#e8d9cb] bg-[#fffdfb] px-4 py-3 text-sm outline-none focus:border-[#a56845] sm:max-w-md"
                />
                {loading ? (
                  <p className="py-10 text-center text-sm text-[#8c7768]">Loading menu items...</p>
                ) : filteredDishes.length === 0 ? (
                  <p className="rounded-xl bg-[#faf6f1] p-8 text-center text-sm text-[#8c7768]">
                    {dishes.length ? "No dishes match your search." : "No dishes added yet."}
                  </p>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    {filteredDishes.map((dish) => (
                      <article key={dish._id} className="overflow-hidden rounded-2xl border border-[#eee2d6] bg-[#fffdfb]">
                        <div className="flex gap-4 p-4">
                          <img
                            src={dish.image || "https://placehold.co/120x120?text=Food"}
                            alt={dish.name}
                            className="h-24 w-24 shrink-0 rounded-xl object-cover"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-start justify-between gap-2">
                              <div>
                                <h3 className="font-bold">{dish.name}</h3>
                                <p className="mt-1 text-xs text-[#8c7768]">
                                  {dish.category} · {dish.isVeg ? "Veg" : "Non-veg"}
                                </p>
                                <div className="mt-2 flex flex-wrap gap-1.5">
                                  {dish.isFeatured && (
                                    <span className="rounded-full bg-[#f4e8dc] px-2 py-1 text-[10px] font-bold text-[#70452f]">⭐ Featured</span>
                                  )}
                                  {dish.isBestseller && (
                                    <span className="rounded-full bg-amber-50 px-2 py-1 text-[10px] font-bold text-amber-700">🔥 Bestseller</span>
                                  )}
                                </div>
                              </div>
                              <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${dish.available ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
                                {dish.available ? "Available" : "Sold out"}
                              </span>
                            </div>
                            <p className="mt-3 text-lg font-black text-[#70452f]">{currency(dish.price)}</p>
                            {dish.description && (
                              <p className="mt-1 line-clamp-2 text-xs leading-5 text-[#8c7768]">{dish.description}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 border-t border-[#eee2d6] bg-white p-3">
                          <button onClick={() => startEdit(dish)} className="rounded-lg bg-[#f5ece3] px-3 py-2 text-xs font-bold text-[#70452f] hover:bg-[#edddce]">
                            Edit
                          </button>
                          <button onClick={() => toggleAvailability(dish)} className="rounded-lg bg-[#f5ece3] px-3 py-2 text-xs font-bold text-[#70452f] hover:bg-[#edddce]">
                            {dish.available ? "Mark sold out" : "Make available"}
                          </button>
                          <button onClick={() => deleteDish(dish._id)} className="rounded-lg bg-red-50 px-3 py-2 text-xs font-bold text-red-700 hover:bg-red-100">
                            Delete
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </section>
            </>
          )}

          {/* Combo offers */}
          {activeTab === "combos" && (
            <>
              <section className="mb-7 rounded-2xl border border-[#eee2d6] bg-white p-5 shadow-sm sm:p-7">
                <SectionHeading
                  eyebrow={editingComboId ? "Update combo" : "Offer builder"}
                  title={editingComboId ? "Edit combo offer" : "Create a combo offer"}
                  description="Choose at least one available dish and set a special combo price."
                  action={editingComboId ? (
                    <button type="button" onClick={resetComboForm} className="text-sm font-semibold text-red-600 hover:underline">Cancel editing</button>
                  ) : null}
                />
                <form onSubmit={saveCombo} className="grid gap-4 sm:grid-cols-2">
                  <label className="text-sm font-semibold text-[#634735]">
                    Combo name
                    <input required maxLength="80" value={comboForm.name} onChange={(e) => setComboForm({ ...comboForm, name: e.target.value })} placeholder="e.g. Coffee Lover Combo" className="mt-2 w-full rounded-xl border border-[#e8d9cb] bg-[#fffdfb] p-3 font-normal outline-none focus:border-[#a56845]" />
                  </label>
                  <label className="text-sm font-semibold text-[#634735]">
                    Offer price (₹)
                    <input required type="number" min="0" step="0.01" value={comboForm.offerPrice} onChange={(e) => setComboForm({ ...comboForm, offerPrice: e.target.value })} placeholder="e.g. 190" className="mt-2 w-full rounded-xl border border-[#e8d9cb] bg-[#fffdfb] p-3 font-normal outline-none focus:border-[#a56845]" />
                  </label>
                  <label className="text-sm font-semibold text-[#634735] sm:col-span-2">
                    Description
                    <textarea value={comboForm.description} onChange={(e) => setComboForm({ ...comboForm, description: e.target.value })} rows="2" placeholder="Describe what's included in this offer..." className="mt-2 w-full rounded-xl border border-[#e8d9cb] bg-[#fffdfb] p-3 font-normal outline-none focus:border-[#a56845]" />
                  </label>
                  <label className="text-sm font-semibold text-[#634735] sm:col-span-2">
                    Combo image URL
                    <input value={comboForm.image} onChange={(e) => setComboForm({ ...comboForm, image: e.target.value })} placeholder="Paste a combo image URL" className="mt-2 w-full rounded-xl border border-[#e8d9cb] bg-[#fffdfb] p-3 font-normal outline-none focus:border-[#a56845]" />
                  </label>
                  <div className="sm:col-span-2">
                    <p className="mb-2 text-sm font-semibold text-[#634735]">Select dishes included in this combo</p>
                    {dishes.filter((dish) => dish.available).length === 0 ? (
                      <p className="rounded-xl bg-[#faf6f1] p-4 text-sm text-[#8c7768]">Add available dishes in Menu Management before creating a combo.</p>
                    ) : (
                      <div className="grid gap-2 sm:grid-cols-2">
                        {dishes.filter((dish) => dish.available).map((dish) => (
                          <label key={dish._id} className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-[#eadfd2] bg-[#faf6f1] p-3 text-sm">
                            <span className="flex min-w-0 items-center gap-2">
                              <input type="checkbox" checked={comboForm.dishes.includes(dish._id)} onChange={() => handleComboDishChange(dish._id)} className="h-4 w-4 accent-[#70452f]" />
                              <span className="truncate font-medium text-[#634735]">{dish.name}</span>
                            </span>
                            <span className="shrink-0 text-xs font-bold text-[#8c7768]">{currency(dish.price)}</span>
                          </label>
                        ))}
                      </div>
                    )}
                    <p className="mt-2 text-xs text-[#8c7768]">{comboForm.dishes.length} dish(es) selected</p>
                  </div>
                  <label className="flex items-center gap-3 rounded-xl bg-[#faf6f1] p-3 text-sm font-medium text-[#634735] sm:col-span-2">
                    <input type="checkbox" checked={comboForm.active} onChange={(e) => setComboForm({ ...comboForm, active: e.target.checked })} className="h-4 w-4 accent-[#70452f]" />
                    Show this combo to customers
                  </label>
                  <div className="flex flex-wrap gap-3 sm:col-span-2">
                    <button type="submit" disabled={comboSaving || comboForm.dishes.length === 0} className="rounded-xl bg-[#70452f] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#956347] disabled:opacity-60">{comboSaving ? "Saving..." : editingComboId ? "Save combo changes" : "+ Create combo"}</button>
                    {editingComboId && <button type="button" onClick={resetComboForm} className="rounded-xl border border-[#e8d9cb] px-6 py-3 text-sm font-semibold text-[#70452f] hover:bg-[#faf6f1]">Cancel</button>}
                  </div>
                </form>
              </section>

              <section className="rounded-2xl border border-[#eee2d6] bg-white p-5 shadow-sm sm:p-7">
                <SectionHeading eyebrow="Your offers" title="Manage combo offers" description={`${combos.length} total combos`} action={refreshButton(loadCombos, comboLoading, "Refresh combos")} />
                {comboLoading ? (
                  <p className="py-10 text-center text-sm text-[#8c7768]">Loading combo offers...</p>
                ) : combos.length === 0 ? (
                  <div className="rounded-xl bg-[#faf6f1] px-5 py-12 text-center"><p className="text-4xl">🎁</p><h3 className="mt-3 font-bold">No combo offers yet</h3><p className="mt-1 text-sm text-[#8c7768]">Create your first combo using the form above.</p></div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    {combos.map((combo) => (
                      <article key={combo._id} className="overflow-hidden rounded-2xl border border-[#eee2d6] bg-[#fffdfb]">
                        {combo.image && <img src={combo.image} alt={combo.name} className="h-40 w-full object-cover" />}
                        <div className="p-4">
                          <div className="flex items-start justify-between gap-3"><h3 className="font-bold text-[#432c21]">{combo.name}</h3><span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${combo.active ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-600"}`}>{combo.active ? "Active" : "Inactive"}</span></div>
                          {combo.description && <p className="mt-2 text-sm text-[#8c7768]">{combo.description}</p>}
                          <div className="mt-3 flex flex-wrap gap-2">{(combo.dishes || []).map((dish) => <span key={dish._id || dish} className="rounded-full bg-[#f5ece3] px-2.5 py-1 text-xs text-[#70452f]">{dish.name || "Menu item"}</span>)}</div>
                          <p className="mt-4 text-xl font-black text-[#70452f]">{currency(combo.offerPrice)}</p>
                        </div>
                        <div className="flex flex-wrap gap-2 border-t border-[#eee2d6] bg-white p-3">
                          <button type="button" onClick={() => editCombo(combo)} className="rounded-lg bg-[#f5ece3] px-3 py-2 text-xs font-bold text-[#70452f] hover:bg-[#edddce]">Edit</button>
                          <button type="button" onClick={() => toggleComboActive(combo)} className="rounded-lg bg-[#f5ece3] px-3 py-2 text-xs font-bold text-[#70452f] hover:bg-[#edddce]">{combo.active ? "Deactivate" : "Activate"}</button>
                          <button type="button" onClick={() => deleteCombo(combo._id)} className="rounded-lg bg-red-50 px-3 py-2 text-xs font-bold text-red-700 hover:bg-red-100">Delete</button>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </section>
            </>
          )}

          {/* Customer orders */}
          {activeTab === "orders" && (
            <section className="rounded-2xl border border-[#eee2d6] bg-white p-5 shadow-sm sm:p-7">
              <SectionHeading
                eyebrow="Order desk"
                title="Customer orders"
                description={`${orders.length} orders received · ${pendingOrders} pending · ${deliveredOrders} delivered`}
                action={refreshButton(loadOrders, ordersLoading, "Refresh orders")}
              />

              <div className="mb-6 grid gap-3 sm:grid-cols-3">
                <StatCard icon="▤" label="All orders" value={orders.length} />
                <StatCard icon="◷" label="Pending" value={pendingOrders} tone="orange" />
                <StatCard icon="✓" label="Delivered" value={deliveredOrders} tone="green" />
              </div>

              {ordersLoading ? (
                <p className="py-10 text-center text-sm text-[#8c7768]">Loading customer orders...</p>
              ) : orders.length === 0 ? (
                <div className="rounded-xl bg-[#faf6f1] px-5 py-12 text-center">
                  <p className="text-4xl">☕</p>
                  <h3 className="mt-3 font-bold">No orders yet</h3>
                  <p className="mt-1 text-sm text-[#8c7768]">New customer orders will appear here.</p>
                </div>
              ) : (
                <div className="space-y-5">
                  {orders.map((order) => (
                    <article key={order._id} className="rounded-2xl border border-[#eee2d6] p-4 sm:p-5">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wider text-[#b47752]">
                            Order #{String(order._id).slice(-7).toUpperCase()}
                          </p>
                          <h3 className="mt-1 text-lg font-bold">{order.customerName}</h3>
                          <p className="mt-1 text-sm text-[#8c7768]">{order.phone}</p>
                          <p className="mt-1 text-sm text-[#8c7768]">{order.address}</p>
                        </div>
                        <span className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                          order.status === "Delivered"
                            ? "bg-emerald-50 text-emerald-700"
                            : order.status === "Cancelled"
                            ? "bg-red-50 text-red-700"
                            : order.status === "Pending"
                            ? "bg-orange-50 text-orange-700"
                            : "bg-sky-50 text-sky-700"
                        }`}>
                          {order.status}
                        </span>
                      </div>

                      <div className="my-4 border-t border-dashed border-[#e8d9cb]" />
                      <p className="mb-3 text-xs font-bold uppercase tracking-wider text-[#8c7768]">Items ordered</p>
                      <div className="space-y-2">
                        {order.items?.map((item, index) => (
                          <div key={`${order._id}-${index}`} className="flex justify-between gap-3 text-sm">
                            <span className="text-[#765f50]">{item.name} × {item.quantity}</span>
                            <span className="font-semibold">{currency(Number(item.price) * Number(item.quantity))}</span>
                          </div>
                        ))}
                      </div>

                      {order.instructions && (
                        <div className="mt-4 rounded-xl bg-[#faf6f1] p-3 text-sm text-[#765f50]">
                          <span className="font-bold">Special instructions: </span>
                          {order.instructions}
                        </div>
                      )}

                      <div className="mt-4 flex flex-wrap items-end justify-between gap-4 border-t border-[#eee2d6] pt-4">
                        <div>
                          <p className="text-xs text-[#8c7768]">Order placed</p>
                          <p className="mt-1 text-sm font-medium">
                            {order.createdAt ? new Date(order.createdAt).toLocaleString() : "Date unavailable"}
                          </p>
                          <p className="mt-1 text-xs text-[#8c7768]">
                            Payment: {order.paymentStatus || "Not specified"}
                          </p>
                        </div>
                        <div className="sm:text-right">
                          <p className="text-xs text-[#8c7768]">Order total</p>
                          <p className="text-2xl font-black text-[#70452f]">{currency(order.totalAmount)}</p>
                        </div>
                      </div>

                      <div className="mt-5 flex flex-wrap items-center gap-3">
                        <label htmlFor={`status-${order._id}`} className="text-sm font-bold">
                          Update status
                        </label>
                        <select
                          id={`status-${order._id}`}
                          value={order.status}
                          disabled={updatingOrderId === order._id}
                          onChange={(event) => updateOrderStatus(order._id, event.target.value)}
                          className="min-w-44 rounded-xl border border-[#e8d9cb] bg-white px-4 py-2.5 text-sm outline-none focus:border-[#a56845] disabled:opacity-60"
                        >
                          {orderStatuses.map((status) => (
                            <option key={status} value={status}>{status}</option>
                          ))}
                        </select>
                        {updatingOrderId === order._id && (
                          <span className="text-xs text-[#8c7768]">Updating order...</span>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          )}

          <footer className="mt-10 flex flex-wrap items-center justify-between gap-2 border-t border-[#e9ded3] pt-5 text-xs text-[#9a887a]">
            <p>© {new Date().getFullYear()} Velvet Drip · Admin workspace</p>
            <p>Made with care and coffee ☕</p>
          </footer>
        </main>
      </div>
    </div>
  );
}
