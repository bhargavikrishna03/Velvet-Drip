
import { useState } from "react";
import { Link } from "react-router-dom";
import QRCode from "qrcode";
import { useCart } from "../Context/CartContext";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://velvet-drip-1.onrender.com/api";

const WHATSAPP_NUMBER = "919392422778";

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

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Place order
  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError("");

    if (cartItems.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    if (!formData.name.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (!/^\d{10}$/.test(formData.phone)) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    if (!formData.address.trim()) {
      setError("Please enter your delivery address.");
      return;
    }

    if (!/^\d+$/.test(WHATSAPP_NUMBER)) {
      setError("Please configure your cafe WhatsApp number.");
      return;
    }

    // Open WhatsApp window before async operations
    const whatsappWindow = window.open("about:blank", "_blank");

    if (!whatsappWindow) {
      setError("Please allow pop-ups to continue with WhatsApp.");
      return;
    }

    setLoading(true);

    try {
      // Prepare order data
      const orderData = {
        customerName: formData.name.trim(),
        phone: formData.phone,
        address: formData.address.trim(),
        instructions: formData.instructions.trim(),

        items: cartItems.map((item) => {
          const isCombo = item.type === "combo";

          return {
            itemType: isCombo ? "combo" : "dish",

            ...(isCombo
              ? { comboId: item._id }
              : { dishId: item._id }),

            quantity: item.quantity,
          };
        }),
      };

      // Send order to backend
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

      if (!savedOrder) {
        throw new Error("Order was created but no order details were returned.");
      }

      // Generate order tracking QR code
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

      // Prepare WhatsApp order details
      const orderDetails = (savedOrder.items || [])
        .map(
          (item) =>
            `${item.name} x ${item.quantity} = ₹${
              Number(item.price) * Number(item.quantity)
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

      // Redirect to WhatsApp
      whatsappWindow.location.href = whatsappURL;

      // Show confirmation page
      setOrderConfirmation({
        orderId: savedOrder._id,
        totalAmount: savedOrder.totalAmount,
        status: savedOrder.status,
        trackingURL,
        qrCode,
      });

      // Clear cart after successful order
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

      console.error("Order placement error:", err);

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
      <div className="min-h-screen bg-[#fffaf3] px-4 py-12">
        <div className="mx-auto max-w-xl rounded-2xl border border-[#eadfd2] bg-white p-6 text-center shadow-lg sm:p-10">

          <div className="mb-4 text-6xl">🎉</div>

          <h1 className="mb-2 text-3xl font-bold text-[#513326]">
            Order Placed Successfully!
          </h1>

          <p className="mb-6 text-gray-600">
            Thank you for ordering from Velvet Drip.
          </p>

          <div className="mb-6 rounded-xl bg-[#fffaf3] p-5 text-left">
            <p className="mb-2 text-sm text-gray-500">
              Order ID
            </p>

            <p className="mb-4 break-all font-semibold text-[#713f2b]">
              {orderConfirmation.orderId}
            </p>

            <div className="flex justify-between gap-4">
              <span className="text-gray-600">
                Total Amount
              </span>

              <span className="font-bold text-[#713f2b]">
                ₹{orderConfirmation.totalAmount}
              </span>
            </div>

            <div className="mt-3 flex justify-between gap-4">
              <span className="text-gray-600">
                Order Status
              </span>

              <span className="font-semibold text-[#713f2b]">
                {orderConfirmation.status}
              </span>
            </div>
          </div>

          {/* Order Tracking QR */}
          {orderConfirmation.qrCode && (
            <div className="mb-6 rounded-xl border border-[#eadfd2] p-5">
              <h2 className="mb-2 text-xl font-bold text-[#513326]">
                Track Your Order
              </h2>

              <p className="mb-4 text-sm text-gray-500">
                Scan this QR code to check your order status.
              </p>

              <img
                src={orderConfirmation.qrCode}
                alt="Order tracking QR code"
                className="mx-auto w-56 rounded-lg"
              />

              <p className="mt-3 break-all text-xs text-gray-500">
                {orderConfirmation.trackingURL}
              </p>

              <a
                href={orderConfirmation.trackingURL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block font-semibold text-[#713f2b] underline"
              >
                Track Order Online
              </a>
            </div>
          )}

          {!orderConfirmation.trackingURL && (
            <p className="mb-5 text-sm text-amber-700">
              Your order was placed, but the tracking QR code
              could not be generated. Please contact the cafe
              with your order ID.
            </p>
          )}

          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to="/"
              className="rounded-lg bg-[#713f2b] px-6 py-3 font-semibold text-white transition hover:bg-[#513326]"
            >
              Back to Home
            </Link>

            <Link
              to="/menu"
              className="rounded-lg border border-[#713f2b] px-6 py-3 font-semibold text-[#713f2b] transition hover:bg-[#fffaf3]"
            >
              Order More
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Empty cart screen
  if (cartItems.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#fffaf3] px-4 text-center">
        <div className="mb-4 text-6xl">🛒</div>

        <h2 className="mb-3 text-2xl font-bold text-[#513326]">
          Your Cart is Empty
        </h2>

        <p className="mb-6 text-gray-500">
          Add some delicious dishes before checking out.
        </p>

        <Link
          to="/"
          className="rounded-lg bg-[#713f2b] px-6 py-3 font-semibold text-white hover:bg-[#513326]"
        >
          Explore Menu
        </Link>
      </div>
    );
  }

  // Checkout form
  return (
    <div className="min-h-screen bg-[#fffaf3] px-4 py-12">
      <div className="mx-auto max-w-3xl">

        <h1 className="mb-2 text-center text-3xl font-bold text-[#513326]">
          Checkout
        </h1>

        <p className="mb-8 text-center text-gray-500">
          Complete your details to place your order.
        </p>

        <div className="grid gap-8 md:grid-cols-2">

          {/* Customer Form */}
          <div className="rounded-2xl border border-[#eadfd2] bg-white p-6 shadow-sm">

            <h2 className="mb-5 text-xl font-bold text-[#513326]">
              Customer Details
            </h2>

            <form onSubmit={handlePlaceOrder} className="space-y-4">

              <div>
                <label className="mb-1 block text-sm font-medium text-[#513326]">
                  Full Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  required
                  className="w-full rounded-lg border border-[#eadfd2] px-4 py-3 outline-none focus:border-[#713f2b]"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-[#513326]">
                  Mobile Number
                </label>

                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="10-digit mobile number"
                  maxLength={10}
                  required
                  className="w-full rounded-lg border border-[#eadfd2] px-4 py-3 outline-none focus:border-[#713f2b]"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-[#513326]">
                  Delivery Address
                </label>

                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter your complete address"
                  rows={3}
                  required
                  className="w-full rounded-lg border border-[#eadfd2] px-4 py-3 outline-none focus:border-[#713f2b]"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-[#513326]">
                  Special Instructions (Optional)
                </label>

                <textarea
                  name="instructions"
                  value={formData.instructions}
                  onChange={handleChange}
                  placeholder="Any special requests?"
                  rows={2}
                  className="w-full rounded-lg border border-[#eadfd2] px-4 py-3 outline-none focus:border-[#713f2b]"
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
                className="w-full rounded-lg bg-[#713f2b] px-6 py-3 font-semibold text-white transition hover:bg-[#513326] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Placing Order..." : "Place Order"}
              </button>

              <p className="text-center text-xs text-gray-500">
                After placing your order, WhatsApp will open
                with your order details.
              </p>
            </form>
          </div>

          {/* Order Summary */}
          <div className="h-fit rounded-2xl border border-[#eadfd2] bg-white p-6 shadow-sm">

            <h2 className="mb-5 text-xl font-bold text-[#513326]">
              Order Summary
            </h2>

            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={`${item.type || "dish"}-${item._id}`}
                  className="flex items-start justify-between gap-3 border-b border-[#eadfd2] pb-3"
                >
                  <div>
                    <p className="font-semibold text-[#513326]">
                      {item.name}
                    </p>

                    <p className="text-sm text-gray-500">
                      {item.type === "combo" ? "Combo" : "Dish"} ×{" "}
                      {item.quantity}
                    </p>
                  </div>

                  <p className="font-semibold text-[#713f2b]">
                    ₹{Number(item.price) * Number(item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-5 flex justify-between border-t border-[#eadfd2] pt-4">
              <span className="font-bold text-[#513326]">
                Total Amount
              </span>

              <span className="text-xl font-bold text-[#713f2b]">
                ₹{cartTotal}
              </span>
            </div>

            <p className="mt-4 text-xs text-gray-500">
              Your order total is calculated and verified by
              our backend before the order is saved.
            </p>

          </div>
        </div>

        <div className="mt-6 text-center">
          <Link
            to="/cart"
            className="font-semibold text-[#713f2b] underline"
          >
            ← Back to Cart
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Checkout;
