// app/api/reset-orders/route.ts

import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(_req: NextRequest) {
  try {
    // Delete all items first (foreign key to Order)
    await prisma.item.deleteMany({});
    // Then delete all orders
    await prisma.order.deleteMany({});

    return NextResponse.json(
      { message: "All orders and items have been reset." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Reset orders error:", error);
    return NextResponse.json(
      { error: "Failed to reset orders." },
      { status: 500 }
    );
  }
}