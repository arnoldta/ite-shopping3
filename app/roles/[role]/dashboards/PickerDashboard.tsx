// app/(roles)/picker/PickerDashboard.tsx
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

export default function PickerDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [pickedItems, setPickedItems] = useState<{
    [orderId: number]: { [itemId: number]: boolean };
  }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch orders in CREATED status
  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/order?status=CREATED");
      if (!res.ok) throw new Error("Failed to load orders");
      const { orders } = await res.json();
      setOrders(orders);
      // reset pickedItems when the list changes
      setPickedItems({});
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Patch entire order to PICKED
  const pickOrder = async (orderId: number) => {
    try {
      const res = await fetch("/api/order", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: orderId, status: "PICKED" }),
      });
      if (!res.ok) {
        const { error: msg } = await res.json();
        throw new Error(msg || "Failed to pick order");
      }
      // reload list so this order disappears
      fetchOrders();
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  // Handle clicking an item's Pick button
  const handlePickItem = (orderId: number, itemId: number) => {
    const prevOrderState = pickedItems[orderId] || {};
    if (prevOrderState[itemId]) return; // already picked

    const newOrderState = { ...prevOrderState, [itemId]: true };
    const newPickedItems = { ...pickedItems, [orderId]: newOrderState };
    setPickedItems(newPickedItems);

    // Check if all items in this order are now picked
    const order = orders.find((o) => o.id === orderId);
    if (order && order.items.every((it) => newOrderState[it.id])) {
      alert(`Order #${orderId} is Picked`);
      pickOrder(orderId);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Picking Station</h1>

      {loading ? (
        <p>Loading orders…</p>
      ) : error ? (
        <p className="text-red-600">Error: {error}</p>
      ) : orders.length === 0 ? (
        <p>No orders in “CREATED” status.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <details
              key={order.id}
              className="border rounded-md overflow-hidden"
            >
              <summary className="cursor-pointer bg-gray-200 px-4 py-2">
                Order #{order.id}
              </summary>

              <div className="p-4 bg-white">
                <p>
                  <strong>Buyer:</strong> {order.buyerName} ({order.buyerEmail})
                </p>
                <p>
                  <strong>Address:</strong> {order.deliveryAddress}
                </p>

                <h4 className="mt-4 font-semibold">Items</h4>
                <ul className="list-none p-0">
                  {order.items.map((item) => {
                    const isPicked = !!pickedItems[order.id]?.[item.id];
                    return (
                      <li
                        key={item.id}
                        className="flex justify-between items-center py-2 border-b last:border-b-0"
                      >
                        <div>
                          {item.productName} × {item.quantity} @ $
                          {item.price.toFixed(2)}
                        </div>
                        <button
                          onClick={() => handlePickItem(order.id, item.id)}
                          disabled={isPicked}
                          className={`ml-4 px-3 py-1 rounded ${
                            isPicked
                              ? "bg-gray-400 text-white cursor-not-allowed"
                              : "bg-blue-600 text-white hover:bg-blue-700"
                          }`}
                        >
                          {isPicked ? "Picked" : "Pick"}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </details>
          ))}
        </div>
      )}
    </div>
  );
}