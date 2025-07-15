// app/start-scheduling/page.tsx
export const dynamic = 'force-dynamic';

import { PrismaClient } from "@prisma/client";
import OpenAI from "openai";

const prisma = new PrismaClient();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function StartSchedulingPage() {
  // 1. Fetch all delivery addresses
  const orders = await prisma.order.findMany({
    select: { deliveryAddress: true },
  });
  const addresses = orders.map((o) => o.deliveryAddress);

  // 2. Build prompt for route optimization
  const prompt = `
You are a logistics expert. Given the following delivery addresses in Singapore:
${addresses.map((addr, i) => `${i + 1}. ${addr}`).join("\n")}

Generate an optimized delivery route that visits each address exactly once, starting from a warehouse located in Simei.  
Return the result as a numbered list of addresses in the order they should be visited.
`;

  // 3. Call OpenAI to compute the optimized route
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "You are a route optimization assistant." },
      { role: "user", content: prompt.trim() },
    ],
  });
  const routePlan = response.choices[0].message.content ? response.choices[0].message.content.trim() : "";

  return (
    <div className="max-w-3xl mx-auto px-6 pt-6 pb-30 space-y-6">
      <h1 className="text-3xl font-bold">Route Optimization</h1>

      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl text-black font-semibold mb-4">Addresses</h2>
        <ul className="list-decimal list-inside space-y-1 text-gray-700">
          {addresses.map((addr, idx) => (
            <li key={idx}>{addr}</li>
          ))}
        </ul>
      </section>

      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl text-black font-semibold mb-4">Optimized Route</h2>
        <pre className="whitespace-pre-wrap text-gray-800">{routePlan}</pre>
      </section>
    </div>
  );
}