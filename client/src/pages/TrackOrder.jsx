
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://velvet-drip-1.onrender.com/api";

const statusSteps = [
  "Pending",
  "Confirmed",
  "Preparing",
  "Ready",
  "Delivered",
];

const TrackOrder = () => {
  const { token } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchOrder = async () => {
      try {
        const response = await fetch(
          `${API_URL}/orders/track/${token}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Order not found");
        }

        if (isMounted) {
          setOrder(data.order || data);
          setError("");
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchOrder();

    // Refresh order status every 10 seconds
    const interval = setInterval(fetchOrder, 10000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [token]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fffaf3]">
        <p className="text-lg font-semibold text-[#713f2b]">
          Loading your order...
        </p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fffaf3] px-5">
        <div className="rounded-3xl bg-white p-8 text-center shadow">
          <h1 className="text-2xl font-bold text-[#513326]">
            Order Not Found
          </h1>
          <p className="mt-3 text-[#8a6b59]">
            {error || "Unable to find your order."}
          </p>
          <Link to="/" className="mt-6 inline-block rounded-xl bg-[#713f2b] px-6 py-3 text-white">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const currentStatus = order.status;
  const currentIndex = statusSteps.indexOf(currentStatus);

  return (
    <section className="min-h-screen bg-[#fffaf3] px-5 py-12">
      <div className="mx-auto max-w-2xl">

        <div className="mb-8 text-center">
          <p className="font-semibold uppercase tracking-[0.3em] text-[#9a5f3d]">
            Velvet Drip
          </p>
          <h1 className="mt-3 text-3xl font-bold text-[#513326]">
            Track Your Order
          </h1>
          <p className="mt-2 text-[#8a6b59]">
            Follow your order's progress in real time.
          </p>
        </div>

        <div className="rounded-3xl border border-[#eadfd2] bg-white p-6 shadow-sm sm:p-8">

          <div className="border-b border-[#eadfd2] pb-5">
            <p className="text-sm text-[#8a6b59]">Order ID</p>
            <p className="mt-1 break-all font-semibold text-[#513326]">
              {order.orderId || order._id}
            </p>

            <div className="mt-5 flex justify-between">
              <span className="text-[#8a6b59]">Total Amount</span>
              <span className="font-bold text-[#513326]">
                ₹{Number(order.totalAmount).toFixed(2)}
              </span>
            </div>

            <div className="mt-3 flex justify-between">
              <span className="text-[#8a6b59]">Payment Status</span>
              <span className="font-semibold text-[#713f2b]">
                {order.paymentStatus || "Not updated"}
              </span>
            </div>
          </div>

          <h2 className="mb-6 mt-7 text-xl font-bold text-[#513326]">
            Order Progress
          </h2>

          {currentStatus === "Cancelled" ? (
            <p className="rounded-xl bg-red-50 p-4 font-semibold text-red-600">
              This order has been cancelled.
            </p>
          ) : (
            <div className="space-y-5">
              {statusSteps.map((status, index) => {
                const completed = currentIndex >= index;

                return (
                  <div key={status} className="flex items-center gap-4">
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-full font-bold ${
                        completed
                          ? "bg-[#713f2b] text-white"
                          : "bg-[#eadfd2] text-[#8a6b59]"
                      }`}
                    >
                      {completed ? "✓" : index + 1}
                    </div>

                    <p
                      className={`font-semibold ${
                        completed
                          ? "text-[#513326]"
                          : "text-[#a99587]"
                      }`}
                    >
                      {status}
                    </p>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-8 rounded-xl bg-[#fffaf3] p-4">
            <p className="text-sm text-[#8a6b59]">
              Current Order Status
            </p>
            <p className="mt-1 text-xl font-bold text-[#713f2b]">
              {currentStatus}
            </p>
          </div>

          <p className="mt-5 text-center text-xs text-[#9a7c69]">
            Order status automatically refreshes every 10 seconds.
          </p>

        </div>

        <div className="mt-6 text-center">
          <Link to="/" className="font-semibold text-[#713f2b] hover:underline">
            ← Back to Velvet Drip
          </Link>
        </div>

      </div>
    </section>
  );
};

export default TrackOrder;
