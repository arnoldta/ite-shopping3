// app/dashboard/page.tsx

// Force this page to render on every request (no static caching)
export const dynamic = 'force-dynamic';

import { PrismaClient, OrderStatus } from "@prisma/client";

const prisma = new PrismaClient();

const STEPS = [
  { label: "Created", status: OrderStatus.CREATED },
  { label: "Picked", status: OrderStatus.PICKED },
  { label: "In Transit", status: OrderStatus.TRANSIT_TO_SZ },
  { label: "Customs Cleared", status: OrderStatus.CUSTOMS_CLEARED },
  { label: "Delivered", status: OrderStatus.POD },
];

export default async function DashboardPage() {
  // Fetch all orders
  const orders = await prisma.order.findMany({
    orderBy: { id: "asc" },
  });

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Orders Dashboard</h1>
      <div className="space-y-4">
        {orders.map((order) => {
          const currentStep = STEPS.findIndex((s) => s.status === order.status);

          return (
            <div
              key={order.id}
              className="bg-white text-black rounded-lg shadow p-4 flex flex-col space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-lg">Order #{order.id}</span>
                <span className="text-sm text-gray-600 capitalize">
                  {order.status.toLowerCase().replaceAll("_", " ")}
                </span>
              </div>

              <div className="flex items-center">
                {STEPS.map((step, idx) => {
                  const completed = idx <= currentStep;
                  const isLast = idx === STEPS.length - 1;
                  return (
                    <div key={step.status} className="flex items-center flex-1">
                      {/* Step circle */}
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-white ${
                          completed ? "bg-blue-600" : "bg-gray-300"
                        }`}
                      >
                        {idx + 1}
                      </div>
                      {/* Connector line */}
                      {!isLast && (
                        <div
                          className={`flex-1 h-1 mx-1 ${
                            idx < currentStep ? "bg-blue-600" : "bg-gray-300"
                          }`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Step labels */}
              <div className="flex text-xs text-center text-gray-600">
                {STEPS.map((step, idx) => (
                  <div key={step.status} className="flex-1">
                    {step.label}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}