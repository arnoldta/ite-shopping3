// app/api/order/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, OrderStatus } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { buyerName, buyerEmail, deliveryAddress, status, items } = await request.json();

    // Basic validation
    if (!buyerName || !buyerEmail || !deliveryAddress || !Array.isArray(items)) {
      return NextResponse.json({ error: 'Missing or invalid fields' }, { status: 400 });
    }

    // If status provided, ensure it's valid; otherwise default to CREATED
    let orderStatus: OrderStatus = OrderStatus.CREATED;
    if (status) {
      if (!Object.values(OrderStatus).includes(status)) {
        return NextResponse.json({ error: 'Invalid order status' }, { status: 400 });
      }
      orderStatus = status;
    }

    // Validate each item
    for (const item of items) {
      const { productName, quantity, price } = item;
      if (!productName || typeof quantity !== 'number' || typeof price !== 'number') {
        return NextResponse.json({ error: 'Each item must have productName, quantity (number), and price (number)' }, { status: 400 });
      }
    }

    // Create Order with nested Items
    const newOrder = await prisma.order.create({
      data: {
        buyerName,
        buyerEmail,
        deliveryAddress,
        status: orderStatus,
        items: {
          create: items.map((item: any) => ({
            productName: item.productName,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: { items: true },
    });

    return NextResponse.json({ order: newOrder }, { status: 201 });
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}