
import { useState } from "react";
import DishDetails from "./DishDetails";
import { useCart } from "../Context/CartContext";
import { optimizeImage, FALLBACK } from "../utils/optimizeImage";

const DishCard = ({ dish }) => {
  const [showDetails, setShowDetails] = useState(false);

  const {
    addToCart,
    cartItems,
    increaseQuantity,
    decreaseQuantity,
  } = useCart();

  const cartItem = cartItems.find(
    (item) => item._id === dish._id
  );

  const quantity = cartItem ? cartItem.quantity : 0;

  const handleAddToCart = (e) => {
    e.stopPropagation();

    if (!dish.available) return;

    addToCart(dish);
  };

  const handleIncrease = (e) => {
    e.stopPropagation();
    increaseQuantity(dish._id);
  };

  const handleDecrease = (e) => {
    e.stopPropagation();
    decreaseQuantity(dish._id);
  };

  return (
    <>
      <div
        onClick={() => setShowDetails(true)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setShowDetails(true);
          }
        }}
        className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-3xl border border-[#eadfd2] bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
      >
        {/* Image */}
        <div className="relative h-56 shrink-0 overflow-hidden bg-[#f5ece1]">
          <img
  src={optimizeImage(dish.image, 600)}
  srcSet={`${optimizeImage(dish.image, 400)} 400w, ${optimizeImage(dish.image, 800)} 800w`}
  sizes="(max-width: 640px) 100vw, 400px"
  alt={dish.name}
  width={600}
  height={400}
  loading="lazy"
  decoding="async"
  onError={(e) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = FALLBACK;
  }}
  className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-110 ${
    !dish.available ? "grayscale" : ""
  }`}
/>

          {/* Veg / Non-Veg */}
          <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-xs font-semibold shadow">
            {dish.isVeg ? "🟢 Veg" : "🔴 Non-Veg"}
          </span>

          {/* Availability */}
          <span
            className={`absolute right-4 top-4 rounded-full px-3 py-1 text-xs font-semibold ${
              dish.available
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {dish.available ? "Available" : "Sold Out"}
          </span>

          {/* Featured and Bestseller badges */}
          <div className="absolute bottom-3 left-3 flex flex-wrap gap-2">
            {dish.isFeatured && (
              <span className="rounded-full bg-[#713f2b] px-3 py-1 text-xs font-bold text-white shadow">
                ⭐ Featured
              </span>
            )}

            {dish.isBestseller && (
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800 shadow">
                🔥 Bestseller
              </span>
            )}
          </div>
        </div>

        {/* Dish Information */}
        <div className="flex flex-1 flex-col p-5">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#9a5f3d]">
            {dish.category}
          </p>

          <h3 className="text-xl font-bold text-[#513326]">
            {dish.name}
          </h3>

          <p className="mt-2 line-clamp-2 min-h-12 text-sm leading-6 text-[#6f5a4b]">
            {dish.description || "Freshly prepared with love."}
          </p>

          {/* Price and Details */}
          <div className="mt-auto border-t border-[#eadfd2] pt-4">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-[#8a5f45]">
                  Price
                </p>

                <h4 className="text-2xl font-bold text-[#713f2b]">
                  ₹{dish.price}
                </h4>
              </div>

              <span className="rounded-full bg-[#f5ece1] px-4 py-2 text-sm font-semibold text-[#713f2b]">
                View Details →
              </span>
            </div>

            {/* Add to Cart / Quantity Controls */}
            {!dish.available ? (
              <button
                type="button"
                disabled
                className="w-full cursor-not-allowed rounded-xl bg-gray-200 px-4 py-3 text-sm font-bold text-gray-500"
              >
                Currently Unavailable
              </button>
            ) : quantity === 0 ? (
              <button
                type="button"
                onClick={handleAddToCart}
                className="w-full rounded-xl bg-[#713f2b] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#513326]"
              >
                + Add to Cart
              </button>
            ) : (
              <div
                className="flex items-center justify-between rounded-xl bg-[#f5ece1] p-2"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={handleDecrease}
                  className="rounded-lg bg-white px-4 py-2 text-lg font-bold text-[#713f2b] transition hover:bg-[#713f2b] hover:text-white"
                >
                  −
                </button>

                <div className="text-center">
                  <p className="text-xs text-[#8a5f45]">
                    Quantity
                  </p>

                  <span className="font-bold text-[#513326]">
                    {quantity}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleIncrease}
                  className="rounded-lg bg-white px-4 py-2 text-lg font-bold text-[#713f2b] transition hover:bg-[#713f2b] hover:text-white"
                >
                  +
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dish Details Popup */}
      {showDetails && (
        <DishDetails
          dish={dish}
          onClose={() => setShowDetails(false)}
        />
      )}
    </>
  );
};

export default DishCard;
