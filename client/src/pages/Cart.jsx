import { Link } from "react-router-dom";
import { useCart } from "../Context/CartContext";

const Cart = () => {
  const {
    cartItems,
    cartCount,
    cartTotal,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  return (
    <section className="min-h-screen bg-[#fffaf3] px-5 py-12 lg:px-10">
      <div className="mx-auto max-w-6xl">

        {/* Heading */}
        <div className="mb-10">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.3em] text-[#9a5f3d]">
            Velvet Drip
          </p>

          <h1 className="text-4xl font-bold text-[#513326]">
            Your Shopping Cart
          </h1>

          <p className="mt-2 text-[#8a6b59]">
            Your favourite flavours are waiting for you.
          </p>
        </div>

        {/* Empty Cart */}
        {cartItems.length === 0 ? (
          <div className="rounded-3xl border border-[#eadfd2] bg-white px-6 py-16 text-center shadow-sm">
            <div className="mb-5 text-6xl">🛒</div>

            <h2 className="text-2xl font-bold text-[#513326]">
              Your cart is empty!
            </h2>

            <p className="mt-3 text-[#8a6b59]">
              Looks like you haven't added anything yet.
            </p>

            <Link
              to="/#full-menu"
              className="mt-7 inline-block rounded-xl bg-[#713f2b] px-7 py-3 font-semibold text-white transition hover:bg-[#513326]"
            >
              Explore Menu
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-3">

            {/* Cart Items */}
            <div className="space-y-5 lg:col-span-2">

              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-[#513326]">
                  Selected Items ({cartCount})
                </h2>

                <button
                  type="button"
                  onClick={clearCart}
                  className="text-sm font-semibold text-red-600 hover:text-red-800"
                >
                  Clear Cart
                </button>
              </div>

              {cartItems.map((item) => (
                <div
                  key={item.cartKey}
                  className="flex flex-col gap-5 rounded-2xl border border-[#eadfd2] bg-white p-4 shadow-sm sm:flex-row sm:items-center"
                >

                  {/* Item Image */}
                  <img
                    src={
                      item.image ||
                      "https://placehold.co/200x200?text=Velvet+Drip"
                    }
                    alt={item.name}
                    className="h-32 w-full rounded-xl object-cover sm:w-32"
                  />

                  {/* Item Details */}
                  <div className="flex-1">
                    <p className="text-xs font-semibold uppercase tracking-widest text-[#9a5f3d]">
                      {item.category}
                    </p>

                    <h3 className="mt-1 text-xl font-bold text-[#513326]">
                      {item.name}
                    </h3>

                    <p className="mt-2 text-sm text-[#8a6b59]">
                      ₹{item.price} × {item.quantity}
                    </p>

                    <p className="mt-2 text-lg font-bold text-[#713f2b]">
                      ₹{item.price * item.quantity}
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center justify-between gap-5 sm:flex-col sm:items-end">

                    <div className="flex items-center gap-3 rounded-xl bg-[#f5ece1] p-2">
                      <button
                        type="button"
                        onClick={() => decreaseQuantity(item._id, item.type)}
                        className="rounded-lg bg-white px-3 py-1 font-bold text-[#713f2b] hover:bg-[#713f2b] hover:text-white"
                      >
                        −
                      </button>

                      <span className="min-w-5 text-center font-bold text-[#513326]">
                        {item.quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() => increaseQuantity(item._id, item.type)}
                        className="rounded-lg bg-white px-3 py-1 font-bold text-[#713f2b] hover:bg-[#713f2b] hover:text-white"
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFromCart(item._id, item.type)}
                      className="text-sm font-semibold text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>

                  </div>
                </div>
              ))}

              <Link
                to="/#full-menu"
                className="inline-block pt-3 font-semibold text-[#713f2b] hover:underline"
              >
                ← Continue Shopping
              </Link>
            </div>

            {/* Order Summary */}
            <div className="h-fit rounded-3xl border border-[#eadfd2] bg-white p-6 shadow-sm">

              <h2 className="mb-6 text-xl font-bold text-[#513326]">
                Order Summary
              </h2>

              <div className="space-y-4 text-sm text-[#8a6b59]">
                <div className="flex justify-between">
                  <span>Total Items</span>
                  <span className="font-semibold text-[#513326]">
                    {cartCount}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#513326]">
                    ₹{cartTotal.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Delivery Charges</span>
                  <span className="font-semibold text-green-700">
                    Free
                  </span>
                </div>
              </div>

              <div className="my-6 border-t border-dashed border-[#d9c5b5]" />

              <div className="flex justify-between text-lg font-bold text-[#513326]">
                <span>Total Amount</span>
                <span>₹{cartTotal.toFixed(2)}</span>
              </div>

              <Link
                to="/checkout"
                className="mt-7 block w-full rounded-xl bg-[#713f2b] px-5 py-4 text-center font-bold text-white transition hover:bg-[#513326]"
              >
                Proceed to Checkout →
              </Link>

              <p className="mt-4 text-center text-xs text-[#9a7c69]">
                Thank you for choosing Velvet Drip!
              </p>
            </div>

          </div>
        )}
      </div>
    </section>
  );
};

export default Cart;
