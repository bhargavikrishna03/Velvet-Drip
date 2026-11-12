import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import DishCard from "../Components/DishCard";
import { useCart } from "../Context/CartContext";

const BASE_URL =
  import.meta.env.VITE_API_URL || "https://velvet-drip-1.onrender.com/api";

const MENU_API_URL = `${BASE_URL}/menu`;
const COMBO_API_URL = `${BASE_URL}/combos`;

const Menu = () => {
  const { addComboToCart } = useCart();

  const [dishes, setDishes] = useState([]);
  const [combos, setCombos] = useState([]);

  const [loading, setLoading] = useState(true);
  const [comboLoading, setComboLoading] = useState(true);
  const [error, setError] = useState("");
  const [comboError, setComboError] = useState("");

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showFullMenu, setShowFullMenu] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (location.hash === "#full-menu") {
      setShowFullMenu(true);

      setTimeout(() => {
        document.getElementById("full-menu")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 300);
    }
  }, [location.hash]);

  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const response = await fetch(MENU_API_URL);

        if (!response.ok) {
          throw new Error("Unable to load menu");
        }

        const data = await response.json();
        setDishes(data);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    const fetchCombos = async () => {
      try {
        const response = await fetch(COMBO_API_URL);

        if (!response.ok) {
          throw new Error("Unable to load combo offers");
        }

        const data = await response.json();
        setCombos(Array.isArray(data) ? data : data.combos || []);
      } catch (err) {
        setComboError(err.message || "Unable to load combos");
      } finally {
        setComboLoading(false);
      }
    };

    fetchDishes();
    fetchCombos();

    // Allow the Hero button to open the full menu.
    const handleExploreMenu = () => {
      setShowFullMenu(true);
      setTimeout(() => {
        document.getElementById("menu")?.scrollIntoView({
          behavior: "smooth",
        });
      }, 100);
    };

    window.addEventListener("velvet:explore-menu", handleExploreMenu);

    return () => {
      window.removeEventListener("velvet:explore-menu", handleExploreMenu);
    };
  }, []);

  const featuredDishes = useMemo(() => {
    return dishes.filter((dish) => dish.isFeatured && dish.available);
  }, [dishes]);

  const categories = useMemo(() => {
    return [
      "All",
      ...new Set(dishes.map((dish) => dish.category).filter(Boolean)),
    ];
  }, [dishes]);

  const filteredDishes = useMemo(() => {
    const searchText = search.toLowerCase().trim();

    return dishes
      .filter((dish) => {
        const matchesCategory =
          selectedCategory === "All" || dish.category === selectedCategory;

        const matchesSearch =
          dish.name?.toLowerCase().includes(searchText) ||
          dish.description?.toLowerCase().includes(searchText);

        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => Number(b.available) - Number(a.available));
  }, [dishes, search, selectedCategory]);

  const handleExploreFullMenu = () => {
    setShowFullMenu(true);

    setTimeout(() => {
      document.getElementById("full-menu")?.scrollIntoView({
        behavior: "smooth",
      });
    }, 100);
  };

  return (
    <section id="menu" className="bg-[#fffaf3] px-5 py-20 lg:px-10">
      <div className="mx-auto max-w-7xl">
        {/* Featured Dishes */}
        {featuredDishes.length > 0 && (
          <div className="mb-20">
            <div className="mb-10 text-center">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[3px] text-[#9a5f3d]">
                Handpicked For You
              </p>

              <h2 className="text-4xl font-bold text-[#513326] md:text-5xl">
                Featured Dishes
              </h2>

              <p className="mt-4 text-[#6f5a4b]">
                Explore our special favourites at Velvet Drip.
              </p>
            </div>

            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {featuredDishes.map((dish) => (
                <DishCard key={dish._id} dish={dish} />
              ))}
            </div>
          </div>
        )}

        {/* Combo Offers */}
        <div className="mb-20">
          <div className="mb-10 text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[3px] text-[#9a5f3d]">
              Special Deals
            </p>

            <h2 className="text-4xl font-bold text-[#513326] md:text-5xl">
              Combo Offers
            </h2>

            <p className="mt-4 text-[#6f5a4b]">
              More deliciousness, better value!
            </p>
          </div>

          {comboLoading && (
            <p className="py-8 text-center text-[#713f2b]">
              Loading special offers...
            </p>
          )}

          {!comboLoading && comboError && (
            <p className="py-8 text-center text-red-600">{comboError}</p>
          )}

          {!comboLoading && !comboError && combos.length === 0 && (
            <p className="py-8 text-center text-[#6f5a4b]">
              Our special combo offers are coming soon!
            </p>
          )}

          {!comboLoading && combos.length > 0 && (
            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {combos.map((combo) => {
                const comboDishes = Array.isArray(combo.dishes)
                  ? combo.dishes
                  : [];

                const foodNames = comboDishes
                  .map((dish) => (typeof dish === "object" ? dish.name : ""))
                  .filter(Boolean);

                const hasNonVeg = comboDishes.some(
                  (dish) => typeof dish === "object" && dish.isVeg === false
                );

                const allVeg =
                  comboDishes.length > 0 &&
                  comboDishes.every(
                    (dish) => typeof dish === "object" && dish.isVeg === true
                  );

                const isAvailable = combo.active !== false;

                return (
                  <div
                    key={combo._id}
                    className="overflow-hidden rounded-3xl border border-[#eadfd2] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="relative h-52 bg-[#f5ece1]">
                      {combo.image ? (
                        <img
                          src={combo.image}
                          alt={combo.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-6xl">
                          ☕
                        </div>
                      )}

                      <span className="absolute left-4 top-4 rounded-full bg-[#713f2b] px-4 py-2 text-xs font-bold text-white">
                        SPECIAL COMBO
                      </span>
                    </div>

                    <div className="p-6">
                      <div className="mb-3 flex items-start justify-between gap-3">
                        <h3 className="text-xl font-bold text-[#513326]">
                          {combo.name}
                        </h3>

                        <span className="whitespace-nowrap rounded-full bg-[#f5ece1] px-3 py-1 text-xs font-semibold text-[#713f2b]">
                          {allVeg
                            ? "🟢 Veg"
                            : hasNonVeg
                              ? "🔴 Non-Veg"
                              : "Combo"}
                        </span>
                      </div>

                      <p className="mb-3 text-sm leading-6 text-[#806b5b]">
                        {combo.description}
                      </p>

                      {foodNames.length > 0 && (
                        <p className="mb-4 text-sm text-[#806b5b]">
                          Includes: {foodNames.join(" + ")}
                        </p>
                      )}

                      <div className="border-t border-[#eadfd2] pt-4">
                        <span className="text-sm text-[#907a69]">
                          Combo Price
                        </span>

                        <p className="text-2xl font-bold text-[#713f2b]">
                          ₹{Number(combo.offerPrice).toFixed(0)}
                        </p>

                        <button
                          type="button"
                          onClick={() => addComboToCart(combo)}
                          disabled={!isAvailable}
                          className="mt-4 w-full rounded-xl bg-[#713f2b] px-5 py-3 font-semibold text-white transition hover:bg-[#513326] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {isAvailable
                            ? "Buy This Combo 🛒"
                            : "Currently Unavailable"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Explore Full Menu Button */}
        {!showFullMenu && (
          <div className="rounded-3xl bg-[#f2e6d8] px-6 py-12 text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[3px] text-[#9a5f3d]">
              Something Delicious Awaits
            </p>

            <h2 className="text-3xl font-bold text-[#513326] md:text-4xl">
              Explore Our Full Menu
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-[#6f5a4b]">
              From freshly brewed coffee to tasty snacks, fast food and
              desserts, discover everything we serve.
            </p>

            <button
              type="button"
              onClick={handleExploreFullMenu}
              className="mt-7 rounded-full bg-[#713f2b] px-8 py-4 font-bold text-white shadow-lg transition hover:-translate-y-1 hover:bg-[#a35f40]"
            >
              Explore Full Menu →
            </button>
          </div>
        )}

        {/* Full Menu Catalogue */}
        {showFullMenu && (
          <div id="full-menu" className="scroll-mt-10">
            <div className="mb-10 text-center">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[3px] text-[#9a5f3d]">
                Made Fresh For You
              </p>

              <h2 className="text-4xl font-bold text-[#513326] md:text-5xl">
                Our Delicious Menu
              </h2>

              <p className="mt-4 text-[#6f5a4b]">
                Discover all your favourites at Velvet Drip.
              </p>
            </div>

            {/* Search */}
            <div className="mx-auto mb-8 max-w-xl">
              <div className="flex items-center rounded-full border border-[#eadfd2] bg-white px-5 py-3 shadow-sm transition focus-within:border-[#a35f40] focus-within:ring-2 focus-within:ring-[#a35f40]/20">
                <span className="mr-3 text-xl" aria-hidden="true">
                  ⌕
                </span>

                <input
                  type="text"
                  aria-label="Search menu"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search coffee, snacks, desserts..."
                  className="w-full bg-transparent text-[#513326] outline-none placeholder:text-[#a8978a]"
                />

                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="ml-2 text-sm text-[#a35f40] hover:text-[#713f2b]"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Category Filters */}
            {!loading && !error && dishes.length > 0 && (
              <div className="mb-10 flex flex-wrap justify-center gap-3">
                {categories.map((category) => (
                  <button
                    type="button"
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`rounded-full px-6 py-2.5 text-sm font-semibold transition-all duration-300 ${
                      selectedCategory === category
                        ? "bg-[#713f2b] text-white shadow-md"
                        : "border border-[#eadfd2] bg-white text-[#713f2b] hover:border-[#a35f40] hover:bg-[#f5ece1]"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            )}

            {loading && (
              <p className="py-10 text-center text-[#713f2b]">
                Preparing your menu...
              </p>
            )}

            {error && (
              <p className="py-10 text-center text-red-600">{error}</p>
            )}

            {!loading && !error && dishes.length === 0 && (
              <p className="py-10 text-center text-[#6f5a4b]">
                Our menu is being updated. Please visit again!
              </p>
            )}

            {!loading &&
              !error &&
              dishes.length > 0 &&
              (filteredDishes.length > 0 ? (
                <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filteredDishes.map((dish) => (
                    <DishCard key={dish._id} dish={dish} />
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center">
                  <p className="text-2xl font-semibold text-[#513326]">
                    No dishes found!
                  </p>

                  <p className="mt-2 text-[#6f5a4b]">
                    Try another search or category.
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      setSearch("");
                      setSelectedCategory("All");
                    }}
                    className="mt-5 rounded-full bg-[#713f2b] px-6 py-3 font-semibold text-white hover:bg-[#a35f40]"
                  >
                    Reset Filters
                  </button>
                </div>
              ))}

            <div className="mt-10 text-center">
              <button
                type="button"
                onClick={() => {
                  setShowFullMenu(false);
                  setSearch("");
                  setSelectedCategory("All");
                  document.getElementById("menu")?.scrollIntoView({
                    behavior: "smooth",
                  });
                }}
                className="rounded-full border border-[#b88b70] px-6 py-3 font-semibold text-[#713f2b] transition hover:bg-[#f5ece1]"
              >
                Back to Featured & Combos
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Menu;
