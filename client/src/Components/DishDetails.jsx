import { useEffect } from "react";

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || "91XXXXXXXXXX";

const DishDetails = ({ dish, onClose }) => {
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  if (!dish) return null;

  const handleOrder = () => {
    if (!dish.available) return;

    const message = `Hello Velvet Drip! I would like to order ${dish.name} for ₹${dish.price}.`;
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={dish.name}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#24160f]/75 p-3 backdrop-blur-md sm:p-6"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative grid max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-[28px] bg-[#fffaf3] shadow-2xl md:grid-cols-2 md:overflow-hidden"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close popup"
          className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-2xl text-[#513326] shadow-lg transition hover:rotate-90 hover:bg-[#713f2b] hover:text-white"
        >
          ×
        </button>

        {/* Image Section */}
        <div className="relative min-h-[250px] overflow-hidden bg-[#eadfd2] md:min-h-[520px]">
          <img
            src={dish.image || "https://placehold.co/800x1000?text=Velvet+Drip"}
            alt={dish.name}
            className={`absolute inset-0 h-full w-full object-cover ${
              !dish.available ? "grayscale" : ""
            }`}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />

          <div className="absolute bottom-6 left-6 text-white">
            <p className="text-xs font-semibold uppercase tracking-[4px] text-white/80">
              Velvet Drip
            </p>
            <p className="mt-2 text-2xl font-semibold">Made with love ☕</p>
          </div>
        </div>

        {/* Details Section */}
        <div className="flex flex-col justify-center p-6 sm:p-9 md:p-10">
          <div className="mb-6 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-[#f0e2d4] px-4 py-2 text-xs font-semibold text-[#713f2b]">
              {dish.category}
            </span>

            <span className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-[#713f2b]">
              {dish.isVeg ? "🟢 Vegetarian" : "🔴 Non-Vegetarian"}
            </span>
          </div>

          <p className="text-xs font-semibold uppercase tracking-[3px] text-[#9a5f3d]">
            A little taste of happiness
          </p>

          <h2 className="mt-3 text-3xl font-bold leading-tight text-[#513326] sm:text-4xl">
            {dish.name}
          </h2>

          <div className="my-6 h-px w-16 bg-[#b77752]" />

          <p className="text-sm leading-7 text-[#6f5a4b] sm:text-base">
            {dish.description ||
              "Freshly prepared with love, using quality ingredients to make every bite special."}
          </p>

          <div className="mt-8 flex items-center justify-between rounded-2xl bg-[#f5ece1] p-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-[#8a5f45]">
                Our Price
              </p>
              <p className="mt-1 text-3xl font-bold text-[#713f2b]">
                ₹{dish.price}
              </p>
            </div>

            <span
              className={`inline-block rounded-full px-3 py-2 text-xs font-semibold ${
                dish.available
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {dish.available ? "● Available" : "● Sold Out"}
            </span>
          </div>

          <button
            type="button"
            onClick={handleOrder}
            disabled={!dish.available}
            className="mt-6 flex w-full items-center justify-center gap-3 rounded-full bg-[#713f2b] px-6 py-4 font-semibold text-white shadow-lg shadow-[#713f2b]/20 transition duration-300 hover:-translate-y-1 hover:bg-[#a35f40] hover:shadow-xl disabled:cursor-not-allowed disabled:bg-gray-400 disabled:shadow-none disabled:hover:translate-y-0"
          >
            {dish.available ? (
              <>
                Order on WhatsApp
                <span>↗</span>
              </>
            ) : (
              "Currently Unavailable"
            )}
          </button>

          <p className="mt-4 text-center text-xs text-[#7d6858]">
            Freshly prepared · Served with love
          </p>
        </div>
      </div>
    </div>
  );
};

export default DishDetails;