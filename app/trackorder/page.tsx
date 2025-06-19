// app/trackorder/page.tsx

import { PrismaClient, OrderStatus } from "@prisma/client";
import { notFound } from "next/navigation";

const prisma = new PrismaClient();

type Step = {
  label: string;
  status: OrderStatus;
};

const STEPS: Step[] = [
  { label: "Created", status: OrderStatus.CREATED },
  { label: "Picked", status: OrderStatus.PICKED },
  { label: "In Transit", status: OrderStatus.TRANSIT_TO_SZ },
  { label: "Customs Cleared", status: OrderStatus.CUSTOMS_CLEARED },
  { label: "Delivered", status: OrderStatus.POD },
];

export default async function TrackOrderPage({
  searchParams,
}: {
  searchParams: { id?: string };
}) {
  const { id } = searchParams;
  if (!id) {
    return <p className="p-6 text-center text-red-600">Order ID is required.</p>;
  }
  const orderId = parseInt(id, 10);
  if (isNaN(orderId)) {
    return <p className="p-6 text-center text-red-600">Invalid order ID.</p>;
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });
  if (!order) {
    notFound();
  }

  // Determine which step is current
  const currentStepIndex = STEPS.findIndex((s) => s.status === order.status);

  // Calculate subtotal, GST (9%), and total including GST
  const subtotal = order.items.reduce((sum, it) => sum + it.price * it.quantity, 0);
  const gst = subtotal * 0.09;
  const totalWithGst = subtotal + gst;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center">Track Order #{order.id}</h1>

      {/* Progress Bar */}
      <div className="flex items-center mt-8">
        {STEPS.map((step, idx) => {
          const completed = idx <= currentStepIndex;
          const isLast = idx === STEPS.length - 1;
          return (
            <div key={step.status} className="flex-1 flex items-center">
              {/* Circle */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${
                  completed ? "bg-blue-600" : "bg-gray-300"
                }`}
              >
                {idx + 1}
              </div>
              {/* Line */}
              {!isLast && (
                <div
                  className={`flex-1 h-1 ${
                    idx < currentStepIndex ? "bg-blue-600" : "bg-gray-300"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
      {/* Labels */}
      <div className="flex justify-between text-xs text-center">
        {STEPS.map((step) => (
          <div key={step.status} className="flex-1">
            {step.label}
          </div>
        ))}
      </div>

      {/* Order Details */}
      <section className="bg-white p-6 rounded-lg shadow mt-8 text-black">
        <h2 className="text-xl font-semibold mb-4">Order Details</h2>
        <p>
          <strong>Buyer:</strong> {order.buyerName} ({order.buyerEmail})
        </p>
        <p>
          <strong>Delivery Address:</strong> {order.deliveryAddress}
        </p>
      </section>

      {/* Items */}
      <section className="bg-white p-6 rounded-lg shadow mt-8 text-black">
        <h2 className="text-xl font-semibold mb-4">Items</h2>
        <ul className="divide-y">
          {order.items.map((item) => (
            <li key={item.id} className="py-3 flex justify-between">
              <span>
                {item.productName} × {item.quantity}
              </span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </li>
          ))}
        </ul>
        {/* GST line */}
        <p className="mt-4 text-right font-medium">
          <strong>GST (9%):</strong> ${gst.toFixed(2)}
        </p>
        {/* Total including GST */}
        <p className="mt-2 text-right font-medium">
          <strong>Total (incl. GST):</strong> ${totalWithGst.toFixed(2)}
        </p>
      </section>
    </div>
  );
}