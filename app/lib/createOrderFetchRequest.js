const orders = [
  {
    buyerName: 'Jordan Smith',
    buyerEmail: 'jordan.smith@gmail.com',
    deliveryAddress: '455 Clementi Road, Singapore',
    status: 'CREATED',
    items: [
      { productName: 'Sports Shoes', quantity: 3, price: 14.99 },
      { productName: 'Nike Airmax', quantity: 1, price: 199.5 },
    ],
  },
  {
    buyerName: 'Alice Tan',
    buyerEmail: 'alice.tan@yahoo.com',
    deliveryAddress: '123 Orchard Road, Singapore',
    status: 'CREATED',
    items: [
      { productName: 'T-shirt', quantity: 2, price: 19.99 },
      { productName: 'Jeans', quantity: 1, price: 49.5 },
    ],
  },
  {
    buyerName: 'Bob Lee',
    buyerEmail: 'bob.lee@outlook.com',
    deliveryAddress: '78 Jurong West Street 42, Singapore',
    status: 'CREATED',
    items: [
      { productName: 'Backpack', quantity: 1, price: 59.99 },
      { productName: 'Water Bottle', quantity: 2, price: 9.5 },
    ],
  },
  {
    buyerName: 'Cynthia Lim',
    buyerEmail: 'cynthia.lim@gmail.com',
    deliveryAddress: '9 Bukit Timah Road, Singapore',
    status: 'CREATED',
    items: [
      { productName: 'Sunglasses', quantity: 1, price: 129.0 },
      { productName: 'Sun Hat', quantity: 2, price: 15.0 },
    ],
  },
  {
    buyerName: 'David Ng',
    buyerEmail: 'david.ng@hotmail.com',
    deliveryAddress: '200 Bedok North Avenue, Singapore',
    status: 'CREATED',
    items: [
      { productName: 'Running Shorts', quantity: 3, price: 25.0 },
      { productName: 'Sports Socks', quantity: 5, price: 5.99 },
      { productName: 'Cap', quantity: 1, price: 12.49 },
    ],
  },
  {
    buyerName: 'Emily Chan',
    buyerEmail: 'emily.chan@live.com',
    deliveryAddress: '56 Tampines Street 11, Singapore',
    status: 'CREATED',
    items: [
      { productName: 'Yoga Mat', quantity: 1, price: 39.99 },
    ],
  },
  {
    buyerName: 'Frank Ho',
    buyerEmail: 'frank.ho@example.com',
    deliveryAddress: '310 Pasir Ris Drive 3, Singapore',
    status: 'CREATED',
    items: [
      { productName: 'Wireless Earbuds', quantity: 1, price: 49.99 },
      { productName: 'Phone Case', quantity: 2, price: 19.99 },
    ],
  },
  {
    buyerName: 'Grace Wong',
    buyerEmail: 'grace.wong@gmail.com',
    deliveryAddress: '45 Clementi Avenue 3, Singapore',
    status: 'CREATED',
    items: [
      { productName: 'Travel Adapter', quantity: 1, price: 14.5 },
      { productName: 'Luggage Tag', quantity: 2, price: 4.99 },
      { productName: 'Neck Pillow', quantity: 1, price: 19.0 },
    ],
  },
  {
    buyerName: 'Henry Zhao',
    buyerEmail: 'henry.zhao@protonmail.com',
    deliveryAddress: '88 Bukit Batok West Avenue, Singapore',
    status: 'CREATED',
    items: [
      { productName: 'Laptop Sleeve', quantity: 1, price: 29.99 },
      { productName: 'Mouse Pad', quantity: 1, price: 9.99 },
    ],
  },
  {
    buyerName: 'Isabella Teo',
    buyerEmail: 'isabella.teo@icloud.com',
    deliveryAddress: '233 Yishun Avenue 5, Singapore',
    status: 'CREATED',
    items: [
      { productName: 'Sports Watch', quantity: 1, price: 199.99 },
      { productName: 'Fitness Tracker', quantity: 1, price: 99.0 },
    ],
  },
];


// Example fetch request to create a new order with items
async function createOrder(orderDetails) {
  try {
    const response = await fetch('/api/order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderDetails),
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
for (const order of orders) {
  createOrder(order);
}