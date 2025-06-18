// app/(roles)/courier/CourierDashboard.tsx
"use client";

import { useState, useEffect, useRef } from "react";

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

// A small signature‐pad component
function SignaturePad() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawing, setDrawing] = useState(false);

  // initialize drawing context
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
  }, []);

  const getCoords = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return { 
      x: e.clientX - rect.left, 
      y: e.clientY - rect.top 
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const { x, y } = getCoords(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setDrawing(true);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const { x, y } = getCoords(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDrawing(false);
  };

  const clear = (e: React.MouseEvent) => {
    e.stopPropagation();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div className="flex items-center space-x-2">
      <canvas
        ref={canvasRef}
        width={200}
        height={100}
        className="border border-gray-300"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      />
      <button
        type="button"
        onClick={clear}
        className="px-2 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm"
      >
        Clear
      </button>
    </div>
  );
}

export default function CourierDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // fetch orders in CUSTOMS_CLEARED status
  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/order?status=CUSTOMS_CLEARED");
      if (!res.ok) throw new Error("Failed to load orders");
      const { orders } = await res.json();
      setOrders(orders);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // patch order to POD
  const deliverOrder = async (orderId: number) => {
    try {
      const res = await fetch("/api/order", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: orderId, status: "POD" }),
      });
      if (!res.ok) {
        const { error: msg } = await res.json();
        throw new Error(msg || "Failed to update order status");
      }
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
      <h1 className="text-3xl font-bold mb-4">Courier Station</h1>

      {loading ? (
        <p>Loading orders…</p>
      ) : error ? (
        <p className="text-red-600">Error: {error}</p>
      ) : orders.length === 0 ? (
        <p>No orders in “CUSTOMS_CLEARED” status.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <details
              key={order.id}
              className="border rounded-md overflow-hidden"
            >
              <summary className="cursor-pointer bg-gray-200 px-4 py-2 flex justify-between items-center">
                <span>Order #{order.id}</span>
              </summary>

              <div className="p-4 bg-white space-y-4">
                <div>
                  <p>
                    <strong>Buyer:</strong> {order.buyerName} (
                    {order.buyerEmail})
                  </p>
                  <p>
                    <strong>Address:</strong> {order.deliveryAddress}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Items</h4>
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
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Receiver Signature</h4>
                  <SignaturePad />
                </div>

                <div>
                  <button
                    onClick={() => deliverOrder(order.id)}
                    className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                  >
                    Deliver to Address
                  </button>
                </div>
              </div>
            </details>
          ))}
        </div>
      )}
    </div>
  );
}