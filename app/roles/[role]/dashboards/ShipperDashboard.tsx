// app/(roles)/shipper/ShipperDashboard.tsx
"use client";

import { useState, useEffect } from "react";

interface Item {
  id: number;
  productName: string;
  quantity: number;
  price: number;
}

interface Order {
  id: number;
  buyerName: string;
  buyerEmail: string;
  deliveryAddress: string;
  status: string;
  items: Item[];
}

export default function ShipperDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch orders in TRANSIT_TO_SZ status
  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/order?status=TRANSIT_TO_SZ");
      if (!res.ok) throw new Error("Failed to load orders");
      const { orders } = await res.json();
      setOrders(orders);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Patch entire order to CUSTOMS_CLEARED
  const shipToSingapore = async (orderId: number) => {
    try {
      const res = await fetch("/api/order", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: orderId, status: "CUSTOMS_CLEARED" }),
      });
      if (!res.ok) {
        const { error: msg } = await res.json();
        throw new Error(msg || "Failed to update order status");
      }
      // Refresh list so this order moves out of TRANSIT_TO_SZ
      fetchOrders();
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Shipping to Singapore</h1>

      {loading ? (
        <p>Loading orders…</p>
      ) : error ? (
        <p className="text-red-600">Error: {error}</p>
      ) : orders.length === 0 ? (
        <p>No orders in “TRANSIT_TO_SZ” status.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            // compute GST = 9% of total value
            const total = order.items.reduce(
              (sum, item) => sum + item.price * item.quantity,
              0
            );
            const gst = total * 0.09;

            return (
              <details
                key={order.id}
                className="border rounded-md overflow-hidden"
              >
                <summary className="cursor-pointer bg-gray-200 px-4 py-2 flex justify-between items-center">
                  <span>Order #{order.id}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      shipToSingapore(order.id);
                    }}
                    className="ml-4 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Ship to Singapore
                  </button>
                </summary>

                <div className="p-4 bg-white">
                  <p>
                    <strong>Buyer:</strong> {order.buyerName} (
                    {order.buyerEmail})
                  </p>
                  <p>
                    <strong>Address:</strong> {order.deliveryAddress}
                  </p>

                  <h4 className="mt-4 font-semibold">Items</h4>
                  <ul className="list-none p-0">
                    {order.items.map((item) => (
                      <li
                        key={item.id}
                        className="py-2 border-b last:border-b-0"
                      >
                        {item.productName} × {item.quantity} @ $
                        {item.price.toFixed(2)}
                      </li>
                    ))}
                  </ul>

                  <p className="mt-4 font-semibold">
                    GST (9%): ${gst.toFixed(2)}
                  </p>
                </div>
              </details>
            );
          })}
        </div>
      )}
    </div>
  );
}