import { useState } from "react";
import DishDetails from "./DishDetails";
import { useCart } from "../Context/CartContext";
import { optimizeImage, FALLBACK } from "../utils/optimizeImage";

const DishCard = ({ dish }) => {
  const [showDetails, setShowDetails] = useState(false);

  const { addToCart, cartItems, increaseQuantity, decreaseQuantity } =
    useCart();

  const cartItem = cartItems.find((item) => item._id === dish._id);
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
        className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-[#eadfd2] bg-white shadow-sm transition-all duration-300 sm:rounded-3xl sm:hover:-translate-y-2 sm:hover:shadow-xl"
      >
        {/* Image */}
        <div className="relative h-32 shrink-0 overflow-hidden bg-[#f5ece1] sm:h-56">
          <img
            src={optimizeImage(dish.image, 600)}
            srcSet={`${optimizeImage(dish.image, 400)} 400w, ${optimizeImage(dish.image, 800)} 800w`}
            sizes="(max-width: 640px) 50vw, 400px"
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

          {/* Veg / Non-Veg (icon only on mobile) */}
          <span className="absolute left-2 top-2 rounded-full bg-white px-2 py-1 text-[11px] font-semibold shadow sm:left-4 sm:top-4 sm:px-3 sm:text-xs">
            {dish.isVeg ? "🟢" : "🔴"}
            <span className="hidden sm:inline">
              {dish.isVeg ? " Veg" : " Non-Veg"}
            </span>
          </span>

          {/* Availability: always shown on desktop, on mobile only when sold out */}
          <span
            className={`absolute right-2 top-2 rounded-full px-2 py-1 text-[11px] font-semibold sm:right-4 sm:top-4 sm:px-3 sm:text-xs ${
              dish.available
                ? "hidden bg-green-100 text-green-700 sm:inline-block"
                : "bg-red-100 text-red-700"
            }`}
          >
            {dish.available ? "Available" : "Sold Out"}
          </span>

          {/* Featured and Bestseller badges (icon only on mobile) */}
          <div className="absolute bottom-2 left-2 flex flex-wrap gap-1 sm:bottom-3 sm:left-3 sm:gap-2">
            {dish.isFeatured && (
              <span className="rounded-full bg-[#713f2b] px-2 py-1 text-[11px] font-bold text-white shadow sm:px-3 sm:text-xs">
                ⭐<span className="hidden sm:inline"> Featured</span>
              </span>
            )}

            {dish.isBestseller && (
              <span className="rounded-full bg-amber-100 px-2 py-1 text-[11px] font-bold text-amber-800 shadow sm:px-3 sm:text-xs">
                🔥<span className="hidden sm:inline"> Bestseller</span>
              </span>
            )}
          </div>
        </div>

        {/* Dish Information */}
        <div className="flex flex-1 flex-col p-3 sm:p-5">
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-[#9a5f3d] sm:mb-2 sm:text-xs">
            {dish.category}
          </p>

          <h3 className="line-clamp-2 text-sm font-bold leading-snug text-[#513326] sm:text-xl">
            {dish.name}
          </h3>

          {/* Description hidden on mobile to keep cards short; visible in popup */}
          <p className="mt-2 line-clamp-2 hidden min-h-12 text-sm leading-6 text-[#6f5a4b] sm:block">
            {dish.description || "Freshly prepared with love."}
          </p>

          {/* Price and Details */}
          <div className="mt-auto border-t border-[#eadfd2] pt-3 sm:pt-4">
            <div className="mb-3 flex items-center justify-between sm:mb-4">
              <div>
                <p className="hidden text-xs text-[#8a5f45] sm:block">Price</p>

                <h4 className="text-lg font-bold text-[#713f2b] sm:text-2xl">
                  ₹{dish.price}
                </h4>
              </div>

              <span className="hidden rounded-full bg-[#f5ece1] px-4 py-2 text-sm font-semibold text-[#713f2b] sm:inline-block">
                View Details →
              </span>
            </div>

            {/* Add to Cart / Quantity Controls */}
            {!dish.available ? (
              <button
                type="button"
                disabled
                className="min-h-[44px] w-full cursor-not-allowed rounded-xl bg-gray-200 px-2 py-2.5 text-xs font-bold text-gray-500 sm:px-4 sm:py-3 sm:text-sm"
              >
                <span className="sm:hidden">Sold Out</span>
                <span className="hidden sm:inline">Currently Unavailable</span>
              </button>
            ) : quantity === 0 ? (
              <button
                type="button"
                onClick={handleAddToCart}
                className="min-h-[44px] w-full rounded-xl bg-[#713f2b] px-2 py-2.5 text-xs font-bold text-white transition hover:bg-[#513326] active:scale-95 sm:px-4 sm:py-3 sm:text-sm"
              >
                + Add to Cart
              </button>
            ) : (
              <div
                className="flex min-h-[44px] items-center justify-between rounded-xl bg-[#f5ece1] p-1.5 sm:p-2"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={handleDecrease}
                  aria-label={`Decrease quantity of ${dish.name}`}
                  className="h-9 w-9 rounded-lg bg-white text-lg font-bold text-[#713f2b] transition hover:bg-[#713f2b] hover:text-white sm:h-auto sm:w-auto sm:px-4 sm:py-2"
                >
                  −
                </button>

                <div className="text-center">
                  <p className="hidden text-xs text-[#8a5f45] sm:block">
                    Quantity
                  </p>

                  <span className="font-bold text-[#513326]">{quantity}</span>
                </div>

                <button
                  type="button"
                  onClick={handleIncrease}
                  aria-label={`Increase quantity of ${dish.name}`}
                  className="h-9 w-9 rounded-lg bg-white text-lg font-bold text-[#713f2b] transition hover:bg-[#713f2b] hover:text-white sm:h-auto sm:w-auto sm:px-4 sm:py-2"
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
        <DishDetails dish={dish} onClose={() => setShowDetails(false)} />
      )}
    </>
  );
};

export default DishCard;
