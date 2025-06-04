// Example fetch request to create a new order with items
async function createOrder() {
  try {
    const response = await fetch('/api/order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        buyerName: 'Jane Doe',
        buyerEmail: 'jane.doe@example.com',
        deliveryAddress: '123 Orchard Road, Singapore',
        status: 'CREATED', // optional—defaults to CREATED if omitted
        items: [
          { productName: 'Wireless Mouse', quantity: 2, price: 25.99 },
          { productName: 'USB-C Cable', quantity: 1, price: 9.5 },
        ],
      }),
    });

    if (!response.ok) {
      const { error } = await response.json();
      console.error('Failed to create order:', error);
      return;
    }

    const { order } = await response.json();
    console.log('Newly created order:', order);
  } catch (err) {
    console.error('Network error:', err);
  }
}

// Call the function (for example, in a useEffect or on button click)
createOrder();