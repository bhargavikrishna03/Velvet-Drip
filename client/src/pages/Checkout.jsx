
import { useState } from "react";
import { Link } from "react-router-dom";
import QRCode from "qrcode";
import { useCart } from "../Context/CartContext";

const API_URL =
  import.meta.env.VITE_API_URL || "https://velvet-drip-1.onrender.com/api";

const WHATSAPP_NUMBER = "91MYNUMBER";

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    instructions: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [orderConfirmation, setOrderConfirmation] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError("");

    if (cartItems.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    if (!/^\d{10}$/.test(formData.phone)) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    if (!/^\d+$/.test(WHATSAPP_NUMBER)) {
      setError("Please configure your cafe WhatsApp number.");
      return;
    }

    // Open a blank tab immediately to avoid popup blocking
    const whatsappWindow = window.open("about:blank", "_blank");

    if (!whatsappWindow) {
      setError("Please allow pop-ups to continue with WhatsApp.");
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        customerName: formData.name.trim(),
        phone: formData.phone,
        address: formData.address.trim(),
        instructions: formData.instructions.trim(),

        items: cartItems.map((item) => ({
          dishId: item._id,
          quantity: item.quantity,
        })),
      };

      // Save order in MongoDB
      const response = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to place your order."
        );
      }

      const savedOrder = data.order;

      // Generate customer tracking QR code
      let trackingURL = "";
      let qrCode = "";

      if (savedOrder.trackingToken) {
        trackingURL = `${window.location.origin}/track/${savedOrder.trackingToken}`;

        try {
          qrCode = await QRCode.toDataURL(trackingURL, {
            width: 280,
            margin: 2,
            errorCorrectionLevel: "H",
          });
        } catch (qrError) {
          console.error("QR generation failed:", qrError);
        }
      }

      // Build WhatsApp message using saved order details
      const orderDetails = savedOrder.items
        .map(
          (item) =>
            `${item.name} x ${item.quantity} = ₹${
              item.price * item.quantity
            }`
        )
        .join("\n");

      const message = `
*VELVET DRIP - NEW ORDER*

Order ID: ${savedOrder._id}

Customer Name: ${savedOrder.customerName}
Phone: ${savedOrder.phone}

*ORDER DETAILS*
${orderDetails}

*Total Amount: ₹${savedOrder.totalAmount}*

Delivery Address:
${savedOrder.address}

Special Instructions:
${savedOrder.instructions || "None"}

Order Status: ${savedOrder.status}

Thank you for choosing Velvet Drip!
`;

      const whatsappURL =
        `https://wa.me/${WHATSAPP_NUMBER}?text=` +
        encodeURIComponent(message);

      // Open WhatsApp
      whatsappWindow.location.href = whatsappURL;

      // Show confirmation page
      setOrderConfirmation({
        orderId: savedOrder._id,
        totalAmount: savedOrder.totalAmount,
        status: savedOrder.status,
        trackingURL,
        qrCode,
      });

      // Clear cart only after successful database save
      clearCart();

      // Reset form
      setFormData({
        name: "",
        phone: "",
        address: "",
        instructions: "",
      });
    } catch (err) {
      whatsappWindow.close();

      setError(
        err.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Order confirmation screen
  if (orderConfirmation) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-[#fffaf3] px-5 py-12">
        <div className="w-full max-w-xl rounded-3xl border border-[#eadfd2] bg-white p-8 text-center shadow-sm">

          <div className="mb-4 text-6xl">☕</div>

          <h1 className="text-3xl font-bold text-[#513326]">
            Thank You!
          </h1>

          <p className="mt-3 text-[#8a6b59]">
            Your Velvet Drip order has been placed successfully.
          </p>

          <div className="my-6 rounded-2xl bg-[#fffaf3] p-5 text-left">
            <p className="text-sm text-[#8a6b59]">
              Order ID
            </p>

            <p className="mt-1 break-all font-semibold text-[#513326]">
              {orderConfirmation.orderId}
            </p>

            <div className="mt-4 flex justify-between">
              <span className="text-[#8a6b59]">Total Amount</span>
              <span className="font-bold text-[#513326]">
                ₹{Number(orderConfirmation.totalAmount).toFixed(2)}
              </span>
            </div>

            <div className="mt-3 flex justify-between">
              <span className="text-[#8a6b59]">Order Status</span>
              <span className="font-semibold text-[#9a5f3d]">
                {orderConfirmation.status}
              </span>
            </div>
          </div>

          {orderConfirmation.qrCode ? (
            <div className="mt-6">
              <h2 className="text-xl font-bold text-[#513326]">
                Track Your Order
              </h2>

              <p className="mt-2 text-sm text-[#8a6b59]">
                Scan this QR code to view your order status.
              </p>

              <img
                src={orderConfirmation.qrCode}
                alt="Order tracking QR code"
                className="mx-auto mt-5 w-64 rounded-xl border border-[#eadfd2] p-3"
              />

              <a
                href={orderConfirmation.trackingURL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block break-all text-sm font-semibold text-[#9a5f3d] underline"
              >
                Open Order Tracking
              </a>
            </div>
          ) : (
            <p className="mt-5 text-sm text-amber-700">
              Your order was saved, but the tracking QR could not
              be generated. Please contact the cafe with your Order ID.
            </p>
          )}

          <Link
            to="/"
            className="mt-8 inline-block rounded-xl bg-[#713f2b] px-7 py-3 font-semibold text-white transition hover:bg-[#513326]"
          >
            Back to Home
          </Link>
        </div>
      </section>
    );
  }

  // Empty cart screen
  if (cartItems.length === 0) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-[#fffaf3] px-5">
        <div className="text-center">
          <div className="mb-4 text-6xl">🛒</div>

          <h2 className="text-2xl font-bold text-[#513326]">
            Your cart is empty
          </h2>

          <p className="mt-2 text-[#8a6b59]">
            Add some delicious dishes before checkout.
          </p>

          <Link
            to="/"
            className="mt-6 inline-block rounded-xl bg-[#713f2b] px-6 py-3 font-semibold text-white"
          >
            Explore Menu
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-[#fffaf3] px-5 py-12 lg:px-10">
      <div className="mx-auto max-w-6xl">

        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#9a5f3d]">
            Velvet Drip
          </p>

          <h1 className="mt-2 text-4xl font-bold text-[#513326]">
            Checkout
          </h1>

          <p className="mt-2 text-[#8a6b59]">
            Almost there! Please enter your details.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">

          {/* Customer Form */}
          <form
            onSubmit={handlePlaceOrder}
            className="space-y-6 rounded-3xl border border-[#eadfd2] bg-white p-6 shadow-sm lg:col-span-2"
          >
            <h2 className="text-xl font-bold text-[#513326]">
              Customer Information
            </h2>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#6f5a4b]">
                Full Name
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
                className="w-full rounded-xl border border-[#eadfd2] px-4 py-3 outline-none focus:border-[#9a5f3d]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#6f5a4b]">
                Mobile Number
              </label>

              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter 10-digit mobile number"
                maxLength={10}
                pattern="[0-9]{10}"
                required
                className="w-full rounded-xl border border-[#eadfd2] px-4 py-3 outline-none focus:border-[#9a5f3d]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#6f5a4b]">
                Delivery Address
              </label>

              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter your complete delivery address"
                rows={4}
                required
                className="w-full rounded-xl border border-[#eadfd2] px-4 py-3 outline-none focus:border-[#9a5f3d]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#6f5a4b]">
                Special Instructions (Optional)
              </label>

              <textarea
                name="instructions"
                value={formData.instructions}
                onChange={handleChange}
                placeholder="Any special requests?"
                rows={3}
                className="w-full rounded-xl border border-[#eadfd2] px-4 py-3 outline-none focus:border-[#9a5f3d]"
              />
            </div>

            {error && (
              <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#713f2b] px-5 py-4 font-bold text-white transition hover:bg-[#513326] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Placing Your Order..."
                : "Place Order on WhatsApp →"}
            </button>

            <Link
              to="/cart"
              className="block text-center text-sm font-semibold text-[#713f2b] hover:underline"
            >
              ← Back to Cart
            </Link>
          </form>

          {/* Order Summary */}
          <div className="h-fit rounded-3xl border border-[#eadfd2] bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-xl font-bold text-[#513326]">
              Order Summary
            </h2>

            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="flex justify-between gap-3 text-sm"
                >
                  <span className="text-[#8a6b59]">
                    {item.name} × {item.quantity}
                  </span>

                  <span className="font-semibold text-[#513326]">
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            <div className="my-6 border-t border-dashed border-[#d9c5b5]" />

            <div className="flex justify-between text-lg font-bold text-[#513326]">
              <span>Total</span>
              <span>₹{cartTotal.toFixed(2)}</span>
            </div>

            <p className="mt-5 text-center text-xs text-[#9a7c69]">
              Your order will be saved and shared through WhatsApp.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Checkout;
